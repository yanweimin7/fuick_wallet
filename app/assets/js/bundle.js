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
var import_react12 = __toESM(require_react());
var import_fuickjs12 = __toESM(require_fuickjs());

// src/pages/OnboardingPage.tsx
var import_react = __toESM(require_react());
var import_fuickjs = __toESM(require_fuickjs());
function OnboardingPage() {
  const navigator = (0, import_fuickjs.useNavigator)();
  return /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Scaffold, { backgroundColor: "white" }, /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Center, null, /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Padding, { padding: 32 }, /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Column, { crossAxisAlignment: "center", mainAxisAlignment: "center" }, /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Container,
    {
      width: 100,
      height: 100,
      decoration: {
        color: "#2196F3",
        borderRadius: 20
      },
      alignment: "center"
    },
    /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Icon, { name: "account_balance_wallet", size: 60, color: "white" })
  ), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.SizedBox, { height: 32 }), /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Text,
    {
      text: "Fuick Wallet",
      fontSize: 28,
      fontWeight: "bold",
      color: "#333"
    }
  ), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.SizedBox, { height: 12 }), /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Text,
    {
      text: "\u5B89\u5168\u3001\u6613\u7528\u7684 Web3 \u94B1\u5305",
      fontSize: 16,
      color: "#666"
    }
  ), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.SizedBox, { height: 60 }), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.InkWell, { onTap: () => navigator.pushReplace("/wallet/create", { nextPath: "/wallet/home" }) }, /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Container,
    {
      width: 240,
      height: 48,
      decoration: {
        color: "#2196F3",
        borderRadius: 24
      },
      alignment: "center"
    },
    /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Text, { text: "\u521B\u5EFA\u65B0\u94B1\u5305", color: "white", fontWeight: "bold" })
  )), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.SizedBox, { height: 20 }), /* @__PURE__ */ import_react.default.createElement(import_fuickjs.InkWell, { onTap: () => navigator.pushReplace("/wallet/import", { nextPath: "/wallet/home" }) }, /* @__PURE__ */ import_react.default.createElement(
    import_fuickjs.Container,
    {
      width: 240,
      height: 48,
      decoration: {
        color: "#E3F2FD",
        borderRadius: 24
      },
      alignment: "center"
    },
    /* @__PURE__ */ import_react.default.createElement(import_fuickjs.Text, { text: "\u5BFC\u5165\u94B1\u5305", color: "#1976D2", fontWeight: "bold" })
  ))))));
}

// src/pages/BootstrapPage.tsx
var import_react2 = __toESM(require_react());
var import_fuickjs2 = __toESM(require_fuickjs());

// src/services/StorageService.ts
var StorageService = class {
  static setItem(key, value) {
    return dartCallNativeAsync("Storage.setItem", { key, value });
  }
  static getItem(key) {
    return dartCallNativeAsync("Storage.getItem", { key });
  }
  static removeItem(key) {
    return dartCallNativeAsync("Storage.removeItem", { key });
  }
};
StorageService.WALLET_KEY = "fuick_wallet_data";

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
  static importPrivateKey(privateKey) {
    return dartCallNativeAsync("Wallet.importPrivateKey", { privateKey });
  }
  static getBalance(rpcUrl, address) {
    return dartCallNativeAsync("Wallet.getBalance", { rpcUrl, address });
  }
  static transfer(rpcUrl, privateKey, to, amount) {
    return dartCallNativeAsync("Wallet.transfer", { rpcUrl, privateKey, to, amount });
  }
};

// src/services/WalletManager.ts
var _WalletManager = class _WalletManager {
  constructor() {
    this.wallets = [];
  }
  static getInstance() {
    if (!_WalletManager.instance) {
      _WalletManager.instance = new _WalletManager();
    }
    return _WalletManager.instance;
  }
  async init() {
    try {
      const list = await StorageService.getItem(_WalletManager.WALLET_LIST_KEY);
      if (list && Array.isArray(list)) {
        this.wallets = list;
      } else {
        this.wallets = [];
      }
      console.log("WalletManager initialized, wallets loaded:", this.wallets.length);
    } catch (e) {
      console.error("Failed to load wallets:", e);
      this.wallets = [];
    }
  }
  getWallets() {
    return this.wallets;
  }
  getWallet(id) {
    return this.wallets.find((w) => w.id === id);
  }
  async createWallet(name) {
    const account = await WalletService.createWallet();
    return this._saveNewWallet(name, account, "mnemonic" /* Mnemonic */);
  }
  async importWallet(name, mnemonic) {
    const account = await WalletService.importWallet(mnemonic);
    return this._saveNewWallet(name, account, "mnemonic" /* Mnemonic */);
  }
  async importPrivateKeyWallet(name, privateKey) {
    const account = await WalletService.importPrivateKey(privateKey);
    return this._saveNewWallet(name, account, "privateKey" /* PrivateKey */);
  }
  async _saveNewWallet(name, account, type) {
    const id = this._generateId();
    const finalName = name || `Wallet ${id}`;
    const info = {
      id,
      name: finalName,
      address: account.address,
      type
    };
    const secret = {
      mnemonic: account.mnemonic,
      privateKey: account.privateKey
    };
    await StorageService.setItem(this._getSecretKey(id), secret);
    this.wallets.push(info);
    await this._saveWalletsList();
    return info;
  }
  async deleteWallet(id) {
    const index = this.wallets.findIndex((w) => w.id === id);
    if (index === -1) return;
    this.wallets.splice(index, 1);
    await this._saveWalletsList();
    await StorageService.removeItem(this._getSecretKey(id));
  }
  async clearAllWallets() {
    for (const w of this.wallets) {
      await StorageService.removeItem(this._getSecretKey(w.id));
    }
    this.wallets = [];
    await StorageService.removeItem(_WalletManager.WALLET_LIST_KEY);
  }
  async getSecret(id) {
    return await StorageService.getItem(this._getSecretKey(id));
  }
  async _saveWalletsList() {
    await StorageService.setItem(_WalletManager.WALLET_LIST_KEY, this.wallets);
  }
  _getSecretKey(id) {
    return `${_WalletManager.SECRET_PREFIX}${id}`;
  }
  _generateId() {
    if (this.wallets.length === 0) {
      return "1";
    }
    const ids = this.wallets.map((w) => parseInt(w.id, 10)).filter((id) => !isNaN(id));
    if (ids.length === 0) {
      return (this.wallets.length + 1).toString();
    }
    const maxId = Math.max(...ids);
    return (maxId + 1).toString();
  }
};
_WalletManager.WALLET_LIST_KEY = "fuick_wallet_list";
_WalletManager.SECRET_PREFIX = "fuick_wallet_secret_";
var WalletManager = _WalletManager;

