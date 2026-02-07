import React, { useState } from "react";
import { AppBar, Column, Scaffold, useNavigator, Container, Text, Padding, SizedBox, SingleChildScrollView } from "fuickjs";
import { WalletManager } from "../../services/WalletManager";
import { ChainRegistry } from "../../services/ChainRegistry";
import { Theme } from "../../theme";
import { ThemeButton, ThemeInput, Card } from "../../components/common";
import { PasswordService } from "../../services/PasswordService";
import { SetPasswordDialog, VerifyPasswordDialog } from "../../components/PasswordDialogs";

export default function ImportWalletPage(props: { nextPath?: string }) {
  const navigator = useNavigator();
  const [name, setName] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!mnemonic) {
      setError("Please enter a mnemonic phrase");
      return;
    }

    const isSet = await PasswordService.isPasswordSet();
    if (!isSet) {
      // @ts-ignore
      const set = await navigator.showDialog(<SetPasswordDialog />);
      if (!set) return;
    } else if (!PasswordService.getCachedPassword()) {
      // @ts-ignore
      const verified = await navigator.showDialog(<VerifyPasswordDialog />);
      if (!verified) return;
    }

    setLoading(true);
    setError("");

    WalletManager.getInstance().importWallet(name || undefined, mnemonic)
      .then(async wallet => {
        setLoading(false);
        const hasAddresses = wallet && wallet.addresses && Object.keys(wallet.addresses).length > 0;
        if (hasAddresses) {
          // Navigate to wallet home or show success
          console.log("Wallet imported:", wallet);
          if (props.nextPath) {
            // @ts-ignore
            navigator.pushReplace(props.nextPath, wallet);
          } else {
            navigator.pop(wallet);
          }
        } else {
          setError("Invalid mnemonic or import failed");
        }
      })
      .catch(e => {
        console.error("Import failed", e);
        setLoading(false);
        setError("Import failed: " + (e.message || "Unknown error"));
      });
  };

  return (
    <Scaffold appBar={<AppBar title="Import Wallet" backgroundColor={Theme.colors.surface} />}>
      <Container color={Theme.colors.background}>
        <SingleChildScrollView>
          <Padding padding={Theme.spacing.m}>
            <Card padding={Theme.spacing.l}>
              <Column crossAxisAlignment="start">
                <Text text="Import Existing Wallet" fontSize={20} fontWeight="bold" color={Theme.colors.textPrimary} />
                <SizedBox height={8} />
                <Text text="Enter your secret recovery phrase to restore your wallet." color={Theme.colors.textSecondary} />
                <SizedBox height={24} />

                <ThemeInput
                  label="Wallet Name (Optional)"
                  value={name}
                  onChanged={(val) => setName(val)}
                  hint="e.g. My Savings"
                />
                <SizedBox height={20} />

                <ThemeInput
                  label="Mnemonic Phrase"
                  value={mnemonic}
                  onChanged={(val) => setMnemonic(val)}
                  hint="Separate words with spaces"
                  maxLines={3}
                />

                <SizedBox height={20} />
                {error ? <Text text={error} color={Theme.colors.error} /> : null}
                <SizedBox height={20} />

                <ThemeButton
                  text={loading ? "Importing..." : "Import Wallet"}
                  onTap={loading ? () => { } : handleImport}
                  loading={loading}
                  fullWidth
                />
              </Column>
            </Card>
          </Padding>
        </SingleChildScrollView>
      </Container>
    </Scaffold>
  );
}

