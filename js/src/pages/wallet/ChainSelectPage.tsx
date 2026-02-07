import React, { useEffect, useState } from 'react';
import { AppBar, Container, ListView, ListTile, Scaffold, Text, useNavigator, Icon } from 'fuickjs';
import { ChainRegistry, ChainConfig, setSelectedChain, getSelectedChain } from '../../services/ChainRegistry';

export default function ChainSelectPage() {
  const navigator = useNavigator();
  const [selected, setSelected] = useState<ChainConfig | null>(null);
  const chains = ChainRegistry.list();

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

  return (
    <Scaffold
      appBar={
        <AppBar
          title={<Text text="选择网络" fontWeight="bold" />}
          centerTitle={true}
          elevation={0}
        />
      }
    >
      <Container>
        <ListView
          children={chains.map((c) => (
            <ListTile
              title={<Text text={c.name} />}
              subtitle={<Text text={`${c.symbol || ''} · ChainId ${c.chainId}`} color="#666666" />}
              trailing={selected?.id === c.id ? <Icon name="check" color="#2196F3" /> : undefined}
              onTap={() => onChoose(c)}
            />
          ))}
        />
      </Container>
    </Scaffold>
  );
}