// src/pages/BootstrapPage.tsx
function BootstrapPage() {
  const navigator = (0, import_fuickjs2.useNavigator)();
  (0, import_react2.useEffect)(() => {
    checkWallet();
  }, []);
  const checkWallet = async () => {
    try {
      await WalletManager.getInstance().init();
      const wallets = WalletManager.getInstance().getWallets();
      if (wallets.length > 0) {
        navigator.pushReplace("/wallet/home");
      } else {
        navigator.pushReplace("/wallet/onboarding", {});
      }
    } catch (e) {
      console.error("Bootstrap check failed", e);
      navigator.pushReplace("/wallet/onboarding", {});
    }
  };
  return /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Scaffold, null, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.Center, null, /* @__PURE__ */ import_react2.default.createElement(import_fuickjs2.CircularProgressIndicator, null)));
}

// src/pages/wallet/CreateWalletPage.tsx
var import_react3 = __toESM(require_react());
var import_fuickjs3 = __toESM(require_fuickjs());
function CreateWalletPage(props) {
  const navigator = (0, import_fuickjs3.useNavigator)();
  const [error, setError] = (0, import_react3.useState)("");
  (0, import_react3.useEffect)(() => {
    WalletService.ping().then((res) => console.log("Wallet Service Ping:", res)).catch((e) => console.error("Wallet Service Ping Failed:", e));
    const createAndNavigate = async () => {
      try {
        const w = await WalletManager.getInstance().createWallet();
        if (w) {
          if (props.nextPath) {
            navigator.pushReplace(props.nextPath, w);
          } else {
            navigator.pop(false, w);
          }
        } else {
          setError("Wallet creation returned null");
        }
      } catch (e) {
        console.error("Failed to create wallet", e);
        setError("Failed: " + (e.message || e.toString()));
      }
    };
    createAndNavigate();
  }, []);
  if (error) {
    return /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Scaffold, { appBar: /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.AppBar, { title: "Error" }) }, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Center, null, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Text, { text: error, color: "red" }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Container, { height: 20 }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Button, { text: "Retry", onTap: () => navigator.pop() })));
  }
  return /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Scaffold, { appBar: /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.AppBar, { title: "Creating Wallet" }) }, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Center, null, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Column, { mainAxisAlignment: "center", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.CircularProgressIndicator, null), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Container, { height: 24 }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Text, { text: "Creating your secure wallet...", fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Container, { height: 8 }), /* @__PURE__ */ import_react3.default.createElement(import_fuickjs3.Text, { text: "This may take a few seconds.", fontSize: 12, color: "#666666" }))));
}

// src/pages/wallet/ImportWalletPage.tsx
var import_react4 = __toESM(require_react());
var import_fuickjs4 = __toESM(require_fuickjs());
function ImportWalletPage(props) {
  const navigator = (0, import_fuickjs4.useNavigator)();
  const [name, setName] = (0, import_react4.useState)("");
  const [mnemonic, setMnemonic] = (0, import_react4.useState)("");
  const [loading, setLoading] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)("");
  const handleImport = () => {
    if (!mnemonic) {
      setError("Please enter a mnemonic phrase");
      return;
    }
    setLoading(true);
    setError("");
    WalletManager.getInstance().importWallet(name || void 0, mnemonic).then(async (wallet) => {
      setLoading(false);
      if (wallet && wallet.address) {
        console.log("Wallet imported:", wallet);
        if (props.nextPath) {
          navigator.push(props.nextPath, wallet);
        } else {
          navigator.pop(false, wallet);
        }
      } else {
        setError("Invalid mnemonic or import failed");
      }
    }).catch((e) => {
      console.error("Import failed", e);
      setLoading(false);
      setError("Import failed: " + (e.message || "Unknown error"));
    });
  };
  return /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Scaffold, { appBar: /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.AppBar, { title: "Import Wallet" }) }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Padding, { padding: 20 }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: "Wallet Name (Optional):", fontWeight: "bold" }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 10 }), /* @__PURE__ */ import_react4.default.createElement(
    import_fuickjs4.TextField,
    {
      text: name,
      onChanged: (val) => setName(val),
      decoration: {
        hintText: "e.g. My Savings",
        border: { width: 1, color: "#cccccc" }
      }
    }
  ), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 20 }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: "Enter Mnemonic Phrase:", fontWeight: "bold" }), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 10 }), /* @__PURE__ */ import_react4.default.createElement(
    import_fuickjs4.TextField,
    {
      text: mnemonic,
      onChanged: (val) => setMnemonic(val),
      maxLines: 3,
      decoration: {
        hintText: "separate words with spaces",
        border: { width: 1, color: "#cccccc" }
      }
    }
  ), /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 20 }), error ? /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Text, { text: error, color: "red" }) : null, /* @__PURE__ */ import_react4.default.createElement(import_fuickjs4.Container, { height: 20 }), /* @__PURE__ */ import_react4.default.createElement(
    import_fuickjs4.Button,
    {
      text: loading ? "Importing..." : "Import Wallet",
      onTap: loading ? void 0 : handleImport
    }
  ))));
}

