import React, { useEffect, useState } from 'react';
import { AppBar, AlertDialog, Button, Column, Container, Icon, InkWell, Padding, Row, Scaffold, Text, useNavigator, SingleChildScrollView, Expanded } from 'fuickjs';
import { ChainRegistry } from '../../services/ChainRegistry';
import { WalletInfo, WalletManager, WalletSecret } from '../../services/WalletManager';

export default function WalletDetailPage({ walletId }: { walletId?: string }) {
  const navigator = useNavigator();
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [secret, setSecret] = useState<WalletSecret | null>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  useEffect(() => {
    const wm = WalletManager.getInstance();
    const id = walletId || wm.getWallets()[0]?.id;
    if (!id) return;
    const info = wm.getWallet(id);
    setWallet(info || null);
  }, [walletId]);

  const confirmReveal = async (type: 'mnemonic' | 'privateKey') => {
    // @ts-ignore
    const ok = await navigator.showDialog(
      React.createElement(RiskRevealDialog, { type })
    );
    if (!ok) return;
    if (!wallet) return;
    const s = await WalletManager.getInstance().getSecret(wallet.id);
    setSecret(s);
    if (type === 'mnemonic') setShowMnemonic(true);
    if (type === 'privateKey') setShowPrivateKey(true);
  };

  return (
    <Scaffold
      appBar={
        <AppBar
          title={<Text text="钱包详情" fontWeight="bold" />}
          centerTitle={true}
          elevation={0}
        />
      }
    >
      <SingleChildScrollView>
        <Padding padding={{ horizontal: 20, vertical: 12 }}>
          <Column crossAxisAlignment="start">
            <Text text="基本信息" fontWeight="bold" fontSize={16} />
            <Container height={8} />
            {wallet ? (
              <Column crossAxisAlignment="start">
                <Row crossAxisAlignment="center">
                  <Container
                    width={36}
                    height={36}
                    decoration={{ color: '#E0F7FA', borderRadius: 18 }}
                    alignment="center"
                    margin={{ right: 8 }}
                  >
                    <Icon name="account_balance_wallet" color="#006064" />
                  </Container>
                  <Expanded><Column crossAxisAlignment="start">
                    <Text text={wallet.name} fontWeight="bold" />
                    <Text text={wallet.address} color="#666666" maxLines={1} overflow="ellipsis" />
                  </Column></Expanded>
                </Row>

                <Container height={20} />
                <Text text="多链地址" fontWeight="bold" fontSize={16} />
                <Container height={8} />
                <Container
                  padding={12}
                  decoration={{ color: '#FAFAFA', borderRadius: 8, border: { width: 1, color: '#EEEEEE' } }}
                >
                  <Column>
                    {ChainRegistry.list().map((chain, index) => (
                      <Column key={chain.id}>
                        <Container padding={{ vertical: 8 }}>
                          <Column crossAxisAlignment="start">
                            <Text text={chain.name} fontSize={12} color="#666" fontWeight="bold" />
                            <Container height={4} />
                            <Text
                              text={wallet?.addresses?.[chain.id] || wallet?.address || '未生成'}
                              fontSize={13}
                              color="#333"
                              maxLines={2}
                            />
                          </Column>
                        </Container>
                        {index < ChainRegistry.list().length - 1 && (
                          <Container height={1} color="#EEEEEE" />
                        )}
                      </Column>
                    ))}
                  </Column>
                </Container>

                <Container height={20} />
                <Text text="安全信息" fontWeight="bold" fontSize={16} />
                <Container height={8} />

                <Container
                  padding={12}
                  decoration={{ color: '#FAFAFA', borderRadius: 8, border: { width: 1, color: '#EEEEEE' } }}
                >
                  <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                    <Expanded>
                      <Column crossAxisAlignment="start">
                        <Text text="助记词" fontWeight="bold" />
                        <Container height={4} />
                        <Text
                          text={
                            showMnemonic ? (secret?.mnemonic || '无') : '******** ******** ******** ********'
                          }
                          color="#333333"
                        />
                      </Column>
                    </Expanded>
                    <Button text={showMnemonic ? '隐藏' : '显示'} onTap={() => (showMnemonic ? setShowMnemonic(false) : confirmReveal('mnemonic'))} />
                  </Row>
                </Container>

                <Container height={12} />

                <Container
                  padding={12}
                  decoration={{ color: '#FAFAFA', borderRadius: 8, border: { width: 1, color: '#EEEEEE' } }}
                >
                  <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                    <Expanded>
                      <Column crossAxisAlignment="start">
                        <Text text="私钥" fontWeight="bold" />
                        <Container height={4} />
                        {showPrivateKey ? (
                          <Column>
                            {Object.entries(secret?.privateKeys || {}).map(([k, v]) => (
                              <Column key={k}>
                                <Text text={`${k.toUpperCase()}:`} fontSize={12} color="#666" fontWeight="bold" />
                                <Text text={v} color="#333333" fontSize={12} />
                                <Container height={4} />
                              </Column>
                            ))}
                            {(!secret?.privateKeys || Object.keys(secret?.privateKeys).length === 0) && <Text text="无" color="#333333" />}
                          </Column>
                        ) : (
                          <Text text="0x********************************" color="#333333" />
                        )}
                      </Column>
                    </Expanded>
                    <Button text={showPrivateKey ? '隐藏' : '显示'} onTap={() => (showPrivateKey ? setShowPrivateKey(false) : confirmReveal('privateKey'))} />
                  </Row>
                </Container>
              </Column>
            ) : (
              <Text text="未找到钱包" />
            )}
          </Column>
        </Padding>
      </SingleChildScrollView>
    </Scaffold>
  );
}

function RiskRevealDialog({ type }: { type: 'mnemonic' | 'privateKey' }) {
  const navigator = useNavigator();
  const onCancel = () => navigator.pop(false);
  const onOk = () => navigator.pop(true);
  return (
    <AlertDialog
      title={<Text text="风险提示" fontWeight="bold" />}
      content={
        <Column crossAxisAlignment="start" mainAxisSize="min">
          <Text text={type === 'mnemonic' ? '显示助记词将暴露恢复权限，请确保周围环境安全。' : '显示私钥将暴露资金控制权，请确保周围环境安全。'} />
          <Container height={8} />
          <Text text="请勿截图或随意分享。我们不会远程保存此信息。" color="red" />
        </Column>
      }
      actions={[
        <InkWell onTap={onCancel}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="取消" />
          </Container>
        </InkWell>,
        <InkWell onTap={onOk}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="确认显示" color="red" fontWeight="bold" />
          </Container>
        </InkWell>,
      ]}
    />
  );
}
