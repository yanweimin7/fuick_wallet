import React, { useState } from "react";
import {
  AppBar,
  Column,
  Scaffold,
  useNavigator,
  Container,
  Text,
  Padding,
  SizedBox,
  SingleChildScrollView,
} from "fuickjs";
import { WalletManager } from "../../services/WalletManager";
import { Theme } from "../../theme";
import { ThemeButton, ThemeInput, Card } from "../../components/common";
import { PasswordService } from "../../services/PasswordService";
import { SetPasswordDialog } from "../../components/PasswordDialogs";

export default function ImportWalletPage(props: { nextPath?: string }) {
  const navigator = useNavigator();
  const [name, setName] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!mnemonic) {
      setError("请输入助记词");
      return;
    }

    let password = "";
    const isSet = await PasswordService.isPasswordSet();
    if (!isSet) {
      // @ts-ignore
      const res = await navigator.showDialog(<SetPasswordDialog />);
      if (!res) return;
      password = res as string;
    } else {
      // 先显示加载状态，再验证身份
      setLoading(true);
      setError("");

      // 验证身份（生物识别或密码），获取加密密钥
      const encryptionKey = await PasswordService.getEncryptionKey(navigator);
      if (!encryptionKey) {
        setLoading(false);
        return;
      }

      // 使用加密密钥导入钱包（不需要密码）
      WalletManager.getInstance()
        .importWallet(name || undefined, mnemonic, encryptionKey)
        .then(async (wallet) => {
          setLoading(false);
          const hasAddresses =
            wallet &&
            wallet.addresses &&
            Object.keys(wallet.addresses).length > 0;
          if (hasAddresses) {
            // Navigate to wallet home or show success
            console.log("Wallet imported:", wallet);
            if (props.nextPath) {
              // @ts-ignore
              navigator.pushReplace(props.nextPath, wallet);
            } else {
              navigator.pop(wallet);
            }
          } else {
            setError("无效的助记词或导入失败");
          }
        })
        .catch((e) => {
          console.error("Import failed", e);
          setLoading(false);
          setError("导入失败: " + (e.message || "未知错误"));
        });
      return;
    }

    setLoading(true);
    setError("");

    WalletManager.getInstance()
      .importWallet(name || undefined, mnemonic, password)
      .then(async (wallet) => {
        setLoading(false);
        const hasAddresses =
          wallet &&
          wallet.addresses &&
          Object.keys(wallet.addresses).length > 0;
        if (hasAddresses) {
          // Navigate to wallet home or show success
          console.log("Wallet imported:", wallet);
          if (props.nextPath) {
            // @ts-ignore
            navigator.pushReplace(props.nextPath, wallet);
          } else {
            navigator.pop(wallet);
          }
        } else {
          setError("无效的助记词或导入失败");
        }
      })
      .catch((e) => {
        console.error("Import failed", e);
        setLoading(false);
        setError("导入失败: " + (e.message || "未知错误"));
      });
  };

  return (
    <Scaffold
      backgroundColor={Theme.colors.background}
      appBar={
        <AppBar title="导入钱包" backgroundColor={Theme.colors.background} foregroundColor={Theme.colors.textPrimary} />
      }
    >
      <Container color={Theme.colors.background}>
        <SingleChildScrollView>
          <Padding padding={Theme.spacing.m}>
            <Card padding={Theme.spacing.l}>
              <Column crossAxisAlignment="start">
                <Text
                  text="导入已有钱包"
                  fontSize={20}
                  fontWeight="bold"
                  color={Theme.colors.textPrimary}
                />
                <SizedBox height={8} />
                <Text
                  text="输入您的助记词来恢复钱包"
                  color={Theme.colors.textSecondary}
                />
                <SizedBox height={24} />

                <ThemeInput
                  label="钱包名称（可选）"
                  value={name}
                  onChanged={(val) => setName(val)}
                  hint="例如：我的储蓄"
                />
                <SizedBox height={20} />

                <ThemeInput
                  label="助记词"
                  value={mnemonic}
                  onChanged={(val) => setMnemonic(val)}
                  hint="用空格分隔单词"
                  maxLines={3}
                />

                <SizedBox height={20} />
                {error ? (
                  <Text text={error} color={Theme.colors.error} />
                ) : null}
                <SizedBox height={20} />

                <ThemeButton
                  text={loading ? "导入中..." : "导入钱包"}
                  onTap={loading ? () => {} : handleImport}
                  loading={loading}
                  fullWidth
                />
              </Column>
            </Card>
          </Padding>
        </SingleChildScrollView>
      </Container>
    </Scaffold>
  );
}