// src/pages/wallet/WalletHomePage.tsx
var import_react5 = __toESM(require_react());
var import_fuickjs5 = __toESM(require_fuickjs());
var RPC_URL = "https://sepolia.drpc.org";
function WalletHomePage() {
  const navigator = (0, import_fuickjs5.useNavigator)();
  const [wallet, setWallet] = (0, import_react5.useState)(null);
  const [balance, setBalance] = (0, import_react5.useState)("0.00");
  const [toAddress, setToAddress] = (0, import_react5.useState)("");
  const [amount, setAmount] = (0, import_react5.useState)("");
  const [txHash, setTxHash] = (0, import_react5.useState)("");
  const [loading, setLoading] = (0, import_react5.useState)(false);
  (0, import_react5.useEffect)(() => {
    loadWallet();
  }, []);
  const loadWallet = () => {
    const wallets = WalletManager.getInstance().getWallets();
    if (wallets.length > 0) {
      setWallet(wallets[0]);
    } else {
      setWallet(null);
    }
  };
  (0, import_react5.useEffect)(() => {
    if (wallet) {
      fetchBalance();
    }
  }, [wallet?.address]);
  const fetchBalance = () => {
    if (!wallet) return;
    setBalance("Loading...");
    WalletService.getBalance(RPC_URL, wallet.address).then((val) => {
      try {
        const num = parseFloat(val);
        setBalance(num.toFixed(4));
      } catch {
        setBalance(val);
      }
    }).catch((e) => setBalance("Error"));
  };
  const handleSwitchWallet = async () => {
    const result = await navigator.showModal("/wallet/list", {}, { maxHeight: 0.9 });
    if (result && result.id) {
      setWallet(result);
    } else {
      const wallets = WalletManager.getInstance().getWallets();
      if (wallet && !wallets.find((w) => w.id === wallet.id)) {
        setWallet(wallets.length > 0 ? wallets[0] : null);
      } else if (!wallet && wallets.length > 0) {
        setWallet(wallets[0]);
      }
    }
  };
  const handleTransfer = async () => {
    if (!wallet || !toAddress || !amount) return;
    setLoading(true);
    setTxHash("");
    try {
      const secret = await WalletManager.getInstance().getSecret(wallet.id);
      if (!secret || !secret.privateKey) {
        throw new Error("Private key not found");
      }
      const hash = await WalletService.transfer(RPC_URL, secret.privateKey, toAddress, amount);
      setTxHash(hash);
      setLoading(false);
      fetchBalance();
    } catch (e) {
      console.error("Transfer failed", e);
      setLoading(false);
      setTxHash("Failed: " + (e.message || "Unknown error"));
    }
  };
  const ActionButton = ({ icon, label, onTap }) => /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.GestureDetector, { onTap }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react5.default.createElement(
    import_fuickjs5.Container,
    {
      width: 48,
      height: 48,
      decoration: { color: "#E0F7FA", borderRadius: 24 },
      alignment: "center"
    },
    /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: icon, color: "#006064", size: 24 })
  ), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { height: 8 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: label, fontSize: 12, color: "#333333" })));
  const TokenItem = ({ icon, symbol, name, balance: balance2, price, change }) => /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, null, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { padding: { top: 16, bottom: 16 } }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, { mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, null, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { width: 40, height: 40, decoration: { color: "#f0f0f0", borderRadius: 20 }, alignment: "center" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: icon, size: 24 })), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { width: 12 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: symbol, fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, null, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: price, fontSize: 12, color: "#666666" }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { width: 4 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: change, fontSize: 12, color: change.startsWith("+") ? "green" : "red" })))), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, { crossAxisAlignment: "end" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: balance2, fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: `$${(parseFloat(balance2) * parseFloat(price.replace("$", ""))).toFixed(2)}`, fontSize: 12, color: "#666666" })))), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { height: 1, color: "#f0f0f0" }));
  if (!wallet) {
    return /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Scaffold, null, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Center, null, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.CircularProgressIndicator, null), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { height: 16 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "Loading Wallet..." })));
  }
  return /* @__PURE__ */ import_react5.default.createElement(
    import_fuickjs5.Scaffold,
    {
      appBar: /* @__PURE__ */ import_react5.default.createElement(
        import_fuickjs5.AppBar,
        {
          centerTitle: false,
          backgroundColor: "white",
          elevation: 0,
          title: /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.GestureDetector, { onTap: handleSwitchWallet }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react5.default.createElement(
            import_fuickjs5.Container,
            {
              width: 32,
              height: 32,
              decoration: { color: "#FFCDD2", borderRadius: 16 },
              alignment: "center",
              margin: { right: 8 }
            },
            /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: "account_balance_wallet", color: "#D32F2F", size: 18 })
          ), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: wallet.name, fontSize: 16, fontWeight: "bold", color: "black" }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: "keyboard_arrow_down", color: "#666666" }))),
          actions: [
            /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { padding: { right: 16 }, alignment: "center" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: "qr_code_scanner", color: "black" }))
          ]
        }
      )
    },
    /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Padding, { padding: { top: 0, left: 20, right: 20, bottom: 20 } }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { height: 24 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: `$${(parseFloat(balance === "Loading..." || balance === "Error" ? "0" : balance) * 2e3).toFixed(2)}`, fontSize: 32, fontWeight: "bold" }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: `+<0.01 (+0.36%) Today's PNL`, fontSize: 12, color: "green" })), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { height: 24 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react5.default.createElement(ActionButton, { icon: "send", label: "Transfer", onTap: () => {
    } }), /* @__PURE__ */ import_react5.default.createElement(ActionButton, { icon: "call_received", label: "Receive" }), /* @__PURE__ */ import_react5.default.createElement(ActionButton, { icon: "history", label: "History" }), /* @__PURE__ */ import_react5.default.createElement(ActionButton, { icon: "more_horiz", label: "More" })), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { height: 24 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { width: 100, height: 80, decoration: { color: "#F5F5F5", borderRadius: 12 }, padding: 12 }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: "savings", color: "#8BC34A" }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Expanded, null, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, null)), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "Earn", fontSize: 12, color: "#666666" }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "$0.05", fontWeight: "bold", fontSize: 14 }))), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { width: 100, height: 80, decoration: { color: "#F5F5F5", borderRadius: 12 }, padding: 12 }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: "credit_card", color: "#FF9800" }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Expanded, null, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, null)), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "Card", fontSize: 12, color: "#666666" }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "No Fee", fontWeight: "bold", fontSize: 14 }))), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { width: 100, height: 80, decoration: { color: "#F5F5F5", borderRadius: 12 }, padding: 12 }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: "swap_horiz", color: "#2196F3" }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Expanded, null, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, null)), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "Swap", fontSize: 12, color: "#666666" }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "Trade", fontWeight: "bold", fontSize: 14 })))), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { height: 24 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, { mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "Tokens $0.03", fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: "tune", color: "#666666" })), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Container, { height: 8 }), /* @__PURE__ */ import_react5.default.createElement(TokenItem, { icon: "currency_bitcoin", symbol: "BNB", name: "BNB", balance: "<0.0001", price: "$659.2", change: "+6.88%" }), /* @__PURE__ */ import_react5.default.createElement(TokenItem, { icon: "attach_money", symbol: "USDC", name: "USDC", balance: "0.0038", price: "$1.00", change: "0.00%" }), /* @__PURE__ */ import_react5.default.createElement(
      import_fuickjs5.Container,
      {
        margin: { top: 8, bottom: 8 },
        padding: 12,
        decoration: { color: "#E0F2F1", borderRadius: 8 }
      },
      /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Text, { text: "Earn 10% APY", color: "#00695C", fontWeight: "bold", fontSize: 12 }), /* @__PURE__ */ import_react5.default.createElement(import_fuickjs5.Icon, { name: "chevron_right", color: "#00695C", size: 16 }))
    )))
  );
}

