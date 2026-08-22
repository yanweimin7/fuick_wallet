import React, { useState, useEffect } from "react";
import {
  Scaffold,
  AppBar,
  ListView,
  Image,
  useNavigator,
  Text,
  Container,
  InkWell,
  Column,
  Row,
  Padding,
  Expanded,
} from "fuickjs";
import { WalletManager, WalletInfo } from "../../services/WalletManager";
import { PasswordService } from "../../services/PasswordService";
import WalletDeleteDialog from "./WalletDeleteDialog";
import WalletClearDialog from "./WalletClearDialog";
import { Theme } from "../../theme";
import { Card, ThemeButton } from "../../components/common";
import { Icons } from "../../assets/icons";

export default function WalletListPage(props: {
  onClose?: (wallet?: WalletInfo) => void;
  presentation?: string;
}) {
  const navigator = useNavigator();
  const navigatorAny = navigator as any;
  const [wallets, setWallets] = useState<WalletInfo[]>([]);

  const isModal = props.onClose || props.presentation === "bottomSheet";

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = () => {
    setWallets([...WalletManager.getInstance().getWallets()]);
  };

  const handleSelect = (wallet: WalletInfo) => {
    console.log("handleSelect called", wallet, "onClose:", props.onClose);
    if (props.onClose) {
      console.log("calling props.onClose");
      props.onClose(wallet);
    } else {
      navigator.pop(wallet);
    }
  };

  const handleCreate = async () => {
    const result = await navigator.push("/wallet/create");
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
    const result = await navigator.push("/wallet/import");
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
    // 先显示确认对话框（不需要密钥）
    const confirmed = await navigatorAny.showDialog(
      <WalletDeleteDialog wallet={wallet} />,
    );
    if (!confirmed) return;

    // 验证身份（生物识别或密码）
    const encryptionKey = await PasswordService.getEncryptionKey(navigatorAny);
    if (!encryptionKey) return;

    try {
      await WalletManager.getInstance().deleteWallet(wallet.id, encryptionKey);
      loadWallets();
    } catch (e) {
      console.error("Failed to delete wallet:", e);
    }
  };

  const content = (
    <Column>
      <Expanded>
        <Container color={Theme.colors.background}>
          <Column>
            <Container height={1} color={Theme.colors.divider} />
            <Expanded>
              <ListView
                padding={{ top: 16, left: 16, right: 16, bottom: 16 }}
                itemCount={wallets.length}
                itemBuilder={(index: number) => {
                  const w = wallets[index];
                  return (
                    <Padding padding={{ bottom: 12 }}>
                      <Card padding={16} onTap={() => handleSelect(w)}>
                        <Row
                          mainAxisAlignment="spaceBetween"
                          crossAxisAlignment="center"
                        >
                          <Expanded>
                            <Column crossAxisAlignment="start">
                              <Text
                                text={w.name}
                                fontSize={16}
                                fontWeight="bold"
                                color={Theme.colors.textPrimary}
                              />
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
                              <Image
                                url={Icons.delete}
                                tintColor={Theme.colors.primary}
                                width={20}
                                height={20}
                                fit="contain"
                              />
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
        </Container>
      </Expanded>
      <Container
        padding={20}
        decoration={{
          color: Theme.colors.surface,
          boxShadow: Theme.shadows.medium,
        }}
      >
        <Row>
          <Expanded>
            <ThemeButton text="创建" onTap={handleCreate} icon="add" />
          </Expanded>
          <Container width={16} />
          <Expanded>
            <ThemeButton
              text="导入"
              onTap={handleImport}
              variant="secondary"
              icon="file_download"
            />
          </Expanded>
        </Row>
        {wallets.length > 0 && (
          <Container margin={{ top: 12 }} alignment="center">
            <InkWell onTap={handleClearAll}>
              <Text
                text="清除所有钱包"
                color={Theme.colors.error}
                fontSize={14}
              />
            </InkWell>
          </Container>
        )}
      </Container>
    </Column>
  );

  if (isModal) {
    return content;
  }

  return (
    <Scaffold backgroundColor={Theme.colors.background}
      appBar={
        <AppBar
          title="我的钱包"
          backgroundColor={Theme.colors.background}
          foregroundColor={Theme.colors.textPrimary}
          elevation={0}
        />
      }
    >
      {content}
    </Scaffold>
  );
}
