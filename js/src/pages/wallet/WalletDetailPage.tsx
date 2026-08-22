/* eslint-disable react/jsx-key */
import React, { useState } from "react";
import {
  AppBar,
  AlertDialog,
  Column,
  Container,
  Image,
  InkWell,
  Padding,
  Row,
  Scaffold,
  Text,
  useNavigator,
  SingleChildScrollView,
  Expanded,
  Center,
  SizedBox,
  ClipboardService,
} from "fuickjs";
import { ChainRegistry } from "../../services/ChainRegistry";
import {
  WalletInfo,
  WalletManager,
  WalletSecret,
} from "../../services/WalletManager";
import WalletDeleteDialog from "./WalletDeleteDialog";
import { Theme } from "../../theme";
import { ThemeButton, Card } from "../../components/common";
import { PasswordService } from "../../services/PasswordService";
import {
  SetPasswordDialog,
  VerifyPasswordDialog,
} from "../../components/PasswordDialogs";
import { Icons } from "../../assets/icons";
import RiskRevealDialog from "../../components/RiskRevealDialog";

export default function WalletDetailPage({ walletId }: { walletId?: string }) {
  const navigator = useNavigator();
  const wm = WalletManager.getInstance();
  const id = walletId || wm.getWallets()[0]?.id;
  const initialWallet = id ? wm.getWallet(id) : null;
  const [wallet, setWallet] = useState<WalletInfo | null>(
    initialWallet || null,
  );
  const [secret, setSecret] = useState<WalletSecret | null>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const confirmReveal = async (type: "mnemonic" | "privateKey") => {
    // 先显示风险提示对话框（不需要密钥）
    const ok = await navigator.showDialog(
      React.createElement(RiskRevealDialog, { type }),
    );
    if (!ok) return;
    if (!wallet) return;

    // 获取加密密钥（通过密码或生物识别）
    let encryptionKey = await PasswordService.getEncryptionKey(navigator);
    if (!encryptionKey) return;

    try {
      const s = await WalletManager.getInstance().getSecret(
        wallet.id,
        encryptionKey,
      );

      // 立即清除加密密钥
      // @ts-expect-error - 强制清除内存中的密钥
      encryptionKey = null;

      if (s) {
        setSecret(s);
        if (type === "mnemonic") setShowMnemonic(true);
        if (type === "privateKey") setShowPrivateKey(true);
      }
    } catch (e) {
      console.error("Failed to get secret:", e);
    }
  };

  const handleDelete = async () => {
    if (!wallet) return;

    // 验证身份（生物识别或密码）
    const encryptionKey = await PasswordService.getEncryptionKey(navigator);
    if (!encryptionKey) return;

    const confirmed = await navigator.showDialog(
      React.createElement(WalletDeleteDialog, { wallet }),
    );
    if (confirmed) {
      await WalletManager.getInstance().deleteWallet(wallet.id, encryptionKey);
      navigator.pop(true);
    }
  };

  const handleCopy = async (text: string) => {
    await ClipboardService.setData(text);
    navigator.showDialog(
      <AlertDialog
        backgroundColor={Theme.colors.surface}
        title={
          <Text
            text="已复制"
            fontWeight="bold"
            fontSize={18}
            color={Theme.colors.textPrimary}
          />
        }
        content={
          <Text
            text={`地址已复制到剪贴板`}
            color={Theme.colors.textSecondary}
          />
        }
        actions={[
          <InkWell onTap={() => navigator.pop()}>
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text text="OK" color={Theme.colors.primary} />
            </Container>
          </InkWell>,
        ]}
      />,
    );
  };

  return (
    <Scaffold
      backgroundColor={Theme.colors.background}
      appBar={
        <AppBar
          title={<Text text="钱包详情" color={Theme.colors.textPrimary} />}
          centerTitle={true}
          backgroundColor={Theme.colors.background}
          foregroundColor={Theme.colors.textPrimary}
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
                        decoration={{
                          color: Theme.colors.accent + "22" + "33",
                          borderRadius: 24,
                        }}
                        alignment="center"
                        margin={{ right: 16 }}
                      >
                        <Image
                          url={Icons.wallet}
                          width={28}
                          height={28}
                          fit="contain"
                        />
                      </Container>
                      <Expanded>
                        <Column crossAxisAlignment="start">
                          <Text
                            text={wallet.name}
                            fontWeight="bold"
                            fontSize={18}
                            color={Theme.colors.textPrimary}
                          />
                          <SizedBox height={4} />
                          <Text
                            text={wallet.address}
                            color={Theme.colors.textSecondary}
                            fontSize={14}
                            maxLines={1}
                            overflow="ellipsis"
                          />
                        </Column>
                      </Expanded>
                    </Row>
                  </Card>

                  <SizedBox height={24} />
                  <Text
                    text="多链地址"
                    fontWeight="bold"
                    fontSize={18}
                    color={Theme.colors.textPrimary}
                  />
                  <SizedBox height={12} />

                  <Card padding={0}>
                    <Column>
                      {ChainRegistry.list().map((chain, index) => (
                        <Column key={chain.id}>
                          <Padding padding={16}>
                            <Column crossAxisAlignment="start">
                              <Row
                                mainAxisAlignment="spaceBetween"
                                crossAxisAlignment="center"
                              >
                                <Text
                                  text={chain.name}
                                  fontSize={14}
                                  color={Theme.colors.textSecondary}
                                  fontWeight="bold"
                                />
                                <InkWell
                                  onTap={() =>
                                    handleCopy(
                                      wallet?.addresses?.[chain.id] ||
                                        wallet?.address ||
                                        "",
                                    )
                                  }
                                >
                                  <Image
                                    url={Icons.copy}
                                    width={16}
                                    height={16}
                                    fit="contain"
                                  />
                                </InkWell>
                              </Row>
                              <SizedBox height={4} />
                              <Text
                                text={
                                  wallet?.addresses?.[chain.id] ||
                                  wallet?.address ||
                                  "未生成"
                                }
                                fontSize={14}
                                color={Theme.colors.textPrimary}
                                maxLines={2}
                              />
                            </Column>
                          </Padding>
                          {index < ChainRegistry.list().length - 1 && (
                            <Container
                              height={1}
                              color={Theme.colors.divider}
                            />
                          )}
                        </Column>
                      ))}
                    </Column>
                  </Card>

                  <SizedBox height={24} />
                  <Text
                    text="安全"
                    fontWeight="bold"
                    fontSize={18}
                    color={Theme.colors.textPrimary}
                  />
                  <SizedBox height={12} />

                  {/* Mnemonic Section */}
                  <Card padding={16}>
                    <Row
                      mainAxisAlignment="spaceBetween"
                      crossAxisAlignment="center"
                    >
                      <Expanded>
                        <Column crossAxisAlignment="start">
                          <Text
                            text="助记词"
                            fontWeight="bold"
                            fontSize={16}
                            color={Theme.colors.textPrimary}
                          />
                          <SizedBox height={8} />
                          <Text
                            text={
                              showMnemonic
                                ? secret?.mnemonic || "None"
                                : "******** ******** ******** ********"
                            }
                            color={Theme.colors.textSecondary}
                            fontSize={14}
                          />
                        </Column>
                      </Expanded>
                      <ThemeButton
                        text={showMnemonic ? "Hide" : "Show"}
                        onTap={() =>
                          showMnemonic
                            ? setShowMnemonic(false)
                            : confirmReveal("mnemonic")
                        }
                        variant="text"
                      />
                    </Row>
                  </Card>

                  <SizedBox height={12} />

                  {/* Private Key Section */}
                  <Card padding={16}>
                    <Row
                      mainAxisAlignment="spaceBetween"
                      crossAxisAlignment="center"
                    >
                      <Expanded>
                        <Column crossAxisAlignment="start">
                          <Text
                            text="私钥"
                            fontWeight="bold"
                            fontSize={16}
                            color={Theme.colors.textPrimary}
                          />
                          <SizedBox height={8} />
                          {showPrivateKey ? (
                            <Column>
                              {Object.entries(secret?.privateKeys || {}).map(
                                ([k, v]) => (
                                  <Column key={k}>
                                    <Text
                                      text={`${k.toUpperCase()}:`}
                                      fontSize={12}
                                      color={Theme.colors.textSecondary}
                                      fontWeight="bold"
                                    />
                                    <Text
                                      text={v}
                                      color={Theme.colors.textPrimary}
                                      fontSize={12}
                                    />
                                    <SizedBox height={4} />
                                  </Column>
                                ),
                              )}
                              {(!secret?.privateKeys ||
                                Object.keys(secret?.privateKeys).length ===
                                  0) && (
                                <Text
                                  text="无"
                                  color={Theme.colors.textSecondary}
                                />
                              )}
                            </Column>
                          ) : (
                            <Text
                              text="0x********************************"
                              color={Theme.colors.textSecondary}
                              fontSize={14}
                            />
                          )}
                        </Column>
                      </Expanded>
                      <ThemeButton
                        text={showPrivateKey ? "Hide" : "Show"}
                        onTap={() =>
                          showPrivateKey
                            ? setShowPrivateKey(false)
                            : confirmReveal("privateKey")
                        }
                        variant="text"
                      />
                    </Row>
                  </Card>

                  <SizedBox height={40} />
                  <ThemeButton
                    text="删除钱包"
                    variant="danger"
                    onTap={handleDelete}
                    fullWidth
                    icon="delete"
                  />
                  <SizedBox height={20} />
                </Column>
              ) : (
                <Center>
                  <Text text="未找到钱包" color={Theme.colors.textSecondary} />
                </Center>
              )}
            </Column>
          </Padding>
        </SingleChildScrollView>
      </Container>
    </Scaffold>
  );
}

