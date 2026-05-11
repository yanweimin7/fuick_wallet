export interface UnlockResult {
  success: boolean;
  encryptionKey?: string;
  error?: string;
}

export class LocalAuthService {
  /**
   * 检查生物识别是否可用
   * Dart 返回字符串 "true" 或 "false"，需要转换
   */
  static async isBiometricAvailable(): Promise<boolean> {
    const result = await dartCallNativeAsync<string>(
      "LocalAuth.isBiometricAvailable",
      {},
    );
    return result === "true";
  }

  /**
   * 初始化加密密钥（创建钱包时调用）
   * @param password 用户密码
   * @returns 加密密钥（用于加密钱包数据）
   */
  static async initEncryptionKey(password: string): Promise<string | null> {
    const result = await dartCallNativeAsync<string>(
      "LocalAuth.initEncryptionKey",
      { password },
    );
    if (!result) return null;
    try {
      const data = JSON.parse(result) as UnlockResult;
      if (data.success) {
        return data.encryptionKey || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * 用密码解锁加密密钥
   * @param password 用户密码
   * @returns 加密密钥（用于解密钱包数据）
   */
  static async unlockWithPassword(password: string): Promise<string | null> {
    const result = await dartCallNativeAsync<string>(
      "LocalAuth.unlockWithPassword",
      { password },
    );
    if (!result) return null;
    try {
      const data = JSON.parse(result) as UnlockResult;
      if (data.success) {
        return data.encryptionKey || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * 启用生物识别
   * @param encryptionKey 当前加密密钥
   */
  static async enableBiometric(encryptionKey: string): Promise<boolean> {
    const result = await dartCallNativeAsync<string>(
      "LocalAuth.enableBiometric",
      { encryptionKey },
    );
    if (!result) return false;
    try {
      const data = JSON.parse(result) as { success: boolean };
      return data.success;
    } catch {
      return false;
    }
  }

  static async disableBiometric(): Promise<boolean> {
    const result = await dartCallNativeAsync<string>(
      "LocalAuth.disableBiometric",
      {},
    );
    if (!result) return false;
    try {
      const data = JSON.parse(result) as { success: boolean };
      return data.success;
    } catch {
      return false;
    }
  }

  /**
   * 检查是否启用了生物识别
   * Dart 返回字符串 "true" 或 "false"，需要转换
   */
  static async isBiometricEnabled(): Promise<boolean> {
    const result = await dartCallNativeAsync<string>(
      "LocalAuth.isBiometricEnabled",
      {},
    );
    return result === "true";
  }

  /**
   * 用生物识别解锁加密密钥
   * @returns 加密密钥（用于解密钱包数据）
   */
  static async unlockWithBiometric(): Promise<string | null> {
    const result = await dartCallNativeAsync<string>(
      "LocalAuth.unlockWithBiometric",
      {},
    );
    if (!result) return null;
    try {
      const data = JSON.parse(result) as UnlockResult;
      if (data.success) {
        return data.encryptionKey || null;
      }
      return null;
    } catch {
      return null;
    }
  }
}
