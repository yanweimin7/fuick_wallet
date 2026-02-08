import React, { useEffect, useState } from 'react';
import { AppBar, AlertDialog, Column, Container, Icon, InkWell, Padding, Row, Scaffold, Text, useNavigator, SingleChildScrollView, Expanded, Center, SizedBox, ClipboardService } from 'fuickjs';
import { ChainRegistry } from '../../services/ChainRegistry';
import { WalletInfo, WalletManager, WalletSecret } from '../../services/WalletManager';
import WalletDeleteDialog from './WalletDeleteDialog';
import { Theme } from '../../theme';
import { Card, ThemeButton } from '../../components/common';
import { PasswordService } from '../../services/PasswordService';
import { VerifyPasswordDialog, SetPasswordDialog } from '../../components/PasswordDialogs';

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
    let password = "";
    // Check local password
    const isSet = await PasswordService.isPasswordSet();
    if (isSet) {
      const res = await PasswordService.getPassword(navigator);
      if (!res) return;
      password = res;
    } else {
      // @ts-ignore
      const res = await navigator.showDialog(<SetPasswordDialog />);
      if (!res) return;
      password = res as string;
    }

    // @ts-ignore
    const ok = await navigator.showDialog(
      React.createElement(RiskRevealDialog, { type })
    );
    if (!ok) return;
    if (!wallet) return;
    const s = await WalletManager.getInstance().getSecret(wallet.id, password);
    setSecret(s);
    if (type === 'mnemonic') setShowMnemonic(true);
    if (type === 'privateKey') setShowPrivateKey(true);
  };

  const handleDelete = async () => {
    if (!wallet) return;
    // @ts-ignore
    const confirmed = await navigator.showDialog(
      React.createElement(WalletDeleteDialog, { wallet })
    );
    if (confirmed) {
      await WalletManager.getInstance().deleteWallet(wallet.id);
      navigator.pop(true);
    }
  };

  const handleCopy = async (text: string) => {
    await ClipboardService.setData(text);
    navigator.showDialog(
      <AlertDialog
        title={<Text text="Copied" fontWeight="bold" fontSize={18} />}
        content={<Text text={`Address copied to clipboard`} />}
        actions={[
          <InkWell onTap={() => navigator.pop()}>
            <Container padding={{ horizontal: 16, vertical: 8 }}><Text text="OK" color={Theme.colors.primary} /></Container>
          </InkWell>
        ]}
      />
    );
  };

  return (
    <Scaffold
      appBar={
        <AppBar
          title="Wallet Details"
          centerTitle={true}
          backgroundColor={Theme.colors.surface}
          elevation={0}
        />
      }
    >
      <Container color={Theme.colors.background}>
        <SingleChildScrollView>
          <Padding padding={20}>
            <Column crossAxisAlignment="start">
              {wallet ? (
                <Column crossAxisAlignment="start">
                  {/* Basic Info */}
                  <Card padding={20}>
                    <Row crossAxisAlignment="center">
                      <Container
                        width={48}
                        height={48}
                        decoration={{ color: Theme.colors.primaryLight + '33', borderRadius: 24 }}
                        alignment="center"
                        margin={{ right: 16 }}
                      >
                        <Icon name="account_balance_wallet" color={Theme.colors.primary} size={28} />
                      </Container>
                      <Expanded>
                        <Column crossAxisAlignment="start">
                          <Text text={wallet.name} fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />
                          <SizedBox height={4} />
                          <Text text={wallet.address} color={Theme.colors.textSecondary} fontSize={14} maxLines={1} overflow="ellipsis" />
                        </Column>
                      </Expanded>
                    </Row>
                  </Card>

                  <SizedBox height={24} />
                  <Text text="Multi-chain Addresses" fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />
                  <SizedBox height={12} />

                  <Card padding={0}>
                    <Column>
                      {ChainRegistry.list().map((chain, index) => (
                        <Column key={chain.id}>
                          <Padding padding={16}>
                            <Column crossAxisAlignment="start">
                              <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                                <Text text={chain.name} fontSize={14} color={Theme.colors.textSecondary} fontWeight="bold" />
                                <InkWell onTap={() => handleCopy(wallet?.addresses?.[chain.id] || wallet?.address || '')}>
                                  <Icon name="content_copy" size={16} color={Theme.colors.primary} />
                                </InkWell>
                              </Row>
                              <SizedBox height={4} />
                              <Text
                                text={wallet?.addresses?.[chain.id] || wallet?.address || 'Not Generated'}
                                fontSize={14}
                                color={Theme.colors.textPrimary}
                                maxLines={2}
                              />
                            </Column>
                          </Padding>
                          {index < ChainRegistry.list().length - 1 && (
                            <Container height={1} color={Theme.colors.divider} />
                          )}
                        </Column>
                      ))}
                    </Column>
                  </Card>

                  <SizedBox height={24} />
                  <Text text="Security" fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />
                  <SizedBox height={12} />

                  {/* Mnemonic Section */}
                  <Card padding={16}>
                    <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                      <Expanded>
                        <Column crossAxisAlignment="start">
                          <Text text="Mnemonic Phrase" fontWeight="bold" fontSize={16} color={Theme.colors.textPrimary} />
                          <SizedBox height={8} />
                          <Text
                            text={
                              showMnemonic ? (secret?.mnemonic || 'None') : '******** ******** ******** ********'
                            }
                            color={Theme.colors.textSecondary}
                            fontSize={14}
                          />
                        </Column>
                      </Expanded>
                      <ThemeButton
                        text={showMnemonic ? 'Hide' : 'Show'}
                        onTap={() => (showMnemonic ? setShowMnemonic(false) : confirmReveal('mnemonic'))}
                        variant="text"
                      />
                    </Row>
                  </Card>

                  <SizedBox height={12} />

                  {/* Private Key Section */}
                  <Card padding={16}>
                    <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
                      <Expanded>
                        <Column crossAxisAlignment="start">
                          <Text text="Private Key" fontWeight="bold" fontSize={16} color={Theme.colors.textPrimary} />
                          <SizedBox height={8} />
                          {showPrivateKey ? (
                            <Column>
                              {Object.entries(secret?.privateKeys || {}).map(([k, v]) => (
                                <Column key={k}>
                                  <Text text={`${k.toUpperCase()}:`} fontSize={12} color={Theme.colors.textSecondary} fontWeight="bold" />
                                  <Text text={v} color={Theme.colors.textPrimary} fontSize={12} />
                                  <SizedBox height={4} />
                                </Column>
                              ))}
                              {(!secret?.privateKeys || Object.keys(secret?.privateKeys).length === 0) && <Text text="None" color={Theme.colors.textSecondary} />}
                            </Column>
                          ) : (
                            <Text text="0x********************************" color={Theme.colors.textSecondary} fontSize={14} />
                          )}
                        </Column>
                      </Expanded>
                      <ThemeButton
                        text={showPrivateKey ? 'Hide' : 'Show'}
                        onTap={() => (showPrivateKey ? setShowPrivateKey(false) : confirmReveal('privateKey'))}
                        variant="text"
                      />
                    </Row>
                  </Card>

                  <SizedBox height={40} />
                  <ThemeButton
                    text="Delete Wallet"
                    variant="danger"
                    onTap={handleDelete}
                    fullWidth
                    icon="delete"
                  />
                  <SizedBox height={20} />
                </Column>
              ) : (
                <Center><Text text="Wallet Not Found" color={Theme.colors.textSecondary} /></Center>
              )}
            </Column>
          </Padding>
        </SingleChildScrollView>
      </Container>
    </Scaffold>
  );
}

function RiskRevealDialog({ type }: { type: 'mnemonic' | 'privateKey' }) {
  const navigator = useNavigator();
  const onCancel = () => navigator.pop(false);
  const onOk = () => navigator.pop(true);
  return (
    <AlertDialog
      title={<Text text="Risk Warning" fontWeight="bold" color={Theme.colors.textPrimary} />}
      content={
        <Column crossAxisAlignment="start" mainAxisSize="min">
          <Text text={type === 'mnemonic' ? 'Revealing mnemonic phrase exposes full control. Ensure you are in a safe environment.' : 'Revealing private key exposes funds control. Ensure you are in a safe environment.'} color={Theme.colors.textPrimary} />
          <Container height={12} />
          <Text text="Do not screenshot or share. We do not store this information." color={Theme.colors.error} />
        </Column>
      }
      actions={[
        <InkWell onTap={onCancel}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Cancel" color={Theme.colors.textSecondary} />
          </Container>
        </InkWell>,
        <InkWell onTap={onOk}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Confirm Reveal" color={Theme.colors.error} fontWeight="bold" />
          </Container>
        </InkWell>,
      ]}
    />
  );
}

