import React, { useState, useEffect } from "react";
import { Center, Scaffold, CircularProgressIndicator } from "fuickjs";
import OnboardingPage from "./OnboardingPage";
import MainTabsPage from "./wallet/MainTabsPage";
import { WalletManager } from "../services/WalletManager";

export default function HomeProxyPage() {
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);

  useEffect(() => {
    WalletManager.getInstance()
      .init()
      .then(() => {
        const wallets = WalletManager.getInstance().getWallets();
        setHasWallet(wallets.length > 0);
      })
      .catch((e) => {
        console.error("[HomeProxyPage] WalletManager init failed:", e);
        setHasWallet(false);
      });
  }, []);

  if (hasWallet === null) {
    return (
      <Scaffold>
        <Center>
          <CircularProgressIndicator />
        </Center>
      </Scaffold>
    );
  }

  if (!hasWallet) {
    return <OnboardingPage />;
  }

  return <MainTabsPage />;
}
