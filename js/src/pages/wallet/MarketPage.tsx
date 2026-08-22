import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  Column,
  Container,
  Text,
  Padding,
  Row,
  Image,
  SizedBox,
  InkWell,
  Scaffold,
  Icon,
  GridView,
  PageView,
  Center,
  CustomScrollView,
  SliverPersistentHeader,
  SliverToBoxAdapter,
  SliverList,
  Flexible,
  Expanded,
  Divider,
  TextField,
  DefaultTabController,
  TabBar,
  Tab,
  SliverAppBar,
} from "fuickjs";
import { Theme } from "../../theme";
import { ChangeBadge } from "../../components/common";

const TABS = ["全部", "自选", "现货", "合约"];
const TAB_TO_PREFIXES: Record<string, string[]> = {
  全部: [],
  自选: ["BTC", "ETH"],
  现货: ["USDT"],
  合约: ["PERP"],
};

interface Crypto {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  color: string;
}

const COIN_COLORS: Record<string, string> = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  SOL: "#14F195",
  BNB: "#F3BA2F",
  XRP: "#23292F",
  ADA: "#0033AD",
  DOGE: "#C2A633",
  DOT: "#E6007A",
  MATIC: "#8247E5",
  LTC: "#345D9D",
};

const generateCryptos = (count: number) => {
  const cryptos = [];
  const baseSymbols = [
    "BTC",
    "ETH",
    "SOL",
    "BNB",
    "XRP",
    "ADA",
    "DOGE",
    "DOT",
    "MATIC",
    "LTC",
  ];
  const quotes = ["USDT", "USDC"];
  const basePrices: Record<string, number> = {
    BTC: 64000,
    ETH: 3200,
    SOL: 145,
    BNB: 580,
    XRP: 0.52,
    ADA: 0.45,
    DOGE: 0.12,
    DOT: 6.8,
    MATIC: 0.72,
    LTC: 72,
  };

  for (let i = 0; i < count; i++) {
    const base = baseSymbols[i % baseSymbols.length];
    const quote = quotes[i % quotes.length];
    const suffix = i >= baseSymbols.length ? ` ${i}` : "";
    const symbol = `${base}/${quote}${suffix}`;
    const change = -6 + Math.random() * 12;

    cryptos.push({
      symbol: symbol,
      name: base + suffix,
      price: (basePrices[base] || 10 + Math.random() * 500) * (0.9 + Math.random() * 0.2),
      change: change,
      volume: Math.floor(Math.random() * 1000000),
      marketCap: Math.floor(Math.random() * 1000000000),
      color: COIN_COLORS[base] || "#64748B",
    });
  }
  return cryptos;
};

const ALL_CRYPTOS = generateCryptos(40);

const BANNERS = [
  "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80",
  "https://images.unsplash.com/photo-1622630998477-20aa696fa4a5?w=800&q=80",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
];

const CATEGORIES = [
  { name: "涨幅榜", icon: "trending_up", color: Theme.colors.success },
  { name: "跌幅榜", icon: "trending_down", color: Theme.colors.error },
  { name: "新币", icon: "fiber_new", color: Theme.colors.accent },
  { name: "Defi", icon: "account_balance", color: "#2DD4BF" },
  { name: "GameFi", icon: "sports_esports", color: "#F59E0B" },
  { name: "Layer2", icon: "layers", color: "#60A5FA" },
  { name: "NFT", icon: "image", color: "#F472B6" },
  { name: "更多", icon: "apps", color: "#94A3B8" },
];