// src/pages/wallet/MainTabsPage.tsx
var import_react8 = __toESM(require_react());
var import_fuickjs8 = __toESM(require_fuickjs());

// src/pages/wallet/HomePage.tsx
var import_react6 = __toESM(require_react());
var import_fuickjs6 = __toESM(require_fuickjs());
var BANNERS = [
  "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80",
  // Bitcoin
  "https://images.unsplash.com/photo-1622630998477-20aa696fa4a5?w=800&q=80",
  // Ethereum
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80"
  // DeFi
];
var ACTIONS = [
  { name: "\u8F6C\u8D26", icon: "send", color: "#2196F3" },
  { name: "\u6536\u6B3E", icon: "qr_code", color: "#4CAF50" },
  { name: "Swap", icon: "swap_horiz", color: "#FF9800" },
  { name: "\u4E70\u5E01", icon: "credit_card", color: "#9C27B0" }
];
function HomePage() {
  return /* @__PURE__ */ import_react6.default.createElement(
    import_fuickjs6.Scaffold,
    {
      appBar: /* @__PURE__ */ import_react6.default.createElement(
        import_fuickjs6.AppBar,
        {
          title: "Fuick Wallet",
          actions: [
            /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Icon, { name: "notifications", color: "white", size: 24 }),
            /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SizedBox, { width: 16 }),
            /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Icon, { name: "qr_code_scanner", color: "white", size: 24 }),
            /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SizedBox, { width: 16 })
          ]
        }
      )
    },
    /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Container, { color: "#F5F5F5" }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Column, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Container, { height: 200 }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Stack, null, /* @__PURE__ */ import_react6.default.createElement(
      import_fuickjs6.Image,
      {
        url: BANNERS[0],
        fit: "cover",
        width: Infinity,
        height: 200
      }
    ), /* @__PURE__ */ import_react6.default.createElement(
      import_fuickjs6.Positioned,
      {
        bottom: 10,
        left: 20
      },
      /* @__PURE__ */ import_react6.default.createElement(
        import_fuickjs6.Container,
        {
          padding: 8,
          decoration: {
            color: "#00000066",
            borderRadius: 8
          }
        },
        /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Text, { text: "\u63A2\u7D22 Web3 \u7684\u65E0\u9650\u53EF\u80FD", color: "white", fontWeight: "bold" })
      )
    ))), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Padding, { padding: 16 }, /* @__PURE__ */ import_react6.default.createElement(
      import_fuickjs6.Container,
      {
        decoration: {
          color: "white",
          borderRadius: 12
          // boxShadow: [{ color: "#0000001A", blurRadius: 10, offset: { dx: 0, dy: 4 } }]
        },
        padding: 20
      },
      /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Row, { mainAxisAlignment: "spaceBetween" }, ACTIONS.map((action, index) => /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Column, { key: index, mainAxisAlignment: "center", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react6.default.createElement(
        import_fuickjs6.Container,
        {
          width: 48,
          height: 48,
          decoration: {
            color: action.color + "22",
            // 浅色背景
            borderRadius: 24
          },
          alignment: "center"
        },
        /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Icon, { name: action.icon, color: action.color, size: 28 })
      ), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SizedBox, { height: 8 }), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Text, { text: action.name, fontSize: 12, color: "#333" }))))
    )), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Padding, { padding: { left: 16, right: 16, bottom: 16 } }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Text, { text: "\u70ED\u95E8 DApps", fontSize: 18, fontWeight: "bold", margin: { bottom: 12 } }), /* @__PURE__ */ import_react6.default.createElement(
      import_fuickjs6.GridView,
      {
        crossAxisCount: 2,
        childAspectRatio: 1.5,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        shrinkWrap: true,
        children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ import_react6.default.createElement(
          import_fuickjs6.Container,
          {
            key: i,
            decoration: {
              color: "white",
              borderRadius: 8
            },
            padding: 12
          },
          /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Row, null, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Container, { width: 40, height: 40, color: "#eee", decoration: { borderRadius: 20 } }), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.SizedBox, { width: 10 }), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Column, { mainAxisAlignment: "center" }, /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Text, { text: `DApp ${i}`, fontWeight: "bold" }), /* @__PURE__ */ import_react6.default.createElement(import_fuickjs6.Text, { text: "DeFi Protocol", fontSize: 10, color: "grey" })))
        ))
      }
    ))))
  );
}

