import React, { useEffect } from "react";
import { Center, CircularProgressIndicator, Scaffold, useNavigator } from "fuickjs";
import { WalletManager } from "../services/WalletManager";

export default function BootstrapPage() {
  const navigator = useNavigator();

  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    try {
      // Initialize wallet manager
      await WalletManager.getInstance().init();

      const wallets = WalletManager.getInstance().getWallets();
      if (wallets.length > 0) {
        // 如果有钱包，加载钱包数据并进入首页
        // MainTabsPage will handle fetching the current wallet
        (navigator as any).pushReplace("/wallet/home");
      } else {
        // 没有钱包，进入引导页
        (navigator as any).pushReplace("/wallet/onboarding", {});
      }
    } catch (e) {
      console.error("Bootstrap check failed", e);
      (navigator as any).pushReplace("/wallet/onboarding", {});
    }
  };

  return (
    <Scaffold>
      <Center>
        <CircularProgressIndicator />
      </Center>
    </Scaffold>
  );
}
