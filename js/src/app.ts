import {
  Router,
  Runtime,
  setGlobalErrorFallback,
  Container,
  Column,
  Text,
  Button,
} from "fuickjs";
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
    { color: "#E0F7FA" },
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
        color: "#006064",
        fontWeight: "bold",
        margin: { bottom: 16 },
      }),
      React.createElement(
        Container,
        {
          padding: 12,
          decoration: {
            color: "#FFFFFF",
            borderRadius: 8,
            border: { width: 1, color: "#B2EBF2" },
          },
          margin: { bottom: 20 },
        },
        React.createElement(Text, {
          text: error?.message || "Unknown Error",
          fontSize: 14,
          color: "#00838F",
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

    Router.register("/", (args) => {
      return React.createElement(HomeProxyPage, cast(args));
    });
    Router.register("/wallet/onboarding", (args) =>
      React.createElement(OnboardingPage, cast(args)),
    );
    Router.register("/wallet/create", (args) =>
      React.createElement(CreateWalletPage, cast(args)),
    );
    Router.register("/wallet/import", (args) =>
      React.createElement(ImportWalletPage, cast(args)),
    );
    Router.register("/wallet/home", (args) =>
      React.createElement(MainTabsPage, cast(args)),
    );
    Router.register("/wallet/list", (args) =>
      React.createElement(WalletListPage, cast(args)),
    );
    Router.register("/wallet/detail", (args) =>
      React.createElement(WalletDetailPage, cast(args)),
    );
    Router.register("/wallet/receive", (args) =>
      React.createElement(ReceivePage, cast(args)),
    );
    Router.register("/wallet/send", (args) =>
      React.createElement(SendPage, cast(args)),
    );
    Router.register("/wallet/chain_select", (args) =>
      React.createElement(ChainSelectPage, cast(args)),
    );
    Router.register("/wallet/add_token", (args) =>
      React.createElement(AddTokenPage, cast(args)),
    );
    Router.register("/wallet/scan_tokens", (args) =>
      React.createElement(ScanTokensPage, cast(args)),
    );
    Router.register("/wallet/dapp_discover", (args) =>
      React.createElement(DAppDiscoverPage, cast(args)),
    );
    Router.register("/wallet/dapp_browser", (args) =>
      React.createElement(DAppBrowserPage, cast(args)),
    );

    console.log("Wallet App Initialized");
  } catch (e) {
    console.error("Failed to init app", e);
  }
}
