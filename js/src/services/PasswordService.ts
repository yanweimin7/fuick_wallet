import { StorageService } from "./StorageService";
import { WalletService } from "./WalletService";

export class PasswordService {
    private static readonly PASSWORD_KEY = "fuick_wallet_local_password_hash";
    private static cachedHash: string | null = null;
    private static cachedPassword: string | null = null; // Cache plain password for session

    static async isPasswordSet(): Promise<boolean> {
        if (this.cachedHash) return true;
        const hash = await StorageService.getItem(this.PASSWORD_KEY);
        if (hash && typeof hash === 'string' && hash.length > 0) {
            this.cachedHash = hash;
            return true;
        }
        return false;
    }

    static async setPassword(password: string): Promise<void> {
        const hash = await WalletService.computeHash(password);
        await StorageService.setItem(this.PASSWORD_KEY, hash);
        this.cachedHash = hash;
        this.cachedPassword = password;
    }

    static async verifyPassword(password: string): Promise<boolean> {
        const hash = await WalletService.computeHash(password);
        if (this.cachedHash) {
            if (this.cachedHash === hash) {
                this.cachedPassword = password;
                return true;
            }
            return false;
        }
        const stored = await StorageService.getItem(this.PASSWORD_KEY);
        if (stored === hash) {
            this.cachedPassword = password;
            return true;
        }
        return false;
    }

    static getCachedPassword(): string | null {
        return this.cachedPassword;
    }
}
