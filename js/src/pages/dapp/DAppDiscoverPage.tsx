import React, { useState, useEffect } from "react";
import {
  Scaffold,
  Column,
  Row,
  Container,
  Text,
  Icon,
  InkWell,
  SizedBox,
  TextField,
  useNavigator,
  SafeArea,
  SingleChildScrollView,
  Expanded,
  ListView,
  DefaultTabController,
  TabBar,
  TabBarView,
  Tab,
} from "fuickjs";
import { Theme } from "../../theme";
import { Chip, IconBadge } from "../../components/common";
import { DAppBridgeService } from "../../services/DAppBridgeService";

interface DApp {
  name: string;
  url: string;
  desc: string;
  tag?: string;
}

interface Category {
  title: string;
  accent: string;
  apps: DApp[];
}

const SOLANA_CATEGORIES: Category[] = [
  {
    title: "DeFi",
    accent: Theme.colors.primary,
    apps: [
      { name: "Jupiter", url: "https://jup.ag", desc: "Solana 聚合交易" },
      { name: "Raydium", url: "https://raydium.io", desc: "AMM / 流动性池" },
      { name: "Drift", url: "https://drift.trade", desc: "永续合约 / 杠杆" },
      {
        name: "Marinade",
        url: "https://marinade.finance",
        desc: "SOL 流动性质押",
        tag: "质押",
      },
    ],
  },
  {
    title: "NFT",
    accent: Theme.colors.accent,
    apps: [
      { name: "Magic Eden", url: "https://magiceden.io", desc: "NFT 市场" },
      { name: "Tensor", url: "https://tensor.trade", desc: "NFT 交易" },
    ],
  },
  {
    title: "工具",
    accent: Theme.colors.accent,
    apps: [
      {
        name: "Solscan",
        url: "https://solscan.io",
        desc: "Solana 区块浏览器",
        tag: "浏览器",
      },
      {
        name: "Phantom",
        url: "https://phantom.app",
        desc: "Solana 钱包官网",
        tag: "钱包",
      },
    ],
  },
];

const MAINNET_CATEGORIES: Category[] = [
  {
    title: "DeFi",
    accent: Theme.colors.primary,
    apps: [
      { name: "Uniswap", url: "https://app.uniswap.org", desc: "去中心化交易" },
      { name: "1inch", url: "https://app.1inch.dev", desc: "聚合交易" },
      { name: "AvantisFi", url: "https://www.avantisfi.com", desc: "永续合约 / 杠杆" },
      { name: "Aave", url: "https://app.aave.com", desc: "借贷" },
      { name: "Lido", url: "https://stake.lido.fi", desc: "ETH 质押" },
      { name: "Curve", url: "https://curve.fi", desc: "稳定币兑换" },
      {
        name: "PancakeSwap",
        url: "https://pancakeswap.finance",
        desc: "多链 DEX",
      },
    ],
  },
  {
    title: "NFT",
    accent: Theme.colors.accent,
    apps: [
      { name: "OpenSea", url: "https://opensea.io", desc: "NFT 市场" },
      { name: "Blur", url: "https://blur.io", desc: "NFT 交易" },
    ],
  },
  {
    title: "工具",
    accent: Theme.colors.accent,
    apps: [
      { name: "Etherscan", url: "https://etherscan.io", desc: "区块浏览器" },
    ],
  },
];

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/** 已知 dApp 的 origin -> 名称 映射，用于连接列表里展示更友好的名字 */
function buildNameMap(): Record<string, string> {
  const map: Record<string, string> = {};
  [...MAINNET_CATEGORIES, ...SOLANA_CATEGORIES].forEach((cat) => {
    cat.apps.forEach((a) => {
      try {
        map[new URL(a.url).origin] = a.name;
      } catch {
        /* ignore */
      }
    });
  });
  return map;
}

