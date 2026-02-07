import { StorageService } from "./StorageService";
import { WalletService, WalletAccount } from "./WalletService";

export enum WalletType {
    Mnemonic = 'mnemonic',
    PrivateKey = 'privateKey'
}

export interface WalletInfo {
    id: string;
    name: string;
    address: string;
    type: WalletType;
}

export interface WalletSecret {
    mnemonic?: string;
    privateKey: string;
}

export class WalletManager {
    private static instance: WalletManager;
    private wallets: WalletInfo[] = [];
    private static readonly WALLET_LIST_KEY = "fuick_wallet_list";
    private static readonly SECRET_PREFIX = "fuick_wallet_secret_";

    private constructor() { }

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
            console.log("WalletManager initialized, wallets loaded:", this.wallets.length);
        } catch (e) {
            console.error("Failed to load wallets:", e);
            this.wallets = [];
        }
    }

    getWallets(): WalletInfo[] {
        return this.wallets;
    }

    getWallet(id: string): WalletInfo | undefined {
        return this.wallets.find(w => w.id === id);
    }

    async createWallet(name?: string): Promise<WalletInfo> {
        const account = await WalletService.createWallet();
        return this._saveNewWallet(name, account, WalletType.Mnemonic);
    }

    async importWallet(name: string | undefined, mnemonic: string): Promise<WalletInfo> {
        const account = await WalletService.importWallet(mnemonic);
        return this._saveNewWallet(name, account, WalletType.Mnemonic);
    }

    async importPrivateKeyWallet(name: string | undefined, privateKey: string): Promise<WalletInfo> {
        const account = await WalletService.importPrivateKey(privateKey);
        return this._saveNewWallet(name, account, WalletType.PrivateKey);
    }

    private async _saveNewWallet(name: string | undefined, account: WalletAccount, type: WalletType): Promise<WalletInfo> {
        const id = this._generateId();
        const finalName = name || `Wallet ${id}`;
        const info: WalletInfo = {
            id,
            name: finalName,
            address: account.address,
            type,
        };

        const secret: WalletSecret = {
            mnemonic: account.mnemonic,
            privateKey: account.privateKey,
        };

        // 1. Save secret first (safest)
        await StorageService.setItem(this._getSecretKey(id), secret);

        // 2. Add to list and save list
        this.wallets.push(info);
        await this._saveWalletsList();

        return info;
    }

    async deleteWallet(id: string): Promise<void> {
        const index = this.wallets.findIndex(w => w.id === id);
        if (index === -1) return;

        // 1. Remove from list
        this.wallets.splice(index, 1);
        await this._saveWalletsList();

        // 2. Remove secret
        await StorageService.removeItem(this._getSecretKey(id));
    }

    async clearAllWallets(): Promise<void> {
        // 1. Remove all secrets
        for (const w of this.wallets) {
            await StorageService.removeItem(this._getSecretKey(w.id));
        }

        // 2. Remove list
        this.wallets = [];
        await StorageService.removeItem(WalletManager.WALLET_LIST_KEY);
    }

    async getSecret(id: string): Promise<WalletSecret | null> {
        return await StorageService.getItem(this._getSecretKey(id));
    }

    private async _saveWalletsList(): Promise<void> {
        await StorageService.setItem(WalletManager.WALLET_LIST_KEY, this.wallets);
    }

    private _getSecretKey(id: string): string {
        return `${WalletManager.SECRET_PREFIX}${id}`;
    }

    private _generateId(): string {
        if (this.wallets.length === 0) {
            return "1";
        }
        const ids = this.wallets
            .map(w => parseInt(w.id, 10))
            .filter(id => !isNaN(id));

        if (ids.length === 0) {
            return (this.wallets.length + 1).toString();
        }

        const maxId = Math.max(...ids);
        return (maxId + 1).toString();
    }
}
