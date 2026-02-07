import React from 'react';
import { AlertDialog, Text, useNavigator, Container, InkWell, Column } from 'fuickjs';

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
      title={<Text text="Clear All Wallets?" fontWeight="bold" fontSize={18} />}
      content={
        <Column mainAxisSize="min" crossAxisAlignment="start">
          <Text text="Are you sure you want to delete ALL wallets?" fontSize={16} />
          <Container height={8} />
          <Text text="This action cannot be undone! All private keys will be lost permanently." color="red" fontSize={14} />
        </Column>
      }
      actions={[
        <InkWell onTap={handleCancel}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Cancel" color="black" fontWeight="bold" />
          </Container>
        </InkWell>,
        <InkWell onTap={handleClear}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Delete All" color="red" fontWeight="bold" />
          </Container>
        </InkWell>
      ]}
    />
  );
}