/** 已连接站点底部弹层 */
function ConnectionsSheet({ onChanged }: { onChanged?: () => void }) {
  const nav = useNavigator();
  const [items, setItems] = useState<
    { origin: string; name: string; kinds: string[] }[]
  >([]);
  const nameMap = buildNameMap();

  const load = async () => {
    const all = await DAppBridgeService.getConnections();
    const list = Object.entries(all)
      .map(([origin, entry]) => {
        const kinds = Object.keys(entry).filter(
          (k) => entry[k] && entry[k].length,
        );
        if (!kinds.length) return null;
        return { origin, name: nameMap[origin] || hostOf(origin), kinds };
      })
      .filter(Boolean) as { origin: string; name: string; kinds: string[] }[];
    setItems(list);
  };

  useEffect(() => {
    load();
  }, []);

  const disconnect = async (origin: string) => {
    await DAppBridgeService.removeSite(origin);
    await load();
    onChanged && onChanged();
  };

  return (
    <Container
      color={Theme.colors.surface}
      padding={{ horizontal: 20, top: 16, bottom: 28 }}
    >
      <Column crossAxisAlignment="stretch">
        <Row crossAxisAlignment="center" mainAxisAlignment="spaceBetween">
          <Text
            text="已连接站点"
            fontSize={18}
            fontWeight="bold"
            color={Theme.colors.textPrimary}
          />
          <InkWell onTap={() => nav.pop()}>
            <Container padding={{ horizontal: 8, vertical: 6 }}>
              <Icon name="close" color={Theme.colors.textHint} size={22} />
            </Container>
          </InkWell>
        </Row>
        <SizedBox height={4} />
        <Text
          text="这些 dApp 已授权读取你的地址，可随时断开"
          fontSize={12}
          color={Theme.colors.textHint}
        />
        <SizedBox height={16} />
        {items.length === 0 ? (
          <Container padding={{ vertical: 40 }} alignment="center">
            <IconBadge icon="link_off" color={Theme.colors.textHint} size={48} />
            <SizedBox height={12} />
            <Text text="暂无已连接的 dApp" fontSize={14} color={Theme.colors.textHint} />
          </Container>
        ) : (
          <SingleChildScrollView scrollDirection="vertical">
            <Column crossAxisAlignment="stretch">
              {items.map((it) => (
                <Container
                  key={it.origin}
                  padding={{ all: 14 }}
                  margin={{ bottom: 12 }}
                  decoration={{
                    color: Theme.colors.surfaceVariant,
                    borderRadius: Theme.borderRadius.m,
                  }}
                >
                  <Row crossAxisAlignment="center">
                    <IconBadge icon="public" color={Theme.colors.accent} size={38} />
                    <SizedBox width={12} />
                    <Expanded flex={1}>
                      <Text
                        text={it.name}
                        fontSize={15}
                        fontWeight="bold"
                        color={Theme.colors.textPrimary}
                      />
                      <SizedBox height={4} />
                      <Row crossAxisAlignment="center">
                        {it.kinds.map((k) => (
                          <Container
                            key={k}
                            margin={{ right: 6 }}
                            padding={{ horizontal: 8, vertical: 2 }}
                            decoration={{
                              color: Theme.colors.primary + "1F",
                              borderRadius: Theme.borderRadius.full,
                            }}
                          >
                            <Text
                              text={k === "solana" ? "Solana" : "EVM"}
                              fontSize={10}
                              fontWeight="bold"
                              color={Theme.colors.primary}
                            />
                          </Container>
                        ))}
                      </Row>
                    </Expanded>
                    <InkWell onTap={() => disconnect(it.origin)}>
                      <Container
                        padding={{ horizontal: 12, vertical: 7 }}
                        decoration={{
                          color: Theme.colors.error + "1A",
                          borderRadius: Theme.borderRadius.full,
                        }}
                      >
                        <Text
                          text="断开"
                          fontSize={12}
                          fontWeight="bold"
                          color={Theme.colors.error}
                        />
                      </Container>
                    </InkWell>
                  </Row>
                </Container>
              ))}
            </Column>
          </SingleChildScrollView>
        )}
      </Column>
    </Container>
  );
}


function DAppCard({
  app,
  accent,
  onTap,
}: {
  app: DApp;
  accent: string;
  onTap: () => void;
}) {
  return (
    <InkWell onTap={onTap}>
      <Container
        padding={{ all: 14 }}
        margin={{ bottom: 12 }}
        decoration={{
          color: Theme.colors.surface,
          borderRadius: Theme.borderRadius.l,
          border: { width: 1, color: Theme.colors.border },
        }}
      >
        <Row crossAxisAlignment="center">
          <Container
            width={42}
            height={42}
            alignment="center"
            margin={{ right: 12 }}
            decoration={{
              color: Theme.colors.accent + "22",
              borderRadius: 14,
            }}
          >
            <Icon name="public" color={Theme.colors.accent} size={22} />
          </Container>
          <Expanded flex={1}>
            <Column crossAxisAlignment="start">
              <Row
                crossAxisAlignment="center"
                mainAxisAlignment="spaceBetween"
              >
                <Text
                  text={app.name}
                  fontSize={15}
                  fontWeight="bold"
                  color={Theme.colors.textPrimary}
                />
                {app.tag ? <Chip label={app.tag} color={accent} /> : null}
              </Row>
              <SizedBox height={3} />
              <Text
                text={app.desc}
                fontSize={12}
                color={Theme.colors.textSecondary}
              />
              <SizedBox height={3} />
              <Text
                text={hostOf(app.url)}
                fontSize={10}
                color={Theme.colors.textHint}
              />
            </Column>
          </Expanded>
          <SizedBox width={6} />
          <Icon name="chevron_right" color={Theme.colors.textHint} size={20} />
        </Row>
      </Container>
    </InkWell>
  );
}

