import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";

export class SolanaService {
  private connection: Connection | null = null;
  private payer: Keypair | null = null;

  constructor(rpcUrl: string) {
    console.log("[SolanaService] Initializing with RPC:", rpcUrl);
    try {
      this.connection = new Connection(rpcUrl, "confirmed");
      console.log("[SolanaService] Connection created");
    } catch (e) {
      console.error("[SolanaService] Failed to initialize:", e);
    }
  }

  isConnected(): boolean {
    return this.connection !== null;
  }

  async getBalance(address: string): Promise<string> {
    if (!this.connection) {
      throw new Error("SolanaService not initialized");
    }
    console.log("[SolanaService] Getting balance for:", address);
    const publicKey = new PublicKey(address);
    console.log("[SolanaService] PublicKey created, calling getBalance...");
    try {
      const balance = await this.connection.getBalance(publicKey);
      console.log("[SolanaService] Raw balance:", balance);
      return (balance / 1e9).toString();
    } catch (e) {
      console.error("[SolanaService] Error in getBalance:", e);
      throw e;
    }
  }

  async getTokenBalance(
    tokenAddress: string,
    walletAddress: string,
  ): Promise<string> {
    if (!this.connection) {
      throw new Error("SolanaService not initialized");
    }
    const tokenPublicKey = new PublicKey(tokenAddress);
    const walletPublicKey = new PublicKey(walletAddress);

    const tokenAccount = await this.connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      {
        mint: tokenPublicKey,
      },
    );

    if (tokenAccount.value.length === 0) {
      return "0";
    }

    const balance =
      tokenAccount.value[0].account.data.parsed.info.tokenAmount.uiAmountString;
    return balance;
  }

  async getBlockNumber(): Promise<number> {
    if (!this.connection) {
      throw new Error("SolanaService not initialized");
    }
    return await this.connection.getSlot();
  }

  initPayer(privateKey: Uint8Array): void {
    if (!this.connection) {
      throw new Error("SolanaService not initialized");
    }
    this.payer = Keypair.fromSecretKey(privateKey);
    console.log(
      "[SolanaService] Payer initialized for:",
      this.payer.publicKey.toBase58(),
    );
  }

  async initPayerFromMnemonic(
    mnemonic: string,
    derivationPath?: string,
  ): Promise<void> {
    if (!this.connection) {
      throw new Error("SolanaService not initialized");
    }

    const seed = await bip39.mnemonicToSeed(mnemonic);

    const paths = derivationPath
      ? [derivationPath]
      : [
          "m/44'/501'/0'/0'",
          "m/44'/501'/0'/0'/0'",
          "m/44'/501'/1'/0'",
          "m/44'/501'/1'/0'/0'",
          "m/44'/501'",
        ];

    for (const path of paths) {
      try {
        const derived = derivePath(path, seed.toString("hex"));
        const privateKey = derived.key;
        const keypair = Keypair.fromSeed(privateKey);

        console.log(
          `[SolanaService] Trying path ${path} -> ${keypair.publicKey.toBase58()}`,
        );

        const balance = await this.connection.getBalance(keypair.publicKey);
        if (balance > 0) {
          this.payer = keypair;
          console.log(
            `[SolanaService] Found funded account with path ${path}, balance: ${balance / 1e9} SOL`,
          );
          return;
        }
      } catch (e) {
        console.log(`[SolanaService] Path ${path} failed:`, e);
      }
    }

    const defaultPath = "m/44'/501'/0'/0'";
    const derived = derivePath(defaultPath, seed.toString("hex"));
    this.payer = Keypair.fromSeed(derived.key);
    console.log(
      "[SolanaService] Payer initialized from mnemonic for:",
      this.payer.publicKey.toBase58(),
    );
  }

  initPayerFromPrivateKey(privateKeyStr: string): void {
    if (!this.connection) {
      throw new Error("SolanaService not initialized");
    }

    const privateKeyBytes = bs58.decode(privateKeyStr);
    this.payer = Keypair.fromSecretKey(privateKeyBytes);
    console.log(
      "[SolanaService] Payer initialized for:",
      this.payer.publicKey.toBase58(),
    );
  }

  async initPayerFromKey(privateKeyStr: string): Promise<void> {
    if (privateKeyStr.includes(" ")) {
      await this.initPayerFromMnemonic(privateKeyStr);
    } else {
      this.initPayerFromPrivateKey(privateKeyStr);
    }
  }

  async transfer(to: string, amount: string): Promise<string> {
    if (!this.connection || !this.payer) {
      throw new Error(
        "SolanaService not initialized with signer. Call initPayer first.",
      );
    }
    const toPublicKey = new PublicKey(to);
    const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
    console.log("[SolanaService] Transferring", amount, "SOL to", to);

    const transaction = new Transaction();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: this.payer.publicKey,
        toPubkey: toPublicKey,
        lamports: Math.round(lamports),
      }),
    );

    const signature = await this.connection.sendTransaction(transaction, [
      this.payer,
    ]);
    console.log("[SolanaService] Transaction sent:", signature);
    try {
      await this.connection.confirmTransaction(signature, "confirmed");
      console.log("[SolanaService] Transaction confirmed:", signature);
    } catch (e) {
      console.error("[SolanaService] Confirm error:", e);
    }
    return signature;
  }
}
