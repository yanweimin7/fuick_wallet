import * as CryptoJS from "crypto-js";
import * as bip39 from "bip39";
import { ethers } from "ethers";
import bs58 from "bs58";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";

export interface WalletAccount {
  mnemonic?: string;
  address?: string;
  privateKey?: string;
  addresses?: Record<string, string>;
  privateKeys?: Record<string, string>;
}

/**
 * 加密数据包格式
 * 包含：盐值、IV、密文、认证标签
 */
export interface EncryptedData {
  salt: string; // base64 编码的盐值（保留字段，不再使用）
  iv: string; // base64 编码的 IV
  ciphertext: string; // base64 编码的密文
  tag: string; // base64 编码的认证标签 (MAC)
  version: number; // 加密方案版本
}

export class WalletService {
  // 加密版本号
  static readonly ENCRYPTION_VERSION = 2;
  // 密钥长度（256 位）
  static readonly KEY_SIZE = 256 / 32;

  /**
   * 创建新钱包 - 生成助记词
   */
  static async createWallet(): Promise<WalletAccount> {
    const mnemonic = bip39.generateMnemonic();
    return { mnemonic };
  }

  /**
   * 规范化助记词
   */
  static normalizeMnemonic(mnemonic: string): string {
    if (!mnemonic) return "";
    return mnemonic
      .trim()
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/\s+/g, " ");
  }

  /**
   * 导入钱包 - 验证助记词
   */
  static async importWallet(mnemonic: string): Promise<WalletAccount> {
    const normalized = this.normalizeMnemonic(mnemonic);
    const isValid = bip39.validateMnemonic(normalized);
    if (!isValid) {
      throw new Error("Invalid mnemonic");
    }
    return { mnemonic: normalized };
  }

  /**
   * 从助记词获取账户
   */
  static async getAccount(
    mnemonic: string,
    chainType: string,
  ): Promise<WalletAccount> {
    const normalized = this.normalizeMnemonic(mnemonic);

    if (chainType === "solana") {
      return this.getSolanaAccountFromMnemonic(normalized);
    } else {
      return this.getEvmAccountFromMnemonic(normalized);
    }
  }

  /**
   * 从助记词获取 EVM 账户
   */
  private static async getEvmAccountFromMnemonic(
    mnemonic: string,
  ): Promise<WalletAccount> {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  }

  /**
   * 从助记词获取 Solana 账户
   */
  private static async getSolanaAccountFromMnemonic(
    mnemonic: string,
  ): Promise<WalletAccount> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const derived = derivePath("m/44'/501'/0'/0'", seed.toString("hex"));
    const keypair = Keypair.fromSeed(derived.key);

    return {
      address: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
    };
  }

  /**
   * 从私钥导入账户
   */
  static async importPrivateKey(privateKey: string): Promise<WalletAccount> {
    // 尝试作为 EVM 私钥导入
    try {
      const wallet = new ethers.Wallet(privateKey);
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
    } catch {
      // 不是 EVM 私钥，尝试 Solana
      try {
        const secretKey = bs58.decode(privateKey);
        const keypair = Keypair.fromSecretKey(secretKey);
        return {
          address: keypair.publicKey.toBase58(),
          privateKey: privateKey,
        };
      } catch {
        throw new Error("Invalid private key");
      }
    }
  }

  /**
   * 计算 SHA256 哈希
   */
  static async computeHash(content: string): Promise<string> {
    return CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex);
  }

  /**
   * 生成随机 IV
   */
  private static generateIV(): string {
    const iv = CryptoJS.lib.WordArray.random(16);
    return CryptoJS.enc.Base64.stringify(iv);
  }

  /**
   * AES 加密
   * 直接使用 encryptionKey（32字节）+ 随机 IV + HMAC 认证
   *
   * @param content 明文内容
   * @param encryptionKey 加密密钥（32字节，base64编码）
   * @returns EncryptedData 加密数据包
   */
  static async aesEncrypt(
    content: string,
    encryptionKey: string,
  ): Promise<EncryptedData> {
    // 1. 生成随机 IV
    const iv = this.generateIV();

    // 2. 直接使用 encryptionKey
    const key = CryptoJS.enc.Base64.parse(encryptionKey);

    // 3. AES 加密（使用 CBC 模式）
    const ivWordArray = CryptoJS.enc.Base64.parse(iv);
    const encrypted = CryptoJS.AES.encrypt(content, key, {
      iv: ivWordArray,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // 4. 计算 HMAC（完整性校验）
    const ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    const hmac = CryptoJS.HmacSHA256(ciphertext, key);
    const tag = hmac.toString(CryptoJS.enc.Base64);

    return {
      salt: "", // 保留字段，不再使用
      iv,
      ciphertext,
      tag,
      version: this.ENCRYPTION_VERSION,
    };
  }

  /**
   * AES 解密
   *
   * @param encryptedData 加密数据包
   * @param encryptionKey 加密密钥
   * @returns 解密后的明文
   */
  static async aesDecrypt(
    encryptedData: EncryptedData,
    encryptionKey: string,
  ): Promise<string> {
    const { iv, ciphertext, tag } = encryptedData;

    // 1. 直接使用 encryptionKey
    const key = CryptoJS.enc.Base64.parse(encryptionKey);

    // 2. 验证 HMAC（完整性校验）
    const hmac = CryptoJS.HmacSHA256(ciphertext, key);
    const computedTag = hmac.toString(CryptoJS.enc.Base64);
    if (computedTag !== tag) {
      throw new Error("数据完整性校验失败：可能已被篡改");
    }

    // 3. AES 解密
    const ivWordArray = CryptoJS.enc.Base64.parse(iv);
    const ciphertextWordArray = CryptoJS.enc.Base64.parse(ciphertext);

    const decrypted = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({ ciphertext: ciphertextWordArray }),
      key,
      {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    const result = decrypted.toString(CryptoJS.enc.Utf8);
    if (!result) {
      throw new Error("解密失败：密钥错误或数据损坏");
    }

    return result;
  }

  /**
   * 验证加密密钥是否正确
   * 只验证 HMAC，不解密完整数据，性能更好
   *
   * @param encryptedData 加密数据包
   * @param encryptionKey 加密密钥
   * @returns 是否验证通过
   */
  static async verifyEncryptionKey(
    encryptedData: EncryptedData,
    encryptionKey: string,
  ): Promise<boolean> {
    try {
      const { ciphertext, tag } = encryptedData;

      // 直接使用 encryptionKey
      const key = CryptoJS.enc.Base64.parse(encryptionKey);

      // 只验证 HMAC，不解密
      const hmac = CryptoJS.HmacSHA256(ciphertext, key);
      const computedTag = hmac.toString(CryptoJS.enc.Base64);
      return computedTag === tag;
    } catch {
      return false;
    }
  }

  /**
   * XOR 加密（用于生物识别保护的密钥）
   * 注意：XOR 仅用于加密随机密钥，不用于直接加密用户数据
   *
   * @param data 数据（base64）
   * @param key 密钥（base64）
   * @returns 加密后的数据（base64）
   */
  static async xorEncrypt(data: string, key: string): Promise<string> {
    const dataBytes = CryptoJS.enc.Base64.parse(data);
    const keyBytes = CryptoJS.enc.Base64.parse(key);

    const result: number[] = [];
    const dataArr = dataBytes.words;
    const keyArr = keyBytes.words;
    const keyLen = keyArr.length;

    for (let i = 0; i < dataArr.length; i++) {
      const dataWord = dataArr[i];
      const keyWord = keyArr[i % keyLen];
      result.push(dataWord ^ keyWord);
    }

    const resultWordArray = CryptoJS.lib.WordArray.create(result);
    return CryptoJS.enc.Base64.stringify(resultWordArray);
  }

  /**
   * XOR 解密
   * 用于解密生物识别保护的密钥
   *
   * @param encryptedData 加密的数据（base64）
   * @param key 解密密钥（base64）
   * @returns 解密后的数据（base64）
   */
  static async xorDecrypt(encryptedData: string, key: string): Promise<string> {
    // XOR 是对称的，加密和解密使用相同操作
    return this.xorEncrypt(encryptedData, key);
  }
}