function CryptoItem({ crypto }: { crypto: Crypto; index: number }) {
  const isUp = crypto.change >= 0;

  return (
    <InkWell onTap={() => console.log(`Click crypto: ${crypto.symbol}`)}>
      <Container
        margin={{ horizontal: 16, bottom: 10 }}
        padding={{ left: 14, right: 14, top: 14, bottom: 14 }}
        decoration={{
          color: Theme.colors.surface,
          borderRadius: Theme.borderRadius.l,
          border: { color: Theme.colors.border, width: 1 },
        }}
      >
        <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
          <Row crossAxisAlignment="center">
            <Container
              width={40}
              height={40}
              alignment="center"
              decoration={{
                color: crypto.color + "22",
                borderRadius: 14,
              }}
            >
              <Text
                text={crypto.name.substring(0, 1)}
                fontSize={16}
                fontWeight="bold"
                color={crypto.color}
              />
            </Container>
            <SizedBox width={12} />
            <Column crossAxisAlignment="start">
              <Text
                text={crypto.name}
                fontSize={16}
                fontWeight="bold"
                color={Theme.colors.textPrimary}
              />
              <SizedBox height={3} />
              <Text
                text={crypto.symbol}
                fontSize={12}
                color={Theme.colors.textSecondary}
              />
            </Column>
          </Row>

          <Column crossAxisAlignment="end">
            <Text
              text={`$${crypto.price.toFixed(2)}`}
              fontSize={16}
              fontWeight="bold"
              color={Theme.colors.textPrimary}
            />
            <SizedBox height={4} />
            <ChangeBadge value={crypto.change} />
          </Column>
        </Row>
      </Container>
    </InkWell>
  );
}

