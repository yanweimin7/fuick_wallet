import React, { useEffect, useState } from "react";
import {
  AppBar,
  Container,
  ListView,
  ListTile,
  Scaffold,
  Text,
  Image,
  useNavigator,
  Icon,
  Padding,
  SizedBox,
  DefaultTabController,
  TabBar,
  Tab,
  TabBarView,
} from "fuickjs";
import {
  ChainRegistry,
  ChainConfig,
  setSelectedChain,
  getSelectedChain,
} from "../../services/ChainRegistry";
import { Theme } from "../../theme";
import { Card } from "../../components/common";
import { ChainIcons } from "../../assets/icons";

export default function ChainSelectPage() {
  const navigator = useNavigator();
  const [selected, setSelected] = useState<ChainConfig | null>(null);
  const allChains = ChainRegistry.list();
  const mainnets = allChains.filter((c) => !c.testnet);
  const testnets = allChains.filter((c) => c.testnet);

  useEffect(() => {
    (async () => {
      const c = await getSelectedChain();
      setSelected(c);
    })();
  }, []);

  const onChoose = async (chain: ChainConfig) => {
    await setSelectedChain(chain);
    navigator.pop(chain);
  };

  const renderList = (chains: ChainConfig[]) => (
    <Container color={Theme.colors.background}>
      <Padding padding={Theme.spacing.m}>
        <ListView
          children={chains.map((c) => (
            <Padding padding={{ bottom: Theme.spacing.s }} key={c.id}>
              <Card padding={0} onTap={() => onChoose(c)}>
                <ListTile
                  leading={
                    c.icon && ChainIcons[c.icon] ? (
                      <Image url={ChainIcons[c.icon]} width={28} height={28} />
                    ) : undefined
                  }
                  title={
                    <Text
                      text={c.name}
                      fontWeight="bold"
                      color={Theme.colors.textPrimary}
                    />
                  }
                  subtitle={
                    <Text
                      text={`${c.symbol || ""} · ChainId ${c.chainId}`}
                      color={Theme.colors.textSecondary}
                      fontSize={12}
                    />
                  }
                  trailing={
                    selected?.id === c.id ? (
                      <Icon
                        name="check_circle"
                        color={Theme.colors.primary}
                        size={24}
                      />
                    ) : undefined
                  }
                  contentPadding={{ horizontal: 16, vertical: 8 }}
                />
              </Card>
            </Padding>
          ))}
        />
      </Padding>
    </Container>
  );

  return (
    <DefaultTabController length={2} initialIndex={0}>
      <Scaffold
        appBar={
          <AppBar
            title={
              <Text
                text="Select Network"
                fontWeight="bold"
                fontSize={18}
                color={Theme.colors.textPrimary}
              />
            }
            centerTitle={true}
            elevation={0}
            backgroundColor={Theme.colors.surface}
            foregroundColor={Theme.colors.textPrimary}
            bottom={
              <TabBar
                tabs={[
                  <Tab key="main" text="主网" />,
                  <Tab key="test" text="测试网" />,
                ]}
                indicatorColor={Theme.colors.primary}
                labelColor={Theme.colors.textPrimary}
                unselectedLabelColor={Theme.colors.textSecondary}
              />
            }
          />
        }
      >
        <TabBarView>
          {renderList(mainnets)}
          {renderList(testnets)}
        </TabBarView>
      </Scaffold>
    </DefaultTabController>
  );
}
