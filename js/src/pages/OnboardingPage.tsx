import React from "react";
import {
  AppBar,
  Button,
  Center,
  Column,
  Scaffold,
  useNavigator,
  Container,
  Text,
  Icon,
  SizedBox,
  Image,
  Padding,
  InkWell
} from "fuickjs";

export default function OnboardingPage() {
  const navigator = useNavigator();

  return (
    <Scaffold backgroundColor="white">
      <Center>
        <Padding padding={32}>
          <Column crossAxisAlignment="center" mainAxisAlignment="center">
            {/* Logo area */}
            <Container
              width={100}
              height={100}
              decoration={{
                color: "#2196F3",
                borderRadius: 20,
              }}
              alignment="center"
            >
              <Icon name="account_balance_wallet" size={60} color="white" />
            </Container>

            <SizedBox height={32} />

            <Text
              text="Fuick Wallet"
              fontSize={28}
              fontWeight="bold"
              color="#333"
            />
            <SizedBox height={12} />
            <Text
              text="安全、易用的 Web3 钱包"
              fontSize={16}
              color="#666"
            />
            <SizedBox height={60} />

            <InkWell onTap={() => (navigator as any).pushReplace("/wallet/create", { nextPath: "/wallet/home" })}>
              <Container
                width={240}
                height={48}
                decoration={{
                  color: "#2196F3",
                  borderRadius: 24,
                }}
                alignment="center"
              >
                <Text text="创建新钱包" color="white" fontWeight="bold" />
              </Container>
            </InkWell>

            <SizedBox height={20} />

            <InkWell onTap={() => (navigator as any).pushReplace("/wallet/import", { nextPath: "/wallet/home" })}>
              <Container
                width={240}
                height={48}
                decoration={{
                  color: "#E3F2FD",
                  borderRadius: 24,
                }}
                alignment="center"
              >
                <Text text="导入钱包" color="#1976D2" fontWeight="bold" />
              </Container>
            </InkWell>
          </Column>
        </Padding>
      </Center>
    </Scaffold>
  );
}
