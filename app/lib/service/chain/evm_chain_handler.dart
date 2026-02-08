import 'package:bip32/bip32.dart' as bip32;
import 'package:bip39/bip39.dart' as bip39;
import 'package:hex/hex.dart';
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';
import 'chain_handler.dart';

class EvmChainHandler implements ChainHandler {
  @override
  Future<Map<String, String>> getAccountFromMnemonic(String mnemonic) async {
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

  @override
  Future<Map<String, String>> getAccountFromPrivateKey(String privateKeyStr) async {
    final privateKey = EthPrivateKey.fromHex(privateKeyStr);
    final address = privateKey.address;

    return {
      'address': address.hex,
      'privateKey': privateKeyStr,
    };
  }

  @override
  Future<String> getBalance(String rpcUrl, String address) async {
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

  @override
  Future<String> getTokenBalance(
      String rpcUrl, String contractAddress, String address) async {
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

  @override
  Future<String> transfer(
      String rpcUrl, String privateKey, String to, String amount) async {
    final client = Web3Client(rpcUrl, Client());
    try {
      final credentials = EthPrivateKey.fromHex(privateKey);
      final toAddress = EthereumAddress.fromHex(to, enforceEip55: false);
      final amountStr = amount.toString();
      final amountWei = BigInt.from((double.tryParse(amountStr) ?? 0) * 1e18);
      final amountEther = EtherAmount.inWei(amountWei);

      final transaction = Transaction(
        to: toAddress,
        value: amountEther,
        maxGas: 21000,
      );

      // Explicitly get chainId to avoid null check errors in web3dart
      final chainId = await client.getChainId();

      // Send transaction
      final txHash = await client.sendTransaction(
        credentials,
        transaction,
        chainId: chainId.toInt(),
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
