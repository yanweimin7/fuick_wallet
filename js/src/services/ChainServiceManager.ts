import { EvmService } from "./EvmService";
import { SolanaService } from "./SolanaService";
import { ChainConfig, ChainRegistry } from "./ChainRegistry";

export type ChainService = EvmService | SolanaService;

export class ChainServiceManager {
  private static instance: ChainServiceManager;
  private services: Map<string, ChainService> = new Map();

  private constructor() {}

  static getInstance(): ChainServiceManager {
    if (!ChainServiceManager.instance) {
      ChainServiceManager.instance = new ChainServiceManager();
    }
    return ChainServiceManager.instance;
  }

  async getService(chainId: string): Promise<ChainService | null> {
    if (!chainId) {
      console.log("[ChainServiceManager] No chain id provided");
      return null;
    }

    if (this.services.has(chainId)) {
      return this.services.get(chainId) || null;
    }

    const chain = ChainRegistry.getById(chainId);
    if (!chain) {
      console.error("[ChainServiceManager] Chain not found:", chainId);
      return null;
    }

    const service = this.createService(chain);
    if (service) {
      this.services.set(chainId, service);
    }
    return service;
  }

  getServiceSync(chainId: string): ChainService | null {
    if (!chainId) return null;
    return this.services.get(chainId) || null;
  }

  private createService(chain: ChainConfig): ChainService | null {
    console.log(
      "[ChainServiceManager] Creating service for chain:",
      chain.id,
      "type:",
      chain.type,
    );

    if (chain.type === "EVM") {
      return new EvmService(chain.rpcUrl, chain.chainId);
    } else if (chain.type === "Solana") {
      return new SolanaService(chain.rpcUrl);
    }

    console.error("[ChainServiceManager] Unknown chain type:", chain.type);
    return null;
  }

  async initSigner(chainId: string, privateKey: string): Promise<void> {
    const service = await this.getService(chainId);
    if (!service) {
      throw new Error("Service not available");
    }

    if (service instanceof EvmService) {
      service.initSigner(privateKey);
    } else if (service instanceof SolanaService) {
      await service.initPayerFromKey(privateKey);
    }
  }

  async initSignerFromMnemonic(
    chainId: string,
    mnemonic: string,
  ): Promise<void> {
    const service = await this.getService(chainId);
    if (!service) {
      throw new Error("Service not available");
    }

    if (service instanceof SolanaService) {
      await service.initPayerFromMnemonic(mnemonic);
    }
  }

  clearService(chainId: string): void {
    this.services.delete(chainId);
  }

  clearAllServices(): void {
    this.services.clear();
  }
}
