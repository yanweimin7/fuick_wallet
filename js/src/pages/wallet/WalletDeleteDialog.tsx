import React from 'react';
import { AlertDialog, Text, useNavigator, Container, InkWell, Row, Padding, Column } from 'fuickjs';
import { WalletInfo } from '../../services/WalletManager';
import { Theme } from '../../theme';

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
      title={<Text text="Delete Wallet?" fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />}
      content={
        <Column mainAxisSize="min" crossAxisAlignment="start">
          <Text text={`Are you sure you want to delete "${walletName}"?`} fontSize={16} color={Theme.colors.textPrimary} />
          <Container height={8} />
          <Text text="This action cannot be undone! Your private key will be lost permanently." color={Theme.colors.error} fontSize={14} />
        </Column>
      }
      actions={[
        <InkWell onTap={handleCancel}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Cancel" color={Theme.colors.textSecondary} fontWeight="bold" />
          </Container>
        </InkWell>,
        <InkWell onTap={handleDelete}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Delete" color={Theme.colors.error} fontWeight="bold" />
          </Container>
        </InkWell>
      ]}
    />
  );
}
