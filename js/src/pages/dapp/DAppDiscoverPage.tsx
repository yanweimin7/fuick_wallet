import React, { useState } from "react";
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
import { Chip } from "../../components/common";

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

const TESTNET_CATEGORIES: Category[] = [
  {
    title: "钱包发现",
    accent: Theme.colors.primary,
    apps: [
      {
        name: "Flow EVM Test Dapp",
        url: "https://flow-evm-rainbow-kit.vercel.app/",
        desc: "EIP-6963 检测 + RPC 联调",
        tag: "检测",
      },
      {
        name: "EIP-6963 Test",
        url: "https://eip6963.org/",
        desc: "多钱包发现验证",
        tag: "检测",
      },
      {
        name: "MetaMask Test Dapp",
        url: "https://metamask.github.io/test-dapp/",
        desc: "Provider 联调",
        tag: "检测",
      },
    ],
  },
  {
    title: "Sepolia 实测",
    accent: Theme.colors.accent,
    apps: [
      {
        name: "Yellow Co-Sign",
        url: "https://cosign-demo-two.vercel.app/",
        desc: "Sepolia 连接 + 签名",
        tag: "Sepolia",
      },
      {
        name: "Web3 Lottery",
        url: "https://web3-lottery-frontend-app.vercel.app/",
        desc: "Sepolia 连接 + 转账",
        tag: "Sepolia",
      },
      {
        name: "Lumea",
        url: "https://lumea.pixellabs.ventures",
        desc: "Sepolia 完整 dApp",
        tag: "Sepolia",
      },
    ],
  },
  {
    title: "测试币 / 浏览器",
    accent: Theme.colors.accent,
    apps: [
      {
        name: "Sepolia Faucet (pk910)",
        url: "https://sepolia-faucet.pk910.de/",
        desc: "免登录水龙头",
        tag: "Faucet",
      },
      {
        name: "Sepolia Faucet (Alchemy)",
        url: "https://sepoliafaucet.com",
        desc: "领测试币",
        tag: "Faucet",
      },
      {
        name: "Etherscan",
        url: "https://etherscan.io",
        desc: "区块浏览器",
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
      {
        name: "MetaMask Test Dapp",
        url: "https://metamask.github.io/test-dapp/",
        desc: "Provider 联调",
      },
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

  const open = (app: DApp) => {
    navigator.push("/wallet/dapp_browser", { url: app.url, title: app.name });
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
              <Text
                text="探索 dApp"
                fontSize={28}
                fontWeight="bold"
                color={Theme.colors.textPrimary}
              />
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
                tabs={[<Tab text="测试网" />, <Tab text="正式网" />]}
                indicatorColor={Theme.colors.primary}
                labelColor={Theme.colors.primary}
                unselectedLabelColor={Theme.colors.textSecondary}
              />
            </Column>
            <Expanded flex={1}>
              <TabBarView
                children={[
                  <TabContent
                    categories={TESTNET_CATEGORIES}
                    query={query}
                    onOpen={open}
                  />,
                  <TabContent
                    categories={MAINNET_CATEGORIES}
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
