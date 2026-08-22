/**
 * DApp 链 Handler 抽象层。
 *
 * 每一条链（EVM / Solana / ...）实现一个 DAppChainHandler，
 * 负责该链相关的：注入脚本、请求派发与处理（账户 / 只读 RPC / 签名 / 发交易 / 切链）。
 * 浏览器页只需把来自页面的请求派发给 registry，无需感知具体链。
 *
 * 新增一条链 = 实现该接口 + 在自己的注入脚本里挂载对应 provider（如 window.solana）
 * + 调用 DAppBridgeService.registerHandler(...) 注册即可。
 */

/** 浏览器页提供给 handler 的 UI / 副作用能力（链无关） */
export interface DAppHandlerContext {
  /** dApp 来源 origin（页面 location.origin） */
  origin: string;
  /** 弹密码框，返回 encryptionKey；用户取消返回 null */
  requestPassword: () => Promise<string | null>;
  /** 弹确认框（连接 / 签名 / 交易），返回是否确认 */
  confirm: (title: string, body: string) => Promise<boolean>;
  /** 通知页面 provider 链变化（用于 window.__fuickEmit('chainChanged')） */
  emitChainChanged: (chainId: string) => void;
  /** 通知页面 provider 账户变化 */
  emitAccountsChanged: (accounts: string[]) => void;
  /** 更新顶部「已连接」状态药丸 */
  setConnected: (connected: boolean) => void;
}

export interface DAppChainHandler {
  /** 链类型标识，如 'eip155' | 'solana' */
  readonly chainKind: string;
  /** 该 handler 注入到页面的 provider 脚本（如 EIP-1193 的 window.ethereum） */
  readonly injectScript: string;
  /** 是否处理该 JSON-RPC 方法（用于派发路由） */
  supports: (method: string) => boolean;
  /** 统一处理入口：页面请求经此派发 */
  handle: (
    method: string,
    params: any[],
    ctx: DAppHandlerContext,
  ) => Promise<unknown>;
}
