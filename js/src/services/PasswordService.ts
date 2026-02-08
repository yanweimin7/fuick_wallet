import { StorageService } from "./StorageService";
import { WalletService } from "./WalletService";
import { LocalAuthService } from "./LocalAuthService";
import React from "react";
import { VerifyPasswordDialog } from "../components/PasswordDialogs";

export class PasswordService {
    private static readonly PASSWORD_KEY = "fuick_wallet_local_password_hash";
    private static cachedHash: string | null = null;

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
    }

    static async verifyPassword(password: string): Promise<boolean> {
        const hash = await WalletService.computeHash(password);
        if (this.cachedHash) {
            return this.cachedHash === hash;
        }
        const stored = await StorageService.getItem(this.PASSWORD_KEY);
        return stored === hash;
    }

    /**
     * 获取用户密码。
     * 1. 优先尝试生物识别验证。
     * 2. 如果生物识别不可用或失败，弹出密码验证对话框。
     * @param navigator 导航器实例，用于显示对话框
     */
    static async getPassword(navigator: any): Promise<string | null> {
        // 1. 尝试生物识别
        try {
            const isBioEnabled = await LocalAuthService.isBiometricEnabled();
            // 鲁棒性检查：确保各种返回类型都能正确识别
            if (isBioEnabled === "true" || (isBioEnabled as any) === true) {
                const bioPass = await LocalAuthService.biometricAuthAndGetPassword();
                if (bioPass) {
                    return bioPass;
                }
            }
        } catch (e) {
            console.error("Biometric auth flow failed", e);
        }

        // 2. 降级到密码对话框
        const password = await navigator.showDialog(React.createElement(VerifyPasswordDialog));
        return password || null;
    }
}
