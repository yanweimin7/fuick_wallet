import React, { useState } from "react";
import { Scaffold, BottomNavigationBar, BottomNavigationBarItem, Icon, useNavigator } from "fuickjs";
import { WalletInfo } from "../../services/WalletManager";
import HomePage from "./HomePage";
import MarketPage from "./MarketPage";
import WalletHomePage from "./WalletHomePage";

export default function MainTabsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const pages = [
    <HomePage />,
    <MarketPage />,
    <WalletHomePage />
  ];

  return (
    <Scaffold
      bottomNavigationBar={
        <BottomNavigationBar
          currentIndex={currentIndex}
          onTap={setCurrentIndex}
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
      {pages[currentIndex]}
    </Scaffold>
  );
}
