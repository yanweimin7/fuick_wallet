import React, { useState } from "react";
import {
    Column,
    Container,
    Row,
    Text,
    Image,
    Icon,
    GridView,
    Padding,
    SizedBox,
    Scaffold,
    AppBar,
    InkWell,
    Center,
    Stack,
    Positioned
} from "fuickjs";

// 模拟 Banner 数据
const BANNERS = [
    "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80", // Bitcoin
    "https://images.unsplash.com/photo-1622630998477-20aa696fa4a5?w=800&q=80", // Ethereum
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80", // DeFi
];

// 功能入口
const ACTIONS = [
    { name: "转账", icon: "send", color: "#2196F3" },
    { name: "收款", icon: "qr_code", color: "#4CAF50" },
    { name: "Swap", icon: "swap_horiz", color: "#FF9800" },
    { name: "买币", icon: "credit_card", color: "#9C27B0" },
];

export default function HomePage() {
    return (
        <Scaffold
            appBar={
                <AppBar
                    title="Fuick Wallet"
                    actions={[
                        <Icon name="notifications" color="white" size={24} />,
                        <SizedBox width={16} />,
                        <Icon name="qr_code_scanner" color="white" size={24} />,
                        <SizedBox width={16} />,
                    ]}
                />
            }
        >
            <Container color="#F5F5F5">
                <Column>
                    {/* Banner 区域 */}
                    <Container height={200}>
                        <Stack>
                            {/* 这里简单展示第一张图作为 Banner，实际可以使用 PageView */}
                            <Image
                                url={BANNERS[0]}
                                fit="cover"
                                width={Infinity}
                                height={200}
                            />
                            <Positioned
                                bottom={10}
                                left={20}
                            >
                                <Container
                                    padding={8}
                                    decoration={{
                                        color: "#00000066",
                                        borderRadius: 8
                                    }}
                                >
                                    <Text text="探索 Web3 的无限可能" color="white" fontWeight="bold" />
                                </Container>
                            </Positioned>
                        </Stack>
                    </Container>

                    {/* 常用功能区 */}
                    <Padding padding={16}>
                        <Container
                            decoration={{
                                color: "white",
                                borderRadius: 12,
                                // boxShadow: [{ color: "#0000001A", blurRadius: 10, offset: { dx: 0, dy: 4 } }]
                            }}
                            padding={20}
                        >
                            <Row mainAxisAlignment="spaceBetween">
                                {ACTIONS.map((action, index) => (
                                    <Column key={index} mainAxisAlignment="center" crossAxisAlignment="center">
                                        <Container
                                            width={48}
                                            height={48}
                                            decoration={{
                                                color: action.color + "22", // 浅色背景
                                                borderRadius: 24
                                            }}
                                            alignment="center"
                                        >
                                            <Icon name={action.icon} color={action.color} size={28} />
                                        </Container>
                                        <SizedBox height={8} />
                                        <Text text={action.name} fontSize={12} color="#333" />
                                    </Column>
                                ))}
                            </Row>
                        </Container>
                    </Padding>

                    {/* 热门 DApps */}
                    <Padding padding={{ left: 16, right: 16, bottom: 16 }}>
                        <Text text="热门 DApps" fontSize={18} fontWeight="bold" margin={{ bottom: 12 }} />
                        <GridView
                            crossAxisCount={2}
                            childAspectRatio={1.5}
                            mainAxisSpacing={12}
                            crossAxisSpacing={12}
                            shrinkWrap={true}
                            children={[1, 2, 3, 4].map((i) => (
                                <Container
                                    key={i}
                                    decoration={{
                                        color: "white",
                                        borderRadius: 8
                                    }}
                                    padding={12}
                                >
                                    <Row>
                                        <Container width={40} height={40} color="#eee" decoration={{ borderRadius: 20 }} />
                                        <SizedBox width={10} />
                                        <Column mainAxisAlignment="center">
                                            <Text text={`DApp ${i}`} fontWeight="bold" />
                                            <Text text="DeFi Protocol" fontSize={10} color="grey" />
                                        </Column>
                                    </Row>
                                </Container>
                            ))}
                        />
                    </Padding>
                </Column>
            </Container>
        </Scaffold>
    );
}
