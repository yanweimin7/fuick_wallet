import React, { useEffect, useState } from "react";
import {
  AppBar,
  Center,
  Column,
  Scaffold,
  useNavigator,
  Container,
  Text,
  CircularProgressIndicator,
  Padding,
  SizedBox,
  Expanded,
} from "fuickjs";
import { WalletManager } from "../../services/WalletManager";
import { Theme } from "../../theme";
import { ThemeButton, Card } from "../../components/common";
import { PasswordService } from "../../services/PasswordService";

export default function CreateWalletPage(props: { nextPath?: string }) {
  const navigator = useNavigator();
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"verifying" | "creating" | "">("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 确保组件已挂载
    setIsReady(true);

    const createAndNavigate = async () => {
      try {
        let encryptionKey: string | null = null;
        const isSet = await PasswordService.isPasswordSet();
        console.log("[CreateWallet] isPasswordSet:", isSet);

        if (!isSet) {
          // 首次创建钱包，需要设置密码
          const password = await PasswordService.setPassword(navigator);
          if (!password) {
            navigator.pop();
            return;
          }
          // 设置密码后，开始显示创建中
          setStatus("creating");
          encryptionKey = await PasswordService.initEncryptionKey(password);
          if (!encryptionKey) {
            setError("初始化加密密钥失败");
            return;
          }
        } else {
          // 已有钱包，先验证密码（不显示创建中）
          encryptionKey = await PasswordService.getEncryptionKey(navigator);
          if (!encryptionKey) {
            navigator.pop();
            return;
          }
          // 验证完成后，开始显示创建中
          setStatus("creating");
        }

        const w = await WalletManager.getInstance().createWallet(encryptionKey);
        if (w) {
          if (props.nextPath) {
            navigator.pushReplace(props.nextPath, w);
          } else {
            navigator.pop(w);
          }
        } else {
          setError("创建钱包失败");
        }
      } catch (e: any) {
        console.error("Failed to create wallet", e);
        setError("Failed: " + (e.message || e.toString()));
      }
    };

    // 延迟执行以确保渲染完成
    const timer = setTimeout(() => {
      createAndNavigate();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 初始加载状态
  if (!isReady) {
    return (
      <Scaffold
        backgroundColor={Theme.colors.background}
        appBar={
          <AppBar
            title="创建钱包"
            backgroundColor={Theme.colors.background}
            foregroundColor={Theme.colors.textPrimary}
          />
        }
      >
        <Column mainAxisAlignment="center" crossAxisAlignment="center">
          <Expanded>
            <Center>
              <CircularProgressIndicator color={Theme.colors.primary} />
              <SizedBox height={Theme.spacing.l} />
              <Text
                text="加载中..."
                color={Theme.colors.textSecondary}
                fontSize={14}
              />
            </Center>
          </Expanded>
        </Column>
      </Scaffold>
    );
  }

  if (error) {
    return (
      <Scaffold
        backgroundColor={Theme.colors.background}
        appBar={
          <AppBar
            title="Error"
            backgroundColor={Theme.colors.background}
            foregroundColor={Theme.colors.textPrimary}
          />
        }
      >
        <Column mainAxisAlignment="center" crossAxisAlignment="center">
          <Expanded>
            <Center>
              <Padding padding={Theme.spacing.l}>
                <Column mainAxisAlignment="center" crossAxisAlignment="center">
                  <Container
                    width={64}
                    height={64}
                    decoration={{
                      color: Theme.colors.error + "1A",
                      borderRadius: 32,
                    }}
                    alignment="center"
                  >
                    <Text
                      text="!"
                      color={Theme.colors.error}
                      fontSize={32}
                      fontWeight="bold"
                    />
                  </Container>
                  <SizedBox height={Theme.spacing.m} />
                  <Text
                    text={error}
                    color={Theme.colors.error}
                    textAlign="center"
                  />
                  <SizedBox height={Theme.spacing.l} />
                  <ThemeButton
                    text="返回"
                    onTap={() => navigator.pop()}
                    variant="secondary"
                  />
                </Column>
              </Padding>
            </Center>
          </Expanded>
        </Column>
      </Scaffold>
    );
  }

  // 验证密码阶段 - 显示空白或简单提示
  if (status === "") {
    console.log("[CreateWallet] Rendering status=empty, showing preparing UI");
    return (
      <Scaffold
        backgroundColor={Theme.colors.background}
        appBar={
          <AppBar
            title="创建钱包"
            backgroundColor={Theme.colors.background}
            foregroundColor={Theme.colors.textPrimary}
          />
        }
      >
        <Column mainAxisAlignment="center" crossAxisAlignment="center">
          <Expanded>
            <Center>
              <Column mainAxisAlignment="center" crossAxisAlignment="center">
                <CircularProgressIndicator color={Theme.colors.primary} />
                <SizedBox height={Theme.spacing.l} />
                <Text
                  text="准备中..."
                  color={Theme.colors.textSecondary}
                  fontSize={14}
                />
              </Column>
            </Center>
          </Expanded>
        </Column>
      </Scaffold>
    );
  }

  // 创建钱包阶段
  return (
    <Scaffold
      backgroundColor={Theme.colors.background}
      appBar={
        <AppBar
          title="创建钱包"
          backgroundColor={Theme.colors.surface}
          foregroundColor={Theme.colors.textPrimary}
        />
      }
    >
      <Column mainAxisAlignment="center" crossAxisAlignment="center">
        <Expanded>
          <Center>
            <Column mainAxisAlignment="center" crossAxisAlignment="center">
              <CircularProgressIndicator color={Theme.colors.primary} />
              <SizedBox height={Theme.spacing.l} />
              <Text
                text="正在创建安全钱包..."
                color={Theme.colors.textPrimary}
                fontSize={16}
              />
              <SizedBox height={Theme.spacing.s} />
              <Text
                text="请稍候"
                color={Theme.colors.textSecondary}
                fontSize={14}
              />
            </Column>
          </Center>
        </Expanded>
      </Column>
    </Scaffold>
  );
}
