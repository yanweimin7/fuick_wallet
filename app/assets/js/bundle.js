var process=process||{env:{NODE_ENV:"production"}};if(typeof console==="undefined"){globalThis.console={log:function(){if(typeof print==='function')print([].slice.call(arguments).join(' '));},error:function(){if(typeof print==='function')print('[ERROR] '+[].slice.call(arguments).join(' '));},warn:function(){if(typeof print==='function')print('[WARN] '+[].slice.call(arguments).join(' '));},debug:function(){if(typeof print==='function')print('[DEBUG] '+[].slice.call(arguments).join(' '));}};}
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// globals:react
var require_react = __commonJS({
  "globals:react"(exports, module) {
    module.exports = globalThis.React;
  }
});

// globals:fuickjs
var require_fuickjs = __commonJS({
  "globals:fuickjs"(exports, module) {
    module.exports = globalThis.FuickFramework;
  }
});

// src/app.ts
var import_react5 = __toESM(require_react());
var import_fuickjs5 = __toESM(require_fuickjs());

// src/pages/wallet/WalletEntryPage.tsx
var import_react = __toESM(require_react());
var import_fuickjs = __toESM(require_fuickjs());
function WalletEntryPage() {
  const navigator = (0, import_fuickjs.useNavigator)();
  return /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Scaffold, { appBar: /* @__PURE__ */ import_react.default.createElement(import_fuickjs.AppBar, { title: "Fuick Wallet" }) }, /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Center, null, /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Column, { crossAxisAlignment: "center", mainAxisAlignment: "center" }, /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Button,
    {
      text: "Create New Wallet",
      onTap: () => navigator.push("/wallet/create", {})
    }
  ), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Container, { height: 20 }), /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Button,
    {
      text: "Import Wallet",
      onTap: () => navigator.push("/wallet/import", {})
    }
  ))));
}

// src/pages/wallet/CreateWalletPage.tsx
var import_react2 = __toESM(require_react());
var import_fuickjs2 = __toESM(require_fuickjs());

// src/services/WalletService.ts
var WalletService = class {
  static ping() {
    return dartCallNativeAsync("Wallet.ping", {});
  }
  static createWallet() {
    return dartCallNativeAsync("Wallet.createWallet", {});
  }
  static importWallet(mnemonic) {
    return dartCallNativeAsync("Wallet.importWallet", { mnemonic });
  }
  static getBalance(rpcUrl, address) {
    return dartCallNativeAsync("Wallet.getBalance", { rpcUrl, address });
  }
  static transfer(rpcUrl, privateKey, to, amount) {
    return dartCallNativeAsync("Wallet.transfer", { rpcUrl, privateKey, to, amount });
  }
};

// src/pages/wallet/CreateWalletPage.tsx
function CreateWalletPage() {
  const navigator = (0, import_fuickjs2.useNavigator)();
  const [wallet, setWallet] = (0, import_react2.useState)(null);
  const [loading, setLoading] = (0, import_react2.useState)(true);
  const [error, setError] = (0, import_react2.useState)("");
  (0, import_react2.useEffect)(() => {
    WalletService.ping().then((res) => console.log("Wallet Service Ping:", res)).catch((e) => console.error("Wallet Service Ping Failed:", e));
    WalletService.createWallet().then((w) => {
      if (w) {
        setWallet(w);
      } else {
        setError("Wallet creation returned null");
      }
      setLoading(false);
    }).catch((e) => {
      console.error("Failed to create wallet", e);
      setError("Failed: " + (e.message || e.toString()));
      setLoading(false);
    });
  }, []);
  if (loading) {
    return /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Scaffold, { appBar: /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.AppBar, { title: "Create Wallet" }) }, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Center, null, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.CircularProgressIndicator, null), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Container, { height: 20 }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Text, { text: "Generating Wallet..." })));
  }
  if (error) {
    return /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Scaffold, { appBar: /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.AppBar, { title: "Error" }) }, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Center, null, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Text, { text: error, color: "red" }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Container, { height: 20 }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Button, { text: "Retry", onTap: () => navigator.pop() })));
  }
  return /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Scaffold, { appBar: /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.AppBar, { title: "New Wallet Created" }) }, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Padding, { padding: 20 }, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Text, { text: "Mnemonic (Keep Secret!):", fontWeight: "bold" }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Container, { padding: 10, color: "#eeeeee" }, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Text, { text: wallet?.mnemonic || "" })), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Container, { height: 20 }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Text, { text: "Address:", fontWeight: "bold" }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Text, { text: wallet?.address || "" }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Container, { height: 20 }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Text, { text: "Private Key:", fontWeight: "bold" }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Text, { text: wallet?.privateKey || "" }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Container, { height: 40 }), /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Center, null, /* @__PURE__ */ import_react2.default.createElement(
    import_fuickjs2.Button,
    {
      text: "Go to Wallet Home",
      onTap: () => navigator.push("/wallet/home", { ...wallet })
    }
  )))));
}

