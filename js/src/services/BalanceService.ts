import { ChainConfig, TokenConfig } from "./ChainRegistry";
import { ChainbaseService } from "./ChainbaseService";
import { ChainServiceManager } from "./ChainServiceManager";

export interface BalanceCacheEntry {
  /** 原生币余额（十进制数字，已除以 decimals） */
  native: number;
  /** 代币余额：key=小写合约地址，value=十进制数字（已除以 decimals） */
  tokens: Map<string, number>;
  /** 数据来源，用于区分 Chainbase / RPC */
  source: "chainbase" | "rpc";
  /** 当 source=rpc 且曾尝试 Chainbase 时，记录失败原因 */
  chainbaseError?: string;
}

class BalanceStore {
  private cache = new Map<string, BalanceCacheEntry>();

  static key(chainId: number, address: string): string {
    return `${chainId}:${address}`;
  }

  get(chainId: number, address: string): BalanceCacheEntry | undefined {
    return this.cache.get(BalanceStore.key(chainId, address));
  }

  set(chainId: number, address: string, entry: BalanceCacheEntry): void {
    this.cache.set(BalanceStore.key(chainId, address), entry);
  }

  invalidate(chainId: number, address: string): void {
    this.cache.delete(BalanceStore.key(chainId, address));
  }
}

export class BalanceService {
  private static store = new BalanceStore();

  /**
   * 获取余额。优先读全局缓存；仅当 force=true（下拉刷新）或缓存未命中（切换钱包/链首次进入）时才发起接口调用。
   */
  static async ensure(opts: {
    chain: ChainConfig;
    address: string;
    tokenList: TokenConfig[];
    force?: boolean;
  }): Promise<BalanceCacheEntry> {
    const { chain, address, tokenList, force } = opts;
    const cached = this.store.get(chain.chainId, address);
    if (!force && cached) {
      // 缓存命中：若本次请求的代币里还有未缓存的（如首次进入时自定义代币
      // 尚未加载完），只补拉缺失的代币，避免整页重复请求原生币。
      const hasAll = tokenList.every((t) =>
        cached.tokens.has(t.address.toLowerCase()),
      );
      if (hasAll) return cached;
      const updated = await this.ensureTokens(
        chain,
        address,
        tokenList,
        cached,
      );
      this.store.set(chain.chainId, address, updated);
      return updated;
    }

    const entry = await this.withTimeout(
      this.fetch(chain, address, tokenList),
      30000,
      "BalanceService.fetch",
    );
    this.store.set(chain.chainId, address, entry);
    return entry;
  }

  private static withTimeout<T>(
    p: Promise<T>,
    ms: number,
    label: string,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const t = setTimeout(
        () => reject(new Error(`${label} timeout ${ms}ms`)),
        ms,
      );
      p.then(
        (v) => {
          clearTimeout(t);
          resolve(v);
        },
        (e) => {
          clearTimeout(t);
          reject(e);
        },
      );
    });
  }

  private static async fetch(
    chain: ChainConfig,
    address: string,
    tokenList: TokenConfig[],
  ): Promise<BalanceCacheEntry> {
    // 优先 Chainbase 取原生币（仅 1 次请求，避免触发免费套餐每秒限流）；
    // 代币只取「配置 + 已添加」的少数几个，用本地 RPC 补，不再全量扫描 Chainbase
    let chainbaseError: string | undefined;
    if (chain.type === "EVM" && ChainbaseService.isConfigured()) {
      try {
        const native = await ChainbaseService.getNativeBalance(
          chain.chainId,
          address,
          18,
        );
        const rpc = await this.fetchViaRpc(chain, address, tokenList);
        console.log(
          "[BalanceService] balance SOURCE = chainbase, native=",
          native,
          "tokens=",
          rpc.tokens.size,
        );
        return { native, tokens: rpc.tokens, source: "chainbase" };
      } catch (e) {
        chainbaseError = e instanceof Error ? e.message : String(e);
        console.warn("[BalanceService] Chainbase failed, fallback RPC:", e);
      }
    }
    const e = await this.fetchViaRpc(chain, address, tokenList);
    console.log(
      "[BalanceService] balance SOURCE = rpc, native=",
      e.native,
      "tokens=",
      e.tokens.size,
    );
    return { ...e, source: "rpc", chainbaseError };
  }

  private static async ensureTokens(
    chain: ChainConfig,
    address: string,
    tokenList: TokenConfig[],
    cached: BalanceCacheEntry,
  ): Promise<BalanceCacheEntry> {
    const manager = ChainServiceManager.getInstance();
    const service = await manager.getService(chain.id);
    if (!service) return cached;
    const tokens = new Map(cached.tokens);
    for (const t of tokenList) {
      const key = t.address.toLowerCase();
      if (tokens.has(key)) continue;
      try {
        const raw = await service.getTokenBalance(t.address, address);
        tokens.set(key, parseFloat(raw) / Math.pow(10, t.decimals) || 0);
      } catch (e) {
        console.error(`[BalanceService] token ${t.symbol} failed:`, e);
        tokens.set(key, 0);
      }
    }
    return { ...cached, tokens };
  }

  private static async fetchViaRpc(
    chain: ChainConfig,
    address: string,
    tokenList: TokenConfig[],
  ): Promise<BalanceCacheEntry> {
    const manager = ChainServiceManager.getInstance();
    const service = await manager.getService(chain.id);
    if (!service) {
      throw new Error("Service not available");
    }
    const nativeRaw = await service.getBalance(address);
    const native = parseFloat(nativeRaw) || 0;

    const tokens = new Map<string, number>();
    for (const t of tokenList) {
      const key = t.address.toLowerCase();
      try {
        const raw = await service.getTokenBalance(t.address, address);
        tokens.set(key, parseFloat(raw) / Math.pow(10, t.decimals) || 0);
      } catch (e) {
        console.error(`[BalanceService] token ${t.symbol} failed:`, e);
        tokens.set(key, 0);
      }
    }
    return { native, tokens, source: "rpc" };
  }
}
