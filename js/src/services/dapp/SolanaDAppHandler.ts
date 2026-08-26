import { DAppChainHandler, DAppHandlerContext } from "./DAppChainHandler";
import { DAppBridgeService } from "../DAppBridgeService";
import { SOLANA_INJECT_SCRIPT } from "../../utils/solanaProvider";
import { base64Encode, base64Decode } from "../../utils/base64";

function shortAddr(a?: string | null): string {
  if (!a) return "";
  return a.length > 12 ? `${a.slice(0, 6)}...${a.slice(-4)}` : a;
}

/**
 * Solana 链 Handler（兼容 Phantom / Wallet Standard 的最小子集）。
 * 把 window.solana 的请求派发到宿主：
 * - solana_connect：连接并授权，返回地址
 * - solana_disconnect：断开
 * - solana_signMessage：对消息签名
 * - solana_signTransaction：对交易部分签名
 * - solana_sendTransaction：签名并发送
 * - solana_request：只读 RPC 透传到 Solana RPC
 */
export class SolanaDAppHandler implements DAppChainHandler {
  readonly chainKind = "solana";
  readonly injectScript = SOLANA_INJECT_SCRIPT;

  supports(method: string): boolean {
    return method.startsWith("solana_");
  }

  async getAccounts(origin: string): Promise<string[]> {
    return DAppBridgeService.getSiteAccounts(origin, this.chainKind);
  }

  async connect(ctx: DAppHandlerContext): Promise<string> {
    const existing = await DAppBridgeService.getSiteAccounts(
      ctx.origin,
      this.chainKind,
    );
    if (existing.length) {
      const svc = await DAppBridgeService.getSolanaService();
      const pk = svc.getAddress();
      if (pk && pk !== existing[0]) {
        await DAppBridgeService.setSiteAccounts(ctx.origin, this.chainKind, [
          pk,
        ]);
        ctx.emitAccountsChanged([pk]);
        return pk;
      }
      return existing[0];
    }

    const addr = await DAppBridgeService.getSolanaAddress();
    if (!addr) throw new Error("没有可用账户");

    const ok = ctx.confirmConnect
      ? await ctx.confirmConnect({
          origin: ctx.origin,
          address: addr,
          chainKind: this.chainKind,
        })
      : await ctx.confirm(
          "连接请求",
          `${ctx.origin}\n请求连接你的 Solana 钱包\n地址: ${shortAddr(addr)}`,
        );
    if (!ok) throw new Error("用户拒绝连接");

    await DAppBridgeService.setSiteAccounts(ctx.origin, this.chainKind, [addr]);
    ctx.setConnected(true);
    ctx.emitAccountsChanged([addr]);
    return (await DAppBridgeService.getSolanaKeyInfo()) || { address: addr, publicKey: "" };
  }

  async disconnect(ctx: DAppHandlerContext): Promise<unknown> {
    await DAppBridgeService.removeSite(ctx.origin, this.chainKind);
    ctx.setConnected(false);
    ctx.emitAccountsChanged([]);
    return null;
  }

  private async ensureSigner(ctx: DAppHandlerContext) {
    const encryptionKey = await ctx.requestPassword();
    if (!encryptionKey) throw new Error("用户取消");
    const pk = await DAppBridgeService.getSolanaPrivateKey(encryptionKey);
    const svc = await DAppBridgeService.getSolanaService();
    svc.initPayerFromKey(pk);
    return svc;
  }

  async signMessage(
    params: any[],
    ctx: DAppHandlerContext,
  ): Promise<{ signature: string }> {
    const b64 = params[0];
    const ok = await ctx.confirm("签名请求", `${ctx.origin}\n请求对消息签名`);
    if (!ok) throw new Error("用户拒绝签名");
    const svc = await this.ensureSigner(ctx);
    const bytes = base64Decode(b64);
    const sig = svc.signMessage(bytes);
    return { signature: base64Encode(sig) };
  }

  async signTransaction(
    params: any[],
    ctx: DAppHandlerContext,
  ): Promise<string> {
    const b64 = params[0];
    const ok = await ctx.confirm("签名请求", `${ctx.origin}\n请求对交易签名`);
    if (!ok) throw new Error("用户拒绝签名");
    const svc = await this.ensureSigner(ctx);
    const bytes = base64Decode(b64);
    const signed = svc.signTransaction(bytes);
    return base64Encode(signed);
  }

  async sendTransaction(
    params: any[],
    ctx: DAppHandlerContext,
  ): Promise<string> {
    const b64 = params[0];
    const ok = await ctx.confirm(
      "交易请求",
      `${ctx.origin}\n请求签名并发送交易`,
    );
    if (!ok) throw new Error("用户拒绝交易");
    const svc = await this.ensureSigner(ctx);
    const bytes = base64Decode(b64);
    return svc.signAndSendTransaction(bytes);
  }

  async readRpc(params: any[]): Promise<unknown> {
    const svc = await DAppBridgeService.getSolanaService();
    const req = params[0] || {};
    return svc.send(req.method, req.params || []);
  }

  async handle(
    method: string,
    params: any[],
    ctx: DAppHandlerContext,
  ): Promise<unknown> {
    switch (method) {
      case "solana_connect":
        return this.connect(ctx);
      case "solana_disconnect":
        return this.disconnect(ctx);
      case "solana_signMessage":
        return this.signMessage(params, ctx);
      case "solana_signTransaction":
        return this.signTransaction(params, ctx);
      case "solana_sendTransaction":
        return this.sendTransaction(params, ctx);
      case "solana_request":
        return this.readRpc(params, ctx);
      default:
        throw new Error("不支持的 Solana 方法: " + method);
    }
  }
}
