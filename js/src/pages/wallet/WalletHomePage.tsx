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
  Icon,
} from "fuickjs";
import { WalletManager, WalletInfo } from "../../services/WalletManager";
import WalletListPage from "./WalletListPage";
import { ChainServiceManager } from "../../services/ChainServiceManager";
import { ChainConfig, TokenConfig, getSelectedChain } from "../../services/ChainRegistry";
import { CustomTokenService } from "../../services/CustomTokenService";
import { formatAmount } from "../../utils/format";
import { Theme } from "../../theme";
import { IconBadge } from "../../components/common";
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
    const result = await navigator.showBottomSheet(
      <WalletListPage
        onClose={(w) => {
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

  const copyAddress = async () => {
    const fullAddress =
      wallet?.addresses?.[chain?.id || ""] || wallet?.address || "";
    if (fullAddress) {
      await ClipboardService.setData(fullAddress);
      await ToastService.show("地址已复制");
    }
  };

  const handleFaucet = () => {
    if (chain?.faucetUrl) {
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
    color,
    onTap,
  }: {
    icon: string;
    label: string;
    color: string;
    onTap?: () => void;
  }) => (
    <InkWell onTap={onTap}>
      <Column mainAxisAlignment="center" crossAxisAlignment="center">
        <Container
          width={56}
          height={56}
          alignment="center"
          decoration={{
            color: color + "1F",
            borderRadius: 18,
            border: { color: color + "55", width: 1 },
          }}
        >
          <Icon name={icon} color={color} size={26} />
        </Container>
        <SizedBox height={8} />
        <Text
          text={label}
          color={Theme.colors.textSecondary}
          fontSize={12}
          fontWeight="600"
        />
      </Column>
    </InkWell>
  );

  const fullAddress =
    wallet?.addresses?.[chain?.id || ""] || wallet?.address || "";

  const AssetRow = ({
    iconUrl,
    symbol,
    name,
    amount,
    onLongPress,
    accent,
  }: {
    iconUrl: string;
    symbol: string;
    name: string;
    amount: string;
    onLongPress?: () => void;
    accent?: string;
  }) => {
    const content = (
      <Container
        padding={{ vertical: 14, horizontal: 14 }}
        margin={{ bottom: 10 }}
        decoration={{
          color: Theme.colors.surface,
          borderRadius: Theme.borderRadius.l,
          border: { color: Theme.colors.border, width: 1 },
        }}
      >
        <Row crossAxisAlignment="center">
          <Container
            width={42}
            height={42}
            decoration={{
              color: (accent || Theme.colors.accent) + "22",
              borderRadius: 14,
            }}
            alignment="center"
          >
            <Image url={iconUrl} width={28} height={28} fit="contain" />
          </Container>
          <SizedBox width={14} />
          <Expanded>
            <Column crossAxisAlignment="start">
              <Text
                text={symbol}
                fontWeight="bold"
                fontSize={16}
                color={Theme.colors.textPrimary}
              />
              <SizedBox height={3} />
              <Text
                text={name}
                color={Theme.colors.textSecondary}
                fontSize={13}
              />
            </Column>
          </Expanded>
          <Column crossAxisAlignment="end">
            <Text
              text={hideBalance ? "••••" : amount}
              fontWeight="bold"
              fontSize={16}
              color={Theme.colors.textPrimary}
            />
          </Column>
        </Row>
      </Container>
    );
    return onLongPress ? (
      <GestureDetector onLongPress={onLongPress}>{content}</GestureDetector>
    ) : (
      content
    );
  };

  return (
    <Scaffold
      backgroundColor={Theme.colors.background}
      appBar={
        <AppBar
          title=""
          backgroundColor={Theme.colors.background}
          foregroundColor={Theme.colors.textPrimary}
          elevation={0}
          centerTitle={false}
          actions={[
            <GestureDetector key="chain" onTap={handleSwitchChain}>
              <Container
                padding={{ horizontal: 12, vertical: 7 }}
                decoration={{
                  color: Theme.colors.surfaceVariant,
                  borderRadius: Theme.borderRadius.full,
                  border: { color: Theme.colors.border, width: 1 },
                }}
              >
                <Row crossAxisAlignment="center">
                  <Image
                    url={
                      ChainIcons[chain?.icon || "ethereum"] ||
                      ChainIcons.ethereum
                    }
                    width={16}
                    height={16}
                    fit="contain"
                  />
                  <SizedBox width={6} />
                  <Text
                    text={chain?.name || "Network"}
                    color={Theme.colors.textPrimary}
                    fontWeight="bold"
                    fontSize={13}
                  />
                  <SizedBox width={2} />
                  <Image
                    url={Icons.expandMore}
                    width={16}
                    height={16}
                    fit="contain"
                  />
                </Row>
              </Container>
            </GestureDetector>,
            <SizedBox key="space1" width={8} />,
            <GestureDetector key="wallet" onTap={handleSwitchWallet}>
              <Container
                padding={{ horizontal: 12, vertical: 7 }}
                decoration={{
                  color: Theme.colors.surfaceVariant,
                  borderRadius: Theme.borderRadius.full,
                  border: { color: Theme.colors.border, width: 1 },
                }}
              >
                <Row crossAxisAlignment="center">
                  <IconBadge
                    icon="account_balance_wallet"
                    size={18}
                    soft={false}
                    color={Theme.colors.accent}
                  />
                  <SizedBox width={6} />
                  <Text
                    text={wallet?.name || "No Wallet"}
                    color={Theme.colors.textPrimary}
                    fontWeight="bold"
                    fontSize={13}
                  />
                  <SizedBox width={2} />
                  <Image
                    url={Icons.expandMore}
                    width={16}
                    height={16}
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
              <Container
                width={38}
                height={38}
                alignment="center"
                decoration={{
                  color: Theme.colors.surfaceVariant,
                  borderRadius: Theme.borderRadius.full,
                  border: { color: Theme.colors.border, width: 1 },
                }}
              >
                <Image
                  src={Icons.settings}
                  width={20}
                  tintColor={Theme.colors.textPrimary}
                  height={20}
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
              <Padding padding={16}>
                {/* Hero Balance Card */}
                <Container
                  width={Infinity}
                  padding={24}
                  decoration={{
                    gradient: Theme.colors.heroGradient,
                    borderRadius: Theme.borderRadius.xl,
                    boxShadow: Theme.shadows.glow,
                  }}
                >
                  <Column crossAxisAlignment="start">
                    <Row
                      mainAxisAlignment="spaceBetween"
                      crossAxisAlignment="center"
                    >
                      <Text
                        text="总资产 (Est.)"
                        color="#FFFFFFCC"
                        fontSize={14}
                      />
                      <InkWell onTap={() => setHideBalance(!hideBalance)}>
                        <Container
                          padding={6}
                          decoration={{
                            color: "#FFFFFF1F",
                            borderRadius: Theme.borderRadius.full,
                          }}
                        >
                          <Image
                            url={
                              hideBalance ? Icons.visibilityOff : Icons.visibility
                            }
                            width={18}
                            height={18}
                            fit="contain"
                          />
                        </Container>
                      </InkWell>
                    </Row>
                    <SizedBox height={10} />
                    <Text
                      text={
                        hideBalance
                          ? "••••••"
                          : `${balance} ${chain?.symbol || "ETH"}`
                      }
                      color="white"
                      fontSize={36}
                      fontWeight="bold"
                    />
                    <SizedBox height={4} />
                    <Text
                      text={`≈ $${(parseFloat(balance) || 0).toFixed(2)} · ${chain?.name || ""}`}
                      color="#FFFFFF99"
                      fontSize={13}
                    />
                    <SizedBox height={18} />
                    <InkWell onTap={copyAddress}>
                      <Container
                        padding={{ horizontal: 14, vertical: 8 }}
                        decoration={{
                          color: "#FFFFFF1F",
                          borderRadius: Theme.borderRadius.full,
                          border: { color: "#FFFFFF33", width: 1 },
                        }}
                      >
                        <Row mainAxisSize="min" crossAxisAlignment="center">
                          <Image
                            url={Icons.copy}
                            width={14}
                            height={14}
                            fit="contain"
                          />
                          <SizedBox width={8} />
                          <Text
                            text={formatAddress(fullAddress)}
                            color="white"
                            fontSize={13}
                            fontWeight="500"
                          />
                        </Row>
                      </Container>
                    </InkWell>
                  </Column>
                </Container>
              </Padding>

              {/* Actions */}
              <Padding padding={{ horizontal: 16 }}>
                <Container
                  padding={{ vertical: 18, horizontal: 8 }}
                  decoration={{
                    color: Theme.colors.surface,
                    borderRadius: Theme.borderRadius.l,
                    border: { color: Theme.colors.border, width: 1 },
                    boxShadow: Theme.shadows.small,
                  }}
                >
                  <Row mainAxisAlignment="spaceAround">
                    <ActionButton
                      icon="north_east"
                      label="发送"
                      color={Theme.colors.primary}
                      onTap={() => navigator.push("/wallet/send", { wallet })}
                    />
                    <ActionButton
                      icon="south_west"
                      label="接收"
                      color={Theme.colors.success}
                      onTap={() => navigator.push("/wallet/receive", { wallet })}
                    />
                    <ActionButton
                      icon="swap_horiz"
                      label="兑换"
                      color={Theme.colors.accent}
                    />
                    {chain?.faucetUrl ? (
                      <ActionButton
                        icon="opacity"
                        label="水龙头"
                        color={Theme.colors.info}
                        onTap={handleFaucet}
                      />
                    ) : (
                      <ActionButton
                        icon="history"
                        label="记录"
                        color={Theme.colors.textSecondary}
                      />
                    )}
                  </Row>
                </Container>
              </Padding>

              <SizedBox height={24} />

              {/* Assets List */}
              <Container
                padding={{ top: 4, bottom: 24, left: 16, right: 16 }}
              >
                <Row
                  mainAxisAlignment="spaceBetween"
                  crossAxisAlignment="center"
                  margin={{ top: 8, bottom: 16 }}
                >
                  <Text
                    text="资产"
                    fontSize={20}
                    fontWeight="bold"
                    color={Theme.colors.textPrimary}
                  />
                  <InkWell onTap={handleAddToken}>
                    <Container
                      padding={{ horizontal: 12, vertical: 6 }}
                      decoration={{
                        color: Theme.colors.primary + "1F",
                        borderRadius: Theme.borderRadius.full,
                        border: { color: Theme.colors.primary + "55", width: 1 },
                      }}
                    >
                      <Row crossAxisAlignment="center">
                        <Icon
                          name="add"
                          color={Theme.colors.primary}
                          size={16}
                        />
                        <SizedBox width={4} />
                        <Text
                          text="添加代币"
                          color={Theme.colors.primary}
                          fontWeight="bold"
                          fontSize={13}
                        />
                      </Row>
                    </Container>
                  </InkWell>
                </Row>

                {/* Native Asset */}
                <AssetRow
                  iconUrl={
                    ChainIcons[chain?.icon || "ethereum"] ||
                    ChainIcons.ethereum
                  }
                  symbol={chain?.symbol || "ETH"}
                  name={chain?.name || "Ethereum"}
                  amount={hideBalance ? "••••" : balance}
                  accent={Theme.colors.primary}
                />

                {/* Token Assets */}
                {[
                  ...(chain?.tokens || []).map((t) => ({
                    ...t,
                    isCustom: false,
                  })),
                  ...customTokens.map((t) => ({ ...t, isCustom: true })),
                ].map((t) => {
                  const balanceKey = t.address.toLowerCase();
                  return (
                    <AssetRow
                      key={balanceKey}
                      iconUrl={
                        TokenIcons[t.symbol.toLowerCase()] || TokenIcons.usdt
                      }
                      symbol={t.symbol}
                      name={t.name}
                      amount={
                        hideBalance
                          ? "••••"
                          : tokenBalances[balanceKey] || "..."
                      }
                      accent={t.isCustom ? Theme.colors.textHint : Theme.colors.accent}
                      onLongPress={
                        t.isCustom ? () => handleRemoveToken(t) : undefined
                      }
                    />
                  );
                })}
              </Container>
            </SingleChildScrollView>
          </Expanded>
        </Column>
      </Container>
    </Scaffold>
  );
}
