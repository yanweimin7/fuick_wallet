import { StorageService } from "./StorageService";
import { WalletService, WalletAccount } from "./WalletService";
import { ChainRegistry } from "./ChainRegistry";

export enum WalletType {
  Mnemonic = "mnemonic",
  PrivateKey = "privateKey",
}

export interface WalletInfo {
  id: string;
  name: string;
  address: string;
  type: WalletType;
  addresses?: Record<string, string>;
}

export interface WalletSecret {
  mnemonic?: string;
  privateKeys?: Record<string, string>;
}

export class WalletManager {
  private static instance: WalletManager;
  private wallets: WalletInfo[] = [];
  private lastSelectedWalletId: string | null = null;
  private static readonly WALLET_LIST_KEY = "fuick_wallet_list_v2";
  private static readonly SECRET_PREFIX = "fuick_wallet_secret_";
  private static readonly LAST_SELECTED_KEY = "fuick_last_selected_wallet";

  private constructor() {}

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  async init() {
    try {
      const list = await StorageService.getItem(WalletManager.WALLET_LIST_KEY);
      if (list && Array.isArray(list)) {
        this.wallets = list;
      } else {
        this.wallets = [];
      }

      // 恢复上次选中的钱包（仅当该钱包仍存在）
      // 注意：桥接层可能把标量 "3" 反序列化为数字 3，而钱包 id 是字符串，
      // 因此比较时统一转成字符串，避免 "3" === 3 失败导致恢复被跳过。
      const lastId = await StorageService.getItem(
        WalletManager.LAST_SELECTED_KEY,
      );
      if (lastId != null && this.wallets.some((w) => String(w.id) === String(lastId))) {
        this.lastSelectedWalletId = String(lastId);
      }

      console.log(
        "[WalletManager] restored lastSelectedWalletId:",
        this.lastSelectedWalletId,
      );

      console.log(
        "WalletManager initialized, wallets loaded:",
        this.wallets.length,
      );
    } catch (e) {
      console.error("Failed to load wallets:", e);
      this.wallets = [];
    }
  }

  getWallets(): WalletInfo[] {
    return this.wallets;
  }

  getWallet(id: string): WalletInfo | undefined {
    return this.wallets.find((w) => w.id === id);
  }

  async setLastSelectedWalletId(id: string | null) {
    this.lastSelectedWalletId = id;
    try {
      if (id) {
        await StorageService.setItem(WalletManager.LAST_SELECTED_KEY, id);
        console.log("[WalletManager] persisted lastSelectedWalletId:", id);
      } else {
        await StorageService.removeItem(WalletManager.LAST_SELECTED_KEY);
        console.log("[WalletManager] cleared lastSelectedWalletId");
      }
    } catch (e) {
      console.error("Failed to persist last selected wallet:", e);
    }
  }

  getLastSelectedWalletId(): string | null {
    return this.lastSelectedWalletId;
  }

  async createWallet(
    encryptionKey: string,
    name?: string,
    type: WalletType = WalletType.Mnemonic,
  ): Promise<WalletInfo | null> {
    const { mnemonic } = await WalletService.createWallet();
    if (!mnemonic) throw new Error("Failed to create wallet");
    return this._saveNewWallet(
      name,
      mnemonic,
      WalletType.Mnemonic,
      encryptionKey,
    );
  }

  async importWallet(
    name: string | undefined,
    mnemonic: string,
    encryptionKey: string,
  ): Promise<WalletInfo> {
    const { mnemonic: validMnemonic } =
      await WalletService.importWallet(mnemonic);
    if (!validMnemonic) throw new Error("Failed to import wallet");
    return this._saveNewWallet(
      name,
      validMnemonic,
      WalletType.Mnemonic,
      encryptionKey,
    );
  }

  async importPrivateKeyWallet(
    name: string | undefined,
    privateKey: string,
    encryptionKey: string,
  ): Promise<WalletInfo> {
    const account = await WalletService.importPrivateKey(privateKey);
    // importPrivateKey still returns address/privateKey directly from native
    return this._saveNewWallet(
      name,
      privateKey,
      WalletType.PrivateKey,
      encryptionKey,
      account,
    );
  }

