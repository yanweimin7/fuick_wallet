import React, { useState, useEffect } from 'react';
import { Scaffold, AppBar, ListView, Icon, useNavigator, Text, Container, InkWell, Column, Row, Padding, Expanded, Center, Stack, Positioned } from 'fuickjs';
import { WalletManager, WalletInfo } from '../../services/WalletManager';
import WalletDeleteDialog from './WalletDeleteDialog';
import WalletClearDialog from './WalletClearDialog';
import { getSelectedChain } from '../../services/ChainRegistry';
import { Theme } from '../../theme';
import { Card, ThemeButton } from '../../components/common';

export default function WalletListPage(props: { onClose?: (wallet?: WalletInfo) => void, presentation?: string }) {
  const navigator = useNavigator();
  const navigatorAny = navigator as any;
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [chainId, setChainId] = useState<string>('');

  const isModal = props.onClose || props.presentation === 'bottomSheet';

  useEffect(() => {
    loadWallets();
    (async () => {
      const c = await getSelectedChain();
      setChainId(c.id);
    })();
  }, []);

  const loadWallets = () => {
    setWallets([...WalletManager.getInstance().getWallets()]);
  };

  const handleSelect = (wallet: WalletInfo) => {
    if (props.onClose) {
      props.onClose(wallet);
    } else {
      navigator.pop(wallet);
    }
  };

  const handleCreate = async () => {
    const result = await navigator.push('/wallet/create');
    if (result) {
      if (props.onClose) {
        props.onClose(result as WalletInfo);
      } else {
        navigator.pop(result);
      }
    } else {
      loadWallets();
    }
  };

  const handleImport = async () => {
    const result = await navigator.push('/wallet/import');
    if (result) {
      if (props.onClose) {
        props.onClose(result as WalletInfo);
      } else {
        navigator.pop(result);
      }
    } else {
      loadWallets();
    }
  };

  const handleClearAll = async () => {
    const confirmed = await navigatorAny.showDialog(<WalletClearDialog />);
    if (confirmed) {
      await WalletManager.getInstance().clearAllWallets();
      loadWallets();
    }
  };

  const handleDeleteWallet = async (wallet: WalletInfo) => {
    const confirmed = await navigatorAny.showDialog(<WalletDeleteDialog wallet={wallet} />);
    if (confirmed) {
      await WalletManager.getInstance().deleteWallet(wallet.id);
      loadWallets();
    }
  };

  const content = (
    <Stack fit="expand">
      <Positioned top={0} left={0} right={0} bottom={0}>
        <Container color={Theme.colors.background} />
      </Positioned>
      <Positioned top={0} left={0} right={0} bottom={0}>
        <Column>
          {isModal ? (
            <Container padding={16} alignment="center" decoration={{ color: Theme.colors.surface }}>
              <Container width={40} height={4} decoration={{ color: Theme.colors.divider, borderRadius: 2 }} />
              <Container height={12} />
              <Text text="Select Wallet" fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />
            </Container>
          ) : (
            <Container height={1} color={Theme.colors.divider} />
          )}
          <Expanded>
            <ListView
              padding={{ top: 16, left: 16, right: 16, bottom: 100 }}
              itemCount={wallets.length}
              itemBuilder={(index: number) => {
                const w = wallets[index];
                return (
                  <Padding padding={{ bottom: 12 }}>
                    <Card padding={16} onTap={() => handleSelect(w)}>
                      <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                        <Expanded>
                          <Column crossAxisAlignment="start">
                            <Text text={w.name} fontSize={16} fontWeight="bold" color={Theme.colors.textPrimary} />
                            <Container height={4} />
                            <Text
                              text={`${w.address.substring(0, 10)}...${w.address.substring(w.address.length - 8)}`}
                              fontSize={12}
                              color={Theme.colors.textSecondary}
                            />
                          </Column>
                        </Expanded>
                        <InkWell onTap={() => handleDeleteWallet(w)}>
                          <Padding padding={8}>
                            <Icon name="delete_outline" color={Theme.colors.error} size={20} />
                          </Padding>
                        </InkWell>
                      </Row>
                    </Card>
                  </Padding>
                );
              }}
            />
          </Expanded>
        </Column>
      </Positioned>
      {/* Bottom Buttons */}
      <Positioned bottom={0} left={0} right={0}>
        <Container
          padding={20}
          decoration={{
            color: Theme.colors.surface,
            boxShadow: Theme.shadows.medium
          }}
        >
          <Row>
            <Expanded>
              <ThemeButton text="Create" onTap={handleCreate} icon="add" />
            </Expanded>
            <Container width={16} />
            <Expanded>
              <ThemeButton text="Import" onTap={handleImport} variant="secondary" icon="file_download" />
            </Expanded>
          </Row>
          {wallets.length > 0 && (
            <Container margin={{ top: 12 }} alignment="center">
              <InkWell onTap={handleClearAll}>
                <Text text="Clear All Wallets" color={Theme.colors.error} fontSize={14} />
              </InkWell>
            </Container>
          )}
        </Container>
      </Positioned>
    </Stack>
  );

  if (isModal) {
    return <Scaffold>{content}</Scaffold>;
  }

  return (
    <Scaffold
      appBar={<AppBar title="My Wallets" backgroundColor={Theme.colors.surface} elevation={0} />}
    >
      {content}
    </Scaffold>
  );
}
