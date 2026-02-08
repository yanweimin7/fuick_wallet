import React, { useState, useEffect } from 'react';
import {
  Scaffold,
  AppBar,
  Container,
  Column,
  Text,
  SizedBox,
  useNavigator,
  Padding,
  Row,
  Expanded,
  Icon,
  AlertDialog,
  InkWell,
  SingleChildScrollView
} from 'fuickjs';
import { Theme } from '../../theme';
import { ThemeButton, ThemeInput } from '../../components/common';
import { WalletInfo, WalletManager } from '../../services/WalletManager';
import { ChainConfig, getSelectedChain } from '../../services/ChainRegistry';
import { WalletService } from '../../services/WalletService';
import { PasswordService } from '../../services/PasswordService';

export default function SendPage({ wallet: initialWallet }: { wallet?: WalletInfo }) {
  const navigator = useNavigator();
  const [wallet, setWallet] = useState<WalletInfo | null>(initialWallet || null);
  const [chain, setChain] = useState<ChainConfig | null>(null);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0.00');

  useEffect(() => {
    (async () => {
      const c = await getSelectedChain();
      setChain(c);

      if (!wallet) {
        const wallets = WalletManager.getInstance().getWallets();
        if (wallets.length > 0) {
          setWallet(wallets[0]);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (wallet && chain) {
      fetchBalance();
    }
  }, [wallet, chain]);

  const fetchBalance = async () => {
    if (!wallet || !chain) return;
    const rpc = chain.rpcUrl;
    const addr = wallet.addresses?.[chain.id] || wallet.address;
    const chainType = chain.type.toLowerCase();

    try {
      const val = await WalletService.getBalance(rpc, addr, chainType);
      try {
        const num = parseFloat(val);
        setBalance(num.toFixed(4));
      } catch {
        setBalance(val);
      }
    } catch (e) {
      setBalance('Error');
    }
  };

  const handleSend = async () => {
    if (!wallet || !chain) return;
    if (!toAddress || !amount) {
      navigator.showDialog(
        <AlertDialog
          title={<Text text="Error" fontWeight="bold" />}
          content={<Text text="Please enter address and amount" />}
          actions={[
            <InkWell onTap={() => navigator.pop()}>
              <Container padding={{ horizontal: 16, vertical: 8 }}>
                <Text text="OK" color={Theme.colors.primary} />
              </Container>
            </InkWell>
          ]}
        />
      );
      return;
    }

    // 1. Get Password (封装后的流程：指纹优先 -> 密码对话框)
    const password = await PasswordService.getPassword(navigator);
    if (!password) return;

    setLoading(true);
    try {
      // 2. Get Secret
      const secret = await WalletManager.getInstance().getSecret(wallet.id, password as string);
      if (!secret) {
        throw new Error("Failed to decrypt wallet");
      }

      const chainType = chain.type.toLowerCase();
      let privateKey = "";

      if (secret.privateKeys && secret.privateKeys[chainType]) {
        privateKey = secret.privateKeys[chainType];
      } else if (secret.mnemonic) {
        // Fallback to mnemonic if specific private key is missing (e.g. older wallets)
        privateKey = secret.mnemonic;
      } else if (chainType === 'evm' && secret.privateKeys?.['evm']) {
        privateKey = secret.privateKeys['evm'];
      } else {
        // Fallback logic if needed, or error
        throw new Error(`No private key found for ${chainType}`);
      }

      // 3. Send Transaction
      const rpc = chain.rpcUrl;
      const txHash = await WalletService.transfer(rpc, privateKey, toAddress, amount, chainType);

      setLoading(false);

      // 4. Show Success
      navigator.showDialog(
        <AlertDialog
          title={<Text text="Transaction Sent" fontWeight="bold" color={Theme.colors.success} />}
          content={
            <Column crossAxisAlignment="start">
              <Text text="Successfully sent!" />
              <SizedBox height={8} />
              <Text text={`Hash: ${txHash}`} fontSize={12} color={Theme.colors.textSecondary} />
            </Column>
          }
          actions={[
            <InkWell onTap={() => {
              navigator.pop(); // Close dialog
              navigator.pop(); // Go back to Home
            }}>
              <Container padding={{ horizontal: 16, vertical: 8 }}>
                <Text text="Done" color={Theme.colors.primary} fontWeight="bold" />
              </Container>
            </InkWell>
          ]}
        />
      );

    } catch (e: any) {
      setLoading(false);
      console.error(e);
      navigator.showDialog(
        <AlertDialog
          title={<Text text="Transaction Failed" fontWeight="bold" color={Theme.colors.error} />}
          content={<Text text={e.message || "Unknown error"} />}
          actions={[
            <InkWell onTap={() => navigator.pop()}>
              <Container padding={{ horizontal: 16, vertical: 8 }}>
                <Text text="OK" color={Theme.colors.primary} />
              </Container>
            </InkWell>
          ]}
        />
      );
    }
  };

  return (
    <Scaffold
      appBar={
        <AppBar
          title={`Send ${chain?.symbol || ''}`}
          backgroundColor={Theme.colors.surface}
          elevation={0}
          centerTitle={true}
        />
      }
    >
      <Container color={Theme.colors.background}>
        <SingleChildScrollView>
          <Padding padding={20}>
            <Column>
              <Container
                padding={16}
                decoration={{
                  color: Theme.colors.surface,
                  borderRadius: Theme.borderRadius.l,
                  boxShadow: Theme.shadows.small
                }}
              >
                <Column crossAxisAlignment="start">
                  <Text text="From" color={Theme.colors.textSecondary} fontSize={14} />
                  <SizedBox height={8} />
                  <Row crossAxisAlignment="center">
                    <Icon name="account_balance_wallet" color={Theme.colors.primary} size={24} />
                    <SizedBox width={12} />
                    <Column>
                      <Text text={wallet?.name || "My Wallet"} fontWeight="bold" />
                      <Text
                        text={wallet?.addresses?.[chain?.id || ''] || wallet?.address || '...'}
                        fontSize={12}
                        color={Theme.colors.textSecondary}
                        maxLines={1}
                        overflow="ellipsis"
                      />
                    </Column>
                  </Row>
                  <SizedBox height={12} />
                  <Text text={`Balance: ${balance} ${chain?.symbol || ''}`} fontSize={12} color={Theme.colors.textSecondary} />
                </Column>
              </Container>

              <SizedBox height={24} />

              <ThemeInput
                label="To Address"
                value={toAddress}
                onChanged={setToAddress}
                hint="0x..."
              />

              <SizedBox height={16} />

              <ThemeInput
                label="Amount"
                value={amount}
                onChanged={setAmount}
                hint="0.0"
              />

              <SizedBox height={40} />

              <ThemeButton
                text={loading ? "Sending..." : "Send"}
                onTap={() => handleSend()}
                loading={loading}
              />
            </Column>
          </Padding>
        </SingleChildScrollView>
      </Container>
    </Scaffold>
  );
}
