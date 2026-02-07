import React from "react";
import {
  Router,
  Runtime,
  setGlobalErrorFallback,
  Column,
  Text,
  Container,
  Button,
  GenericPage,
} from "fuickjs";
import OnboardingPage from "./pages/OnboardingPage";
import BootstrapPage from "./pages/BootstrapPage";
import CreateWalletPage from "./pages/wallet/CreateWalletPage";
import ImportWalletPage from "./pages/wallet/ImportWalletPage";
import WalletHomePage from "./pages/wallet/WalletHomePage";
import MainTabsPage from "./pages/wallet/MainTabsPage";
import WalletListPage from "./pages/wallet/WalletListPage";

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

export function initApp() {
  try {
    Runtime.bindGlobals();

    // Set global error fallback during initialization
    setGlobalErrorFallback(CustomErrorUI);

    // Router Registration
    // @ts-ignore
    Router.register("/", (args) => React.createElement(BootstrapPage, args as any));
    // @ts-ignore
    Router.register("/wallet/onboarding", (args) => React.createElement(OnboardingPage, args as any));
    // @ts-ignore
    Router.register("/wallet/create", (args) => React.createElement(CreateWalletPage, args as any));
    // @ts-ignore
    Router.register("/wallet/import", (args) => React.createElement(ImportWalletPage, args as any));
    // @ts-ignore
    Router.register("/wallet/home", (args) => React.createElement(MainTabsPage, args as any));
    // @ts-ignore
    Router.register("/wallet/list", (args) => React.createElement(WalletListPage, args as any));
    // @ts-ignore
    Router.register("/_generic_dialog", (args) => React.createElement(GenericPage, args as any));
    // @ts-ignore
    Router.register("/wallet/detail", (args) => React.createElement(WalletHomePage, args as any));

    console.log("Wallet App Initialized");
  } catch (e) {
    console.error("Failed to init app", e);
  }
}
