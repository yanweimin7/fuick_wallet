export interface WalletAccount {
    mnemonic?: string;
    address?: string;
    privateKey?: string;
    addresses?: string;
    privateKeys?: string;
}

export class WalletService {
    static ping(): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.ping', {});
    }

    static createWallet(): Promise<WalletAccount> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.createWallet', {});
    }

    static importWallet(mnemonic: string): Promise<WalletAccount> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.importWallet', { mnemonic });
    }

    static getAccount(mnemonic: string, chainType: string): Promise<WalletAccount> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.getAccount', { mnemonic, chainType });
    }

    static importPrivateKey(privateKey: string): Promise<WalletAccount> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.importPrivateKey', { privateKey });
    }

    static getBalance(rpcUrl: string, address: string, chainType: string = 'evm'): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.getBalance', { rpcUrl, address, chainType });
    }

    static getTokenBalance(rpcUrl: string, contractAddress: string, address: string, chainType: string = 'evm'): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.getTokenBalance', { rpcUrl, contractAddress, address, chainType });
    }

    static transfer(rpcUrl: string, privateKey: string, to: string, amount: string, chainType: string = 'evm'): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.transfer', { rpcUrl, privateKey, to, amount, chainType });
    }

    static computeHash(content: string): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.computeHash', { content });
    }

    static aesEncrypt(content: string, password: string): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.aesEncrypt', { content, password });
    }

    static aesDecrypt(encryptedData: string, password: string): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('Wallet.aesDecrypt', { encryptedData, password });
    }
}
