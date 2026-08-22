import { EvmService } from "./EvmService";
import { WalletManager } from "./WalletManager";
import { StorageService } from "./StorageService";
import { getSelectedChain, setSelectedChain, ChainRegistry } from "./ChainRegistry";
import { DAppChainHandler } from "./dapp/DAppChainHandler";
import { EvmDAppHandler } from "./dapp/EvmDAppHandler";

const CONNECTED_KEY = "fuick_dapp_connected_sites";

/**
 * DApp 桥接中枢：
 * - 维护「已连接站点」持久化（按 origin + chainKind 命名空间，便于多链共存）
 * - 持有链 Handler 注册表，页面把请求派发给对应 handler
 * - 提供 EVM 基础设施（EvmService 缓存、私钥获取、切链）
 */
export class DAppBridgeService {
  /** 已注册链 handler；默认包含 EVM（EIP-1193） */
  private static handlers: DAppChainHandler[] = [new EvmDAppHandler()];

  /** 注册一条链的 handler（同 chainKind 只保留一个） */
  static registerHandler(handler: DAppChainHandler): void {
    this.handlers = this.handlers.filter(
      (h) => h.chainKind !== handler.chainKind,
    );
    this.handlers.push(handler);
  }

  static getHandlers(): DAppChainHandler[] {
    return this.handlers;
  }

  /** 兜底 handler（第一个注册的，当前为 EVM） */
  static getPrimaryHandler(): DAppChainHandler {
    return this.handlers[0];
  }

  /** 按方法找到能处理的 handler，找不到用兜底 */
  static resolveHandler(method: string): DAppChainHandler {
    return this.handlers.find((h) => h.supports(method)) || this.handlers[0];
  }

  // ---------------- 已连接站点（命名空间持久化） ----------------

  /** 结构：{ [origin]: { [chainKind]: string[] } } */
  static async getConnections(): Promise<
    Record<string, Record<string, string[]>>
  > {
    const raw = await StorageService.getItem(CONNECTED_KEY);
    return raw && typeof raw === "object" ? raw : {};
  }

  static async getSiteAccounts(
    origin: string,
    chainKind: string,
  ): Promise<string[]> {
    const all = await this.getConnections();
    return (all[origin] && all[origin][chainKind]) || [];
  }

  static async setSiteAccounts(
    origin: string,
    chainKind: string,
    accounts: string[],
  ): Promise<void> {
    const all = await this.getConnections();
    if (!all[origin]) all[origin] = {};
    all[origin][chainKind] = accounts;
    await StorageService.setItem(CONNECTED_KEY, all);
  }

  static async removeSite(origin: string, chainKind?: string): Promise<void> {
    const all = await this.getConnections();
    if (!all[origin]) return;
    if (chainKind) {
      delete all[origin][chainKind];
      if (Object.keys(all[origin]).length === 0) delete all[origin];
    } else {
      delete all[origin];
    }
    await StorageService.setItem(CONNECTED_KEY, all);
  }

  /** 该 origin 是否有任意链已授权 */
  static async isOriginConnected(origin: string): Promise<boolean> {
    const all = await this.getConnections();
    const entry = all[origin];
    if (!entry) return false;
    return Object.values(entry).some((accs) => accs && accs.length > 0);
  }

  // ---------------- EVM 基础设施 ----------------

  /** 当前选中的钱包在所选链上的地址 */
  static async getActiveAddress(): Promise<string | null> {
    const wm = WalletManager.getInstance();
    const wid = wm.getLastSelectedWalletId();
    if (!wid) return null;
    const chain = await getSelectedChain();
    return wm.getAddressForChain(wid, chain.id) || null;
  }

  /** 当前选中的链的 EVM chainId（十进制） */
  static async getActiveChainId(): Promise<number> {
    const chain = await getSelectedChain();
    return chain.chainId;
  }

  /** 按 chainId 缓存的 EvmService 实例 */
  private static evmCache = new Map<number, EvmService>();
  static async getEvmService(chainId?: number): Promise<EvmService> {
    const chain = await getSelectedChain();
    const id = chainId ?? chain.chainId;
    const cached = this.evmCache.get(id);
    if (cached && cached.isConnected()) return cached;
    const cfg = ChainRegistry.getById(chain.id) || chain;
    const svc = new EvmService(cfg.rpcUrl, cfg.chainId);
    this.evmCache.set(id, svc);
    return svc;
  }

  /** 用 encryptionKey 解出当前钱包的 EVM 私钥 */
  static async getEvmPrivateKey(encryptionKey: string): Promise<string> {
    const wm = WalletManager.getInstance();
    const wid = wm.getLastSelectedWalletId();
    if (!wid) throw new Error("没有已选择的钱包");
    const secret = await wm.getSecret(wid, encryptionKey);
    const pk = secret?.privateKeys?.evm;
    if (!pk) throw new Error("该钱包没有 EVM 私钥");
    return pk;
  }

  /** 切换当前链（dApp 请求 wallet_switchEthereumChain） */
  static async switchChain(chainId: number): Promise<void> {
    const target = ChainRegistry.list().find((c) => c.chainId === chainId);
    if (!target) throw new Error("不支持的链: " + chainId);
    await setSelectedChain(target);
    this.evmCache.clear();
  }
}
