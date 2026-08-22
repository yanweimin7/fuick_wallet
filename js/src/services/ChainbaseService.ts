import { APP_CONFIG } from "../config";

const CHAINBASE_BASE = "https://api.chainbase.online/v1";

export interface ChainbaseTokenBalance {
  contractAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  /** 已按 decimals 格式化后的余额（十进制字符串） */
  balance: string;
}

export class ChainbaseService {
  static get apiKey(): string {
    return APP_CONFIG.chainbaseApiKey || "";
  }

  static isConfigured(): boolean {
    const k = this.apiKey;
    return !!k && k !== "YOUR_CHAINBASE_API_KEY";
  }

  private static async request<T>(path: string, attempt = 1): Promise<T> {
    const url = `${CHAINBASE_BASE}${path}`;
    console.log(`[ChainbaseService] request (try ${attempt}):`, url);
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": this.apiKey,
          accept: "application/json",
        },
      });
      const json = await res.json();
      console.log("[ChainbaseService] response:", JSON.stringify(json));
      if (json && json.code !== undefined && json.code !== 0) {
        throw new Error(
          json.message || json.error || `Chainbase error ${json.code}`,
        );
      }
      return json as T;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      // 限流（免费套餐每秒请求数上限）才重试；unsupported network 等永久错误直接抛
      const rateLimited = /credit limit|rate|429|too many|timeout/i.test(msg);
      if (rateLimited && attempt < 4) {
        const delay = 800 * attempt;
        console.warn(
          `[ChainbaseService] rate-limited, retry ${attempt} after ${delay}ms`,
        );
        await new Promise((r) => setTimeout(r, delay));
        return this.request<T>(path, attempt + 1);
      }
      throw e;
    }
  }

  /** 原生币余额。返回十进制浮点数字（已除以 decimals，默认 18） */
  static async getNativeBalance(
    chainId: number,
    address: string,
    decimals = 18,
  ): Promise<number> {
    const json: any = await this.request(
      `/account/balance?chain_id=${chainId}&address=${address}`,
    );
    const data = json.data;
    let raw: bigint;
    if (typeof data === "string" && data.startsWith("0x")) {
      raw = BigInt(data);
    } else {
      raw = BigInt(data ?? "0");
    }
    const divisor = BigInt(10) ** BigInt(decimals);
    const whole = raw / divisor;
    const frac = raw % divisor;
    return Number(whole) + Number(frac) / Number(divisor);
  }

  /** 该地址在指定链上的全部 ERC20 代币余额，key 为小写合约地址 */
  static async getTokenBalances(
    chainId: number,
    address: string,
  ): Promise<Map<string, ChainbaseTokenBalance>> {
    const map = new Map<string, ChainbaseTokenBalance>();
    let page = 1;
    const limit = 100;
    const PAGE_INTERVAL_MS = 1000;
    while (page <= 10) {
      // 翻页前稍作停顿，避免短时间内连发请求触发 Chainbase 免费套餐限频
      if (page > 1) {
        await new Promise((r) => setTimeout(r, PAGE_INTERVAL_MS));
      }
      const json: any = await this.request(
        `/account/tokens?chain_id=${chainId}&address=${address}&page=${page}&limit=${limit}`,
      );
      const items: any[] = Array.isArray(json.data) ? json.data : [];
      for (const it of items) {
        const decimals = Number(it.decimals ?? 18);
        const balance = this.normalizeBalance(it.balance, decimals);
        map.set((it.contract_address || "").toLowerCase(), {
          contractAddress: it.contract_address,
          symbol: it.symbol || "",
          name: it.name || "",
          decimals,
          balance,
        });
      }
      if (items.length < limit) break;
      page++;
    }
    return map;
  }

  /** 把 Chainbase 返回的余额（十进制或 0x 十六进制整数串）按 decimals 格式化 */
  private static normalizeBalance(
    raw: string | number | null,
    decimals: number,
  ): string {
    if (raw === null || raw === undefined) return "0";
    const dec = Number(decimals) || 0;
    const divide = (big: bigint): string => {
      if (dec <= 0) return big.toString();
      const divisor = BigInt(10) ** BigInt(dec);
      const whole = big / divisor;
      const frac = big % divisor;
      const fracStr = frac.toString().padStart(dec, "0").replace(/0+$/, "");
      return fracStr ? `${whole}.${fracStr}` : `${whole}`;
    };
    if (typeof raw === "number") {
      // JSON 数字：已是浮点（已除精度）直接返回；否则当作原始整数按精度除
      if (!Number.isInteger(raw)) return raw.toString();
      return divide(BigInt(raw));
    }
    const s = String(raw).trim();
    if (s === "") return "0";
    if (s.includes(".")) return s; // 已是十进制浮点（已除精度）
    return divide(BigInt(s)); // 0x 十六进制或十进制整数串，统一按整数解析
  }
}
