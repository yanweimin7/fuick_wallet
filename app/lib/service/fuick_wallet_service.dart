import 'package:bip32/bip32.dart' as bip32;
import 'package:bip39/bip39.dart' as bip39;
import 'package:flutter/foundation.dart';
import 'package:fuickjs_flutter/core/service/BaseFuickService.dart';
import 'package:hex/hex.dart';
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';
import 'package:solana/solana.dart' as solana;
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
  final chainType = args['chainType'] as String;

  if (chainType == 'solana') {
    final solanaKeyPair = await solana.Ed25519HDKeyPair.fromMnemonic(mnemonic);
    return {
      'address': solanaKeyPair.address,
      // Solana private key handling can be added here if needed
    };
  } else {
    // Default EVM
    final seed = bip39.mnemonicToSeed(mnemonic);
    // Use BIP32 for standard Ethereum derivation path
    final root = bip32.BIP32.fromSeed(seed);
    // m/44'/60'/0'/0/0
    final child = root.derivePath("m/44'/60'/0'/0/0");
    final privateKeyList = child.privateKey!;

    final privateKey = EthPrivateKey(privateKeyList);
    final address = privateKey.address;
    final evmPrivateKey = HEX.encode(privateKeyList);

    return {
      'address': address.hex,
      'privateKey': evmPrivateKey,
    };
  }
}

Future<Map<String, String>> _importPrivateKeyTask(String privateKeyStr) async {
  final privateKey = EthPrivateKey.fromHex(privateKeyStr);
  final address = privateKey.address;

  return {
    'address': address.hex,
    'privateKey': privateKeyStr,
  };
}

class FuickWalletService extends BaseFuickService {
  @override
  String get name => "Wallet";

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
        try {
          // Run in a separate isolate
          final result = await compute<String, Map<String, String>>(
              _importPrivateKeyTask, privateKey);
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
        final chainType = args['chainType'] ?? 'evm';

        if (rpcUrl != null && address != null) {
          if (chainType == 'solana') {
            try {
              final client = solana.RpcClient(rpcUrl);
              final balance = await client.getBalance(address);
              return (balance.value / 1000000000).toString();
            } catch (e) {
              print('Solana getBalance error: $e');
              return "0";
            }
          } else {
            final client = Web3Client(rpcUrl, Client());
            try {
              final etherAmount = await client.getBalance(
                  EthereumAddress.fromHex(address, enforceEip55: false));
              return etherAmount.getValueInUnit(EtherUnit.ether).toString();
            } catch (e) {
              print('EVM getBalance error: $e');
              return "0";
            } finally {
              client.dispose();
            }
          }
        }
      }
      return "0";
    });

    registerAsyncMethod('getTokenBalance', (args) async {
      if (args is Map) {
        final rpcUrl = args['rpcUrl'];
        final contractAddress = args['contractAddress'];
        final address = args['address'];
        final chainType = args['chainType'] ?? 'evm';

        if (rpcUrl != null && contractAddress != null && address != null) {
          if (chainType == 'solana') {
            // TODO: SPL token balance
            return "0";
          } else {
            final client = Web3Client(rpcUrl, Client());
            try {
              final contract = DeployedContract(
                ContractAbi.fromJson(
                    '[{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}]',
                    'ERC20'),
                EthereumAddress.fromHex(contractAddress, enforceEip55: false),
              );
              final balanceOf = contract.function('balanceOf');
              final balance = await client.call(
                contract: contract,
                function: balanceOf,
                params: [EthereumAddress.fromHex(address, enforceEip55: false)],
              );
              return balance.first.toString();
            } catch (e) {
              print('Token balance error: $e');
              return "0";
            } finally {
              client.dispose();
            }
          }
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
        final chainType = args['chainType'] ?? 'evm';

        if (rpcUrl != null &&
            privateKey != null &&
            to != null &&
            amount != null) {
          if (chainType == 'solana') {
            // TODO: Implement Solana transfer
            throw UnimplementedError("Solana transfer not implemented");
          }

          final client = Web3Client(rpcUrl, Client());
          try {
            final credentials = EthPrivateKey.fromHex(privateKey);
            final toAddress = EthereumAddress.fromHex(to, enforceEip55: false);
            final amountEther = EtherAmount.fromUnitAndValue(
                EtherUnit.ether, double.parse(amount.toString()));

            final transaction = Transaction(
              to: toAddress,
              value: amountEther,
              maxGas: 21000,
            );

            // Send transaction
            // Note: In production you should estimate gas, get gas price etc.
            // For simple transfer, sendTransaction handles signing and broadcasting
            final txHash = await client.sendTransaction(
              credentials,
              transaction,
              chainId: null, // Let the client figure it out or pass it if known
            );
            return txHash;
          } catch (e) {
            print("Transfer error: $e");
            rethrow;
          } finally {
            client.dispose();
          }
        }
      }
      return null;
    });
  }
}
