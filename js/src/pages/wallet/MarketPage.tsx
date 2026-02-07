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
  SafeArea,
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
  Divider,
  TextField,
  DefaultTabController,
  TabBar,
  Tab,
  SliverAppBar,
  Stack,
  Positioned,
} from "fuickjs";

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
}

// --- 数据生成逻辑 ---

// 生成 Crypto 数据
const generateCryptos = (count: number) => {
  const cryptos = [];
  const baseSymbols = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE", "DOT", "MATIC", "LTC"];
  const quotes = ["USDT", "USDC"];
  
  for (let i = 0; i < count; i++) {
    const base = baseSymbols[i % baseSymbols.length];
    const quote = quotes[i % quotes.length];
    // 为了增加多样性，后面加一些后缀
    const suffix = i >= baseSymbols.length ? ` ${i}` : "";
    const symbol = `${base}/${quote}${suffix}`;
    
    cryptos.push({
      symbol: symbol,
      name: base + suffix,
      price: 10 + Math.random() * 50000,
      change: -10 + Math.random() * 20,
      volume: Math.floor(Math.random() * 1000000),
      marketCap: Math.floor(Math.random() * 1000000000),
    });
  }
  return cryptos;
};

const ALL_CRYPTOS = generateCryptos(100);

const BANNERS = [
  "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80",
  "https://images.unsplash.com/photo-1622630998477-20aa696fa4a5?w=800&q=80",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
];

const CATEGORIES = [
  { name: "涨幅榜", icon: "trending_up", color: "#4CAF50" },
  { name: "跌幅榜", icon: "trending_down", color: "#F44336" },
  { name: "新币", icon: "fiber_new", color: "#FF4081" },
  { name: "Defi", icon: "account_balance", color: "#9C27B0" },
  { name: "GameFi", icon: "games", color: "#795548" },
  { name: "NFT", icon: "image", color: "#FF9800" },
  { name: "Layer2", icon: "layers", color: "#2196F3" },
  { name: "更多", icon: "apps", color: "#607D8B" },
];

// --- 组件定义 ---

