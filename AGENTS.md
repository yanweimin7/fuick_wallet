# AGENTS.md — Fuick Wallet

资产类 Flutter 动态化钱包 demo。`fuick_wallet` 是业务 JS 工程，运行在
`fuickjs_framework`（fuickjs + fuickjs_flutter 渲染引擎）之上，最终在
`fuickjs_demo` 里以"内置 bundle"形式加载运行。

## 仓库布局（三个独立 git 仓库）

- `fuick_wallet/` — 本仓库。钱包业务 TS/React 代码（`js/src`），构建后产物在
  `app/assets/js/`。
- `fuickjs_framework/` — fuickjs（JS 桥 + 组件）、fuickjs_flutter（Flutter 渲染/Service）。
- `fuickjs_demo/` — demo Flutter 工程，从 `app/assets/js/*.zip` 加载内置 bundle。
  `js/tools/bundle/pack-all.js` 负责打包 zip。

## 构建与"改动如何生效"——最重要的坑

构建入口：`cd js && npm run build`（执行 `js/esbuild.js`）：

1. esbuild 打包 `src/index.ts` → `dist/bundle.js`（minify，中文被转义为 `\uXXXX`）。
2. 拷贝到 `fuick_wallet/app/assets/js/bundle.js`。
3. **尝试用 `qjsc` 把 bundle 编译成 QuickJS 字节码 `bundle.qjc`**。
   `qjsc` 路径在 `fuickjs_engine/src/main/jni/quickjs/build/qjsc`，
   **本机该二进制不存在** → 字节码不会被重编，沿用旧 `bundle.qjc`。
4. 拷贝到 `fuickjs_demo/app/assets/js/wallet_bundle.js` 与 `wallet_bundle.qjc`。
5. 调用 `fuickjs_demo/js/tools/bundle/pack-all.js` 把所有内置 bundle 打成
   `wallet_bundle.zip` + 更新 `bundles.json`。

**Demo 运行时按 `codeForm` 加载 zip 内的代码**：
- 旧逻辑：只要 zip 里有 `bundle.qjc` 就 `codeForm: qjc`，优先执行字节码。
- **因为 qjsc 缺失，`.qjc` 是旧字节码**，demo 会一直跑旧代码 —— 你改 JS 文案/逻辑
  在 demo 上"看不到任何变化"，且复制等功能也是旧逻辑。这正是之前"资产页无法复制
  地址"的根因（不是业务 bug，是打包链路）。
- **已修复**：`pack-all.js` 现在永远只打 `.js`（`codeForm: js`），不再打包 `.qjc`。
  所以 `npm run build` 后 demo 一定加载最新 `bundle.js`。

### 让改动在 demo 上可见的标准流程

```
cd js && npm run build          # 重新打包（已改 pack-all 只打 js）
# 然后在 fuickjs_demo 目录重新 flutter run   # 必须重跑，才能把新 zip 编进 app 资源
```

> 注意：Flutter 的 asset 在 `flutter run` 构建时才打进安装包，只改文件不重跑
> Flutter 不会生效。打包后若 demo 仍显示旧内容，先确认 `flutter run` 是否真正重建。

## 验证改动的技巧

- minify 后中文是 `\uXXXX`，在 `dist/bundle.js` / zip 里 grep 原始中文搜不到，
  用转义串搜（如 `改包` → `\\u6539\\u5305`）。
- 优先用**屏幕上可见的 UI 文案变化**验证 bundle 是否生效，别只依赖 `console.log`
  （JS 日志经框架 ConsoleService 转发到 Flutter logger，未必在你看的日志流里）。

## 链 / RPC 配置

- 所有链定义在 `js/src/services/ChainRegistry.ts`，字段 `rpcUrl: string | string[]`。
- `EvmService` 已支持 `string | string[]`：多个 URL 时用 ethers `FallbackProvider`
  （**quorum=1**，任意一个节点成功即返回，避免单点 RPC 失败导致整页取不到余额）。
- Sepolia 当前用 `https://ethereum-sepolia-rpc.publicnode.com`（免 API key、国内可达）。
  Ankr / drpc / blastapi / llamarpc 等公开节点在该环境下多不可用（需 key / 停服 / 404）。
  **新增 RPC 前请先 `curl` 实测 `eth_blockNumber` 连通性再加。**
- 修改 RPC 后需重新 `npm run build` + `flutter run` 才生效。

## 资产页复制地址

- 逻辑在 `js/src/pages/wallet/WalletHomePage.tsx`（总资产卡片下地址药丸）、
  `ReceivePage.tsx`、`WalletDetailPage.tsx`，均调用
  `ClipboardService.setData(text)`（桥接 `fuickjs_flutter` 的 `clipboard_service.dart`，
  底层 `flutter/services` 的 `Clipboard`）。Flutter 侧实现正确，地址为空时会被
  `if (fullAddress)` 跳过（表现为"点了没反应也没 toast"）。
