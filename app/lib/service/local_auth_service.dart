import 'package:fuickjs_flutter/core/service/base_fuick_service.dart';
import 'package:local_auth/local_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:encrypt/encrypt.dart' as encrypt;

class LocalAuthService extends BaseFuickService {
  @override
  String get name => "LocalAuth";

  final LocalAuthentication _auth = LocalAuthentication();
  final _storage = const FlutterSecureStorage();
  static const _biometricPassKey = 'fuick_wallet_biometric_pass_v1';

  // Internal encryption key for extra layer of security
  // In a real production app, this should be obfuscated or derived securely.
  final _encryptionKey =
      encrypt.Key.fromUtf8('fuick_wallet_32_byte_secure_key!');

  String _encrypt(String text) {
    final iv = encrypt.IV.fromSecureRandom(16);
    final encrypter = encrypt.Encrypter(encrypt.AES(_encryptionKey));
    final encrypted = encrypter.encrypt(text, iv: iv);
    return "${iv.base64}:${encrypted.base64}";
  }

  String _decrypt(String combined) {
    try {
      final parts = combined.split(':');
      if (parts.length != 2) throw Exception("Invalid storage format");
      final iv = encrypt.IV.fromBase64(parts[0]);
      final encryptedText = parts[1];
      final encrypter = encrypt.Encrypter(encrypt.AES(_encryptionKey));
      return encrypter.decrypt64(encryptedText, iv: iv);
    } catch (e) {
      print("AES Decrypt error: $e");
      rethrow; // Don't return original data if decryption fails
    }
  }

  AndroidOptions _getAndroidOptions() => const AndroidOptions(
        // encryptedSharedPreferences is deprecated in flutter_secure_storage 9.0.0+
        // and replaced by more specific options. For standard secure storage,
        // the default options are now recommended.
        resetOnError: true,
      );

  IOSOptions _getIOSOptions() => const IOSOptions(
        accessibility: KeychainAccessibility.unlocked_this_device,
      );

  LocalAuthService() {
    registerAsyncMethod('isBiometricAvailable', (args) async {
      try {
        final canCheck = await _auth.canCheckBiometrics;
        final isSupported = await _auth.isDeviceSupported();
        print("LocalAuthService: canCheck=$canCheck, isSupported=$isSupported");
        return (canCheck && isSupported).toString();
      } catch (e) {
        print("LocalAuthService error: $e");
        return "false";
      }
    });

    registerAsyncMethod('enableBiometric', (args) async {
      if (args is Map) {
        final password = args['password'] as String;

        try {
          final bool didAuthenticate = await _auth.authenticate(
              localizedReason: 'Authenticate to enable biometric login');

          if (didAuthenticate) {
            // Encrypt password before storing
            final encryptedPassword = _encrypt(password);

            // Store encrypted password securely
            await _storage.write(
              key: _biometricPassKey,
              value: encryptedPassword,
              iOptions: _getIOSOptions(),
              aOptions: _getAndroidOptions(),
            );
            return "true";
          }
        } catch (e) {
          print("Enable biometric auth error: $e");
        }
      }
      return "false";
    });

    registerAsyncMethod('disableBiometric', (args) async {
      await _storage.delete(
        key: _biometricPassKey,
        iOptions: _getIOSOptions(),
        aOptions: _getAndroidOptions(),
      );
      return "true";
    });

    registerAsyncMethod('isBiometricEnabled', (args) async {
      final hasPassword = await _storage.containsKey(
        key: _biometricPassKey,
        iOptions: _getIOSOptions(),
        aOptions: _getAndroidOptions(),
      );
      return hasPassword.toString();
    });

    registerAsyncMethod('biometricAuthAndGetPassword', (args) async {
      final hasPassword = await _storage.containsKey(
        key: _biometricPassKey,
        iOptions: _getIOSOptions(),
        aOptions: _getAndroidOptions(),
      );
      if (!hasPassword) return "";

      try {
        final bool didAuthenticate = await _auth.authenticate(
            localizedReason: 'Please authenticate to access your wallet');

        if (didAuthenticate) {
          final storedValue = await _storage.read(
            key: _biometricPassKey,
            iOptions: _getIOSOptions(),
            aOptions: _getAndroidOptions(),
          );

          if (storedValue == null) return "";

          // Decrypt stored password
          return _decrypt(storedValue);
        }
      } catch (e) {
        print("Biometric auth error: $e");
      }
      return "";
    });
  }
}