  private async _saveNewWallet(
    name: string | undefined,
    mnemonicOrPrivateKey: string,
    type: WalletType,
    encryptionKey: string,
    privateKeyAccount?: WalletAccount,
  ): Promise<WalletInfo> {
    const id = this._generateId();
    const finalName = name || `Wallet ${id}`;

    const addresses: Record<string, string> = {};
    const privateKeys: Record<string, string> = {};
    let primaryAddress = "";

    if (type === WalletType.Mnemonic) {
      const mnemonic = mnemonicOrPrivateKey;
      // Get unique protocols
      const protocols = Array.from(
        new Set(ChainRegistry.list().map((c) => c.type.toLowerCase())),
      );

      for (const protocol of protocols) {
        try {
          const acc = await WalletService.getAccount(mnemonic, protocol);
          if (acc.address) {
            // Assign to all chains of this protocol
            ChainRegistry.list()
              .filter((c) => c.type.toLowerCase() === protocol)
              .forEach((c) => {
                addresses[c.id] = acc.address!;
              });

            if (acc.privateKey) {
              privateKeys[protocol] = acc.privateKey;
            }

            // Set primary (prefer EVM)
            if (protocol === "evm") {
              primaryAddress = acc.address;
            } else if (!primaryAddress) {
              primaryAddress = acc.address;
            }
          }
        } catch (e) {
          console.error(`Failed to get account for protocol ${protocol}`, e);
        }
      }
    } else if (type === WalletType.PrivateKey && privateKeyAccount) {
      // 按检测出的链类型分流（EVM / Solana），不再硬编码 EVM，
      // 避免 Solana 私钥被错误地写入 evm 槽位并赋给所有 EVM 链地址
      const account = privateKeyAccount;
      const protocol = (account.chainType || "evm").toLowerCase();
      if (account.address && account.privateKey) {
        primaryAddress = account.address;
        privateKeys[protocol] = account.privateKey;

        ChainRegistry.list()
          .filter((c) => c.type.toLowerCase() === protocol)
          .forEach((c) => {
            addresses[c.id] = account.address!;
          });
      }
    }

    const info: WalletInfo = {
      id,
      name: finalName,
      address: primaryAddress,
      type,
      addresses,
    };

    const secret: WalletSecret = {
      mnemonic: type === WalletType.Mnemonic ? mnemonicOrPrivateKey : undefined,
      privateKeys: privateKeys,
    };

    // 1. Save secret first (safest)
    await this.saveSecret(id, secret, encryptionKey);

    // 2. Add to list and save list
    this.wallets.push(info);
    await this._saveWalletsList();

    return info;
  }

  async deleteWallet(id: string, encryptionKey: string): Promise<void> {
    const index = this.wallets.findIndex((w) => w.id === id);
    if (index === -1) return;

    // 1. Verify encryption key by verifying HMAC (faster than full decryption)
    const raw = await StorageService.getItem(this._getSecretKey(id));
    if (!raw) {
      throw new Error("Wallet secret not found");
    }

    const isValidKey = await WalletService.verifyEncryptionKey(
      raw,
      encryptionKey,
    );
    if (!isValidKey) {
      throw new Error("Invalid encryption key");
    }

    // 2. Remove from list
    this.wallets.splice(index, 1);
    if (this.lastSelectedWalletId === id) {
      this.lastSelectedWalletId = null;
      await StorageService.removeItem(WalletManager.LAST_SELECTED_KEY);
    }
    await this._saveWalletsList();

    // 3. Remove secret
    await StorageService.removeItem(this._getSecretKey(id));
  }

  async clearAllWallets(): Promise<void> {
    // 1. Remove all secrets
    for (const w of this.wallets) {
      await StorageService.removeItem(this._getSecretKey(w.id));
    }

    // 2. Remove list
    this.wallets = [];
    this.lastSelectedWalletId = null;
    await StorageService.removeItem(WalletManager.WALLET_LIST_KEY);
    await StorageService.removeItem(WalletManager.LAST_SELECTED_KEY);
  }

  async getSecret(
    walletId: string,
    encryptionKey: string,
  ): Promise<WalletSecret | null> {
    try {
      const raw = await StorageService.getItem(
        WalletManager.SECRET_PREFIX + walletId,
      );
      if (!raw) return null;
      try {
        const decrypted = await WalletService.aesDecrypt(raw, encryptionKey);
        return JSON.parse(decrypted);
      } catch (e) {
        console.error("Decryption failed", e);
        return null;
      }
    } catch (e) {
      console.error("Failed to load secret:", e);
      return null;
    }
  }

  async saveSecret(
    walletId: string,
    secret: WalletSecret,
    encryptionKey: string,
  ) {
    try {
      const content = JSON.stringify(secret);

      if (encryptionKey) {
        const encrypted = await WalletService.aesEncrypt(
          content,
          encryptionKey,
        );
        await StorageService.setItem(
          WalletManager.SECRET_PREFIX + walletId,
          encrypted,
        );
      } else {
        console.warn("Saving secret WITHOUT encryption (no encryptionKey set)");
        await StorageService.setItem(
          WalletManager.SECRET_PREFIX + walletId,
          content,
        );
      }
    } catch (e) {
      console.error("Failed to save secret:", e);
      throw e;
    }
  }

  private async _saveWalletsList(): Promise<void> {
    await StorageService.setItem(WalletManager.WALLET_LIST_KEY, this.wallets);
  }

  private _getSecretKey(id: string): string {
    return WalletManager.SECRET_PREFIX + id;
  }

  private _generateId(): string {
    if (this.wallets.length === 0) {
      return "1";
    }
    const ids = this.wallets
      .map((w) => parseInt(w.id, 10))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      return (this.wallets.length + 1).toString();
    }

    const maxId = Math.max(...ids);
    return (maxId + 1).toString();
  }

  getAddressForChain(id: string, chainId: string): string | undefined {
    const w = this.getWallet(id);
    if (!w) return undefined;
    return (w.addresses && w.addresses[chainId]) || w.address;
  }
}
