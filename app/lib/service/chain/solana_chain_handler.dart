import 'package:solana/solana.dart' as solana;
import 'package:bs58/bs58.dart';
import 'chain_handler.dart';

class SolanaChainHandler implements ChainHandler {
  @override
  Future<Map<String, String>> getAccountFromMnemonic(String mnemonic) async {
    final solanaKeyPair = await solana.Ed25519HDKeyPair.fromMnemonic(mnemonic);
    return {
      'address': solanaKeyPair.address,
      'privateKey':
          mnemonic, // Storing mnemonic as privateKey for Solana HD wallet
    };
  }

  @override
  Future<Map<String, String>> getAccountFromPrivateKey(
      String privateKeyStr) async {
    if (privateKeyStr.contains(' ')) {
      return getAccountFromMnemonic(privateKeyStr);
    }

    // Assume Base58 encoded private key
    try {
      final privateKeyBytes = base58.decode(privateKeyStr);
      final keyPair = await solana.Ed25519HDKeyPair.fromPrivateKeyBytes(
          privateKey: privateKeyBytes);
      return {
        'address': keyPair.address,
        'privateKey': privateKeyStr,
      };
    } catch (e) {
      print('Failed to import Solana private key: $e');
      throw Exception("Invalid Solana private key");
    }
  }

  @override
  Future<String> getBalance(String rpcUrl, String address) async {
    try {
      final client = solana.RpcClient(rpcUrl);
      final balance = await client.getBalance(address);
      return (balance.value / 1000000000).toString();
    } catch (e) {
      print('Solana getBalance error: $e');
      return "0";
    }
  }

  @override
  Future<String> getTokenBalance(
      String rpcUrl, String contractAddress, String address) async {
    // TODO: Implement SPL token balance
    return "0";
  }

  @override
  Future<String> transfer(
      String rpcUrl, String privateKey, String to, String amount) async {
    final client = solana.RpcClient(rpcUrl);

    solana.Ed25519HDKeyPair keyPair;
    if (privateKey.contains(' ')) {
      keyPair = await solana.Ed25519HDKeyPair.fromMnemonic(privateKey);
    } else {
      // Assume Base58 encoded private key
      final privateKeyBytes = base58.decode(privateKey);
      keyPair = await solana.Ed25519HDKeyPair.fromPrivateKeyBytes(
          privateKey: privateKeyBytes);
    }

    final amountSol = double.tryParse(amount) ?? 0;
    final lamports = (amountSol * 1000000000).toInt();

    final source = keyPair;
    final destination = solana.Ed25519HDPublicKey.fromBase58(to);

    final instruction = solana.SystemInstruction.transfer(
      fundingAccount: source.publicKey,
      recipientAccount: destination,
      lamports: lamports,
    );

    final message = solana.Message(instructions: [instruction]);

    final signature = await client.signAndSendTransaction(
      message,
      [source],
    );

    return signature;
  }
}