function TabContent({
  categories,
  query,
  onOpen,
}: {
  categories: Category[];
  query: string;
  onOpen: (app: DApp) => void;
}) {
  const filtered = categories
    .map((c) => ({
      ...c,
      apps: c.apps.filter(
        (a) =>
          !query ||
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.desc.toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter((c) => c.apps.length > 0);

  return (
    <SingleChildScrollView scrollDirection="vertical">
      <Column
        crossAxisAlignment="stretch"
        padding={{ horizontal: 16, top: 16, bottom: 32 }}
      >
        {filtered.length === 0 ? (
          <Container margin={{ top: 60 }}>
            <Text
              text="没有匹配的 dApp"
              fontSize={14}
              color={Theme.colors.textHint}
            />
          </Container>
        ) : (
          filtered.map((cat) => (
            <Column
              key={cat.title}
              crossAxisAlignment="stretch"
              margin={{ bottom: 24 }}
            >
              <Row crossAxisAlignment="center" margin={{ bottom: 12 }}>
                <Container
                  width={4}
                  height={16}
                  margin={{ right: 8 }}
                  decoration={{
                    color: cat.accent,
                    borderRadius: Theme.borderRadius.full,
                  }}
                />
                <Text
                  text={cat.title}
                  fontSize={16}
                  fontWeight="bold"
                  color={Theme.colors.textPrimary}
                />
              </Row>
              <ListView
                shrinkWrap={true}
                physics="never"
                itemCount={cat.apps.length}
                itemBuilder={(index: number) => (
                  <DAppCard
                    app={cat.apps[index]}
                    accent={cat.accent}
                    onTap={() => onOpen(cat.apps[index])}
                  />
                )}
              />
            </Column>
          ))
        )}
      </Column>
    </SingleChildScrollView>
  );
}

export default function DAppDiscoverPage() {
  const navigator = useNavigator();
  const [query, setQuery] = useState("");
  const [connectedCount, setConnectedCount] = useState(0);

  const reloadConnected = async () => {
    const all = await DAppBridgeService.getConnections();
    const count = Object.values(all).filter((entry) =>
      Object.values(entry).some((accs) => accs && accs.length > 0),
    ).length;
    setConnectedCount(count);
  };

  useEffect(() => {
    reloadConnected();
  }, []);

  const open = (app: DApp) => {
    navigator.push("/wallet/dapp_browser", { url: app.url, title: app.name });
  };

  const openConnections = () => {
    navigator.showBottomSheet(
      <ConnectionsSheet onChanged={reloadConnected} />,
      { maxHeight: 560 },
    );
  };

  return (
    <Scaffold backgroundColor={Theme.colors.background}>
      <SafeArea>
        <DefaultTabController length={2} initialIndex={0}>
          <Column crossAxisAlignment="stretch">
            <Column
              crossAxisAlignment="stretch"
              padding={{ horizontal: 16, top: 20, bottom: 4 }}
            >
              <Row
                crossAxisAlignment="center"
                mainAxisAlignment="spaceBetween"
              >
                <Text
                  text="探索 dApp"
                  fontSize={28}
                  fontWeight="bold"
                  color={Theme.colors.textPrimary}
                />
                <InkWell onTap={openConnections}>
                  <Container
                    padding={{ horizontal: 12, vertical: 10 }}
                    decoration={{
                      color: Theme.colors.surfaceVariant,
                      borderRadius: Theme.borderRadius.full,
                    }}
                  >
                    <Row crossAxisAlignment="center">
                      <Icon
                        name="link"
                        color={Theme.colors.primary}
                        size={20}
                      />
                      {connectedCount > 0 ? (
                        <>
                          <SizedBox width={6} />
                          <Container
                            padding={{ horizontal: 7, vertical: 2 }}
                            decoration={{
                              color: Theme.colors.primary,
                              borderRadius: Theme.borderRadius.full,
                            }}
                          >
                            <Text
                              text={String(connectedCount)}
                              fontSize={11}
                              fontWeight="bold"
                              color={Theme.colors.onPrimary}
                            />
                          </Container>
                        </>
                      ) : null}
                    </Row>
                  </Container>
                </InkWell>
              </Row>
              <SizedBox height={16} />
              <Container
                padding={{ horizontal: 12, vertical: 4 }}
                decoration={{
                  color: Theme.colors.surfaceVariant,
                  borderRadius: Theme.borderRadius.full,
                }}
              >
                <Row crossAxisAlignment="center">
                  <Icon name="search" color={Theme.colors.textHint} />
                  <SizedBox width={8} />
                  <Expanded flex={1}>
                    <TextField
                      value={query}
                      border="none"
                      onChanged={setQuery}
                    />
                  </Expanded>
                </Row>
              </Container>
              <SizedBox height={12} />
              <TabBar
                tabs={[<Tab text="正式网" />, <Tab text="Solana" />]}
                indicatorColor={Theme.colors.primary}
                labelColor={Theme.colors.primary}
                unselectedLabelColor={Theme.colors.textSecondary}
              />
            </Column>
            <Expanded flex={1}>
              <TabBarView
                children={[
                  <TabContent
                    categories={MAINNET_CATEGORIES}
                    query={query}
                    onOpen={open}
                  />,
                  <TabContent
                    categories={SOLANA_CATEGORIES}
                    query={query}
                    onOpen={open}
                  />,
                ]}
              />
            </Expanded>
          </Column>
        </DefaultTabController>
      </SafeArea>
    </Scaffold>
  );
}
