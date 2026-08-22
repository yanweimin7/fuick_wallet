import React, { useState, useEffect } from "react";
import {
  Scaffold,
  AppBar,
  Container,
  Column,
  Text,
  SizedBox,
  useNavigator,
  Padding,
  Row,
  Image,
  AlertDialog,
  InkWell,
  SingleChildScrollView,
  ClipboardService,
  ToastService,
} from "fuickjs";
import { Theme } from "../../theme";
import { ThemeButton, ThemeInput } from "../../components/common";
import { ChainRegistry, TokenConfig } from "../../services/ChainRegistry";
import { ChainServiceManager } from "../../services/ChainServiceManager";
import { CustomTokenService } from "../../services/CustomTokenService";
import { Icons, ChainIcons } from "../../assets/icons";

function isValidEvmAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr.trim());
}

export default function AddTokenPage({
  walletId,
  chainId,
}: {
  walletId?: string;
  chainId?: string;
}) {
  const navigator = useNavigator();
  const chain = chainId ? ChainRegistry.getById(chainId) : undefined;

  const [address, setAddress] = useState("");
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [decimals, setDecimals] = useState(
    chain?.type === "Solana" ? "9" : "18",
  );
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDecimals(chain?.type === "Solana" ? "9" : "18");
  }, [chain?.type]);

  const detect = async () => {
    setError("");
    const addr = address.trim();
    if (!addr) {
      setError("请输入合约地址");
      return;
    }
    if (chain?.type === "EVM" && !isValidEvmAddress(addr)) {
      setError("无效的 EVM 合约地址");
      return;
    }
    if (!chainId) {
      setError("缺少链信息");
      return;
    }
    setDetecting(true);
    try {
      const service = await ChainServiceManager.getInstance().getService(
        chainId,
      );
      // @ts-ignore - getTokenMetadata exists on both Evm/Solana services
      const meta = service ? await service.getTokenMetadata(addr) : null;
      if (meta) {
        setName(meta.name || name);
        setSymbol(meta.symbol || symbol || addr.slice(0, 6));
        if (meta.decimals != null) setDecimals(String(meta.decimals));
      } else {
        setError("无法自动识别，请手动填写代币信息");
      }
    } catch (e: any) {
      setError(e?.message || "识别失败，请手动填写代币信息");
    } finally {
      setDetecting(false);
    }
  };

  const save = async () => {
    setError("");
    const addr = address.trim();
    if (!addr) {
      setError("请输入合约地址");
      return;
    }
    if (chain?.type === "EVM" && !isValidEvmAddress(addr)) {
      setError("无效的 EVM 合约地址");
      return;
    }
    const sym = symbol.trim();
    if (!sym) {
      setError("请填写代币符号");
      return;
    }
    const dec = parseInt(decimals, 10);
    if (isNaN(dec) || dec < 0 || dec > 36) {
      setError("精度需为 0-36 的整数");
      return;
    }
    if (!walletId || !chainId) {
      setError("缺少钱包或链信息");
      return;
    }
    setSaving(true);
    try {
      const token: TokenConfig = {
        symbol: sym,
        name: name.trim() || sym,
        address: addr,
        decimals: dec,
      };
      await CustomTokenService.addToken(walletId, chainId, token);
      navigator.pop(true);
    } catch (e: any) {
      setError(e?.message || "保存失败");
      setSaving(false);
    }
  };

  const handleExport = async () => {
    if (!walletId) {
      setError("缺少钱包信息");
      return;
    }
    const text = await CustomTokenService.buildBackupText(walletId);
    navigator.showBottomSheet(
      <Container color={Theme.colors.surface} padding={20}>
        <Column crossAxisAlignment="start">
          <Text text="自定义代币备份" fontWeight="bold" fontSize={18} />
          <SizedBox height={8} />
          <Text
            text="复制下方内容保存即可备份；之后可在本页「导入备份」恢复。"
            fontSize={13}
            color={Theme.colors.textSecondary}
          />
          <SizedBox height={12} />
          <Container
            height={280}
            padding={12}
            decoration={{
              color: Theme.colors.background,
              borderRadius: Theme.borderRadius.s,
              border: { width: 1, color: Theme.colors.divider },
            }}
          >
            <SingleChildScrollView scrollDirection="vertical">
              <Text text={text} fontSize={12} color={Theme.colors.textPrimary} />
            </SingleChildScrollView>
          </Container>
          <SizedBox height={16} />
          <ThemeButton
            text="复制到剪贴板"
            onTap={async () => {
              await ClipboardService.setData(text);
              ToastService.show("已复制");
            }}
          />
          <SizedBox height={8} />
          <ThemeButton
            text="关闭"
            variant="text"
            onTap={() => navigator.pop()}
          />
        </Column>
      </Container>,
      { maxHeight: 0.9 },
    );
  };

  const [importText, setImportText] = useState("");

  const handleImportClick = () => {
    navigator.showBottomSheet(
      <Container color={Theme.colors.surface} padding={20}>
        <Column crossAxisAlignment="start">
          <Text text="导入备份" fontWeight="bold" fontSize={18} />
          <SizedBox height={12} />
          <ThemeInput
            label="粘贴备份内容"
            value={importText}
            onChanged={setImportText}
            hint="粘贴导出的 JSON"
            maxLines={6}
          />
          <SizedBox height={16} />
          <ThemeButton
            text="导入"
            onTap={async () => {
              const items = CustomTokenService.parseBackupText(importText);
              if (!items) {
                ToastService.show("备份格式无效");
                return;
              }
              if (!walletId) {
                ToastService.show("缺少钱包信息");
                return;
              }
              const n = await CustomTokenService.importTokens(
                walletId,
                items,
              );
              navigator.pop();
              ToastService.show(`已导入 ${n} 个代币`);
              setTimeout(() => navigator.pop(true), 200);
            }}
          />
          <SizedBox height={8} />
          <ThemeButton
            text="取消"
            variant="text"
            onTap={() => navigator.pop()}
          />
        </Column>
      </Container>,
      { maxHeight: 0.9 },
    );
  };

  return (
    <Scaffold
      appBar={
        <AppBar
          title="添加代币"
          backgroundColor={Theme.colors.surface}
          elevation={0}
          centerTitle={true}
        />
      }
    >
      <Container color={Theme.colors.background}>
        <SingleChildScrollView>
          <Padding padding={20}>
            <Column>
              <Container
                padding={16}
                decoration={{
                  color: Theme.colors.surface,
                  borderRadius: Theme.borderRadius.l,
                  border: { width: 1, color: Theme.colors.divider },
                }}
              >
                <Row crossAxisAlignment="center">
                  <Image
                    url={
                      chain && ChainIcons[chain.icon || "ethereum"]
                        ? ChainIcons[chain.icon || "ethereum"]
                        : ChainIcons.ethereum
                    }
                    width={20}
                    height={20}
                    fit="contain"
                  />
                  <SizedBox width={10} />
                  <Text
                    text={`链: ${chain?.name || "未知"}`}
                    fontWeight="bold"
                  />
                </Row>
              </Container>

              <SizedBox height={24} />

              <ThemeInput
                label="合约地址"
                value={address}
                onChanged={(v) => setAddress(v)}
                hint={
                  chain?.type === "Solana"
                    ? "Solana mint 地址"
                    : "0x 合约地址"
                }
              />

              <SizedBox height={12} />

              <ThemeButton
                text={detecting ? "识别中..." : "自动识别"}
                variant="outline"
                onTap={detect}
                loading={detecting}
              />

              <SizedBox height={24} />

              <ThemeInput
                label="代币符号"
                value={symbol}
                onChanged={(v) => setSymbol(v)}
                hint="如 USDT"
              />

              <SizedBox height={16} />

              <ThemeInput
                label="代币名称"
                value={name}
                onChanged={(v) => setName(v)}
                hint="可选"
              />

              <SizedBox height={16} />

              <ThemeInput
                label="精度 (decimals)"
                value={decimals}
                onChanged={(v) => setDecimals(v)}
                hint="如 18"
              />

              {error ? (
                <>
                  <SizedBox height={16} />
                  <Text
                    text={error}
                    color={Theme.colors.error}
                    fontSize={13}
                  />
                </>
              ) : null}

              <SizedBox height={40} />

              <ThemeButton
                text={saving ? "保存中..." : "保存"}
                onTap={save}
                loading={saving}
              />

              <SizedBox height={16} />

              <ThemeButton
                text="导出备份"
                variant="outline"
                fullWidth
                onTap={handleExport}
              />

              <SizedBox height={12} />

              <ThemeButton
                text="导入备份"
                variant="outline"
                fullWidth
                onTap={handleImportClick}
              />
            </Column>
          </Padding>
        </SingleChildScrollView>
      </Container>
    </Scaffold>
  );
}
