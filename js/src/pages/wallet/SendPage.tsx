/* eslint-disable react/jsx-key */
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
} from "fuickjs";
import { Theme } from "../../theme";
import { ThemeButton, ThemeInput } from "../../components/common";
import { WalletInfo, WalletManager } from "../../services/WalletManager";
import { ChainConfig, getSelectedChain } from "../../services/ChainRegistry";
import { PasswordService } from "../../services/PasswordService";
import { ChainServiceManager } from "../../services/ChainServiceManager";
import { Icons } from "../../assets/icons";

export default function SendPage({
  wallet: initialWallet,
}: {
  wallet?: WalletInfo;
}) {
  const navigator = useNavigator();
  const [wallet, setWallet] = useState<WalletInfo | null>(
    initialWallet || null,
  );
  const [chain, setChain] = useState<ChainConfig | null>(null);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("0.00");

  useEffect(() => {
    (async () => {
      const c = await getSelectedChain();
      setChain(c);

      if (!wallet) {
        const wallets = WalletManager.getInstance().getWallets();
        if (wallets.length > 0) {
          setWallet(wallets[0]);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (wallet && chain) {
      fetchBalance();
    }
  }, [wallet, chain]);

  const fetchBalance = async () => {
    if (!wallet || !chain) return;
    const addr = wallet.addresses?.[chain.id] || wallet.address;

    try {
      const manager = ChainServiceManager.getInstance();
      const service = await manager.getService(chain.id);
      if (!service) {
        throw new Error("服务不可用");
      }
      const val = await service.getBalance(addr);
      const num = parseFloat(val);
      setBalance(num.toFixed(4));
    } catch (e) {
      setBalance("错误");
    }
  };

  const handleSend = async () => {
    if (!wallet || !chain) return;
    if (!toAddress || !amount) {
      navigator.showDialog(
        <AlertDialog
          title={<Text text="错误" fontWeight="bold" />}
          content={<Text text="请输入地址和金额" />}
          actions={[
            <InkWell onTap={() => navigator.pop()}>
              <Container padding={{ horizontal: 16, vertical: 8 }}>
                <Text text="确定" color={Theme.colors.primary} />
              </Container>
            </InkWell>,
          ]}
        />,
      );
      return;
    }

    // 1. 获取加密密钥（指纹优先 -> 密码对话框）
    let encryptionKey = await PasswordService.getEncryptionKey(navigator);
    if (!encryptionKey) return;

    setLoading(true);
    let txHash = "";
    let error: Error | null = null;

    try {
      // 2. 获取密钥
      const secret = await WalletManager.getInstance().getSecret(
        wallet.id,
        encryptionKey,
      );
      if (!secret) {
        throw new Error("解密钱包失败");
      }

      const chainType = chain.type.toLowerCase();
      let privateKey = "";

      if (secret.privateKeys && secret.privateKeys[chainType]) {
        privateKey = secret.privateKeys[chainType];
      } else if (secret.mnemonic) {
        privateKey = secret.mnemonic;
      } else if (chainType === "evm" && secret.privateKeys?.["evm"]) {
        privateKey = secret.privateKeys["evm"];
      } else {
        throw new Error(`未找到 ${chainType} 的私钥`);
      }

      const manager = ChainServiceManager.getInstance();
      const service = await manager.getService(chain.id);
      if (!service) {
        throw new Error("服务不可用");
      }

      if (secret.mnemonic && chain.type === "Solana") {
        await manager.initSignerFromMnemonic(chain.id, secret.mnemonic);
      } else {
        await manager.initSigner(chain.id, privateKey);
      }

      // 3. 立即清除敏感数据
      // @ts-ignore - 强制清除内存中的密钥
      encryptionKey = null;
      // @ts-ignore
      privateKey = null;
      // @ts-ignore
      secret.mnemonic = null;
      if (secret.privateKeys) {
        Object.keys(secret.privateKeys).forEach((k) => {
          // @ts-ignore
          secret.privateKeys[k] = null;
        });
      }

      // 4. 执行交易
      txHash = await service.transfer(toAddress, amount);
    } catch (e: any) {
      error = e;
      console.error(e);
    }

    setLoading(false);

    // 5. 显示结果（此时密钥已清除）
    if (!error) {
      navigator.showDialog(
        <AlertDialog
          title={
            <Text
              text="交易已发送"
              fontWeight="bold"
              color={Theme.colors.success}
            />
          }
          content={
            <Container width={300}>
              <Column crossAxisAlignment="start" mainAxisSize="min">
                <Text text="发送成功!" />
                <SizedBox height={8} />
                <Text
                  text={`哈希: ${txHash}`}
                  fontSize={12}
                  color={Theme.colors.textSecondary}
                />
              </Column>
            </Container>
          }
          actions={[
            <InkWell
              onTap={() => {
                navigator.pop(); // 关闭对话框
                navigator.pop(); // 返回首页
              }}
            >
              <Container padding={{ horizontal: 16, vertical: 8 }}>
                <Text
                  text="完成"
                  color={Theme.colors.primary}
                  fontWeight="bold"
                />
              </Container>
            </InkWell>,
          ]}
        />,
      );
    } else {
      navigator.showDialog(
        <AlertDialog
          title={
            <Text
              text="交易失败"
              fontWeight="bold"
              color={Theme.colors.error}
            />
          }
          content={<Text text={error.message || "未知错误"} />}
          actions={[
            <InkWell onTap={() => navigator.pop()}>
              <Container padding={{ horizontal: 16, vertical: 8 }}>
                <Text text="确定" color={Theme.colors.primary} />
              </Container>
            </InkWell>,
          ]}
        />,
      );
    }
  };

  return (
    <Scaffold
      appBar={
        <AppBar
          title={`发送 ${chain?.symbol || ""}`}
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
                  boxShadow: Theme.shadows.small,
                }}
              >
                <Column crossAxisAlignment="start">
                  <Text
                    text="从"
                    color={Theme.colors.textSecondary}
                    fontSize={14}
                  />
                  <SizedBox height={8} />
                  <Row crossAxisAlignment="center">
                    <Image
                      url={Icons.wallet}
                      width={24}
                      height={24}
                      fit="contain"
                    />
                    <SizedBox width={12} />
                    <Column>
                      <Text
                        text={wallet?.name || "我的钱包"}
                        fontWeight="bold"
                      />
                      <Text
                        text={
                          wallet?.addresses?.[chain?.id || ""] ||
                          wallet?.address ||
                          "..."
                        }
                        fontSize={12}
                        color={Theme.colors.textSecondary}
                        maxLines={1}
                        overflow="ellipsis"
                      />
                    </Column>
                  </Row>
                  <SizedBox height={12} />
                  <Text
                    text={`余额: ${balance} ${chain?.symbol || ""}`}
                    fontSize={12}
                    color={Theme.colors.textSecondary}
                  />
                </Column>
              </Container>

              <SizedBox height={24} />

              <ThemeInput
                label="接收地址"
                value={toAddress}
                onChanged={setToAddress}
                hint="0x..."
              />

              <SizedBox height={16} />

              <ThemeInput
                label="金额"
                value={amount}
                onChanged={setAmount}
                hint="0.0"
              />

              <SizedBox height={40} />

              <ThemeButton
                text={loading ? "发送中..." : "发送"}
                onTap={() => handleSend()}
                loading={loading}
              />
            </Column>
          </Padding>
        </SingleChildScrollView>
      </Container>
    </Scaffold>
  );
}
