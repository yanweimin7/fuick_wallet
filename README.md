# Fuick Wallet

Fuick Wallet is a high-performance, dynamic crypto wallet application built with **Flutter** and **FuickJS**. It combines the native performance of Flutter with the flexibility of React/TypeScript for business logic and UI definition, powered by the QuickJS runtime.

## 🚀 Features

-   **Dynamic UI**: The entire UI is driven by React components running in a QuickJS environment, allowing for over-the-air updates without app store releases.
-   **Multi-Chain Support**: Architecture designed to support multiple blockchain protocols (EVM, etc.).
-   **Secure Wallet Management**:
    -   Create and import wallets via Mnemonic or Private Key.
    -   **Zero-Caching Security**: Plaintext passwords are never cached in memory. They are explicitly requested from the user when performing sensitive operations (signing, revealing secrets).
    -   **AES Encryption**: Wallet secrets are encrypted using AES before storage.
-   **High Performance**: Uses a custom React reconciler (`react-reconciler`) to map React components to Flutter widgets efficiently.

## 📂 Project Structure

The project is divided into two main parts:

-   **`js/`**: The TypeScript/React frontend.
    -   Contains all UI components, pages, and business logic.
    -   Compiles to a bytecode bundle (`bundle.qjc`) executed by the Flutter app.
-   **`app/`**: The Native Flutter Host.
    -   Provides the runtime environment (FuickJS Flutter bindings).
    -   Handles native services (Crypto, Storage, Networking).
    -   Loads and renders the JS bundle.

### Directory Layout

```
fuick_wallet/
├── js/                 # React/TypeScript Source
│   ├── src/
│   │   ├── components/ # Reusable UI components (ThemeInput, Dialogs)
│   │   ├── pages/      # Application screens (Wallet, Market, Settings)
│   │   ├── services/   # Business logic (WalletManager, PasswordService)
│   │   └── index.ts    # Entry point
│   └── esbuild.js      # Build script
└── app/                # Flutter Host App
    ├── lib/
    │   ├── service/    # Native implementations of services
    │   └── main.dart   # App entry point
    └── assets/js/      # Destination for compiled JS bundles
```

## 🛠️ Getting Started

### Prerequisites

-   **Flutter SDK**: [Install Flutter](https://flutter.dev/docs/get-started/install)
-   **Node.js** (v16+): [Install Node.js](https://nodejs.org/)

### 1. Setup JS Environment

Navigate to the `js` directory and install dependencies:

```bash
cd js
npm install
```

### 2. Build JS Bundle

Compile the TypeScript code into the QuickJS bytecode bundle. This script also copies the output to the Flutter assets directory.

```bash
npm run build
```

For development with watch mode:

```bash
npm run dev
```

### 3. Run Flutter App

Navigate to the `app` directory and run the Flutter application:

```bash
cd ../app
flutter pub get
flutter run
```

## 🔐 Security Architecture

### Password Handling
To maximize security, Fuick Wallet enforces a strict **no-caching policy** for passwords:
-   **Storage**: Passwords are hashed before being stored locally (for verification only).
-   **Usage**: When a sensitive operation requires the password (e.g., decrypting a private key), the user is prompted to enter it via a secure dialog.
-   **Memory**: The plaintext password is passed directly to the decryption function and is discarded immediately after use. It is never stored in a global variable or long-lived service.

### Wallet Encryption
-   Wallet secrets (mnemonics, private keys) are encrypted using **AES** with the user's password.
-   The encrypted data is stored securely using the device's storage mechanisms.

## 🤝 Contributing

1.  Make changes in `js/src` for UI/Logic or `app/lib` for Native capabilities.
2.  Run `npm run build` in `js/` to update the bundle.
3.  Test changes in the Flutter simulator/device.

