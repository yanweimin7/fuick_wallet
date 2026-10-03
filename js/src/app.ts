import {
  Router,
  Runtime,
  setGlobalErrorFallback,
  Container,
  Column,
  Text,
  Button,
} from "fuickjs";
import { Theme } from "./theme";
import { ThemeProvider } from "./components/ThemeProvider";
import OnboardingPage from "./pages/OnboardingPage";
import HomeProxyPage from "./pages/HomeProxyPage";
import CreateWalletPage from "./pages/wallet/CreateWalletPage";
import ImportWalletPage from "./pages/wallet/ImportWalletPage";
import MainTabsPage from "./pages/wallet/MainTabsPage";
import WalletListPage from "./pages/wallet/WalletListPage";
import ChainSelectPage from "./pages/wallet/ChainSelectPage";
import WalletDetailPage from "./pages/wallet/WalletDetailPage";
import ReceivePage from "./pages/wallet/ReceivePage";
import SendPage from "./pages/wallet/SendPage";
import AddTokenPage from "./pages/wallet/AddTokenPage";
import ScanTokensPage from "./pages/wallet/ScanTokensPage";
import DAppDiscoverPage from "./pages/dapp/DAppDiscoverPage";
import DAppBrowserPage from "./pages/dapp/DAppBrowserPage";
import React from "react";

// Custom Global Error UI
const CustomErrorUI = (error: Error) =>
  React.createElement(
    Container,
    { color: Theme.colors.background },
    React.createElement(
      Column,
      {
        mainAxisAlignment: "center",
        crossAxisAlignment: "center",
        padding: 30,
      },
      React.createElement(Text, {
        text: "Oops! Something went wrong",
        fontSize: 22,
        color: Theme.colors.textPrimary,
        fontWeight: "bold",
        margin: { bottom: 16 },
      }),
      React.createElement(
        Container,
        {
          padding: 12,
          decoration: {
            color: Theme.colors.surface,
            borderRadius: 8,
            border: { width: 1, color: Theme.colors.border },
          },
          margin: { bottom: 20 },
        },
        React.createElement(Text, {
          text: error?.message || "Unknown Error",
          fontSize: 14,
          color: Theme.colors.textSecondary,
          maxLines: 5,
          overflow: "ellipsis",
        }),
      ),
      React.createElement(Button, {
        text: "Retry",
        onTap: () => console.log("Retry..."),
      }),
    ),
  );

export async function initApp() {
  try {
    Runtime.configure({ prewarm: true, prewarmMs: 50, debug: true });
    Runtime.bindGlobals();

    // Set global error fallback during initialization
    setGlobalErrorFallback(CustomErrorUI);

    // Router Registration - MUST register synchronously before any Flutter render call
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cast = (args: unknown) => (args || {}) as any;

    // 统一在此处套 ThemeProvider：主题订阅只写这一处，
    // 页面组件自身不需要（也不应该）调用 useAppTheme。
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = (Component: any) => (args: unknown) =>
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(Component, cast(args)),
      );

    Router.register("/", page(HomeProxyPage));
    Router.register("/wallet/onboarding", page(OnboardingPage));
    Router.register("/wallet/create", page(CreateWalletPage));
    Router.register("/wallet/import", page(ImportWalletPage));
    Router.register("/wallet/home", page(MainTabsPage));
    Router.register("/wallet/list", page(WalletListPage));
    Router.register("/wallet/detail", page(WalletDetailPage));
    Router.register("/wallet/receive", page(ReceivePage));
    Router.register("/wallet/send", page(SendPage));
    Router.register("/wallet/chain_select", page(ChainSelectPage));
    Router.register("/wallet/add_token", page(AddTokenPage));
    Router.register("/wallet/scan_tokens", page(ScanTokensPage));
    Router.register("/wallet/dapp_discover", page(DAppDiscoverPage));
    Router.register("/wallet/dapp_browser", page(DAppBrowserPage));

    console.log("Wallet App Initialized");
  } catch (e) {
    console.error("Failed to init app", e);
  }
}