// src/pages/wallet/ImportWalletPage.tsx
var import_react3 = __toESM(require_react());
var import_fuickjs3 = __toESM(require_fuickjs());
function ImportWalletPage() {
  const navigator = (0, import_fuickjs3.useNavigator)();
  const [mnemonic, setMnemonic] = (0, import_react3.useState)("");
  const [loading, setLoading] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)("");
  const handleImport = () => {
    if (!mnemonic) {
      setError("Please enter a mnemonic phrase");
      return;
    }
    setLoading(true);
    setError("");
    WalletService.importWallet(mnemonic).then((wallet) => {
      setLoading(false);
      if (wallet && wallet.address) {
        console.log("Wallet imported:", wallet);
        navigator.push("/wallet/home", wallet);
      } else {
        setError("Invalid mnemonic or import failed");
      }
    }).catch((e) => {
      console.error("Import failed", e);
      setLoading(false);
      setError("Import failed: " + (e.message || "Unknown error"));
    });
  };
  return /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Scaffold, { appBar: /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.AppBar, { title: "Import Wallet" }) }, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Padding, { padding: 20 }, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Text, { text: "Enter Mnemonic Phrase:", fontWeight: "bold" }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Container, { height: 10 }), /* @__PURE__ */ import_react3.default.createElement(
    import_fuickjs3.TextField,
    {
      text: mnemonic,
      onChanged: (val) => setMnemonic(val),
      maxLines: 3,
      decoration: {
        hintText: "separate words with spaces",
        border: { width: 1, color: "#cccccc" }
      }
    }
  ), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Container, { height: 20 }), error ? /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Text, { text: error, color: "red" }) : null, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Container, { height: 20 }), /* @__PURE__ */ import_react3.default.createElement(
    import_fuickjs3.Button,
    {
      text: loading ? "Importing..." : "Import Wallet",
      onTap: loading ? void 0 : handleImport
    }
  ))));
}