// src/pages/wallet/MarketPage.tsx
var import_react7 = __toESM(require_react());
var import_fuickjs7 = __toESM(require_fuickjs());
var TABS = ["\u5168\u90E8", "\u81EA\u9009", "\u73B0\u8D27", "\u5408\u7EA6"];
var generateCryptos = (count) => {
  const cryptos = [];
  const baseSymbols = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE", "DOT", "MATIC", "LTC"];
  const quotes = ["USDT", "USDC"];
  for (let i = 0; i < count; i++) {
    const base = baseSymbols[i % baseSymbols.length];
    const quote = quotes[i % quotes.length];
    const suffix = i >= baseSymbols.length ? ` ${i}` : "";
    const symbol = `${base}/${quote}${suffix}`;
    cryptos.push({
      symbol,
      name: base + suffix,
      price: 10 + Math.random() * 5e4,
      change: -10 + Math.random() * 20,
      volume: Math.floor(Math.random() * 1e6),
      marketCap: Math.floor(Math.random() * 1e9)
    });
  }
  return cryptos;
};
var ALL_CRYPTOS = generateCryptos(100);
var BANNERS2 = [
  "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80",
  "https://images.unsplash.com/photo-1622630998477-20aa696fa4a5?w=800&q=80",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80"
];
var CATEGORIES = [
  { name: "\u6DA8\u5E45\u699C", icon: "trending_up", color: "#4CAF50" },
  { name: "\u8DCC\u5E45\u699C", icon: "trending_down", color: "#F44336" },
  { name: "\u65B0\u5E01", icon: "fiber_new", color: "#FF4081" },
  { name: "Defi", icon: "account_balance", color: "#9C27B0" },
  { name: "GameFi", icon: "games", color: "#795548" },
  { name: "NFT", icon: "image", color: "#FF9800" },
  { name: "Layer2", icon: "layers", color: "#2196F3" },
  { name: "\u66F4\u591A", icon: "apps", color: "#607D8B" }
];
function CryptoItem({ crypto }) {
  const isUp = crypto.change >= 0;
  const color = isUp ? "#4CAF50" : "#F44336";
  return /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.InkWell, { onTap: () => console.log(`Click crypto: ${crypto.symbol}`) }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { color: "white" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Padding, { padding: { left: 16, right: 16, top: 12, bottom: 12 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: crypto.name, fontSize: 16, fontWeight: "bold" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SizedBox, { width: 6 }), /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.Container,
    {
      color: "#F5F5F5",
      borderRadius: 4,
      padding: { left: 4, right: 4, top: 1, bottom: 1 }
    },
    /* @__PURE__ */ import_react7.default.createElement(
      import_fuickjs7.Text,
      {
        text: "10X",
        fontSize: 10,
        color: "#666666"
      }
    )
  )), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SizedBox, { height: 4 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: crypto.symbol, fontSize: 12, color: "#999999" })), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { crossAxisAlignment: "end" }, /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.Text,
    {
      text: crypto.price.toFixed(2),
      fontSize: 17,
      fontWeight: "bold",
      color
    }
  ), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SizedBox, { height: 2 }), /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.Text,
    {
      text: (isUp ? "+" : "") + crypto.change.toFixed(2) + "%",
      fontSize: 12,
      color
    }
  ))))))), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Padding, { padding: { left: 16 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Divider, { height: 1, color: "#EEEEEE" })));
}
function MarketPage() {
  const [marketData, setMarketData] = (0, import_react7.useState)({
    tick: 0,
    bannerIndex: 0,
    cryptos: ALL_CRYPTOS
  });
  const [activeTabIndex, setActiveTabIndex] = (0, import_react7.useState)(0);
  const listRef = (0, import_react7.useRef)(null);
  const pageViewRef = (0, import_react7.useRef)(null);
  const { tick, cryptos: cryptosWithUpdate } = marketData;
  const filteredCryptos = (0, import_react7.useMemo)(() => {
    if (activeTabIndex === 0) return ALL_CRYPTOS;
    return ALL_CRYPTOS.filter((_, i) => i % (activeTabIndex + 1) === 0);
  }, [activeTabIndex]);
  (0, import_react7.useEffect)(() => {
    setMarketData((prev) => ({ ...prev, cryptos: filteredCryptos }));
  }, [filteredCryptos]);
  (0, import_react7.useEffect)(() => {
    const timer = setInterval(() => {
      setMarketData((prev) => {
        const nextCryptos = prev.cryptos.map((s) => ({
          ...s,
          price: s.price + (Math.random() - 0.5) * 10,
          change: s.change + (Math.random() - 0.5) * 0.1
        }));
        const nextBannerIndex = (prev.bannerIndex + 1) % BANNERS2.length;
        if (pageViewRef.current) {
          pageViewRef.current.animateToPage(nextBannerIndex);
        }
        if (listRef.current) {
          const updates = nextCryptos.map((crypto, index) => ({
            index,
            dsl: /* @__PURE__ */ import_react7.default.createElement(CryptoItem, { key: crypto.symbol, crypto, index })
          }));
          listRef.current.updateItems(updates);
        }
        return {
          tick: prev.tick + 1,
          bannerIndex: nextBannerIndex,
          cryptos: nextCryptos
        };
      });
    }, 3e3);
    return () => clearInterval(timer);
  }, []);
  const itemBuilder = (0, import_react7.useCallback)(
    (index) => {
      const crypto = cryptosWithUpdate[index];
      if (!crypto) return null;
      return /* @__PURE__ */ import_react7.default.createElement(CryptoItem, { key: crypto.symbol, crypto, index });
    },
    [cryptosWithUpdate]
  );
  const bannerItems = (0, import_react7.useMemo)(
    () => BANNERS2.map((url, i) => /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Image, { key: i, url, fit: "cover", width: Infinity, height: 150, borderRadius: 12 })),
    []
  );
  const categoriesGrid = (0, import_react7.useMemo)(
    () => CATEGORIES.map((cat, i) => /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { key: i, color: "white", borderRadius: 12 }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { mainAxisAlignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(
      import_fuickjs7.Container,
      {
        width: 40,
        height: 40,
        borderRadius: 20,
        color: cat.color + "15"
      },
      /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Center, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: cat.icon, color: cat.color, size: 24 }))
    ), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SizedBox, { height: 8 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Text, { text: cat.name, fontSize: 12, color: "#333333" })))),
    []
  );
  const tabBarTabs = (0, import_react7.useMemo)(
    () => TABS.map((t) => /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Tab, { key: t, text: t })),
    []
  );
  return /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.DefaultTabController, { length: TABS.length, initialIndex: 0 }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Scaffold, { backgroundColor: "white" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.CustomScrollView, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SliverAppBar, { pinned: true }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { color: "#2196F3", isBoundary: true }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SafeArea, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Padding, { padding: { left: 16, right: 16, bottom: 8 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, { mainAxisAlignment: "center", crossAxisAlignment: "start" }, /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.Text,
    {
      text: "\u884C\u60C5",
      fontSize: 18,
      color: "white",
      fontWeight: "bold"
    }
  ), /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.Text,
    {
      text: `\u5B9E\u65F6\u884C\u60C5 \xB7 \u66F4\u65B0 ${tick}`,
      fontSize: 11,
      color: "white"
    }
  )))))), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SliverToBoxAdapter, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Padding, { padding: { left: 16, right: 16, top: 12, bottom: 0 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 44, color: "#F5F5F5", borderRadius: 22 }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Padding, { padding: { left: 16, right: 16 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { crossAxisAlignment: "center" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Icon, { name: "search", size: 20, color: "#999999" }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SizedBox, { width: 8 }), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Flexible, null, /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.TextField,
    {
      hintText: "\u641C\u7D22\u5E01\u79CD",
      onChanged: (v) => console.log("Search:", v)
    }
  ))))))), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SliverToBoxAdapter, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Padding, { padding: { left: 16, right: 16, top: 16 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 150, borderRadius: 12 }, /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.PageView,
    {
      ref: pageViewRef,
      onPageChanged: (index) => setMarketData((prev) => ({ ...prev, bannerIndex: index }))
    },
    bannerItems
  )))), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SliverToBoxAdapter, null, /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.GridView,
    {
      padding: { left: 12, right: 12, bottom: 8 },
      crossAxisCount: 4,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 0.8,
      shrinkWrap: true,
      physics: "never"
    },
    categoriesGrid
  )), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SliverToBoxAdapter, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Padding, { padding: { left: 16, right: 16, top: 20, bottom: 0 } }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Row, { mainAxisAlignment: "spaceBetween" }, /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.Text,
    {
      text: `${TABS[activeTabIndex]}\u699C\u5355`,
      fontSize: 18,
      fontWeight: "bold"
    }
  )))), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SliverPersistentHeader, { pinned: true, minExtent: 49, maxExtent: 49 }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { color: "#FFFFFF" }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Column, null, /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.TabBar,
    {
      tabs: tabBarTabs,
      onTap: (index) => setActiveTabIndex(index),
      labelColor: "#2196F3",
      unselectedLabelColor: "#666666",
      indicatorColor: "#2196F3",
      indicatorWeight: 2
    }
  ), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Divider, { height: 1, color: "#EEEEEE" })))), /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.SliverList,
    {
      ref: listRef,
      itemCount: cryptosWithUpdate.length,
      itemBuilder
    }
  ), /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.SliverToBoxAdapter, null, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Container, { height: 60 }, /* @__PURE__ */ import_react7.default.createElement(import_fuickjs7.Center, null, /* @__PURE__ */ import_react7.default.createElement(
    import_fuickjs7.Text,
    {
      text: `\u2014\u2014 \u5230\u5E95\u4E86\uFF0C\u5171 ${cryptosWithUpdate.length} \u4E2A\u5E01\u79CD \u2014\u2014`,
      color: "#CCCCCC",
      fontSize: 12
    }
  )))))));
}

