import { ethers, Network, Contract, Wallet } from "ethers";

export class EvmService {
  private provider: ethers.JsonRpcProvider | null = null;
  private signer: Wallet | null = null;

  constructor(rpcUrl: string, chainId?: number) {
    console.log(
      "[EvmService] Initializing with RPC:",
      rpcUrl,
      "chainId:",
      chainId,
    );
    try {
      if (chainId) {
        const network = Network.from(chainId);
        this.provider = new ethers.JsonRpcProvider(rpcUrl, network);
        console.log("[EvmService] Provider created with chainId:", chainId);
      } else {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        console.log("[EvmService] Provider created, detecting network...");
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
    return ethers.formatEther(balance);
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
