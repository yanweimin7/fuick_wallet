import React, { useEffect, useState } from 'react';
import { AppBar, Container, ListView, ListTile, Scaffold, Text, useNavigator, Icon, Padding, SizedBox } from 'fuickjs';
import { ChainRegistry, ChainConfig, setSelectedChain, getSelectedChain } from '../../services/ChainRegistry';
import { Theme } from '../../theme';
import { Card } from '../../components/common';

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
          title={<Text text="Select Network" fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />}
          centerTitle={true}
          elevation={0}
          backgroundColor={Theme.colors.surface}
          foregroundColor={Theme.colors.textPrimary}
        />
      }
    >
      <Container color={Theme.colors.background}>
        <Padding padding={Theme.spacing.m}>
          <ListView
            children={chains.map((c) => (
              <Padding padding={{ bottom: Theme.spacing.s }} key={c.id}>
                <Card
                  padding={0}
                  onTap={() => onChoose(c)}
                >
                  <ListTile
                    title={<Text text={c.name} fontWeight="bold" color={Theme.colors.textPrimary} />}
                    subtitle={<Text text={`${c.symbol || ''} · ChainId ${c.chainId}`} color={Theme.colors.textSecondary} fontSize={12} />}
                    trailing={selected?.id === c.id ? <Icon name="check_circle" color={Theme.colors.primary} size={24} /> : undefined}
                    contentPadding={{ horizontal: 16, vertical: 8 }}
                  />
                </Card>
              </Padding>
            ))}
          />
        </Padding>
      </Container>
    </Scaffold>
  );
}