// src/pages/wallet/MainTabsPage.tsx
function MainTabsPage() {
  const [currentIndex, setCurrentIndex] = (0, import_react8.useState)(0);
  const pages = [
    /* @__PURE__ */ import_react8.default.createElement(HomePage, null),
    /* @__PURE__ */ import_react8.default.createElement(MarketPage, null),
    /* @__PURE__ */ import_react8.default.createElement(WalletHomePage, null)
  ];
  return /* @__PURE__ */ import_react8.default.createElement(
    import_fuickjs8.Scaffold,
    {
      bottomNavigationBar: /* @__PURE__ */ import_react8.default.createElement(
        import_fuickjs8.BottomNavigationBar,
        {
          currentIndex,
          onTap: setCurrentIndex,
          items: [
            /* @__PURE__ */ import_react8.default.createElement(
              import_fuickjs8.BottomNavigationBarItem,
              {
                key: "home",
                icon: /* @__PURE__ */ import_react8.default.createElement(import_fuickjs8.Icon, { name: "home" }),
                label: "\u9996\u9875"
              }
            ),
            /* @__PURE__ */ import_react8.default.createElement(
              import_fuickjs8.BottomNavigationBarItem,
              {
                key: "market",
                icon: /* @__PURE__ */ import_react8.default.createElement(import_fuickjs8.Icon, { name: "show_chart" }),
                label: "\u884C\u60C5"
              }
            ),
            /* @__PURE__ */ import_react8.default.createElement(
              import_fuickjs8.BottomNavigationBarItem,
              {
                key: "assets",
                icon: /* @__PURE__ */ import_react8.default.createElement(import_fuickjs8.Icon, { name: "account_balance_wallet" }),
                label: "\u8D44\u4EA7"
              }
            )
          ]
        }
      )
    },
    pages[currentIndex]
  );
}

