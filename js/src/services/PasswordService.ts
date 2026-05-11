import { LocalAuthService } from "./LocalAuthService";
import React from "react";
import {
  VerifyPasswordDialog,
  SetPasswordDialog,
} from "../components/PasswordDialogs";

export class PasswordService {
  /**
   * 检查是否已设置密码
   * 通过检查是否有存储的盐值来判断
   */
  static async isPasswordSet(): Promise<boolean> {
    const result = await dartCallNativeAsync<string>(
      "LocalAuth.isPasswordSet",
      {},
    );
    return result === "true";
  }

  /**
   * 设置新密码（创建第一个钱包时）
   * @param navigator 导航器实例
   * @returns 密码或 null
   */
  static async setPassword(navigator: any): Promise<string | null> {
    const password = await navigator.showDialog(
      React.createElement(SetPasswordDialog),
    );
    return password || null;
  }

  /**
   * 获取加密密钥
   * 1. 如果启用了生物识别，优先尝试生物识别解锁
   * 2. 否则弹出密码输入对话框
   * @param navigator 导航器实例，用于显示对话框
   * @returns 加密密钥（用于解密钱包数据）
   */
  static async getEncryptionKey(navigator: any): Promise<string | null> {
    // 1. 尝试生物识别（如果启用）
    try {
      const isBioEnabled = await LocalAuthService.isBiometricEnabled();
      if (isBioEnabled) {
        const encryptionKey = await LocalAuthService.unlockWithBiometric();
        if (encryptionKey) {
          return encryptionKey;
        }
      }
    } catch (e) {
      console.error("Biometric auth failed", e);
    }

    // 2. 降级到密码对话框（直接返回 encryptionKey）
    const encryptionKey = await navigator.showDialog(
      React.createElement(VerifyPasswordDialog),
    );
    return encryptionKey || null;
  }

  /**
   * 初始化加密密钥（创建钱包时调用）
   * @param password 用户设置的密码
   * @returns 加密密钥
   */
  static async initEncryptionKey(password: string): Promise<string | null> {
    return await LocalAuthService.initEncryptionKey(password);
  }

  /**
   * 启用生物识别
   * @param encryptionKey 当前加密密钥
   */
  static async enableBiometric(encryptionKey: string): Promise<boolean> {
    return await LocalAuthService.enableBiometric(encryptionKey);
  }

  /**
   * 禁用生物识别
   */
  static async disableBiometric(): Promise<void> {
    await LocalAuthService.disableBiometric();
  }
}