function CryptoItem({ crypto }: { crypto: Crypto; index: number }) {
  const isUp = crypto.change >= 0;
  const color = isUp ? "#4CAF50" : "#F44336"; // 绿涨红跌

  return (
    <Column>
      <InkWell onTap={() => console.log(`Click crypto: ${crypto.symbol}`)}>
        <Container color="white">
          <Padding padding={{ left: 16, right: 16, top: 12, bottom: 12 }}>
            <Row mainAxisAlignment="spaceBetween">
              <Column crossAxisAlignment="start">
                <Row>
                  <Text text={crypto.name} fontSize={16} fontWeight="bold" />
                  <SizedBox width={6} />
                  <Container
                    color="#F5F5F5"
                    borderRadius={4}
                    padding={{ left: 4, right: 4, top: 1, bottom: 1 }}
                  >
                    <Text
                      text="10X"
                      fontSize={10}
                      color="#666666"
                    />
                  </Container>
                </Row>
                <SizedBox height={4} />
                <Text text={crypto.symbol} fontSize={12} color="#999999" />
              </Column>

              <Row>
                <Column crossAxisAlignment="end">
                  <Text
                    text={crypto.price.toFixed(2)}
                    fontSize={17}
                    fontWeight="bold"
                    color={color}
                  />
                  <SizedBox height={2} />
                  <Text
                    text={(isUp ? "+" : "") + crypto.change.toFixed(2) + "%"}
                    fontSize={12}
                    color={color}
                  />
                </Column>
              </Row>
            </Row>
          </Padding>
        </Container>
      </InkWell>
      <Padding padding={{ left: 16 }}>
        <Divider height={1} color="#EEEEEE" />
      </Padding>
    </Column>
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
    // 简单模拟过滤逻辑
    if (activeTabIndex === 0) return ALL_CRYPTOS;
    // 这里只是简单演示，实际上应该根据 tab 过滤
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
          price: s.price + (Math.random() - 0.5) * 10,
          change: s.change + (Math.random() - 0.5) * 0.1,
        }));

        const nextBannerIndex = (prev.bannerIndex + 1) % BANNERS.length;
        if (pageViewRef.current) {
          pageViewRef.current.animateToPage(nextBannerIndex);
        }

        if (listRef.current) {
          const updates = nextCryptos.map((crypto, index) => ({
            index,
            dsl: <CryptoItem key={crypto.symbol} crypto={crypto} index={index} />,
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
        <Image key={i} url={url} fit="cover" width={Infinity} height={150} borderRadius={12} />
      )),
    [],
  );

  const categoriesGrid = useMemo(
    () =>
      CATEGORIES.map((cat, i) => (
        <Container key={i} color="white" borderRadius={12}>
          <Column mainAxisAlignment="center">
            <Container
              width={40}
              height={40}
              borderRadius={20}
              color={cat.color + "15"}
            >
              <Center>
                <Icon name={cat.icon} color={cat.color} size={24} />
              </Center>
            </Container>
            <SizedBox height={8} />
            <Text text={cat.name} fontSize={12} color="#333333" />
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
      <Scaffold backgroundColor="white">
        <CustomScrollView>
          <SliverAppBar pinned={true}>
            <Container color="#2196F3" isBoundary={true}>
              <SafeArea>
                <Padding padding={{ left: 16, right: 16, bottom: 8 }}>
                  <Column mainAxisAlignment="center" crossAxisAlignment="start">
                    <Text
                      text="行情"
                      fontSize={18}
                      color="white"
                      fontWeight="bold"
                    />
                    <Text
                      text={`实时行情 · 更新 ${tick}`}
                      fontSize={11}
                      color="white"
                    />
                  </Column>
                </Padding>
              </SafeArea>
            </Container>
          </SliverAppBar>

          <SliverToBoxAdapter>
            <Padding padding={{ left: 16, right: 16, top: 12, bottom: 0 }}>
              <Container height={44} color="#F5F5F5" borderRadius={22}>
                <Padding padding={{ left: 16, right: 16 }}>
                  <Row crossAxisAlignment="center">
                    <Icon name="search" size={20} color="#999999" />
                    <SizedBox width={8} />
                    <Flexible>
                      <TextField
                        hintText="搜索币种"
                        onChanged={(v) => console.log("Search:", v)}
                      />
                    </Flexible>
                  </Row>
                </Padding>
              </Container>
            </Padding>
          </SliverToBoxAdapter>

          <SliverToBoxAdapter>
            <Padding padding={{ left: 16, right: 16, top: 16 }}>
              <Container height={150} borderRadius={12}>
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
              padding={{ left: 12, right: 12, bottom: 8 }}
              crossAxisCount={4}
              mainAxisSpacing={12}
              crossAxisSpacing={12}
              childAspectRatio={0.8}
              shrinkWrap={true}
              physics="never"
            >
              {categoriesGrid}
            </GridView>
          </SliverToBoxAdapter>

          <SliverToBoxAdapter>
            <Padding padding={{ left: 16, right: 16, top: 20, bottom: 0 }}>
              <Row mainAxisAlignment="spaceBetween">
                <Text
                  text={`${TABS[activeTabIndex]}榜单`}
                  fontSize={18}
                  fontWeight="bold"
                />
              </Row>
            </Padding>
          </SliverToBoxAdapter>

          <SliverPersistentHeader pinned={true} minExtent={49} maxExtent={49}>
            <Container color="#FFFFFF">
              <Column>
                <TabBar
                  tabs={tabBarTabs}
                  onTap={(index) => setActiveTabIndex(index)}
                  labelColor="#2196F3"
                  unselectedLabelColor="#666666"
                  indicatorColor="#2196F3"
                  indicatorWeight={2}
                />
                <Divider height={1} color="#EEEEEE" />
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
                  color="#CCCCCC"
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
