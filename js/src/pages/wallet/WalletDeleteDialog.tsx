import React from 'react';
import { AlertDialog, Text, useNavigator, Container, InkWell, Row, Padding, Column } from 'fuickjs';
import { WalletInfo } from '../../services/WalletManager';

export default function WalletDeleteDialog(props: { wallet: WalletInfo }) {
  const navigator = useNavigator();
  const walletName = props.wallet ? props.wallet.name : "Wallet";

  const handleCancel = () => {
    navigator.pop(false);
  };

  const handleDelete = () => {
    navigator.pop(true);
  };

  return (
    <AlertDialog
      title={<Text text="Delete Wallet?" fontWeight="bold" fontSize={18} />}
      content={
        <Column mainAxisSize="min" crossAxisAlignment="start">
          <Text text={`Are you sure you want to delete "${walletName}"?`} fontSize={16} />
          <Container height={8} />
          <Text text="This action cannot be undone! Your private key will be lost permanently." color="red" fontSize={14} />
        </Column>
      }
      actions={[
        <InkWell onTap={handleCancel}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Cancel" color="black" fontWeight="bold" />
          </Container>
        </InkWell>,
        <InkWell onTap={handleDelete}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Delete" color="red" fontWeight="bold" />
          </Container>
        </InkWell>
      ]}
    />
  );
}