// src/pages/wallet/WalletListPage.tsx
var import_react11 = __toESM(require_react());
var import_fuickjs11 = __toESM(require_fuickjs());

// src/pages/wallet/WalletDeleteDialog.tsx
var import_react9 = __toESM(require_react());
var import_fuickjs9 = __toESM(require_fuickjs());
function WalletDeleteDialog(props) {
  const navigator = (0, import_fuickjs9.useNavigator)();
  const walletName = props.wallet ? props.wallet.name : "Wallet";
  const handleCancel = () => {
    navigator.pop(false);
  };
  const handleDelete = () => {
    navigator.pop(true);
  };
  return /* @__PURE__ */ import_react9.default.createElement(
    import_fuickjs9.AlertDialog,
    {
      title: /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Text, { text: "Delete Wallet?", fontWeight: "bold", fontSize: 18 }),
      content: /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Column, { mainAxisSize: "min", crossAxisAlignment: "start" }, /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Text, { text: `Are you sure you want to delete "${walletName}"?`, fontSize: 16 }), /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Container, { height: 8 }), /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Text, { text: "This action cannot be undone! Your private key will be lost permanently.", color: "red", fontSize: 14 })),
      actions: [
        /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.InkWell, { onTap: handleCancel }, /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Container, { padding: { horizontal: 16, vertical: 8 } }, /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Text, { text: "Cancel", color: "black", fontWeight: "bold" }))),
        /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.InkWell, { onTap: handleDelete }, /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Container, { padding: { horizontal: 16, vertical: 8 } }, /* @__PURE__ */ import_react9.default.createElement(import_fuickjs9.Text, { text: "Delete", color: "red", fontWeight: "bold" })))
      ]
    }
  );
}

// src/pages/wallet/WalletClearDialog.tsx
var import_react10 = __toESM(require_react());
var import_fuickjs10 = __toESM(require_fuickjs());
function WalletClearDialog() {
  const navigator = (0, import_fuickjs10.useNavigator)();
  const handleCancel = () => {
    navigator.pop(false);
  };
  const handleClear = () => {
    navigator.pop(true);
  };
  return /* @__PURE__ */ import_react10.default.createElement(
    import_fuickjs10.AlertDialog,
    {
      title: /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Text, { text: "Clear All Wallets?", fontWeight: "bold", fontSize: 18 }),
      content: /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Column, { mainAxisSize: "min", crossAxisAlignment: "start" }, /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Text, { text: "Are you sure you want to delete ALL wallets?", fontSize: 16 }), /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Container, { height: 8 }), /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Text, { text: "This action cannot be undone! All private keys will be lost permanently.", color: "red", fontSize: 14 })),
      actions: [
        /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.InkWell, { onTap: handleCancel }, /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Container, { padding: { horizontal: 16, vertical: 8 } }, /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Text, { text: "Cancel", color: "black", fontWeight: "bold" }))),
        /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.InkWell, { onTap: handleClear }, /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Container, { padding: { horizontal: 16, vertical: 8 } }, /* @__PURE__ */ import_react10.default.createElement(import_fuickjs10.Text, { text: "Delete All", color: "red", fontWeight: "bold" })))
      ]
    }
  );
}

