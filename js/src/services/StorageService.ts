import { WalletAccount } from "./WalletService";

export class StorageService {
    private static readonly WALLET_KEY = "fuick_wallet_data";

    static setItem(key: string, value: any): Promise<boolean> {
        // @ts-ignore
        return dartCallNativeAsync('Storage.setItem', { key, value });
    }

    static getItem(key: string): Promise<any | null> {
        // @ts-ignore
        return dartCallNativeAsync('Storage.getItem', { key });
    }

    static removeItem(key: string): Promise<boolean> {
        // @ts-ignore
        return dartCallNativeAsync('Storage.removeItem', { key });
    }
}
