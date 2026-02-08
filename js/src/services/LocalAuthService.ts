export class LocalAuthService {
    static isBiometricAvailable(): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('LocalAuth.isBiometricAvailable', {});
    }

    static enableBiometric(password: string): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('LocalAuth.enableBiometric', { password });
    }

    static disableBiometric(): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('LocalAuth.disableBiometric', {});
    }

    static isBiometricEnabled(): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('LocalAuth.isBiometricEnabled', {});
    }

    static biometricAuthAndGetPassword(): Promise<string> {
        // @ts-ignore
        return dartCallNativeAsync('LocalAuth.biometricAuthAndGetPassword', {});
    }
}
