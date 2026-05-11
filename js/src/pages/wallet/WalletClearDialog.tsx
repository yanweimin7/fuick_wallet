import React from "react";
import {
  AlertDialog,
  Text,
  useNavigator,
  Container,
  InkWell,
  Column,
} from "fuickjs";
import { Theme } from "../../theme";

export default function WalletClearDialog() {
  const navigator = useNavigator();

  const handleCancel = () => {
    navigator.pop(false);
  };

  const handleClear = () => {
    navigator.pop(true);
  };

  return (
    <AlertDialog
      title={
        <Text
          text="清除所有钱包?"
          fontWeight="bold"
          fontSize={18}
          color={Theme.colors.textPrimary}
        />
      }
      content={
        <Column mainAxisSize="min" crossAxisAlignment="start">
          <Text
            text="确定要删除所有钱包吗?"
            fontSize={16}
            color={Theme.colors.textPrimary}
          />
          <Container height={8} />
          <Text
            text="此操作无法撤销! 所有私钥将永久丢失。"
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
        <InkWell onTap={handleClear}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text
              text="全部删除"
              color={Theme.colors.error}
              fontWeight="bold"
            />
          </Container>
        </InkWell>,
      ]}
    />
  );
}