export default function MarketPage() {
  const [marketData, setMarketData] = useState({
    tick: 0,
    bannerIndex: 0,
    cryptos: ALL_CRYPTOS,
  });
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const listRef = useRef<SliverList>(null);
  const pageViewRef = useRef<PageView>(null);

  const { tick, cryptos: cryptosWithUpdate } = marketData;

  const filteredCryptos = useMemo(() => {
    if (activeTabIndex === 0) return ALL_CRYPTOS;
    return ALL_CRYPTOS.filter((_, i) => i % (activeTabIndex + 1) === 0);
  }, [activeTabIndex]);

  useEffect(() => {
    setMarketData((prev) => ({ ...prev, cryptos: filteredCryptos }));
  }, [filteredCryptos]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMarketData((prev) => {
        const nextCryptos = prev.cryptos.map((s) => ({
          ...s,
          price: Math.max(0.01, s.price + (Math.random() - 0.5) * s.price * 0.01),
          change: s.change + (Math.random() - 0.5) * 0.15,
        }));

        const nextBannerIndex = (prev.bannerIndex + 1) % BANNERS.length;
        if (pageViewRef.current) {
          pageViewRef.current.animateToPage(nextBannerIndex);
        }

        if (listRef.current) {
          const updates = nextCryptos.map((crypto, index) => ({
            index,
            dsl: (
              <CryptoItem key={crypto.symbol} crypto={crypto} index={index} />
            ),
          }));
          listRef.current.updateItems(updates);
        }

        return {
          tick: prev.tick + 1,
          bannerIndex: nextBannerIndex,
          cryptos: nextCryptos,
        };
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const itemBuilder = useCallback(
    (index: number) => {
      const crypto = cryptosWithUpdate[index];
      if (!crypto) return null;
      return <CryptoItem key={crypto.symbol} crypto={crypto} index={index} />;
    },
    [cryptosWithUpdate],
  );

  const bannerItems = useMemo(
    () =>
      BANNERS.map((url, i) => (
        <Image
          key={i}
          url={url}
          fit="cover"
          width={Infinity}
          height={160}
          borderRadius={Theme.borderRadius.l}
        />
      )),
    [],
  );

  const categoriesGrid = useMemo(
    () =>
      CATEGORIES.map((cat, i) => (
        <Container
          key={i}
          alignment="center"
          padding={{ vertical: 14 }}
          decoration={{
            color: Theme.colors.surface,
            borderRadius: Theme.borderRadius.l,
            border: { color: Theme.colors.border, width: 1 },
          }}
        >
          <Column mainAxisAlignment="center">
            <Container
              width={42}
              height={42}
              borderRadius={14}
              color={cat.color + "22"}
            >
              <Center>
                <Icon name={cat.icon} color={cat.color} size={22} />
              </Center>
            </Container>
            <SizedBox height={8} />
            <Text
              text={cat.name}
              fontSize={12}
              color={Theme.colors.textPrimary}
            />
          </Column>
        </Container>
      )),
    [],
  );

  const tabBarTabs = useMemo(
    () => TABS.map((t) => <Tab key={t} text={t} />),
    [],
  );

  return (
    <DefaultTabController length={TABS.length} initialIndex={0}>
      <Scaffold backgroundColor={Theme.colors.background}>
        <CustomScrollView>
            <SliverAppBar pinned={true} expandedHeight={0}>
              <Container
                color={Theme.colors.background}
              >
                 <Padding padding={{ left: 16, right: 16, bottom: 10, top: 8 }}>
                 <Row
                   mainAxisAlignment="spaceBetween"
                   crossAxisAlignment="center"
                 >
                   <Expanded flex={1}>
                     <Column crossAxisAlignment="start">
                       <Text
                         text="行情"
                         fontSize={24}
                         color="white"
                         fontWeight="bold"
                       />
                     </Column>
                   </Expanded>
                   <Container
                     width={40}
                     height={40}
                     alignment="center"
                     decoration={{
                       color: "#FFFFFF1F",
                       borderRadius: Theme.borderRadius.full,
                     }}
                   >
                     <Icon name="notifications" color="white" size={22} />
                   </Container>
                 </Row>
               </Padding>
            </Container>
          </SliverAppBar>

          <SliverToBoxAdapter>
            <Padding padding={{ left: 16, right: 16, top: 12, bottom: 0 }}>
              <Container
                height={46}
                padding={{ horizontal: 14 }}
                decoration={{
                  color: Theme.colors.surfaceVariant,
                  borderRadius: Theme.borderRadius.full,
                  border: { color: Theme.colors.border, width: 1 },
                }}
              >
                <Row crossAxisAlignment="center">
                  <Icon
                    name="search"
                    size={20}
                    color={Theme.colors.textHint}
                  />
                  <SizedBox width={8} />
                  <Flexible>
                    <TextField
                      hintText="搜索币种"
                      border="none"
                      onChanged={(v) => console.log("Search:", v)}
                    />
                  </Flexible>
                </Row>
              </Container>
            </Padding>
          </SliverToBoxAdapter>

          <SliverToBoxAdapter>
            <Padding padding={{ left: 16, right: 16, top: 16 }}>
              <Container
                height={160}
                decoration={{
                  borderRadius: Theme.borderRadius.l,
                  boxShadow: Theme.shadows.medium,
                }}
              >
                <PageView
                  ref={pageViewRef}
                  onPageChanged={(index) =>
                    setMarketData((prev) => ({ ...prev, bannerIndex: index }))
                  }
                >
                  {bannerItems}
                </PageView>
              </Container>
            </Padding>
          </SliverToBoxAdapter>

          <SliverToBoxAdapter>
            <GridView
              padding={{ left: 12, right: 12, top: 16, bottom: 4 }}
              crossAxisCount={4}
              mainAxisSpacing={12}
              crossAxisSpacing={12}
              childAspectRatio={0.85}
              shrinkWrap={true}
              physics="never"
            >
              {categoriesGrid}
            </GridView>
          </SliverToBoxAdapter>

          <SliverPersistentHeader pinned={true} minExtent={52} maxExtent={52}>
            <Container color={Theme.colors.background}>
              <Column>
                <TabBar
                  tabs={tabBarTabs}
                  onTap={(index) => setActiveTabIndex(index)}
                  labelColor={Theme.colors.primary}
                  unselectedLabelColor={Theme.colors.textSecondary}
                  indicatorColor={Theme.colors.primary}
                  indicatorWeight={2}
                />
                <Divider height={1} color={Theme.colors.border} />
              </Column>
            </Container>
          </SliverPersistentHeader>

          <SliverList
            ref={listRef}
            itemCount={cryptosWithUpdate.length}
            itemBuilder={itemBuilder}
          />

          <SliverToBoxAdapter>
            <Container height={60}>
              <Center>
                <Text
                  text={`—— 到底了，共 ${cryptosWithUpdate.length} 个币种 ——`}
                  color={Theme.colors.textHint}
                  fontSize={12}
                />
              </Center>
            </Container>
          </SliverToBoxAdapter>
        </CustomScrollView>
      </Scaffold>
    </DefaultTabController>
  );
}
