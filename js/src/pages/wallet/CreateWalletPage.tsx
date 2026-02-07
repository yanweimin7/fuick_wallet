import React, { useEffect, useState } from "react";
import { AppBar, Center, Column, Scaffold, useNavigator, Container, Text, CircularProgressIndicator, Padding, SizedBox } from "fuickjs";
import { WalletService } from "../../services/WalletService";
import { WalletManager } from "../../services/WalletManager";
import { Theme } from "../../theme";
import { ThemeButton, Card } from "../../components/common";
import { PasswordService } from "../../services/PasswordService";
import { SetPasswordDialog, VerifyPasswordDialog } from "../../components/PasswordDialogs";

export default function CreateWalletPage(props: { nextPath?: string }) {
  const navigator = useNavigator();
  const [error, setError] = useState("");

  useEffect(() => {
    // Debug: Check connectivity
    WalletService.ping().then(res => console.log("Wallet Service Ping:", res)).catch(e => console.error("Wallet Service Ping Failed:", e));

    const createAndNavigate = async () => {
      try {
        let password = "";
        const isSet = await PasswordService.isPasswordSet();
        if (!isSet) {
          // @ts-ignore
          const res = await navigator.showDialog(<SetPasswordDialog />);
          if (!res) {
            navigator.pop();
            return;
          }
          password = res as string;
        } else {
          // Always ask for password since we don't cache it
          // @ts-ignore
          const res = await navigator.showDialog(<VerifyPasswordDialog />);
          if (!res) {
            navigator.pop();
            return;
          }
          password = res as string;
        }

        const w = await WalletManager.getInstance().createWallet(password);
        if (w) {
          // 延迟一点跳转，让用户看到完成状态（可选，或者直接跳）
          if (props.nextPath) {
            // @ts-ignore
            (navigator as any).pushReplace(props.nextPath, w);
          } else {
            navigator.pop(w);
          }
        } else {
          setError("Wallet creation returned null");
        }
      } catch (e: any) {
        console.error("Failed to create wallet", e);
        setError("Failed: " + (e.message || e.toString()));
      }
    };

    createAndNavigate();
  }, []);

  if (error) {
    return (
      <Scaffold appBar={<AppBar title="Error" backgroundColor={Theme.colors.surface} foregroundColor={Theme.colors.textPrimary} />}>
        <Center>
          <Padding padding={Theme.spacing.l}>
            <Column mainAxisAlignment="center" crossAxisAlignment="center">
              <Container
                width={64}
                height={64}
                decoration={{ color: Theme.colors.error + '1A', borderRadius: 32 }}
                alignment="center"
              >
                <Text text="!" color={Theme.colors.error} fontSize={32} fontWeight="bold" />
              </Container>
              <SizedBox height={Theme.spacing.m} />
              <Text text={error} color={Theme.colors.error} textAlign="center" />
              <SizedBox height={Theme.spacing.l} />
              <ThemeButton text="Retry" onTap={() => navigator.pop()} variant="outline" />
            </Column>
          </Padding>
        </Center>
      </Scaffold>
    );
  }

  return (
    <Scaffold appBar={<AppBar title="Creating Wallet" backgroundColor={Theme.colors.surface} foregroundColor={Theme.colors.textPrimary} />}>
      <Center>
        <Column mainAxisAlignment="center" crossAxisAlignment="center">
          <CircularProgressIndicator color={Theme.colors.primary} />
          <SizedBox height={24} />
          <Text text="Creating your secure wallet..." fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />
          <SizedBox height={8} />
          <Text text="This may take a few seconds." fontSize={14} color={Theme.colors.textSecondary} />
        </Column>
      </Center>
    </Scaffold>
  );
}

