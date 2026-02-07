import React, { useState, useRef } from "react";
import { Scaffold, BottomNavigationBar, BottomNavigationBarItem, Icon, PageView } from "fuickjs";
import { WalletInfo } from "../../services/WalletManager";
import HomePage from "./HomePage";
import MarketPage from "./MarketPage";
import WalletHomePage from "./WalletHomePage";
import { Theme } from "../../theme";

export default function MainTabsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pageViewRef = useRef<PageView>(null);

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
