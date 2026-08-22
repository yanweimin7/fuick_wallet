import React, { useState, useEffect } from "react";
import {
  Scaffold,
  AppBar,
  Container,
  Column,
  Text,
  SizedBox,
  Row,
  Image,
  InkWell,
  SingleChildScrollView,
  Padding,
  CircularProgressIndicator,
  ToastService,
} from "fuickjs";
import { Theme } from "../../theme";
import { ChainRegistry, TokenConfig } from "../../services/ChainRegistry";
import { ChainbaseService } from "../../services/ChainbaseService";
import { ChainServiceManager } from "../../services/ChainServiceManager";
import { CustomTokenService } from "../../services/CustomTokenService";
import { WalletManager } from "../../services/WalletManager";
import { ChainIcons } from "../../assets/icons";

interface ScannedToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: number;
}

export default function ScanTokensPage({
  walletId,
  chainId,
}: {
  walletId?: string;
  chainId?: string;
}) {
  const chain = chainId ? ChainRegistry.getById(chainId) : undefined;

  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [tokens, setTokens] = useState<ScannedToken[]>([]);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setNotice("");
      setTokens([]);
      setAdded({});

      if (!chain || chain.type !== "EVM") {
        setNotice("仅支持 EVM 主网扫描（Chainbase 不支持测试网 / Solana）");
        setLoading(false);
        return;
      }
      if (!walletId) {
        setNotice("缺少钱包信息");
        setLoading(false);
        return;
      }
      const address = WalletManager.getInstance().getAddressForChain(
        walletId,
        chain.id,
      );
      if (!address) {
        setNotice("找不到该链地址");
        setLoading(false);
        return;
      }

      try {
        const map = await ChainbaseService.getTokenBalances(
          chain.chainId,
          address,
        );
        const list: ScannedToken[] = [];
        for (const [, tb] of map) {
          const bal = parseFloat(tb.balance) || 0;
          if (bal <= 0) continue;
          list.push({
            address: tb.contractAddress,
            symbol: tb.symbol || "",
            name: tb.name || "",
            decimals: tb.decimals || 18,
            balance: bal,
          });
        }
        list.sort((a, b) => b.balance - a.balance);

        // Chainbase 对很多代币返回空的 name/symbol，回退到链上合约查询
        const needMeta = list.filter((t) => !t.name || !t.symbol);
        if (needMeta.length) {
          setNotice("正在识别代币信息…");
          try {
            const service = await ChainServiceManager.getInstance().getService(
              chain.id,
            );
            await Promise.all(
              needMeta.map(async (t) => {
                try {
                  const meta = service
                    ? await service.getTokenMetadata(t.address)
                    : null;
                  if (meta) {
                    if (!t.name) t.name = meta.name || t.name;
                    if (!t.symbol) t.symbol = meta.symbol || t.symbol;
                    if (meta.decimals != null) t.decimals = meta.decimals;
                  }
                } catch {
                  /* 单个代币识别失败不影响其它 */
                }
              }),
            );
          } catch {
            /* 识别服务不可用，保留 Chainbase 原始（可能为空） */
          }
        }

        if (list.length === 0) {
          setNotice("该地址在当前链上未扫描到有余值的代币");
        } else {
          setNotice("");
        }
        setTokens(list);

        const existing = await CustomTokenService.getTokens(walletId, chain.id);
        const owned = [
          ...(chain.tokens || []).map((t) => t.address.toLowerCase()),
          ...existing.map((t) => t.address.toLowerCase()),
        ];
        const addedMap: Record<string, boolean> = {};
        for (const t of list) {
          if (owned.includes(t.address.toLowerCase())) {
            addedMap[t.address.toLowerCase()] = true;
          }
        }
        setAdded(addedMap);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setNotice(`扫描失败：${msg}`);
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain?.id, walletId]);

  const handleAdd = async (t: ScannedToken) => {
    if (!walletId || !chainId) return;
    const token: TokenConfig = {
      symbol: t.symbol || t.name || "(未知)",
      name: t.name || t.symbol || "",
      address: t.address,
      decimals: t.decimals,
    };
    try {
      await CustomTokenService.addToken(walletId, chainId, token);
      setAdded({ ...added, [t.address.toLowerCase()]: true });
      ToastService.show(`已添加 ${t.symbol}`);
    } catch (e: unknown) {
      ToastService.show(e instanceof Error ? e.message : "添加失败");
    }
  };

  return (
    <Scaffold
      backgroundColor={Theme.colors.background}
      appBar={
        <AppBar
          title="扫描代币"
          backgroundColor={Theme.colors.background}
          foregroundColor={Theme.colors.textPrimary}
          elevation={0}
          centerTitle={true}
        />
      }
    >
      <Container color={Theme.colors.background}>
        <SingleChildScrollView>
          <Padding padding={16}>
            <Column>
              <Container
                padding={12}
                decoration={{
                  color: Theme.colors.surface,
                  borderRadius: Theme.borderRadius.l,
                  border: { width: 1, color: Theme.colors.divider },
                }}
              >
                <Row crossAxisAlignment="center">
                  <Image
                    url={
                      chain && ChainIcons[chain.icon || "ethereum"]
                        ? ChainIcons[chain.icon || "ethereum"]
                        : ChainIcons.ethereum
                    }
                    width={20}
                    height={20}
                    fit="contain"
                  />
                  <SizedBox width={10} />
                  <Text
                    text={`链: ${chain?.name || "未知"} · 仅显示有余值的代币`}
                    fontWeight="bold"
                    fontSize={13}
                  />
                </Row>
              </Container>

              <SizedBox height={16} />

              {loading ? (
                <Row mainAxisAlignment="center" crossAxisAlignment="center">
                  <CircularProgressIndicator color={Theme.colors.primary} />
                  <SizedBox width={12} />
                  <Text
                    text="扫描中..."
                    color={Theme.colors.textSecondary}
                    fontSize={13}
                  />
                </Row>
              ) : notice ? (
                <Container
                  padding={16}
                  decoration={{
                    color: Theme.colors.surface,
                    borderRadius: Theme.borderRadius.l,
                    border: { width: 1, color: Theme.colors.divider },
                  }}
                >
                  <Text
                    text={notice}
                    color={Theme.colors.textSecondary}
                    fontSize={13}
                  />
                </Container>
              ) : (
                <Column>
                  {tokens.map((t) => {
                    const key = t.address.toLowerCase();
                    const isAdded = !!added[key];
                    return (
                      <Container
                        key={t.address}
                        margin={{ bottom: 10 }}
                        padding={14}
                        decoration={{
                          color: Theme.colors.surface,
                          borderRadius: Theme.borderRadius.l,
                          border: { width: 1, color: Theme.colors.divider },
                        }}
                      >
                        <Row
                          mainAxisAlignment="spaceBetween"
                          crossAxisAlignment="center"
                        >
                          <Column crossAxisAlignment="start">
                            <Text
                              text={t.name || t.symbol || "(未知)"}
                              fontWeight="bold"
                              fontSize={18}
                              color={Theme.colors.textPrimary}
                            />
                            <SizedBox height={2} />
                            <Text
                              text={
                                t.symbol && t.symbol !== (t.name || "")
                                  ? t.symbol
                                  : `${t.address.slice(0, 6)}…${t.address.slice(-4)}`
                              }
                              fontSize={12}
                              color={Theme.colors.textSecondary}
                            />
                            <SizedBox height={2} />
                            <Text
                              text={`余额: ${t.balance}`}
                              fontSize={12}
                              color={Theme.colors.textSecondary}
                            />
                            <SizedBox height={2} />
                            <Text
                              text={t.address}
                              fontSize={11}
                              color={Theme.colors.textSecondary}
                              maxLines={1}
                            />
                          </Column>
                          <InkWell onTap={() => !isAdded && handleAdd(t)}>
                            <Container
                              padding={{ horizontal: 16, vertical: 8 }}
                              decoration={{
                                color: isAdded
                                  ? "#FFFFFF1F"
                                  : Theme.colors.primary,
                                borderRadius: Theme.borderRadius.full,
                              }}
                            >
                              <Text
                                text={isAdded ? "已添加" : "添加"}
                                color={
                                  isAdded ? Theme.colors.textSecondary : "white"
                                }
                                fontSize={13}
                                fontWeight="bold"
                              />
                            </Container>
                          </InkWell>
                        </Row>
                      </Container>
                    );
                  })}
                </Column>
              )}

              <SizedBox height={24} />
            </Column>
          </Padding>
        </SingleChildScrollView>
      </Container>
    </Scaffold>
  );
}
