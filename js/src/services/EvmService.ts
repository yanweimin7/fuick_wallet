import { ethers, Network, Contract, Wallet } from "ethers";

export class EvmService {
  private provider: ethers.Provider | null = null;
  private signer: Wallet | null = null;

  constructor(rpcUrl: string | string[], chainId?: number) {
    const urls = Array.isArray(rpcUrl) ? rpcUrl : [rpcUrl];
    console.log(
      "[EvmService] Initializing with RPC:",
      urls,
      "chainId:",
      chainId,
    );
    try {
      const network = chainId ? Network.from(chainId) : undefined;
      const providers = urls.map((u) =>
        network
          ? new ethers.JsonRpcProvider(u, network)
          : new ethers.JsonRpcProvider(u),
      );
      this.provider =
        providers.length === 1
          ? providers[0]
          : new ethers.FallbackProvider(providers, 1);
      console.log(
        "[EvmService] Provider created, fallback count:",
        providers.length,
      );
      if (!chainId) {
        this.detectNetwork();
      }
    } catch (e) {
      console.error("[EvmService] Failed to initialize:", e);
    }
  }

  private async detectNetwork() {
    try {
      const network = await this.provider?.getNetwork();
      console.log("[EvmService] Network detected:", network);
    } catch (e) {
      console.error("[EvmService] Network detection failed:", e);
    }
  }

  isConnected(): boolean {
    return this.provider !== null;
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error("EvmService not initialized");
    }
    const balance = await this.provider.getBalance(address);
    console.log("[EvmService] Raw balance:", balance.toString());
    return ethers.formatEther(balance);
  }

  async getTokenBalance(
    tokenAddress: string,
    walletAddress: string,
  ): Promise<string> {
    if (!this.provider) {
      throw new Error("EvmService not initialized");
    }
    const minABI = [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ];
    const contract = new ethers.Contract(tokenAddress, minABI, this.provider);
    const balance = await contract.balanceOf(walletAddress);
    // 返回原始整数（未除以 decimals），由调用方按代币 decimals 格式化
    return balance.toString();
  }

  async getTokenMetadata(
    tokenAddress: string,
  ): Promise<{ name: string; symbol: string; decimals: number } | null> {
    if (!this.provider) return null;
    const abi = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
    ];
    try {
      const contract = new ethers.Contract(tokenAddress, abi, this.provider);
      const [name, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
      ]);
      return { name, symbol, decimals: Number(decimals) };
    } catch (e) {
      console.error("[EvmService] getTokenMetadata failed:", e);
      return null;
    }
  }

  async getBlockNumber(): Promise<number> {
    if (!this.provider) {
      throw new Error("EvmService not initialized");
    }
    return await this.provider.getBlockNumber();
  }

  async getGasPrice(): Promise<string> {
    if (!this.provider) {
      throw new Error("EvmService not initialized");
    }
    const gasPrice = await this.provider.getFeeData();
    return ethers.formatUnits(gasPrice.gasPrice || 0, "gwei");
  }

  initSigner(privateKey: string): void {
    if (!this.provider) {
      throw new Error("EvmService not initialized");
    }
    this.signer = new Wallet(privateKey, this.provider);
    console.log("[EvmService] Signer initialized for:", this.signer.address);
  }

  /** 透传任意 JSON-RPC 只读请求（eth_call / eth_getBalance / eth_blockNumber 等） */
  async send(method: string, params: unknown[]): Promise<unknown> {
    if (!this.provider) {
      throw new Error("EvmService not initialized");
    }
    return this.provider.send(method, params);
  }

  /** 对消息签名（personal_sign），message 可为 utf8 字符串或 0x 十六进制 */
  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error("EvmService signer not initialized");
    }
    return this.signer.signMessage(message);
  }

  /** 对 EIP-712 结构化数据签名（eth_signTypedData_v4） */
  async signTypedData(
    domain: unknown,
    types: Record<string, Array<{ name: string; type: string }>>,
    value: unknown,
  ): Promise<string> {
    if (!this.signer) {
      throw new Error("EvmService signer not initialized");
    }
    // ethers v6 要求 types 中剔除 EIP712Domain
    const { EIP712Domain, ...filteredTypes } = types as any;
    return this.signer.signTypedData(domain as any, filteredTypes as any, value as any);
  }

  /** 发送一笔交易，返回交易哈希 */
  async sendTransaction(tx: {
    to?: string;
    from?: string;
    value?: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    nonce?: string;
  }): Promise<string> {
    if (!this.signer) {
      throw new Error("EvmService signer not initialized");
    }
    const txRequest: any = {};
    if (tx.to) txRequest.to = tx.to;
    if (tx.value) txRequest.value = tx.value;
    if (tx.data) txRequest.data = tx.data;
    if (tx.gasLimit) txRequest.gasLimit = tx.gasLimit;
    if (tx.gasPrice) txRequest.gasPrice = tx.gasPrice;
    if (tx.maxFeePerGas) txRequest.maxFeePerGas = tx.maxFeePerGas;
    if (tx.maxPriorityFeePerGas)
      txRequest.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
    if (tx.nonce) txRequest.nonce = parseInt(tx.nonce, 16);

    const sent = await this.signer.sendTransaction(txRequest);
    console.log("[EvmService] Transaction sent:", sent.hash);
    try {
      await sent.wait(1);
    } catch (e) {
      console.error("[EvmService] Wait error:", e);
    }
    return sent.hash;
  }

  async transfer(to: string, amount: string): Promise<string> {
    if (!this.signer) {
      throw new Error(
        "EvmService signer not initialized. Call initSigner first.",
      );
    }
    console.log("[EvmService] Transferring", amount, "to", to);
    const tx = await this.signer.sendTransaction({
      to,
      value: ethers.parseEther(amount),
    });
    console.log("[EvmService] Transaction sent:", tx.hash);
    try {
      const receipt = await tx.wait(1);
      console.log("[EvmService] Transaction confirmed:", receipt?.hash);
    } catch (e) {
      console.error("[EvmService] Wait error:", e);
    }
    return tx.hash;
  }

  async transferToken(
    tokenAddress: string,
    to: string,
    amount: string,
    decimals: number = 18,
  ): Promise<string> {
    if (!this.signer) {
      throw new Error(
        "EvmService signer not initialized. Call initSigner first.",
      );
    }
    const tokenContract = new Contract(
      tokenAddress,
      ["function transfer(address to, uint256 amount) public returns (bool)"],
      this.signer,
    );
    const amountWei = ethers.parseUnits(amount, decimals);
    console.log("[EvmService] Transferring token", amount, "to", to);
    const tx = await tokenContract.transfer(to, amountWei);
    console.log("[EvmService] Token transaction sent:", tx.hash);
    try {
      const receipt = await tx.wait(1);
      console.log("[EvmService] Token transaction confirmed:", receipt?.hash);
    } catch (e) {
      console.error("[EvmService] Token wait error:", e);
    }
    return tx.hash;
  }
}
