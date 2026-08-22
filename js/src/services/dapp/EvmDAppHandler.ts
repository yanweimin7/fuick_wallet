import { DAppChainHandler, DAppHandlerContext } from "./DAppChainHandler";
import { DAppBridgeService } from "../DAppBridgeService";
import { EIP1193_INJECT_SCRIPT } from "../../utils/eip1193Provider";

function shortAddr(a?: string | null): string {
  if (!a) return "";
  return a.length > 12 ? `${a.slice(0, 6)}...${a.slice(-4)}` : a;
}

/**
 * EVM（兼容 EIP-1193）链 Handler。
 * 把原先写在 DAppBrowserPage 里的全部 EVM 处理逻辑搬到这里，
 * 通过 DAppHandlerContext 使用页面提供的密码框 / 确认框 / 事件通知。
 */
export class EvmDAppHandler implements DAppChainHandler {
  readonly chainKind = "eip155";
  readonly injectScript = EIP1193_INJECT_SCRIPT;

  supports(method: string): boolean {
    return (
      method.startsWith("eth_") ||
      method.startsWith("net_") ||
      method.startsWith("web3_") ||
      method.startsWith("personal_") ||
      method === "wallet_switchEthereumChain" ||
      method === "wallet_requestPermissions" ||
      method === "wallet_getPermissions" ||
      method === "wallet_revokePermissions"
    );
  }

  async getChainId(): Promise<string> {
    const id = await DAppBridgeService.getActiveChainId();
    return "0x" + id.toString(16);
  }

  async getAccounts(origin: string): Promise<string[]> {
    return DAppBridgeService.getSiteAccounts(origin, this.chainKind);
  }

  async connect(ctx: DAppHandlerContext): Promise<string[]> {
    const existing = await DAppBridgeService.getSiteAccounts(
      ctx.origin,
      this.chainKind,
    );
    if (existing.length) return existing;

    const addr = await DAppBridgeService.getActiveAddress();
    if (!addr) throw new Error("没有可用账户");

    const ok = await ctx.confirm(
      "连接请求",
      `${ctx.origin}\n请求连接你的钱包\n地址: ${shortAddr(addr)}`,
    );
    if (!ok) throw new Error("用户拒绝连接");

    await DAppBridgeService.setSiteAccounts(ctx.origin, this.chainKind, [addr]);
    ctx.setConnected(true);
    ctx.emitAccountsChanged([addr]);
    return [addr];
  }

  async readRpc(method: string, params: any[]): Promise<unknown> {
    const svc = await DAppBridgeService.getEvmService();
    return svc.send(method, params);
  }

  private async ensureSigner(ctx: DAppHandlerContext) {
    const encryptionKey = await ctx.requestPassword();
    if (!encryptionKey) throw new Error("用户取消");
    const pk = await DAppBridgeService.getEvmPrivateKey(encryptionKey);
    const svc = await DAppBridgeService.getEvmService();
    svc.initSigner(pk);
    return svc;
  }

  async signMessage(params: any[], ctx: DAppHandlerContext): Promise<string> {
    const data = params[0];
    const ok = await ctx.confirm("签名请求", `${ctx.origin}\n请求对消息签名`);
    if (!ok) throw new Error("用户拒绝签名");
    const svc = await this.ensureSigner(ctx);
    return svc.signMessage(data);
  }

  async signTypedData(
    params: any[],
    ctx: DAppHandlerContext,
  ): Promise<string> {
    const typed = JSON.parse(params[1]);
    const { types, domain, message } = typed;
    const ok = await ctx.confirm(
      "签名请求",
      `${ctx.origin}\n请求对结构化数据签名`,
    );
    if (!ok) throw new Error("用户拒绝签名");
    const svc = await this.ensureSigner(ctx);
    return svc.signTypedData(domain, types, message);
  }

  async sendTransaction(
    params: any[],
    ctx: DAppHandlerContext,
  ): Promise<string> {
    const tx = params[0] || {};
    const valueEth = tx.value
      ? (parseInt(tx.value, 16) / 1e18).toFixed(6) + " ETH"
      : "0 ETH";
    const ok = await ctx.confirm(
      "交易请求",
      `${ctx.origin}\n发送至: ${shortAddr(tx.to)}\n金额: ${valueEth}`,
    );
    if (!ok) throw new Error("用户拒绝交易");
    const svc = await this.ensureSigner(ctx);
    return svc.sendTransaction(tx);
  }

  async switchChain(
    params: any[],
    ctx: DAppHandlerContext,
  ): Promise<void> {
    const hex = params[0]?.chainId;
    const chainId = parseInt(hex, 16);
    if (isNaN(chainId)) throw new Error("无效的 chainId");
    await DAppBridgeService.switchChain(chainId);
    ctx.emitChainChanged("0x" + chainId.toString(16));
  }

  async requestPermissions(
    params: any[],
    ctx: DAppHandlerContext,
  ): Promise<unknown> {
    const accounts = await this.connect(ctx);
    return [
      {
        invoker: ctx.origin,
        parentCapability: "eth_accounts",
        caveats: [{ type: "restrictReturnedAccounts", value: accounts }],
      },
    ];
  }

  async getPermissions(ctx: DAppHandlerContext): Promise<unknown> {
    const accounts = await this.getAccounts(ctx.origin);
    if (!accounts.length) return [];
    return [
      {
        invoker: ctx.origin,
        parentCapability: "eth_accounts",
        caveats: [{ type: "restrictReturnedAccounts", value: accounts }],
      },
    ];
  }

  async revokePermissions(
    params: any[],
    ctx: DAppHandlerContext,
  ): Promise<unknown> {
    await DAppBridgeService.removeSite(ctx.origin, this.chainKind);
    ctx.setConnected(false);
    ctx.emitAccountsChanged([]);
    return null;
  }

  /** 统一入口：页面把请求派发到这里，由本 handler 决定如何处理 */
  async handle(
    method: string,
    params: any[],
    ctx: DAppHandlerContext,
  ): Promise<unknown> {
    switch (method) {
      case "eth_chainId":
        return this.getChainId();
      case "net_version": {
        const hex = await this.getChainId();
        return String(parseInt(hex, 16));
      }
      case "eth_accounts":
        return this.getAccounts(ctx.origin);
      case "eth_requestAccounts":
        return this.connect(ctx);
      case "wallet_requestPermissions":
        return this.requestPermissions(params, ctx);
      case "wallet_getPermissions":
        return this.getPermissions(ctx);
      case "wallet_revokePermissions":
        return this.revokePermissions(params, ctx);
      case "wallet_switchEthereumChain":
        return this.switchChain(params, ctx);
      case "personal_sign":
      case "eth_sign":
        return this.signMessage(params, ctx);
      case "eth_signTypedData":
      case "eth_signTypedData_v4":
        return this.signTypedData(params, ctx);
      case "eth_sendTransaction":
        return this.sendTransaction(params, ctx);
      default:
        // 其余 eth_/net_/web3_ 视为只读 RPC 透传
        if (
          method.startsWith("eth_") ||
          method.startsWith("net_") ||
          method.startsWith("web3_")
        ) {
          return this.readRpc(method, params);
        }
        throw new Error("不支持的方法: " + method);
    }
  }
}
