import React, { useEffect, useState } from "react";
import { AppBar, Button, Center, Column, Scaffold, useNavigator, Container, Text, CircularProgressIndicator, Padding } from "fuickjs";
import { WalletService } from "../../services/WalletService";
import { WalletManager } from "../../services/WalletManager";

export default function CreateWalletPage(props: { nextPath?: string }) {
  const navigator = useNavigator();
  const [error, setError] = useState("");

  useEffect(() => {
    // Debug: Check connectivity
    WalletService.ping().then(res => console.log("Wallet Service Ping:", res)).catch(e => console.error("Wallet Service Ping Failed:", e));

    const createAndNavigate = async () => {
      try {
        const w = await WalletManager.getInstance().createWallet();
        if (w) {
          // 延迟一点跳转，让用户看到完成状态（可选，或者直接跳）
          if (props.nextPath) {
            // @ts-ignore
            (navigator as any).pushReplace(props.nextPath, w);
          } else {
            navigator.pop(false, w);
          }
        } else {
          setError("Wallet creation returned null");
        }
      } catch (e: any) {
        console.error("Failed to create wallet", e);
        setError("Failed: " + (e.message || e.toString()));
      }
    };

    createAndNavigate();
  }, []);

  if (error) {
    return (
      <Scaffold appBar={<AppBar title="Error" />}>
        <Center>
          <Text text={error} color="red" />
          <Container height={20} />
          <Button text="Retry" onTap={() => navigator.pop()} />
        </Center>
      </Scaffold>
    );
  }

  return (
    <Scaffold appBar={<AppBar title="Creating Wallet" />}>
      <Center>
        <Column mainAxisAlignment="center" crossAxisAlignment="center">
          <CircularProgressIndicator />
          <Container height={24} />
          <Text text="Creating your secure wallet..." fontWeight="bold" fontSize={16} />
          <Container height={8} />
          <Text text="This may take a few seconds." fontSize={12} color="#666666" />
        </Column>
      </Center>
    </Scaffold>
  );
}
