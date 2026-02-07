import React, { useState, useEffect } from 'react';
import { Scaffold, AppBar, ListView, Icon, useNavigator, Text, Container, InkWell, Column, Row, Padding, Expanded, Center, Button, Stack, Positioned, GestureDetector } from 'fuickjs';
import { WalletManager, WalletInfo } from '../../services/WalletManager';
import WalletDeleteDialog from './WalletDeleteDialog';
import WalletClearDialog from './WalletClearDialog';
import { getSelectedChain } from '../../services/ChainRegistry';

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
      navigator.pop(false, wallet);
    }
  };

  const handleCreate = async () => {
    const result = await navigator.push('/wallet/create');
    if (result) {
      if (props.onClose) {
        props.onClose(result as WalletInfo);
      } else {
        navigator.pop(false, result);
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
        navigator.pop(false, result);
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
    <Column>
      {isModal ? (
        <Container padding={16} alignment="center">
          <Container width={40} height={4} decoration={{ color: '#ddd', borderRadius: 2 }} />
          <Container height={10} />
          <Text text="Select Wallet" fontWeight="bold" fontSize={16} />
        </Container>
      ) : (
        <Container height={1} color="#eee" />
      )}
      <Expanded>
        <ListView
          itemCount={wallets.length}
          itemBuilder={(index: number) => {
            const w = wallets[index];
            return (
              <Column>
                <Container padding={16}>
                  <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                    <Expanded>
                      <InkWell onTap={() => handleSelect(w)}>
                        <Column crossAxisAlignment="start">
                          <Text text={w.name} fontWeight="bold" fontSize={16} />
                          <Container height={4} />
                          <Text
                            text={(() => {
                              const addr = (w.addresses && chainId) ? (w.addresses[chainId] || w.address) : w.address;
                              const head = addr.substring(0, 6);
                              const tail = addr.substring(addr.length - 4);
                              return head + "..." + tail;
                            })()}
                            fontSize={14}
                            color="#666"
                          />
                        </Column>
                      </InkWell>
                    </Expanded>
                    <Row>
                      {w.type === 'mnemonic' ?
                        <Container padding={{ horizontal: 8, vertical: 4 }} decoration={{ color: '#E3F2FD', borderRadius: 4 }}>
                          <Text text="HD" fontSize={10} color="#1976D2" />
                        </Container>
                        :
                        <Container padding={{ horizontal: 8, vertical: 4 }} decoration={{ color: '#FFF3E0', borderRadius: 4 }}>
                          <Text text="PK" fontSize={10} color="#F57C00" />
                        </Container>
                      }
                      <Container width={16} />
                      <GestureDetector onTap={() => handleDeleteWallet(w)}>
                        <Container padding={8}>
                          <Icon name="delete" color="#aaa" size={20} />
                        </Container>
                      </GestureDetector>
                    </Row>
                  </Row>
                </Container>
                <Container height={1} color="#f0f0f0" />
              </Column>
            );
          }}
        />
      </Expanded>
      <Padding padding={20}>
        <Column>
          <InkWell onTap={handleCreate}>
            <Container
              height={48}
              decoration={{
                color: "#2196F3",
                borderRadius: 24,
              }}
              alignment="center"
            >
              <Row mainAxisAlignment="center">
                <Icon name="add" color="white" />
                <Container width={8} />
                <Text text="Create New Wallet" color="white" fontWeight="bold" />
              </Row>
            </Container>
          </InkWell>
          <Container height={12} />
          <InkWell onTap={handleImport}>
            <Container
              height={48}
              decoration={{
                color: "white",
                borderRadius: 24,
                border: { width: 1, color: "#2196F3" }
              }}
              alignment="center"
            >
              <Row mainAxisAlignment="center">
                <Icon name="file_download" color="#2196F3" />
                <Container width={8} />
                <Text text="Import Wallet" color="#2196F3" fontWeight="bold" />
              </Row>
            </Container>
          </InkWell>
          <Container height={20} />
          <InkWell onTap={handleClearAll}>
            <Container
              height={48}
              alignment="center"
            >
              <Text text="Clear Local Wallets" color="red" />
            </Container>
          </InkWell>
        </Column>
      </Padding>
    </Column>
  );

  if (isModal) {
    return (
      <Container decoration={{ color: "white", borderRadius: { topLeft: 16, topRight: 16 } }}>
        {content}
      </Container>
    );
  }

  return (
    <Scaffold
      appBar={
        <AppBar
          title="Wallets"
        />
      }
    >
      {content}
    </Scaffold>
  );
}
