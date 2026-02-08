import React, { useState, useRef, useEffect } from "react";
import { Scaffold, BottomNavigationBar, BottomNavigationBarItem, Icon, PageView, useNavigator, AlertDialog, Text, InkWell, Container } from "fuickjs";
import { WalletInfo } from "../../services/WalletManager";
import HomePage from "./HomePage";
import MarketPage from "./MarketPage";
import WalletHomePage from "./WalletHomePage";
import { Theme } from "../../theme";
import { LocalAuthService } from "../../services/LocalAuthService";
import { VerifyPasswordDialog } from "../../components/PasswordDialogs";

let hasCheckedBiometric = false;

export default function MainTabsPage() {
  const navigator = useNavigator();
  const [currentIndex, setCurrentIndex] = useState(0);
  const pageViewRef = useRef<PageView>(null);

  useEffect(() => {
    if (!hasCheckedBiometric) {
      hasCheckedBiometric = true;
      checkBiometric();
    }
  }, []);

  const checkBiometric = async () => {
    try {
      const available = await LocalAuthService.isBiometricAvailable();
      const enabled = await LocalAuthService.isBiometricEnabled();

      console.log(`MainTabsPage Bio Check: available=${available}, enabled=${enabled}`);

      if (available === "true" && enabled !== "true") {
        showBiometricPrompt();
      }
    } catch (e) {
      console.error("Biometric check failed", e);
    }
  };

  const showBiometricPrompt = () => {
    navigator.showDialog(
      <AlertDialog
        title={<Text text="Enable Biometric" fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />}
        content={<Text text="Would you like to use biometric authentication for faster transactions?" fontSize={14} color={Theme.colors.textSecondary} />}
        actions={[
          <InkWell onTap={() => navigator.pop()}>
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text text="No, thanks" color={Theme.colors.textSecondary} fontWeight="bold" />
            </Container>
          </InkWell>,
          <InkWell onTap={() => {
            navigator.pop();
            handleEnableBiometric();
          }}>
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text text="Enable" color={Theme.colors.primary} fontWeight="bold" />
            </Container>
          </InkWell>
        ]}
      />
    );
  };

  const handleEnableBiometric = async () => {
    // @ts-ignore
    const password = await navigator.showDialog(<VerifyPasswordDialog />);
    if (password) {
      const success = await LocalAuthService.enableBiometric(password as string);
      if (success === "true") {
        navigator.showDialog(
          <AlertDialog
            title={<Text text="Success" fontWeight="bold" color={Theme.colors.success} />}
            content={<Text text="Biometric authentication enabled!" />}
            actions={[
              <InkWell onTap={() => navigator.pop()}>
                <Container padding={{ horizontal: 16, vertical: 8 }}>
                  <Text text="OK" color={Theme.colors.primary} fontWeight="bold" />
                </Container>
              </InkWell>
            ]}
          />
        );
      } else {
        navigator.showDialog(
          <AlertDialog
            title={<Text text="Failed" fontWeight="bold" color={Theme.colors.error} />}
            content={<Text text="Failed to enable biometric authentication." />}
            actions={[
              <InkWell onTap={() => navigator.pop()}>
                <Container padding={{ horizontal: 16, vertical: 8 }}>
                  <Text text="OK" color={Theme.colors.primary} fontWeight="bold" />
                </Container>
              </InkWell>
            ]}
          />
        );
      }
    }
  };

  const handleTabTap = (index: number) => {
    setCurrentIndex(index);
    pageViewRef.current?.jumpToPage(index);
  };

  const handlePageChanged = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Scaffold
      bottomNavigationBar={
        <BottomNavigationBar
          currentIndex={currentIndex}
          onTap={handleTabTap}
          selectedItemColor={Theme.colors.primary}
          unselectedItemColor={Theme.colors.textSecondary}
          backgroundColor={Theme.colors.surface}
          items={[
            <BottomNavigationBarItem
              key="home"
              icon={<Icon name="home" />}
              label="首页"
            />,
            <BottomNavigationBarItem
              key="market"
              icon={<Icon name="show_chart" />}
              label="行情"
            />,
            <BottomNavigationBarItem
              key="assets"
              icon={<Icon name="account_balance_wallet" />}
              label="资产"
            />,
          ]}
        />
      }
    >
      <PageView
        physics='never'
        ref={pageViewRef}
        onPageChanged={handlePageChanged}
        initialPage={0}
      >
        <HomePage />
        <MarketPage />
        <WalletHomePage />
      </PageView>
    </Scaffold>
  );
}
