import React from 'react';
import { AlertDialog, Text, useNavigator, Container, InkWell, Column } from 'fuickjs';
import { Theme } from '../../theme';

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
      title={<Text text="Clear All Wallets?" fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />}
      content={
        <Column mainAxisSize="min" crossAxisAlignment="start">
          <Text text="Are you sure you want to delete ALL wallets?" fontSize={16} color={Theme.colors.textPrimary} />
          <Container height={8} />
          <Text text="This action cannot be undone! All private keys will be lost permanently." color={Theme.colors.error} fontSize={14} />
        </Column>
      }
      actions={[
        <InkWell onTap={handleCancel}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Cancel" color={Theme.colors.textSecondary} fontWeight="bold" />
          </Container>
        </InkWell>,
        <InkWell onTap={handleClear}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Delete All" color={Theme.colors.error} fontWeight="bold" />
          </Container>
        </InkWell>
      ]}
    />
  );
}