function RiskRevealDialog({ type }: { type: "mnemonic" | "privateKey" }) {
  const navigator = useNavigator();
  const onCancel = () => navigator.pop(false);
  const onOk = () => navigator.pop(true);
  return (
    <AlertDialog
      backgroundColor={Theme.colors.surface}
      title={
        <Text
          text="风险提示"
          fontWeight="bold"
          color={Theme.colors.textPrimary}
        />
      }
      content={
        <Column crossAxisAlignment="start" mainAxisSize="min">
          <Text
            text={
              type === "mnemonic"
                ? "Revealing mnemonic phrase exposes full control. Ensure you are in a safe environment."
                : "Revealing private key exposes funds control. Ensure you are in a safe environment."
            }
            color={Theme.colors.textPrimary}
          />
          <Container height={12} />
          <Text
            text="请勿截图或分享。我们不存储此信息。"
            color={Theme.colors.error}
          />
        </Column>
      }
      actions={[
        <InkWell onTap={onCancel}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="取消" color={Theme.colors.textSecondary} />
          </Container>
        </InkWell>,
        <InkWell onTap={onOk}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text
              text="确认显示"
              color={Theme.colors.error}
              fontWeight="bold"
            />
          </Container>
        </InkWell>,
      ]}
    />
  );
}
