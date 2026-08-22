import { StorageService } from "./StorageService";
import { TokenConfig, ChainRegistry } from "./ChainRegistry";

const STORE_KEY = "fuick_custom_tokens_v1";

// walletId -> chainId -> TokenConfig[]
type TokenStore = Record<string, Record<string, TokenConfig[]>>;

export class CustomTokenService {
  private static cache: TokenStore | null = null;

  private static async load(): Promise<TokenStore> {
    if (this.cache) return this.cache;
    try {
      const raw = await StorageService.getItem(STORE_KEY);
      this.cache =
        raw && typeof raw === "object" ? (raw as TokenStore) : {};
    } catch (e) {
      console.error("CustomTokenService load failed:", e);
      this.cache = {};
    }
    return this.cache!;
  }

  private static async save(store: TokenStore): Promise<void> {
    this.cache = store;
    await StorageService.setItem(STORE_KEY, store);
  }

  static async getTokens(
    walletId: string,
    chainId: string,
  ): Promise<TokenConfig[]> {
    const store = await this.load();
    return (store[walletId]?.[chainId] || []).slice();
  }

  static async addToken(
    walletId: string,
    chainId: string,
    token: TokenConfig,
  ): Promise<void> {
    const store = await this.load();
    if (!store[walletId]) store[walletId] = {};
    if (!store[walletId][chainId]) store[walletId][chainId] = [];
    const list = store[walletId][chainId];
    const exists = list.some(
      (t) => t.address.toLowerCase() === token.address.toLowerCase(),
    );
    if (exists) {
      store[walletId][chainId] = list.map((t) =>
        t.address.toLowerCase() === token.address.toLowerCase() ? token : t,
      );
    } else {
      store[walletId][chainId] = [...list, token];
    }
    await this.save(store);
  }

  static async removeToken(
    walletId: string,
    chainId: string,
    address: string,
  ): Promise<void> {
    const store = await this.load();
    if (!store[walletId]?.[chainId]) return;
    store[walletId][chainId] = store[walletId][chainId].filter(
      (t) => t.address.toLowerCase() !== address.toLowerCase(),
    );
    await this.save(store);
  }

  /** 导出某钱包下全部自定义代币（跨所有链），用于备份 */
  static async exportAll(
    walletId: string,
  ): Promise<Array<{ chainId: string } & TokenConfig>> {
    const store = await this.load();
    const result: Array<{ chainId: string } & TokenConfig> = [];
    const chains = store[walletId] || {};
    for (const chainId of Object.keys(chains)) {
      for (const t of chains[chainId]) {
        result.push({ chainId, ...t });
      }
    }
    return result;
  }

  /** 从备份数据导入自定义代币（按 chainId 归属到当前钱包），返回成功导入数量 */
  static async importTokens(
    walletId: string,
    items: Array<{ chainId: string } & TokenConfig>,
  ): Promise<number> {
    let count = 0;
    for (const item of items) {
      const { chainId, ...token } = item;
      if (!chainId || !token.address || !token.symbol) continue;
      if (!ChainRegistry.getById(chainId)) continue;
      if (
        typeof token.decimals !== "number" ||
        token.decimals < 0 ||
        token.decimals > 36
      ) {
        continue;
      }
      await this.addToken(walletId, chainId, token);
      count++;
    }
    return count;
  }

  /** 生成可读的备份文本（JSON） */
  static async buildBackupText(walletId: string): Promise<string> {
    const tokens = await this.exportAll(walletId);
    return JSON.stringify(
      { app: "fuick-wallet", type: "custom-tokens", version: 1, tokens },
      null,
      2,
    );
  }

  /** 解析备份文本，支持完整对象或纯数组，失败返回 null */
  static parseBackupText(
    text: string,
  ): Array<{ chainId: string } & TokenConfig> | null {
    try {
      const data = JSON.parse(text);
      const arr = Array.isArray(data) ? data : data?.tokens;
      if (!Array.isArray(arr)) return null;
      return arr as Array<{ chainId: string } & TokenConfig>;
    } catch {
      return null;
    }
  }
}