// src/pages/wallet/WalletHomePage.tsx
var import_react4 = __toESM(require_react());
var import_fuickjs4 = __toESM(require_fuickjs());
var RPC_URL = "https://sepolia.drpc.org";
function WalletHomePage(props) {
  const [balance, setBalance] = (0, import_react4.useState)("Loading...");
  const [toAddress, setToAddress] = (0, import_react4.useState)("");
  const [amount, setAmount] = (0, import_react4.useState)("");
  const [txHash, setTxHash] = (0, import_react4.useState)("");
  const [loading, setLoading] = (0, import_react4.useState)(false);
  (0, import_react4.useEffect)(() => {
    fetchBalance();
  }, []);
  const fetchBalance = () => {
    WalletService.getBalance(RPC_URL, props.address).then(setBalance).catch((e) => setBalance("Error"));
  };
  const handleTransfer = async () => {
    if (!toAddress || !amount) return;
    setLoading(true);
    setTxHash("");
    try {
      const hash = await WalletService.transfer(RPC_URL, props.privateKey, toAddress, amount);
      setTxHash(hash);
      setLoading(false);
      fetchBalance();
    } catch (e) {
      console.error("Transfer failed", e);
      setLoading(false);
      setTxHash("Failed");
    }
  };
  return /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Scaffold, { appBar: /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.AppBar, { title: "My Wallet" }) }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Padding, { padding: 20 }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: "Address:", fontWeight: "bold" }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { padding: 10, color: "#eeeeee" }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: props.address, fontSize: 12 })), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 20 }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: "Balance (ETH):", fontWeight: "bold" }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: balance, fontSize: 20, color: "green" }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Button, { text: "Refresh", onTap: fetchBalance })), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 40 }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: "Transfer:", fontWeight: "bold", fontSize: 18 }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 10 }), /* @__PURE__ */ import_react4.default.createElement(
    import_fuickjs4.TextField,
    {
      hintText: "To Address",
      onChanged: setToAddress
    }
  ), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 10 }), /* @__PURE__ */ import_react4.default.createElement(
    import_fuickjs4.TextField,
    {
      hintText: "Amount (ETH)",
      onChanged: setAmount
    }
  ), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 20 }), loading ? /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Center, null, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.CircularProgressIndicator, null)) : /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Center, null, /* @__PURE__ */ import_react4.default.createElement(
    import_fuickjs4.Button,
    {
      text: "Send Transaction",
      onTap: handleTransfer
    }
  )), txHash && /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Column, null, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 20 }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: "Transaction Hash:", fontWeight: "bold" }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: txHash, fontSize: 10 })))));
}

// src/app.ts
var CustomErrorUI = (error) => import_react5.default.createElement(
  import_fuickjs5.Container,
  { color: "#E0F7FA" },
  import_react5.default.createElement(
    import_fuickjs5.Column,
    {
      mainAxisAlignment: "center",
      crossAxisAlignment: "center",
      padding: 30
    },
    import_react5.default.createElement(import_fuickjs5.Text, {
      text: "Oops! Something went wrong",
      fontSize: 22,
      color: "#006064",
      fontWeight: "bold",
      margin: { bottom: 16 }
    }),
    import_react5.default.createElement(
      import_fuickjs5.Container,
      {
        padding: 12,
        decoration: {
          color: "#FFFFFF",
          borderRadius: 8,
          border: { width: 1, color: "#B2EBF2" }
        },
        margin: { bottom: 20 }
      },
      import_react5.default.createElement(import_fuickjs5.Text, {
        text: error?.message || "Unknown Error",
        fontSize: 14,
        color: "#00838F",
        maxLines: 5,
        overflow: "ellipsis"
      })
    ),
    import_react5.default.createElement(import_fuickjs5.Button, {
      text: "Retry",
      onTap: () => console.log("Retry...")
    })
  )
);
function initApp() {
  try {
    import_fuickjs5.Runtime.bindGlobals();
    (0, import_fuickjs5.setGlobalErrorFallback)(CustomErrorUI);
    import_fuickjs5.Router.register("/", (args) => import_react5.default.createElement(WalletEntryPage, args));
    import_fuickjs5.Router.register("/wallet/entry", (args) => import_react5.default.createElement(WalletEntryPage, args));
    import_fuickjs5.Router.register("/wallet/create", (args) => import_react5.default.createElement(CreateWalletPage, args));
    import_fuickjs5.Router.register("/wallet/import", (args) => import_react5.default.createElement(ImportWalletPage, args));
    import_fuickjs5.Router.register("/wallet/home", (args) => import_react5.default.createElement(WalletHomePage, args));
    console.log("Wallet App Initialized");
  } catch (e) {
    console.error("Failed to init app", e);
  }
}

// src/index.ts
globalThis.initApp = initApp;
initApp();
