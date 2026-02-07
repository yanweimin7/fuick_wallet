import React from "react";
import {
    Column,
    Container,
    Row,
    Text,
    Image,
    Icon,
    Padding,
    SizedBox,
    Scaffold,
    AppBar,
    Stack,
    Positioned,
    Expanded,
    SingleChildScrollView,
    InkWell
} from "fuickjs";
import { Theme } from "../../theme";
import { Card } from "../../components/common";

// 模拟 Banner 数据
const BANNERS = [
    "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&q=80", // Bitcoin
    "https://images.unsplash.com/photo-1622630998477-20aa696fa4a5?w=800&q=80", // Ethereum
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80", // DeFi
];

// 功能入口
const ACTIONS = [
    { name: "Transfer", icon: "send", color: "#2196F3" },
    { name: "Receive", icon: "qr_code", color: "#4CAF50" },
    { name: "Swap", icon: "swap_horiz", color: "#FF9800" },
    { name: "Buy", icon: "credit_card", color: "#9C27B0" },
];

export default function HomePage() {
    return (
        <Scaffold
            appBar={
                <AppBar
                    title="Discovery"
                    backgroundColor={Theme.colors.surface}
                    elevation={0}
                    actions={[
                        <Icon name="notifications" color={Theme.colors.textPrimary} size={24} />,
                        <SizedBox width={16} />,
                        <Icon name="qr_code_scanner" color={Theme.colors.textPrimary} size={24} />,
                        <SizedBox width={16} />,
                    ]}
                />
            }
        >
            <Container color={Theme.colors.background}>
                <SingleChildScrollView>
                    <Column>
                        {/* Banner 区域 */}
                        <Padding padding={16}>
                            <Container
                                height={200}
                                decoration={{
                                    borderRadius: Theme.borderRadius.l,
                                    boxShadow: Theme.shadows.medium,
                                    color: Theme.colors.surface
                                }}
                            >
                                <Stack>
                                    <Container
                                        decoration={{
                                            borderRadius: Theme.borderRadius.l,
                                            // clipBehavior: 'antiAlias', // Note: Check if supported
                                        }}
                                    >
                                        <Image
                                            url={BANNERS[0]}
                                            fit="cover"
                                            width={Infinity}
                                            height={200}
                                        />
                                    </Container>
                                    <Positioned
                                        bottom={0}
                                        left={0}
                                        right={0}
                                    >
                                        <Container
                                            padding={16}
                                            decoration={{
                                                color: "#00000080",
                                                borderRadius: { bottomLeft: Theme.borderRadius.l, bottomRight: Theme.borderRadius.l }
                                            }}
                                        >
                                            <Text text="Explore Web3 Possibilities" color="white" fontWeight="bold" fontSize={18} />
                                        </Container>
                                    </Positioned>
                                </Stack>
                            </Container>
                        </Padding>

                        {/* 常用功能区 */}
                        <Padding padding={{ horizontal: 16 }}>
                            <Card padding={20}>
                                <Row mainAxisAlignment="spaceBetween">
                                    {ACTIONS.map((action, index) => (
                                        <Column key={index} mainAxisAlignment="center" crossAxisAlignment="center">
                                            <InkWell>
                                                <Container
                                                    width={56}
                                                    height={56}
                                                    decoration={{
                                                        color: action.color + "1A", // 10% opacity
                                                        borderRadius: 28
                                                    }}
                                                    alignment="center"
                                                >
                                                    <Icon name={action.icon} color={action.color} size={28} />
                                                </Container>
                                            </InkWell>
                                            <SizedBox height={8} />
                                            <Text text={action.name} fontSize={14} color={Theme.colors.textPrimary} fontWeight="w500" />
                                        </Column>
                                    ))}
                                </Row>
                            </Card>
                        </Padding>

                        <SizedBox height={24} />

                        <Padding padding={{ horizontal: 16 }}>
                            <Text text="Trending Assets" fontSize={18} fontWeight="bold" color={Theme.colors.textPrimary} />
                        </Padding>
                        <SizedBox height={12} />

                        {/* Placeholder List */}
                        {[1, 2, 3].map((i) => (
                            <Padding key={i} padding={{ horizontal: 16, vertical: 6 }}>
                                <Card padding={16}>
                                    <Row crossAxisAlignment="center">
                                        <Container width={40} height={40} decoration={{ color: Theme.colors.primaryLight, borderRadius: 20 }} alignment="center">
                                            <Text text={`#${i}`} color="white" fontWeight="bold" />
                                        </Container>
                                        <SizedBox width={16} />
                                        <Expanded>
                                            <Column crossAxisAlignment="start">
                                                <Text text={`Token ${i}`} fontWeight="bold" fontSize={16} />
                                                <Text text="+5.24%" color={Theme.colors.success} fontSize={14} />
                                            </Column>
                                        </Expanded>
                                        <Text text="$1,234.56" fontWeight="bold" fontSize={16} />
                                    </Row>
                                </Card>
                            </Padding>
                        ))}
                        <SizedBox height={30} />
                    </Column>
                </SingleChildScrollView>
            </Container>
        </Scaffold>
    );
}
