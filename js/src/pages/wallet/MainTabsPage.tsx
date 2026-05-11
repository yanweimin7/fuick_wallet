import React, { useState, useRef, useEffect } from "react";
import {
  Scaffold,
  BottomNavigationBar,
  BottomNavigationBarItem,
  Icon,
  PageView,
  useNavigator,
  AlertDialog,
  Text,
  InkWell,
  Container,
} from "fuickjs";
import HomePage from "./HomePage";
import MarketPage from "./MarketPage";
import WalletHomePage from "./WalletHomePage";
import { Theme } from "../../theme";
import { LocalAuthService } from "../../services/LocalAuthService";
import { DeviceInfoService } from "fuickjs";
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
      if ((await DeviceInfoService.getDeviceInfo()).isMacOS) {
        return;
      }

      const available = await LocalAuthService.isBiometricAvailable();
      const enabled = await LocalAuthService.isBiometricEnabled();

      console.log(
        `MainTabsPage Bio Check: available=${available}, enabled=${enabled}`,
      );

      if (available && !enabled) {
        showBiometricPrompt();
      }
    } catch (e) {
      console.error("Biometric check failed", e);
    }
  };

  const showBiometricPrompt = () => {
    navigator.showDialog(
      <AlertDialog
        title={
          <Text
            text="启用生物识别"
            fontWeight="bold"
            fontSize={18}
            color={Theme.colors.textPrimary}
          />
        }
        content={
          <Text
            text="是否启用生物识别认证以进行更快的交易?"
            fontSize={14}
            color={Theme.colors.textSecondary}
          />
        }
        actions={[
          <InkWell onTap={() => navigator.pop()} key="cancel">
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text
                text="不用了"
                color={Theme.colors.textSecondary}
                fontWeight="bold"
              />
            </Container>
          </InkWell>,
          // eslint-disable-next-line react/jsx-key
          <InkWell
            onTap={() => {
              navigator.pop();
              handleEnableBiometric();
            }}
          >
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text
                text="启用"
                color={Theme.colors.primary}
                fontWeight="bold"
              />
            </Container>
          </InkWell>,
        ]}
      />,
    );
  };

  const handleEnableBiometric = async () => {
    // @ts-ignore
    // VerifyPasswordDialog 现在直接返回 encryptionKey
    const encryptionKey = await navigator.showDialog(<VerifyPasswordDialog />);
    if (!encryptionKey) {
      // 用户取消或验证失败
      return;
    }

    // 用 encryptionKey 启用生物识别
    const success = await LocalAuthService.enableBiometric(encryptionKey);
    if (success) {
      navigator.showDialog(
        <AlertDialog
          title={
            <Text text="成功" fontWeight="bold" color={Theme.colors.success} />
          }
          content={<Text text="生物识别认证已启用!" />}
          actions={[
            <InkWell onTap={() => navigator.pop()} key="confirm">
              <Container padding={{ horizontal: 16, vertical: 8 }}>
                <Text
                  text="确定"
                  color={Theme.colors.primary}
                  fontWeight="bold"
                />
              </Container>
            </InkWell>,
          ]}
        />,
      );
    } else {
      navigator.showDialog(
        <AlertDialog
          title={
            <Text text="失败" fontWeight="bold" color={Theme.colors.error} />
          }
          content={<Text text="启用生物识别认证失败" />}
          actions={[
            <InkWell onTap={() => navigator.pop()} key="confirm">
              <Container padding={{ horizontal: 16, vertical: 8 }}>
                <Text
                  text="确定"
                  color={Theme.colors.primary}
                  fontWeight="bold"
                />
              </Container>
            </InkWell>,
          ]}
        />,
      );
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
        ref={pageViewRef}
        onPageChanged={handlePageChanged}
        children={[
          <HomePage key="home" />,
          <MarketPage key="market" />,
          <WalletHomePage key="assets" />,
        ]}
      />
    </Scaffold>
  );
}
