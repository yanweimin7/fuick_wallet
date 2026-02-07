import React, { useEffect, useState } from "react";
import { AppBar, Button, Center, Column, Scaffold, Container, Text, TextField, Padding, CircularProgressIndicator, Row, Icon, GestureDetector, Expanded, ListView, useNavigator } from "fuickjs";
import { WalletService } from "../../services/WalletService";
import { WalletManager, WalletInfo } from "../../services/WalletManager";

// Default RPC (Sepolia)
const RPC_URL = "https://sepolia.drpc.org";

export default function WalletHomePage() {
  const navigator = useNavigator();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState("0.00");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = () => {
    const wallets = WalletManager.getInstance().getWallets();
    if (wallets.length > 0) {
      setWallet(wallets[0]);
    } else {
      // Should not happen if flow is correct, but handle anyway
      setWallet(null);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchBalance();
    }
  }, [wallet?.address]);

  const fetchBalance = () => {
    if (!wallet) return;
    setBalance("Loading...");
    WalletService.getBalance(RPC_URL, wallet.address)
      .then(val => {
        // Format balance to 4 decimal places if possible, or just string
        try {
          const num = parseFloat(val);
          setBalance(num.toFixed(4));
        } catch {
          setBalance(val);
        }
      })
      .catch(e => setBalance("Error"));
  };

  const handleSwitchWallet = async () => {
    // @ts-ignore
    const result = await navigator.showModal("/wallet/list", {}, { maxHeight: 0.9 });
    if (result && (result as any).id) {
      setWallet(result as WalletInfo);
    } else {
      // Refresh anyway in case wallet list changed (e.g. deleted)
      // Ideally we check if current wallet still exists
      const wallets = WalletManager.getInstance().getWallets();
      if (wallet && !wallets.find(w => w.id === wallet.id)) {
        setWallet(wallets.length > 0 ? wallets[0] : null);
      } else if (!wallet && wallets.length > 0) {
        setWallet(wallets[0]);
      }
    }
  };

  const handleTransfer = async () => {
    if (!wallet || !toAddress || !amount) return;
    setLoading(true);
    setTxHash("");
    try {
      const secret = await WalletManager.getInstance().getSecret(wallet.id);
      if (!secret || !secret.privateKey) {
        throw new Error("Private key not found");
      }

      const hash = await WalletService.transfer(RPC_URL, secret.privateKey, toAddress, amount);
      setTxHash(hash);
      setLoading(false);
      fetchBalance();
    } catch (e: any) {
      console.error("Transfer failed", e);
      setLoading(false);
      setTxHash("Failed: " + (e.message || "Unknown error"));
    }
  };

  const ActionButton = ({ icon, label, onTap }: { icon: string, label: string, onTap?: () => void }) => (
    <GestureDetector onTap={onTap}>
      <Column crossAxisAlignment="center">
        <Container
          width={48} height={48}
          decoration={{ color: "#E0F7FA", borderRadius: 24 }}
          alignment="center"
        >
          <Icon name={icon} color="#006064" size={24} />
        </Container>
        <Container height={8} />
        <Text text={label} fontSize={12} color="#333333" />
      </Column>
    </GestureDetector>
  );

  const TokenItem = ({ icon, symbol, name, balance, price, change }: any) => (
    <Column>
      <Container padding={{ top: 16, bottom: 16 }}>
        <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
          <Row>
            <Container width={40} height={40} decoration={{ color: "#f0f0f0", borderRadius: 20 }} alignment="center">
              <Icon name={icon} size={24} />
            </Container>
            <Container width={12} />
            <Column crossAxisAlignment="start">
              <Text text={symbol} fontWeight="bold" fontSize={16} />
              <Row>
                <Text text={price} fontSize={12} color="#666666" />
                <Container width={4} />
                <Text text={change} fontSize={12} color={change.startsWith('+') ? "green" : "red"} />
              </Row>
            </Column>
          </Row>
          <Column crossAxisAlignment="end">
            <Text text={balance} fontWeight="bold" fontSize={16} />
            <Text text={`$${(parseFloat(balance) * parseFloat(price.replace('$', ''))).toFixed(2)}`} fontSize={12} color="#666666" />
          </Column>
        </Row>
      </Container>
      <Container height={1} color="#f0f0f0" />
    </Column>
  );

  if (!wallet) {
    return (
      <Scaffold>
        <Center>
          <CircularProgressIndicator />
          <Container height={16} />
          <Text text="Loading Wallet..." />
        </Center>
      </Scaffold>
    );
  }

  return (
    <Scaffold
      appBar={
        <AppBar
          centerTitle={false}
          backgroundColor="white"
          elevation={0}
          title={
            <GestureDetector onTap={handleSwitchWallet}>
              <Row crossAxisAlignment="center">
                <Container
                  width={32} height={32}
                  decoration={{ color: "#FFCDD2", borderRadius: 16 }}
                  alignment="center"
                  margin={{ right: 8 }}
                >
                  <Icon name="account_balance_wallet" color="#D32F2F" size={18} />
                </Container>
                <Text text={wallet.name} fontSize={16} fontWeight="bold" color="black" />
                <Icon name="keyboard_arrow_down" color="#666666" />
              </Row>
            </GestureDetector>
          }
          actions={[
            <Container padding={{ right: 16 }} alignment="center">
              <Icon name="qr_code_scanner" color="black" />
            </Container>
          ]}
        />
      }
    >
      <Padding padding={{ top: 0, left: 20, right: 20, bottom: 20 }}>
        <Column crossAxisAlignment="start">
          <Container height={24} />

          {/* Balance */}
          <Text text={`$${(parseFloat(balance === "Loading..." || balance === "Error" ? "0" : balance) * 2000).toFixed(2)}`} fontSize={32} fontWeight="bold" />
          <Row crossAxisAlignment="center">
            <Text text={`+<0.01 (+0.36%) Today's PNL`} fontSize={12} color="green" />
          </Row>

          <Container height={24} />

          {/* Actions */}
          <Row mainAxisAlignment="spaceBetween">
            <ActionButton icon="send" label="Transfer" onTap={() => { /* Show transfer modal/page */ }} />
            <ActionButton icon="call_received" label="Receive" />
            <ActionButton icon="history" label="History" />
            <ActionButton icon="more_horiz" label="More" />
          </Row>

          <Container height={24} />

          {/* Cards (Optional based on image) */}
          <Row mainAxisAlignment="spaceBetween">
            <Container width={100} height={80} decoration={{ color: "#F5F5F5", borderRadius: 12 }} padding={12}>
              <Column crossAxisAlignment="start">
                <Icon name="savings" color="#8BC34A" />
                <Expanded><Container /></Expanded>
                <Text text="Earn" fontSize={12} color="#666666" />
                <Text text="$0.05" fontWeight="bold" fontSize={14} />
              </Column>
            </Container>
            <Container width={100} height={80} decoration={{ color: "#F5F5F5", borderRadius: 12 }} padding={12}>
              <Column crossAxisAlignment="start">
                <Icon name="credit_card" color="#FF9800" />
                <Expanded><Container /></Expanded>
                <Text text="Card" fontSize={12} color="#666666" />
                <Text text="No Fee" fontWeight="bold" fontSize={14} />
              </Column>
            </Container>
            <Container width={100} height={80} decoration={{ color: "#F5F5F5", borderRadius: 12 }} padding={12}>
              <Column crossAxisAlignment="start">
                <Icon name="swap_horiz" color="#2196F3" />
                <Expanded><Container /></Expanded>
                <Text text="Swap" fontSize={12} color="#666666" />
                <Text text="Trade" fontWeight="bold" fontSize={14} />
              </Column>
            </Container>
          </Row>

          <Container height={24} />

          {/* Tokens List Header */}
          <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
            <Text text="Tokens $0.03" fontWeight="bold" fontSize={16} />
            <Icon name="tune" color="#666666" />
          </Row>

          <Container height={8} />

          {/* Token List */}
          <TokenItem icon="currency_bitcoin" symbol="BNB" name="BNB" balance="<0.0001" price="$659.2" change="+6.88%" />
          <TokenItem icon="attach_money" symbol="USDC" name="USDC" balance="0.0038" price="$1.00" change="0.00%" />

          {/* Yield Banner */}
          <Container
            margin={{ top: 8, bottom: 8 }}
            padding={12}
            decoration={{ color: "#E0F2F1", borderRadius: 8 }}
          >
            <Row mainAxisAlignment="spaceBetween">
              <Text text="Earn 10% APY" color="#00695C" fontWeight="bold" fontSize={12} />
              <Icon name="chevron_right" color="#00695C" size={16} />
            </Row>
          </Container>
        </Column>
      </Padding>
    </Scaffold>
  );
}
