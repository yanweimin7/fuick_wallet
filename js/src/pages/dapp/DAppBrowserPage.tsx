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
          color={disabled ? Theme.colors.textHint : color || Theme.colors.textPrimary}
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

export default function DAppBrowserPage(args: { url?: string; title?: string }) {
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
          <Text text={titleText} fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />
        }
        content={<Text text={body} fontSize={14} color={Theme.colors.textSecondary} />}
        actions={[
          <InkWell key="cancel" onTap={() => navigator.pop(false)}>
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text text="取消" color={Theme.colors.textSecondary} fontWeight="bold" />
            </Container>
          </InkWell>,
          <InkWell key="ok" onTap={() => navigator.pop(true)}>
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text text="确认" color={Theme.colors.primary} fontWeight="bold" />
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
          <Text text={titleText} fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />
        }
        content={<Text text={body} fontSize={14} color={Theme.colors.textSecondary} />}
        actions={[
          <InkWell key="ok" onTap={() => navigator.pop(true)}>
            <Container padding={{ horizontal: 16, vertical: 8 }}>
              <Text text="知道了" color={Theme.colors.primary} fontWeight="bold" />
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

  const emitChainChanged = (chainId: string) => {
    const dec = parseInt(chainId, 16);
    webViewRef.current?.evaluateJavascript(
      `window.ethereum && window.ethereum.setChainId(${dec})`,
    );
  };

  const emitAccountsChanged = (accounts: string[]) => {
    webViewRef.current?.evaluateJavascript(
      `window.ethereum && window.ethereum.setAccounts(${JSON.stringify(accounts)})`,
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
      try { raw = JSON.parse(raw); } catch { /* keep */ }
    }
    if (Array.isArray(raw) && raw.length > 0) raw = raw[0];
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw); } catch { /* keep */ }
    }
    const msg: any = raw;
    const { id, method, params, origin: msgOrigin } = msg;
    const originToUse = msgOrigin || origin;
    const ctx: DAppHandlerContext = {
      origin: originToUse,
      requestPassword,
      confirm: showConfirm,
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
                      color={secure ? Theme.colors.success : Theme.colors.warning}
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
                        connected ? Theme.colors.success : Theme.colors.textSecondary
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