// src/pages/wallet/WalletListPage.tsx
function WalletListPage(props) {
  const navigator = (0, import_fuickjs11.useNavigator)();
  const [wallets, setWallets] = (0, import_react11.useState)([]);
  const isModal = props.onClose || props.presentation === "bottomSheet";
  (0, import_react11.useEffect)(() => {
    loadWallets();
  }, []);
  const loadWallets = () => {
    setWallets([...WalletManager.getInstance().getWallets()]);
  };
  const handleSelect = (wallet) => {
    if (props.onClose) {
      props.onClose(wallet);
    } else {
      navigator.pop(false, wallet);
    }
  };
  const handleCreate = async () => {
    const result = await navigator.push("/wallet/create");
    if (result) {
      if (props.onClose) {
        props.onClose(result);
      } else {
        navigator.pop(false, result);
      }
    } else {
      loadWallets();
    }
  };
  const handleImport = async () => {
    const result = await navigator.push("/wallet/import");
    if (result) {
      if (props.onClose) {
        props.onClose(result);
      } else {
        navigator.pop(false, result);
      }
    } else {
      loadWallets();
    }
  };
  const handleClearAll = async () => {
    const confirmed = await navigator.showDialog(/* @__PURE__ */ import_react11.default.createElement(WalletClearDialog, null));
    if (confirmed) {
      await WalletManager.getInstance().clearAllWallets();
      loadWallets();
    }
  };
  const handleDeleteWallet = async (wallet) => {
    const confirmed = await navigator.showDialog(/* @__PURE__ */ import_react11.default.createElement(WalletDeleteDialog, { wallet }));
    if (confirmed) {
      await WalletManager.getInstance().deleteWallet(wallet.id);
      loadWallets();
    }
  };
  const content = /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Column, null, isModal ? /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { padding: 16, alignment: "center" }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { width: 40, height: 4, decoration: { color: "#ddd", borderRadius: 2 } }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 10 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "Select Wallet", fontWeight: "bold", fontSize: 16 })) : /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 1, color: "#eee" }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Expanded, null, /* @__PURE__ */ import_react11.default.createElement(
    import_fuickjs11.ListView,
    {
      itemCount: wallets.length,
      itemBuilder: (index) => {
        const w = wallets[index];
        return /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Column, null, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { padding: 16 }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Row, { mainAxisAlignment: "spaceBetween", crossAxisAlignment: "center" }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Expanded, null, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.InkWell, { onTap: () => handleSelect(w) }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Column, { crossAxisAlignment: "start" }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: w.name, fontWeight: "bold", fontSize: 16 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 4 }), /* @__PURE__ */ import_react11.default.createElement(
          import_fuickjs11.Text,
          {
            text: w.address.substring(0, 6) + "..." + w.address.substring(w.address.length - 4),
            fontSize: 14,
            color: "#666"
          }
        )))), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Row, null, w.type === "mnemonic" ? /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { padding: { horizontal: 8, vertical: 4 }, decoration: { color: "#E3F2FD", borderRadius: 4 } }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "HD", fontSize: 10, color: "#1976D2" })) : /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { padding: { horizontal: 8, vertical: 4 }, decoration: { color: "#FFF3E0", borderRadius: 4 } }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "PK", fontSize: 10, color: "#F57C00" })), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { width: 16 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.GestureDetector, { onTap: () => handleDeleteWallet(w) }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { padding: 8 }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Icon, { name: "delete", color: "#aaa", size: 20 })))))), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 1, color: "#f0f0f0" }));
      }
    }
  )), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Padding, { padding: 20 }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Column, null, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.InkWell, { onTap: handleCreate }, /* @__PURE__ */ import_react11.default.createElement(
    import_fuickjs11.Container,
    {
      height: 48,
      decoration: {
        color: "#2196F3",
        borderRadius: 24
      },
      alignment: "center"
    },
    /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Row, { mainAxisAlignment: "center" }, /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Icon, { name: "add", color: "white" }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { width: 8 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "Create New Wallet", color: "white", fontWeight: "bold" }))
  )), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { height: 20 }), /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.InkWell, { onTap: handleClearAll }, /* @__PURE__ */ import_react11.default.createElement(
    import_fuickjs11.Container,
    {
      height: 48,
      alignment: "center"
    },
    /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Text, { text: "Clear Local Wallets", color: "red" })
  )))));
  if (isModal) {
    return /* @__PURE__ */ import_react11.default.createElement(import_fuickjs11.Container, { decoration: { color: "white", borderRadius: { topLeft: 16, topRight: 16 } } }, content);
  }
  return /* @__PURE__ */ import_react11.default.createElement(
    import_fuickjs11.Scaffold,
    {
      appBar: /* @__PURE__ */ import_react11.default.createElement(
        import_fuickjs11.AppBar,
        {
          title: "Wallets"
        }
      )
    },
    content
  );
}

// src/app.ts
var CustomErrorUI = (error) => import_react12.default.createElement(
  import_fuickjs12.Container,
  { color: "#E0F7FA" },
  import_react12.default.createElement(
    import_fuickjs12.Column,
    {
      mainAxisAlignment: "center",
      crossAxisAlignment: "center",
      padding: 30
    },
    import_react12.default.createElement(import_fuickjs12.Text, {
      text: "Oops! Something went wrong",
      fontSize: 22,
      color: "#006064",
      fontWeight: "bold",
      margin: { bottom: 16 }
    }),
    import_react12.default.createElement(
      import_fuickjs12.Container,
      {
        padding: 12,
        decoration: {
          color: "#FFFFFF",
          borderRadius: 8,
          border: { width: 1, color: "#B2EBF2" }
        },
        margin: { bottom: 20 }
      },
      import_react12.default.createElement(import_fuickjs12.Text, {
        text: error?.message || "Unknown Error",
        fontSize: 14,
        color: "#00838F",
        maxLines: 5,
        overflow: "ellipsis"
      })
    ),
    import_react12.default.createElement(import_fuickjs12.Button, {
      text: "Retry",
      onTap: () => console.log("Retry...")
    })
  )
);
function initApp() {
  try {
    import_fuickjs12.Runtime.bindGlobals();
    (0, import_fuickjs12.setGlobalErrorFallback)(CustomErrorUI);
    import_fuickjs12.Router.register("/", (args) => import_react12.default.createElement(BootstrapPage, args));
    import_fuickjs12.Router.register("/wallet/onboarding", (args) => import_react12.default.createElement(OnboardingPage, args));
    import_fuickjs12.Router.register("/wallet/create", (args) => import_react12.default.createElement(CreateWalletPage, args));
    import_fuickjs12.Router.register("/wallet/import", (args) => import_react12.default.createElement(ImportWalletPage, args));
    import_fuickjs12.Router.register("/wallet/home", (args) => import_react12.default.createElement(MainTabsPage, args));
    import_fuickjs12.Router.register("/wallet/list", (args) => import_react12.default.createElement(WalletListPage, args));
    import_fuickjs12.Router.register("/_generic_dialog", (args) => import_react12.default.createElement(import_fuickjs12.GenericPage, args));
    import_fuickjs12.Router.register("/wallet/detail", (args) => import_react12.default.createElement(WalletHomePage, args));
    console.log("Wallet App Initialized");
  } catch (e) {
    console.error("Failed to init app", e);
  }
}

// src/index.ts
globalThis.initApp = initApp;
initApp();
