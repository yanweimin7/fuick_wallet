import 'package:bip39/bip39.dart' as bip39;
import 'package:flutter/foundation.dart';
import 'package:fuickjs_flutter/core/service/BaseFuickService.dart';
import 'package:fuick_wallet/service/chain/chain_handler.dart';
import 'package:fuick_wallet/service/chain/evm_chain_handler.dart';
import 'package:fuick_wallet/service/chain/solana_chain_handler.dart';
import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:encrypt/encrypt.dart' as encrypt;

// Top-level function for compute
Future<String> _createMnemonicTask(String? mnemonic) async {
  final validMnemonic = mnemonic ?? bip39.generateMnemonic();
  // Validate mnemonic if provided
  if (mnemonic != null && !bip39.validateMnemonic(mnemonic)) {
    throw Exception("Invalid mnemonic");
  }
  return validMnemonic;
}

Future<Map<String, String>> _getAccountTask(Map<String, dynamic> args) async {
  final mnemonic = args['mnemonic'] as String;
  final chainType = args['chainType'] as String? ?? 'evm';

  ChainHandler handler =
      chainType == 'solana' ? SolanaChainHandler() : EvmChainHandler();
  return handler.getAccountFromMnemonic(mnemonic);
}

Future<Map<String, String>> _importPrivateKeyTask(
    Map<String, dynamic> args) async {
  final privateKeyStr = args['privateKey'] as String;
  final chainType = args['chainType'] as String? ?? 'evm';

  ChainHandler handler =
      chainType == 'solana' ? SolanaChainHandler() : EvmChainHandler();
  return handler.getAccountFromPrivateKey(privateKeyStr);
}

class FuickWalletService extends BaseFuickService {
  @override
  String get name => "Wallet";

  final Map<String, ChainHandler> _chainHandlers = {
    'evm': EvmChainHandler(),
    'solana': SolanaChainHandler(),
  };

  ChainHandler _getHandler(String? chainType) {
    return _chainHandlers[chainType ?? 'evm'] ?? _chainHandlers['evm']!;
  }

  FuickWalletService() {
    registerAsyncMethod('ping', (args) async {
      return "pong";
    });

    registerAsyncMethod('computeHash', (args) async {
      if (args is Map && args['content'] != null) {
        final content = args['content'] as String;
        final bytes = utf8.encode(content);
        final digest = sha256.convert(bytes);
        return digest.toString();
      }
      return "";
    });

    registerAsyncMethod('aesEncrypt', (args) async {
      if (args is Map) {
        final content = args['content'] as String;
        final password = args['password'] as String;

        // Derive key from password using SHA256 (32 bytes for AES-256)
        final keyBytes = sha256.convert(utf8.encode(password)).bytes;
        final key = encrypt.Key(Uint8List.fromList(keyBytes));
        final iv = encrypt.IV.fromLength(16); // Random IV

        final encrypter = encrypt.Encrypter(encrypt.AES(key));
        final encrypted = encrypter.encrypt(content, iv: iv);

        // Return IV + Encrypted as Base64
        return iv.base64 + ":" + encrypted.base64;
      }
      return "";
    });

    registerAsyncMethod('aesDecrypt', (args) async {
      if (args is Map) {
        final encryptedData = args['encryptedData'] as String;
        final password = args['password'] as String;

        final parts = encryptedData.split(':');
        if (parts.length != 2) throw Exception("Invalid encrypted format");

        final iv = encrypt.IV.fromBase64(parts[0]);
        final encrypted = encrypt.Encrypted.fromBase64(parts[1]);

        final keyBytes = sha256.convert(utf8.encode(password)).bytes;
        final key = encrypt.Key(Uint8List.fromList(keyBytes));

        final encrypter = encrypt.Encrypter(encrypt.AES(key));
        return encrypter.decrypt(encrypted, iv: iv);
      }
      return "";
    });

    registerAsyncMethod('createWallet', (args) async {
      try {
        // Run in a separate isolate to avoid blocking the UI thread
        final mnemonic =
            await compute<String?, String>(_createMnemonicTask, null);
        return {'mnemonic': mnemonic};
      } catch (e, stack) {
        print(stack);
        rethrow;
      }
    });

    registerAsyncMethod('importWallet', (args) async {
      if (args is Map) {
        final mnemonic = args['mnemonic'];
        try {
          // Run in a separate isolate
          final validMnemonic =
              await compute<String?, String>(_createMnemonicTask, mnemonic);
          return {'mnemonic': validMnemonic};
        } catch (e, stack) {
          print(stack);
          rethrow;
        }
      }
      return null;
    });

    registerAsyncMethod('getAccount', (args) async {
      if (args is Map) {
        try {
          // Run in a separate isolate
          final result =
              await compute<Map<String, dynamic>, Map<String, String>>(
                  _getAccountTask, args.cast<String, dynamic>());
          return result;
        } catch (e, stack) {
          print(stack);
          rethrow;
        }
      }
      return null;
    });

    registerAsyncMethod('importPrivateKey', (args) async {
      if (args is Map) {
        final privateKey = args['privateKey'];
        final chainType = args['chainType'];
        try {
          // Run in a separate isolate
          final result =
              await compute<Map<String, dynamic>, Map<String, String>>(
                  _importPrivateKeyTask,
                  {'privateKey': privateKey, 'chainType': chainType});
          return result;
        } catch (e, stack) {
          print(stack);
          rethrow;
        }
      }
      return null;
    });

    registerAsyncMethod('getBalance', (args) async {
      if (args is Map) {
        final rpcUrl = args['rpcUrl'];
        final address = args['address'];
        final chainType = args['chainType'];

        if (rpcUrl != null && address != null) {
          return _getHandler(chainType).getBalance(rpcUrl, address);
        }
      }
      return "0";
    });

    registerAsyncMethod('getTokenBalance', (args) async {
      if (args is Map) {
        final rpcUrl = args['rpcUrl'];
        final contractAddress = args['contractAddress'];
        final address = args['address'];
        final chainType = args['chainType'];

        if (rpcUrl != null && contractAddress != null && address != null) {
          return _getHandler(chainType)
              .getTokenBalance(rpcUrl, contractAddress, address);
        }
      }
      return "0";
    });

    registerAsyncMethod('transfer', (args) async {
      if (args is Map) {
        final rpcUrl = args['rpcUrl'];
        final privateKey = args['privateKey'];
        final to = args['to'];
        final amount = args['amount'];
        final chainType = args['chainType'];

        if (rpcUrl != null &&
            privateKey != null &&
            to != null &&
            amount != null) {
          return _getHandler(chainType)
              .transfer(rpcUrl, privateKey, to, amount);
        }
      }
      return null;
    });
  }
}
