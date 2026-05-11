export class StorageService {
  private static readonly WALLET_KEY = "fuick_wallet_data";

  static setItem(key: string, value: any): Promise<boolean> {
    return dartCallNativeAsync<boolean>("Storage.setItem", { key, value });
  }

  static getItem(key: string): Promise<any | null> {
    return dartCallNativeAsync<any | null>("Storage.getItem", { key });
  }

  static removeItem(key: string): Promise<boolean> {
    return dartCallNativeAsync<boolean>("Storage.removeItem", { key });
  }
}
