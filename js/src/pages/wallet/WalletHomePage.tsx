import React, { useEffect, useState } from "react";
import {
  AppBar,
  Column,
  Scaffold,
  Container,
  Text,
  Padding,
  Row,
  Expanded,
  useNavigator,
  InkWell,
  SizedBox,
  SingleChildScrollView,
  AlertDialog,
  Image,
  GestureDetector,
  ClipboardService,
  ToastService,
} from "fuickjs";
import { WalletManager, WalletInfo } from "../../services/WalletManager";
import WalletListPage from "./WalletListPage";
import { ChainServiceManager } from "../../services/ChainServiceManager";
import { ChainConfig, TokenConfig, getSelectedChain } from "../../services/ChainRegistry";
import { CustomTokenService } from "../../services/CustomTokenService";
import { formatAmount } from "../../utils/format";
import { Theme } from "../../theme";
import { Card } from "../../components/common";
import { Icons, ChainIcons, TokenIcons } from "../../assets/icons";

export default function WalletHomePage() {
  const navigator = useNavigator();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState("0.00");
  const [chain, setChain] = useState<ChainConfig | null>(null);
  const [hideBalance, setHideBalance] = useState(false);
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>(
    {},
  );
  const [customTokens, setCustomTokens] = useState<TokenConfig[]>([]);

  useEffect(() => {
    loadWallet();
    (async () => {
      const c = await getSelectedChain();
      setChain(c);
    })();
  }, []);

  const loadWallet = async () => {
    const wallets = WalletManager.getInstance().getWallets();
    const lastId = WalletManager.getInstance().getLastSelectedWalletId();
    console.log(
      "[WalletHomePage] loadWallet: walletCount=",
      wallets.length,
      "restoredLastId=",
      lastId,
      "walletIds=",
      wallets.map((w) => w.id),
    );
    if (wallets.length > 0) {
      const lastWallet = lastId != null
        ? wallets.find((w) => String(w.id) === String(lastId))
        : null;
      if (lastWallet) {
        setWallet(lastWallet);
      } else {
        setWallet(wallets[0]);
        await WalletManager.getInstance().setLastSelectedWalletId(
          wallets[0].id,
        );
      }
    } else {
      setWallet(null);
      await WalletManager.getInstance().setLastSelectedWalletId(null);
    }
  };

  const loadCustomTokens = async () => {
    if (!wallet || !chain) return;
    const list = await CustomTokenService.getTokens(wallet.id, chain.id);
    setCustomTokens(list);
  };

  useEffect(() => {
    loadCustomTokens();
  }, [wallet?.id, chain?.id]);

  useEffect(() => {
    if (wallet && chain) {
      fetchBalance();
    }
  }, [wallet?.addresses?.[chain?.id || ""], chain?.id, customTokens]);

  const fetchBalance = async () => {
    if (!wallet || !chain) return;
    setBalance("Loading...");
    const addr = wallet.addresses?.[chain.id] || wallet.address;

    const manager = ChainServiceManager.getInstance();
    const service = await manager.getService(chain.id);

    try {
      if (!service) {
        throw new Error("Service not available");
      }
      const val = await service.getBalance(addr);
      const num = parseFloat(val);
      setBalance(formatAmount(num));
    } catch (e) {
      console.error("Failed to fetch balance:", e);
      setBalance("Error");
    }

    const allTokens: TokenConfig[] = [
      ...(chain.tokens || []),
      ...customTokens,
    ];
    if (allTokens.length > 0) {
      const newBalances: Record<string, string> = {};
      for (const t of allTokens) {
        const key = t.address.toLowerCase();
        try {
          newBalances[key] = "...";
          setTokenBalances((prev) => ({ ...prev, ...newBalances }));

          if (!service) {
            throw new Error("Service not available");
          }
          const raw = await service.getTokenBalance(t.address, addr);
          const val = parseFloat(raw) / Math.pow(10, t.decimals);
          newBalances[key] = formatAmount(val);
        } catch (e) {
          console.error(`Failed to fetch ${t.symbol}`, e);
          newBalances[key] = "—";
        }
      }
      setTokenBalances(newBalances);
    } else {
      setTokenBalances({});
    }
  };

  const handleAddToken = async () => {
    if (!wallet || !chain) return;
    const result = await navigator.push("/wallet/add_token", {
      walletId: wallet.id,
      chainId: chain.id,
    });
    if (result) {
      await loadCustomTokens();
    }
  };

  const handleRemoveToken = (token: TokenConfig) => {
    navigator.showDialog(
      <AlertDialog
        title={<Text text="移除代币" fontWeight="bold" fontSize={18} />}
        content={<Text text={`确定从列表移除 ${token.symbol} 吗？`} />}
        actions={[
          <GestureDetector
            key="cancel"
            onTap={() => navigator.pop()}
          >
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text text="取消" color={Theme.colors.textSecondary} />
            </Container>
          </GestureDetector>,
          <GestureDetector
            key="remove"
            onTap={async () => {
              navigator.pop();
              if (!wallet || !chain) return;
              await CustomTokenService.removeToken(
                wallet.id,
                chain.id,
                token.address,
              );
              const key = token.address.toLowerCase();
              setTokenBalances((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
              });
              await loadCustomTokens();
            }}
          >
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text
                text="移除"
                color={Theme.colors.error}
                fontWeight="bold"
              />
            </Container>
          </GestureDetector>,
        ]}
      />,
    );
  };

  const handleSwitchWallet = async () => {
    console.log("handleSwitchWallet called");
    const result = await navigator.showBottomSheet(
      <WalletListPage
        onClose={(w) => {
          console.log("WalletHomePage onClose callback called with:", w);
          navigator.pop(w);
        }}
        presentation="bottomSheet"
      />,
      { maxHeight: 0.9 },
    );
    if (result && (result as any).id) {
      setWallet(result as WalletInfo);
      await WalletManager.getInstance().setLastSelectedWalletId(
        (result as WalletInfo).id,
      );
    }
  };

  const handleSwitchChain = async () => {
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

  const handleFaucet = () => {
    if (chain?.faucetUrl) {
      // Open in browser via native bridge or specialized webview
      // Since we don't have a direct browser opener yet, we'll log it or use a dialog
      console.log("Opening faucet:", chain.faucetUrl);
      // For now, let's just show the URL in a dialog so user can copy, or assume we have a link opener
      // Ideally: navigator.push("/webview", { url: chain.faucetUrl });
      // But we don't have a webview page.
      // Let's create a simple dialog for now.
      navigator.showDialog(
        <AlertDialog
          title={
            <Text text="Get Test Tokens" fontWeight="bold" fontSize={18} />
          }
          content={<Text text={`Go to: ${chain.faucetUrl}`} />}
          actions={[
            <GestureDetector key="close" onTap={() => navigator.pop()}>
              <Container padding={{ horizontal: 16, vertical: 8 }}>
                <Text text="Close" color={Theme.colors.primary} />
              </Container>
            </GestureDetector>,
          ]}
        />,
      );
    }
  };

  const ActionButton = ({
    icon,
    label,
    onTap,
  }: {
    icon: string;
    label: string;
    onTap?: () => void;
  }) => (
    <InkWell onTap={onTap}>
      <Column mainAxisAlignment="center" crossAxisAlignment="center">
        <Container
          width={50}
          height={50}
          alignment="center"
          decoration={{
            color: Theme.colors.primary,
            borderRadius: 25,
            boxShadow: Theme.shadows.medium,
          }}
        >
          <Image url={icon} width={24} height={24} fit="contain" />
        </Container>
        <SizedBox height={8} />
        <Text
          text={label}
          color={Theme.colors.textPrimary}
          fontSize={14}
          fontWeight="w500"
        />
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
            <GestureDetector key="chain" onTap={handleSwitchChain}>
              <Container
                padding={{ horizontal: 12, vertical: 6 }}
                decoration={{ color: Theme.colors.surface, borderRadius: 16 }}
              >
                <Row>
                  <Text
                    text={chain?.name || "Network"}
                    color={Theme.colors.primary}
                    fontWeight="bold"
                  />
                  <Image
                    url={Icons.expandMore}
                    width={20}
                    height={20}
                    fit="contain"
                  />
                </Row>
              </Container>
            </GestureDetector>,
            <SizedBox key="space1" width={8} />,
            <GestureDetector
              key="wallet"
              onTap={() => {
                handleSwitchWallet();
              }}
            >
              <Container
                padding={{ horizontal: 12, vertical: 6 }}
                decoration={{ color: Theme.colors.surface, borderRadius: 16 }}
              >
                <Row>
                  <Text
                    text={wallet?.name || "No Wallet"}
                    color={Theme.colors.primary}
                    fontWeight="bold"
                  />
                  <Image
                    url={Icons.expandMore}
                    width={20}
                    height={20}
                    fit="contain"
                  />
                </Row>
              </Container>
            </GestureDetector>,
            <SizedBox key="space2" width={8} />,
            <GestureDetector
              key="settings"
              onTap={async () => {
                await navigator.push("/wallet/detail", {
                  walletId: wallet?.id,
                });
                loadWallet();
              }}
            >
              <Container padding={8}>
                <Image
                  src={Icons.settings}
                  width={24}
                  tintColor={Theme.colors.textPrimary}
                  height={24}
                  fit="contain"
                />
              </Container>
            </GestureDetector>,
            <SizedBox key="space3" width={8} />,
          ]}
        />
      }
    >
      <Container color={Theme.colors.background}>
        <Column>
          <Expanded>
            <SingleChildScrollView>
              <Column>
                <Padding padding={20}>
                  {/* Balance Card */}
                  <Container
              width={Infinity}
              padding={24}
              decoration={{
                color: Theme.colors.primary, // Could be gradient if supported
                borderRadius: Theme.borderRadius.xl,
                boxShadow: Theme.shadows.large,
              }}
            >
              <Column crossAxisAlignment="start">
                <Row mainAxisAlignment="spaceBetween">
                  <Text text="Total Balance" color="#FFFFFFCC" fontSize={14} />
                  <InkWell onTap={() => setHideBalance(!hideBalance)}>
                    <Image
                      url={hideBalance ? Icons.visibilityOff : Icons.visibility}
                      width={20}
                      height={20}
                      fit="contain"
                    />
                  </InkWell>
                </Row>
                <SizedBox height={8} />
                <Text
                  text={
                    hideBalance
                      ? "****"
                      : `${balance} ${chain?.symbol || "ETH"}`
                  }
                  color="white"
                  fontSize={32}
                  fontWeight="bold"
                />
                <SizedBox height={20} />
                <InkWell
                  onTap={async () => {
                    const fullAddress =
                      wallet?.addresses?.[chain?.id || ""] ||
                      wallet?.address ||
                      "";
                    if (fullAddress) {
                      await ClipboardService.setData(fullAddress);
                      await ToastService.show("地址已复制");
                    }
                  }}
                >
                  <Container
                    padding={{ horizontal: 12, vertical: 6 }}
                    decoration={{ color: "#8c8dae33", borderRadius: 20 }}
                  >
                    <Row mainAxisSize="min">
                      <Text
                        text={formatAddress(
                          wallet?.addresses?.[chain?.id || ""] ||
                            wallet?.address ||
                            "",
                        )}
                        color="white"
                        fontSize={12}
                      />
                      <SizedBox width={4} />
                      <Image
                        url={Icons.copy}
                        width={12}
                        height={12}
                        fit="contain"
                      />
                    </Row>
                  </Container>
                </InkWell>
              </Column>
            </Container>
          </Padding>

          {/* Actions */}
          <Padding padding={{ horizontal: 20 }}>
            <Row mainAxisAlignment="spaceAround">
              <ActionButton
                icon={Icons.send}
                label="Send"
                onTap={() => navigator.push("/wallet/send", { wallet })}
              />
              <ActionButton
                icon={Icons.receive}
                label="Receive"
                onTap={() => navigator.push("/wallet/receive", { wallet })}
              />
              <ActionButton icon={Icons.swap} label="Swap" />
              {chain?.faucetUrl ? (
                <ActionButton
                  icon={Icons.faucet}
                  label="Faucet"
                  onTap={handleFaucet}
                />
              ) : (
                <ActionButton icon={Icons.history} label="History" />
              )}
            </Row>
          </Padding>

          <SizedBox height={30} />

          {/* Assets List */}
          <Container
            decoration={{
              color: Theme.colors.surface,
              borderRadius: {
                topLeft: Theme.borderRadius.xl,
                topRight: Theme.borderRadius.xl,
              },
            }}
            margin={{ top: 10 }}
            padding={{ top: 20, bottom: 24, left: 20, right: 20 }}
          >
            <Column mainAxisAlignment="start">
                <Row
                  mainAxisAlignment="spaceBetween"
                  crossAxisAlignment="center"
                >
                  <Text
                    text="Assets"
                    fontSize={20}
                    fontWeight="bold"
                    color={Theme.colors.textPrimary}
                  />
                  <InkWell onTap={handleAddToken}>
                    <Container
                      padding={{ horizontal: 10, vertical: 4 }}
                      decoration={{
                        color: Theme.colors.primaryLight,
                        borderRadius: 14,
                      }}
                    >
                      <Row crossAxisAlignment="center">
                        <Image
                          url={Icons.add}
                          width={18}
                          height={18}
                          fit="contain"
                        />
                        <SizedBox width={4} />
                        <Text
                          text="添加"
                          color={Theme.colors.primary}
                          fontWeight="bold"
                          fontSize={14}
                        />
                      </Row>
                    </Container>
                  </InkWell>
                </Row>
                <SizedBox height={16} />
                {/* Native Asset */}
                  <Card padding={16} margin={12}>
                    <Row>
                      <Container
                        width={40}
                        height={40}
                        decoration={{
                          color: Theme.colors.primaryLight,
                          borderRadius: 20,
                        }}
                        alignment="center"
                      >
                        <Image
                          url={
                            ChainIcons[chain?.icon || "ethereum"] ||
                            ChainIcons.ethereum
                          }
                          width={32}
                          height={32}
                          fit="contain"
                        />
                      </Container>
                      <SizedBox width={16} />
                      <Expanded>
                        <Column crossAxisAlignment="start">
                          <Text
                            text={chain?.symbol || "ETH"}
                            fontWeight="bold"
                            fontSize={16}
                          />
                          <Text
                            text={chain?.name || "Ethereum"}
                            color={Theme.colors.textSecondary}
                            fontSize={14}
                          />
                        </Column>
                      </Expanded>
                      <Column crossAxisAlignment="end">
                        <Text
                          text={hideBalance ? "****" : balance}
                          fontWeight="bold"
                          fontSize={16}
                        />
                        <Text
                          text="$0.00"
                          color={Theme.colors.textSecondary}
                          fontSize={14}
                        />
                      </Column>
                    </Row>
                  </Card>

                  {/* Token Assets (built-in + custom) */}
                  {[
                    ...(chain?.tokens || []).map((t) => ({
                      ...t,
                      isCustom: false,
                    })),
                    ...customTokens.map((t) => ({ ...t, isCustom: true })),
                  ].map((t) => {
                    const balanceKey = t.address.toLowerCase();
                    const cardContent = (
                      <Card key={balanceKey} padding={16} margin={12}>
                        <Row>
                          <Container
                            width={40}
                            height={40}
                            decoration={{
                              color: t.isCustom
                                ? Theme.colors.divider
                                : Theme.colors.secondary,
                              borderRadius: 20,
                            }}
                            alignment="center"
                          >
                            <Image
                              url={
                                TokenIcons[t.symbol.toLowerCase()] ||
                                TokenIcons.usdt
                              }
                              width={32}
                              height={32}
                              fit="contain"
                            />
                          </Container>
                          <SizedBox width={16} />
                          <Expanded>
                            <Column crossAxisAlignment="start">
                              <Text
                                text={t.symbol}
                                fontWeight="bold"
                                fontSize={16}
                              />
                              <Text
                                text={t.name}
                                color={Theme.colors.textSecondary}
                                fontSize={14}
                              />
                            </Column>
                          </Expanded>
                          <Column crossAxisAlignment="end">
                            <Text
                              text={
                                hideBalance
                                  ? "****"
                                  : tokenBalances[balanceKey] || "..."
                              }
                              fontWeight="bold"
                              fontSize={16}
                            />
                          </Column>
                        </Row>
                      </Card>
                    );

                    if (t.isCustom) {
                      return (
                        <GestureDetector
                          key={balanceKey}
                          onLongPress={() => handleRemoveToken(t)}
                        >
                          {cardContent}
                        </GestureDetector>
                      );
                    }
                     return cardContent;
                   })}
              </Column>
            </Container>
          </Column>
          </SingleChildScrollView>
          </Expanded>
        </Column>
      </Container>
    </Scaffold>
  );
}
