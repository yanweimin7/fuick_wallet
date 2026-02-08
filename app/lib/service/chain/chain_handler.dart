abstract class ChainHandler {
  Future<Map<String, String>> getAccountFromMnemonic(String mnemonic);
  Future<Map<String, String>> getAccountFromPrivateKey(String privateKey);
  Future<String> getBalance(String rpcUrl, String address);
  Future<String> getTokenBalance(String rpcUrl, String contractAddress, String address);
  Future<String> transfer(String rpcUrl, String privateKey, String to, String amount);
}
