import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bs58 from "bs58";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";

// SPL Token Program 与 Associated Token Account Program 的固定地址
const SOLANA_TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
);
const SOLANA_ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
);

export class SolanaService {
  private connection: Connection | null = null;
  private payer: Keypair | null = null;

  constructor(rpcUrl: string | string[]) {
    const url = Array.isArray(rpcUrl) ? rpcUrl[0] : rpcUrl;
    console.log("[SolanaService] Initializing with RPC:", url);
    try {
      this.connection = new Connection(url, "confirmed");
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
      tokenAccount.value[0].account.data.parsed.info.tokenAmount.amount;
    return balance;
  }

  async getTokenMetadata(
    tokenAddress: string,
  ): Promise<{ name: string; symbol: string; decimals: number } | null> {
    if (!this.connection) return null;
    try {
      const mint = new PublicKey(tokenAddress);
      const info = await this.connection.getParsedAccountInfo(mint);
      // @ts-ignore - parsed mint account carries decimals
      const decimals = info.value?.data?.parsed?.info?.decimals;
      if (typeof decimals !== "string" && typeof decimals !== "number") {
        return null;
      }
      return { name: "", symbol: "", decimals: Number(decimals) };
    } catch (e) {
      console.error("[SolanaService] getTokenMetadata failed:", e);
      return null;
    }
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

  /**
   * SPL 代币转账（与 EVM 的 transferToken 对齐）
   * 若目标地址的关联代币账户(ATA)不存在，则先创建。
   * 使用手写指令，避免引入 @solana/spl-token 依赖。
   */
  async transferToken(
    tokenAddress: string,
    to: string,
    amount: string,
    decimals: number = 9,
  ): Promise<string> {
    if (!this.connection || !this.payer) {
      throw new Error(
        "SolanaService not initialized with signer. Call initPayer first.",
      );
    }
    const mint = new PublicKey(tokenAddress);
    const owner = this.payer.publicKey;
    const destination = new PublicKey(to);

    const sourceAta = PublicKey.findProgramAddressSync(
      [owner.toBuffer(), SOLANA_TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SOLANA_ASSOCIATED_TOKEN_PROGRAM_ID,
    )[0];
    const destAta = PublicKey.findProgramAddressSync(
      [
        destination.toBuffer(),
        SOLANA_TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      SOLANA_ASSOCIATED_TOKEN_PROGRAM_ID,
    )[0];

    const transaction = new Transaction();

    // 目标 ATA 不存在则先创建（否则 transfer 会失败）
    const destInfo = await this.connection.getAccountInfo(destAta);
    if (!destInfo) {
      transaction.add(
        new TransactionInstruction({
          programId: SOLANA_ASSOCIATED_TOKEN_PROGRAM_ID,
          keys: [
            { pubkey: owner, isSigner: true, isWritable: true },
            { pubkey: destAta, isSigner: false, isWritable: true },
            { pubkey: destination, isSigner: false, isWritable: false },
            { pubkey: mint, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            { pubkey: SOLANA_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          ],
          data: new Uint8Array(0),
        }),
      );
    }

    // SPL Transfer 指令：opcode=3, amount=u64 小端
    const amountU64 = this._parseTokenAmount(amount, decimals);
    const data = new Uint8Array(9);
    data[0] = 3;
    for (let i = 0; i < 8; i++) {
      data[1 + i] = Number((amountU64 >> BigInt(8 * i)) & 0xffn);
    }
    transaction.add(
      new TransactionInstruction({
        programId: SOLANA_TOKEN_PROGRAM_ID,
        keys: [
          { pubkey: sourceAta, isSigner: false, isWritable: true },
          { pubkey: destAta, isSigner: false, isWritable: true },
          { pubkey: owner, isSigner: true, isWritable: false },
        ],
        data,
      }),
    );

    const signature = await this.connection.sendTransaction(transaction, [
      this.payer,
    ]);
    console.log("[SolanaService] Token transaction sent:", signature);
    try {
      await this.connection.confirmTransaction(signature, "confirmed");
      console.log("[SolanaService] Token transaction confirmed:", signature);
    } catch (e) {
      console.error("[SolanaService] Token confirm error:", e);
    }
    return signature;
  }

  /**
   * 将十进制字符串金额（如 "1.5"）按 decimals 转换为 u64 整数（无浮点精度损失）
   */
  private _parseTokenAmount(amount: string, decimals: number): bigint {
    const [intPart, fracPart = ""] = amount.split(".");
    const frac = (fracPart + "0".repeat(decimals)).slice(0, decimals);
    const combined = (intPart || "0") + frac;
    return BigInt(combined || "0");
  }
}
