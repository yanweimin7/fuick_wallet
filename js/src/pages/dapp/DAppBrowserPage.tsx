import React, { useState, useRef, useEffect } from "react";
import {
  Scaffold,
  Column,
  Row,
  Container,
  Text,
  Icon,
  InkWell,
  AlertDialog,
  CircularProgressIndicator,
  Expanded,
  SafeArea,
  LinearProgressIndicator,
  SingleChildScrollView,
  SizedBox,
  ClipboardService,
  ToastService,
  useNavigator,
} from "fuickjs";
import { WebView } from "@fuickjs-community/web_view";
import { Theme } from "../../theme";
import { DAppBridgeService } from "../../services/DAppBridgeService";
import { DAppHandlerContext } from "../../services/dapp/DAppChainHandler";
import { VerifyPasswordDialog } from "../../components/PasswordDialogs";
import { IconBadge, ThemeButton } from "../../components/common";

function shortAddr(a?: string | null): string {
  if (!a) return "";
  return a.length > 14 ? `${a.slice(0, 8)}...${a.slice(-6)}` : a;
}

function toOrigin(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

function normalizeUrl(input: string): string {
  const s = input.trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  return "https://" + s;
}

function hostOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

function IconButton({
  name,
  onTap,
  color,
  size = 22,
  disabled = false,
}: {
  name: string;
  onTap?: () => void;
  color?: string;
  size?: number;
  disabled?: boolean;
}) {
  return (
    <InkWell onTap={disabled ? () => {} : onTap}>
      <Container padding={{ horizontal: 14, vertical: 10 }}>
        <Icon
          name={name}
          size={size}
          color={
            disabled ? Theme.colors.textHint : color || Theme.colors.textPrimary
          }
        />
      </Container>
    </InkWell>
  );
}

/** 所有已注册链的注入脚本拼接到一起，随页面加载注入 */
const INJECT_SCRIPT = DAppBridgeService.getHandlers()
  .map((h) => h.injectScript)
  .filter(Boolean)
  .join("\n");

export default function DAppBrowserPage(args: {
  url?: string;
  title?: string;
}) {
  const navigator = useNavigator();
  const webViewRef = useRef<WebView>(null);
  const initialUrl = args.url || "https://app.uniswap.org";

  const [url, setUrl] = useState(initialUrl);
  const [title, setTitle] = useState(args.title || "");
  const [progress, setProgress] = useState(0);
  const [connected, setConnected] = useState(false);
  const [origin, setOrigin] = useState(toOrigin(initialUrl));

  const refreshConnection = async (currentUrl?: string) => {
    const o = toOrigin(currentUrl || url);
    if (!o) return;
    setOrigin(o);
    setConnected(await DAppBridgeService.isOriginConnected(o));
  };

  useEffect(() => {
    refreshConnection();
  }, []);

  const showConfirm = async (
    titleText: string,
    body: string,
  ): Promise<boolean> => {
    return (await navigator.showDialog(
      <AlertDialog
        backgroundColor={Theme.colors.surface}
        title={
          <Text
            text={titleText}
            fontWeight="bold"
            fontSize={18}
            color={Theme.colors.textPrimary}
          />
        }
        content={
          <Text text={body} fontSize={14} color={Theme.colors.textSecondary} />
        }
        actions={[
          <InkWell key="cancel" onTap={() => navigator.pop(false)}>
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text
                text="取消"
                color={Theme.colors.textSecondary}
                fontWeight="bold"
              />
            </Container>
          </InkWell>,
          <InkWell key="ok" onTap={() => navigator.pop(true)}>
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text
                text="确认"
                color={Theme.colors.primary}
                fontWeight="bold"
              />
            </Container>
          </InkWell>,
        ]}
      />,
    )) as boolean;
  };

  const showInfo = async (titleText: string, body: string) => {
    await navigator.showDialog(
      <AlertDialog
        backgroundColor={Theme.colors.surface}
        title={
          <Text
            text={titleText}
            fontWeight="bold"
            fontSize={18}
            color={Theme.colors.textPrimary}
          />
        }
        content={
          <Text text={body} fontSize={14} color={Theme.colors.textSecondary} />
        }
        actions={[
          <InkWell key="ok" onTap={() => navigator.pop(true)}>
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text
                text="知道了"
                color={Theme.colors.primary}
                fontWeight="bold"
              />
            </Container>
          </InkWell>,
        ]}
      />,
    );
  };

  const requestPassword = async (): Promise<string | null> => {
    const encryptionKey = await navigator.showDialog(<VerifyPasswordDialog />);
    return encryptionKey ? (encryptionKey as string) : null;
  };

  /** 连接授权底部弹层：展示 dApp 站点与本地钱包的对应关系（与「已连接站点」风格一致） */
  const ConnectConfirmSheet = ({
    origin,
    address,
    chainKind,
  }: {
    origin: string;
    address: string;
    chainKind: string;
  }) => {
    const nav = useNavigator();
    const host = hostOf(origin);
    const chainLabel = chainKind === "solana" ? "Solana" : "EVM";
    return (
      <Container
        color={Theme.colors.surface}
        borderRadius={{ topLeft: Theme.borderRadius.xl, topRight: Theme.borderRadius.xl }}
        padding={{ horizontal: 20, top: 16, bottom: 24 }}
      >
        <SingleChildScrollView scrollDirection="vertical">
          <Column crossAxisAlignment="stretch">
          <Row crossAxisAlignment="center" mainAxisAlignment="spaceBetween">
            <Text
              text="连接请求"
              fontSize={18}
              fontWeight="bold"
              color={Theme.colors.textPrimary}
            />
            <InkWell onTap={() => nav.pop(false)}>
              <Container padding={{ horizontal: 8, vertical: 6 }}>
                <Icon name="close" color={Theme.colors.textHint} size={22} />
              </Container>
            </InkWell>
          </Row>
          <SizedBox height={4} />
          <Text
            text={`${host} 想要连接你的钱包`}
            fontSize={12}
            color={Theme.colors.textHint}
          />
          <SizedBox height={16} />

          <Container
            padding={{ all: 14 }}
            decoration={{
              color: Theme.colors.surfaceVariant,
              borderRadius: Theme.borderRadius.m,
            }}
          >
            <Row crossAxisAlignment="center">
              <IconBadge icon="public" color={Theme.colors.accent} size={40} />
              <SizedBox width={12} />
              <Expanded flex={1}>
                <Text
                  text={host}
                  fontSize={14}
                  fontWeight="bold"
                  color={Theme.colors.textPrimary}
                />
                <SizedBox height={2} />
                <Text text="dApp 站点" fontSize={12} color={Theme.colors.textHint} />
              </Expanded>
            </Row>
          </Container>

          <SizedBox height={8} />
          <Icon name="arrow_downward" color={Theme.colors.textHint} size={18} />
          <SizedBox height={8} />

          <Container
            padding={{ all: 14 }}
            decoration={{
              color: Theme.colors.surfaceVariant,
              borderRadius: Theme.borderRadius.m,
            }}
          >
            <Row crossAxisAlignment="center">
              <IconBadge
                icon="account_balance_wallet"
                color={Theme.colors.primary}
                size={40}
              />
              <SizedBox width={12} />
              <Expanded flex={1}>
                <Text
                  text="Fuick Wallet"
                  fontSize={14}
                  fontWeight="bold"
                  color={Theme.colors.textPrimary}
                />
                <SizedBox height={2} />
                <Text
                  text={`${chainLabel} · ${shortAddr(address)}`}
                  fontSize={12}
                  color={Theme.colors.textHint}
                />
              </Expanded>
            </Row>
          </Container>

          <SizedBox height={14} />
          <Text
            text="仅共享公开地址，不会泄露私钥"
            fontSize={11}
            color={Theme.colors.textHint}
            textAlign="center"
          />

          <SizedBox height={16} />
          <Row mainAxisAlignment="spaceBetween">
            <Expanded flex={1}>
              <Container margin={{ right: 6 }}>
                <ThemeButton
                  text="取消"
                  variant="outline"
                  fullWidth
                  onTap={() => nav.pop(false)}
                />
              </Container>
            </Expanded>
            <Expanded flex={1}>
              <Container margin={{ left: 6 }}>
                <ThemeButton
                  text="连接"
                  fullWidth
                  onTap={() => nav.pop(true)}
                />
              </Container>
            </Expanded>
          </Row>
          </Column>
        </SingleChildScrollView>
      </Container>
    );
  };

  const showConnectConfirm = async (
    origin: string,
    address: string,
    chainKind: string,
  ): Promise<boolean> => {
    return (await navigator.showBottomSheet(
      <ConnectConfirmSheet
        origin={origin}
        address={address}
        chainKind={chainKind}
      />,
      { maxHeight: 560, backgroundColor: Theme.colors.surface },
    )) as boolean;
  };

  const emitChainChanged = (chainId: string) => {
    const dec = parseInt(chainId, 16);
    webViewRef.current?.evaluateJavascript(
      `window.ethereum && window.ethereum.setChainId(${dec});` +
        `window.solana && window.solana.setChainId && window.solana.setChainId(${dec});`,
    );
  };

  const emitAccountsChanged = (accounts: string[]) => {
    webViewRef.current?.evaluateJavascript(
      `window.ethereum && window.ethereum.setAccounts(${JSON.stringify(accounts)});` +
        `window.solana && window.solana.setAccounts && window.solana.setAccounts(${JSON.stringify(accounts)});`,
    );
  };

  const respond = (id: string, ok: boolean, result: unknown) => {
    const dataJson = JSON.stringify(result ?? null);
    webViewRef.current?.evaluateJavascript(
      `window.__fuickResolve(${JSON.stringify(id)}, ${ok ? "true" : "false"}, ${JSON.stringify(dataJson)})`,
    );
  };

  const handleMessage = async (payload: unknown) => {
    let raw: any = payload;
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        /* keep */
      }
    }
    if (Array.isArray(raw) && raw.length > 0) raw = raw[0];
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        /* keep */
      }
    }
    const msg: any = raw;
    const { id, method, params, origin: msgOrigin } = msg;
    const originToUse = msgOrigin || origin;
    const ctx: DAppHandlerContext = {
      origin: originToUse,
      requestPassword,
      confirm: showConfirm,
      confirmConnect: showConnectConfirm,
      emitChainChanged,
      emitAccountsChanged,
      setConnected,
    };
    try {
      const handler = DAppBridgeService.resolveHandler(method);
      const result = await handler.handle(method, params || [], ctx);
      respond(id, true, result);
    } catch (e: any) {
      console.error("[DApp] request failed", method, e);
      respond(id, false, e?.message || "rejected");
    }
  };

  const secure = toOrigin(url).startsWith("https://");
  const loading = progress > 0 && progress < 100;

  return (
    <Scaffold backgroundColor={Theme.colors.background}>
      <Column crossAxisAlignment="stretch">
        <SafeArea>
          <Container
            decoration={{
              color: Theme.colors.background,
              border: { bottom: { width: 1, color: Theme.colors.divider } },
            }}
            padding={{ horizontal: 8, top: 8, bottom: 8 }}
          >
            <Row crossAxisAlignment="center">
              <IconButton name="arrow_back" onTap={() => navigator.pop()} />
              <Expanded flex={1}>
                <Container
                  padding={{ horizontal: 12, vertical: 7 }}
                  decoration={{
                    color: Theme.colors.surfaceVariant,
                    borderRadius: Theme.borderRadius.full,
                  }}
                >
                  <Row crossAxisAlignment="center">
                    <Icon
                      name={secure ? "lock" : "lock_open"}
                      size={16}
                      color={
                        secure ? Theme.colors.success : Theme.colors.warning
                      }
                    />
                    <SizedBox width={8} />
                    <Expanded flex={1}>
                      <Text
                        text={hostOf(url)}
                        fontSize={14}
                        color={Theme.colors.textPrimary}
                        maxLines={1}
                        overflow="ellipsis"
                      />
                    </Expanded>
                  </Row>
                </Container>
              </Expanded>
              <InkWell
                onTap={() =>
                  showInfo(
                    "连接状态",
                    connected
                      ? `已连接到 ${origin}\n该站点可读取你的地址并发起签名请求。`
                      : `未连接到 ${origin}\n在 dApp 中点击「连接钱包」即可授权。`,
                  )
                }
              >
                <Container
                  padding={{ horizontal: 10, vertical: 7 }}
                  margin={{ left: 4 }}
                  decoration={{
                    color: connected
                      ? Theme.colors.success + "1A"
                      : Theme.colors.surfaceVariant,
                    borderRadius: Theme.borderRadius.full,
                  }}
                >
                  <Row crossAxisAlignment="center">
                    <Container
                      width={6}
                      height={6}
                      decoration={{
                        color: connected
                          ? Theme.colors.success
                          : Theme.colors.textHint,
                        borderRadius: Theme.borderRadius.full,
                      }}
                    />
                    <SizedBox width={6} />
                    <Text
                      text={connected ? "已连接" : "未连接"}
                      fontSize={12}
                      fontWeight="bold"
                      color={
                        connected
                          ? Theme.colors.success
                          : Theme.colors.textSecondary
                      }
                    />
                  </Row>
                </Container>
              </InkWell>
            </Row>
            {loading ? (
              <Container margin={{ top: 8 }}>
                <LinearProgressIndicator
                  value={progress / 100}
                  color={Theme.colors.primary}
                  backgroundColor={Theme.colors.accent + "22"}
                  strokeWidth={2}
                  borderRadius={2}
                />
              </Container>
            ) : null}
          </Container>
        </SafeArea>

        <Expanded flex={1}>
          <WebView
            ref={webViewRef}
            url={url}
            injectedJavaScript={INJECT_SCRIPT}
            onMessage={(payload: unknown) => handleMessage(payload)}
            onConsoleMessage={(m: string) => console.log("[DAppWebView]", m)}
            onTitleChanged={(t: string) => setTitle(t)}
            onProgressChanged={(p: number) => setProgress(p)}
            onLoadStop={(u: string) => {
              setUrl(u);
              refreshConnection(u);
            }}
          />
        </Expanded>

        <SafeArea>
          <Container
            decoration={{
              color: Theme.colors.surface,
              border: { top: { width: 1, color: Theme.colors.divider } },
            }}
          >
            <Row
              crossAxisAlignment="center"
              mainAxisAlignment="spaceEvenly"
              padding={{ top: 4, bottom: 4 }}
            >
              <IconButton
                name="arrow_back"
                onTap={() => webViewRef.current?.goBack()}
              />
              <IconButton
                name="arrow_forward"
                onTap={() => webViewRef.current?.goForward()}
              />
              <IconButton
                name="refresh"
                onTap={() => webViewRef.current?.reload()}
              />
              <IconButton
                name="home"
                onTap={() => navigator.push("/wallet/dapp_discover")}
              />
              <IconButton
                name="share"
                onTap={async () => {
                  await ClipboardService.setData(url);
                  ToastService.show("已复制当前网址");
                }}
              />
            </Row>
          </Container>
        </SafeArea>
      </Column>
    </Scaffold>
  );
}
