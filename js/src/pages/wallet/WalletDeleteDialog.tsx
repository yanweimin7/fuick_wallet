import React from "react";
import {
  AlertDialog,
  Text,
  useNavigator,
  Container,
  InkWell,
  Row,
  Padding,
  Column,
} from "fuickjs";
import { WalletInfo } from "../../services/WalletManager";
import { Theme } from "../../theme";

export default function WalletDeleteDialog(props: { wallet: WalletInfo }) {
  const navigator = useNavigator();
  const walletName = props.wallet ? props.wallet.name : "钱包";

  const handleCancel = () => {
    navigator.pop(false);
  };

  const handleDelete = () => {
    navigator.pop(true);
  };

  return (
    <AlertDialog
      backgroundColor={Theme.colors.surface}
      title={
        <Text
          text="删除钱包?"
          fontWeight="bold"
          fontSize={18}
          color={Theme.colors.textPrimary}
        />
      }
      content={
        <Column mainAxisSize="min" crossAxisAlignment="start">
          <Text
            text={`确定要删除 "${walletName}" 吗?`}
            fontSize={16}
            color={Theme.colors.textPrimary}
          />
          <Container height={8} />
          <Text
            text="此操作无法撤销! 您的私钥将永久丢失。"
            color={Theme.colors.error}
            fontSize={14}
          />
        </Column>
      }
      actions={[
        <InkWell onTap={handleCancel}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text
              text="取消"
              color={Theme.colors.textSecondary}
              fontWeight="bold"
            />
          </Container>
        </InkWell>,
        <InkWell onTap={handleDelete}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="删除" color={Theme.colors.error} fontWeight="bold" />
          </Container>
        </InkWell>,
      ]}
    />
  );
}
