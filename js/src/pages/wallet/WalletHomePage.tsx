import React, { useEffect, useState } from "react";
import { AppBar, Center, Column, Scaffold, Container, Text, Padding, Row, Icon, Expanded, useNavigator, InkWell, SizedBox, SingleChildScrollView } from "fuickjs";
import { WalletService } from "../../services/WalletService";
import { WalletManager, WalletInfo } from "../../services/WalletManager";
import { ChainConfig, getSelectedChain } from "../../services/ChainRegistry";
import { Theme } from "../../theme";
import { Card } from "../../components/common";

export default function WalletHomePage() {
  const navigator = useNavigator();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState("0.00");
  const [chain, setChain] = useState<ChainConfig | null>(null);
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    loadWallet();
    (async () => {
      const c = await getSelectedChain();
      setChain(c);
    })();
  }, []);

  const loadWallet = () => {
    const wallets = WalletManager.getInstance().getWallets();
    if (wallets.length > 0) {
      setWallet(wallets[0]);
    } else {
      setWallet(null);
    }
  };

  useEffect(() => {
    if (wallet && chain) {
      fetchBalance();
    }
  }, [wallet?.address, chain?.id]);

  const fetchBalance = () => {
    if (!wallet) return;
    setBalance("Loading...");
    const rpc = chain?.rpcUrl || "https://sepolia.drpc.org";
    const addr = wallet.addresses?.[chain?.id || ""] || wallet.address;
    const chainType = chain?.type?.toLowerCase() || 'evm';
    WalletService.getBalance(rpc, addr, chainType)
      .then(val => {
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
      const wallets = WalletManager.getInstance().getWallets();
      if (wallet && !wallets.find(w => w.id === wallet.id)) {
        setWallet(wallets.length > 0 ? wallets[0] : null);
      } else if (!wallet && wallets.length > 0) {
        setWallet(wallets[0]);
      }
    }
  };

  const handleSwitchChain = async () => {
    // @ts-ignore
    const result = await navigator.push("/wallet/chain_select");
    if (result) {
      setChain(result as ChainConfig);
    } else {
      const c = await getSelectedChain();
      setChain(c);
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const ActionButton = ({ icon, label, onTap }: { icon: string, label: string, onTap?: () => void }) => (
    <InkWell onTap={onTap}>
      <Column mainAxisAlignment="center" crossAxisAlignment="center">
        <Container
          width={50}
          height={50}
          alignment="center"
          decoration={{
            color: Theme.colors.primary,
            borderRadius: 25,
            boxShadow: Theme.shadows.medium
          }}
        >
          <Icon name={icon} color="white" size={24} />
        </Container>
        <SizedBox height={8} />
        <Text text={label} color={Theme.colors.textPrimary} fontSize={14} fontWeight="w500" />
      </Column>
    </InkWell>
  );

  return (
    <Scaffold
      appBar={
        <AppBar
          title="My Wallet"
          backgroundColor={Theme.colors.background}
          elevation={0}
          centerTitle={false}
          actions={[
            <InkWell onTap={handleSwitchChain}>
              <Container padding={{ horizontal: 12, vertical: 6 }} decoration={{ color: Theme.colors.surface, borderRadius: 16 }}>
                <Row>
                  <Text text={chain?.name || "Network"} color={Theme.colors.primary} fontWeight="bold" />
                  <Icon name="expand_more" color={Theme.colors.primary} size={20} />
                </Row>
              </Container>
            </InkWell>,
            <SizedBox width={8} />,
            <InkWell onTap={handleSwitchWallet}>
              <Container padding={{ horizontal: 12, vertical: 6 }} decoration={{ color: Theme.colors.surface, borderRadius: 16 }}>
                <Row>
                  <Text text={wallet?.name || "No Wallet"} color={Theme.colors.primary} fontWeight="bold" />
                  <Icon name="expand_more" color={Theme.colors.primary} size={20} />
                </Row>
              </Container>
            </InkWell>,
            <SizedBox width={8} />,
            <InkWell onTap={async () => {
              await navigator.push("/wallet/detail", { walletId: wallet?.id });
              loadWallet();
            }}>
              <Container padding={8}>
                <Icon name="settings" color={Theme.colors.textSecondary} size={24} />
              </Container>
            </InkWell>,
            <SizedBox width={8} />
          ]}
        />
      }
    >
      <Container color={Theme.colors.background}>
        <Column>
          <Padding padding={20}>
            {/* Balance Card */}
            <Container
              width={Infinity}
              padding={24}
              decoration={{
                color: Theme.colors.primary, // Could be gradient if supported
                borderRadius: Theme.borderRadius.xl,
                boxShadow: Theme.shadows.large
              }}
            >
              <Column crossAxisAlignment="start">
                <Row mainAxisAlignment="spaceBetween">
                  <Text text="Total Balance" color="#FFFFFFCC" fontSize={14} />
                  <InkWell onTap={() => setHideBalance(!hideBalance)}>
                    <Icon name={hideBalance ? "visibility_off" : "visibility"} color="#FFFFFFCC" size={20} />
                  </InkWell>
                </Row>
                <SizedBox height={8} />
                <Text
                  text={hideBalance ? "****" : `${balance} ${chain?.symbol || "ETH"}`}
                  color="white"
                  fontSize={32}
                  fontWeight="bold"
                />
                <SizedBox height={20} />
                <Container
                  padding={{ horizontal: 12, vertical: 6 }}
                  decoration={{ color: "#FFFFFF33", borderRadius: 20 }}
                >
                  <Row mainAxisSize="min">
                    <Text text={formatAddress(wallet?.address || "")} color="white" fontSize={12} />
                    <SizedBox width={4} />
                    <Icon name="content_copy" color="white" size={12} />
                  </Row>
                </Container>
              </Column>
            </Container>
          </Padding>

          {/* Actions */}
          <Padding padding={{ horizontal: 20 }}>
            <Row mainAxisAlignment="spaceAround">
              <ActionButton icon="arrow_upward" label="Send" />
              <ActionButton icon="arrow_downward" label="Receive" onTap={() => navigator.push("/wallet/receive", { wallet })} />
              <ActionButton icon="swap_vert" label="Swap" />
              <ActionButton icon="history" label="History" />
            </Row>
          </Padding>

          <SizedBox height={30} />

          {/* Assets List */}
          <Expanded>
            <Container
              decoration={{
                color: Theme.colors.surface,
                borderRadius: { topLeft: Theme.borderRadius.xl, topRight: Theme.borderRadius.xl }
              }}
              padding={{ top: 20, left: 20, right: 20 }}
            >
              <Column mainAxisAlignment="start">
                <Text text="Assets" fontSize={20} fontWeight="bold" color={Theme.colors.textPrimary} />
                <SizedBox height={16} />
                <SingleChildScrollView>
                  {/* Mock Assets */}
                  <Card padding={16} margin={12}>
                    <Row>
                      <Container width={40} height={40} decoration={{ color: Theme.colors.primaryLight, borderRadius: 20 }} alignment="center">
                        <Text text="E" color="white" fontWeight="bold" />
                      </Container>
                      <SizedBox width={16} />
                      <Expanded>
                        <Column crossAxisAlignment="start">
                          <Text text={chain?.symbol || "ETH"} fontWeight="bold" fontSize={16} />
                          <Text text={chain?.name || "Ethereum"} color={Theme.colors.textSecondary} fontSize={14} />
                        </Column>
                      </Expanded>
                      <Column crossAxisAlignment="end">
                        <Text text={hideBalance ? "****" : balance} fontWeight="bold" fontSize={16} />
                        <Text text="$0.00" color={Theme.colors.textSecondary} fontSize={14} />
                      </Column>
                    </Row>
                  </Card>
                </SingleChildScrollView>
              </Column>
            </Container>
          </Expanded>
        </Column>
      </Container>
    </Scaffold>
  );
}
