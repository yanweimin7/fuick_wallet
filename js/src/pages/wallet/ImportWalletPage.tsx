import React, { useState } from "react";
import { AppBar, Button, Center, Column, Scaffold, useNavigator, Container, Text, TextField, Padding } from "fuickjs";
import { WalletManager } from "../../services/WalletManager";

export default function ImportWalletPage(props: { nextPath?: string }) {
  const navigator = useNavigator();
  const [name, setName] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImport = () => {
    if (!mnemonic) {
      setError("Please enter a mnemonic phrase");
      return;
    }
    setLoading(true);
    setError("");

    WalletManager.getInstance().importWallet(name || undefined, mnemonic)
      .then(async wallet => {
        setLoading(false);
        if (wallet && wallet.address) {
          // Navigate to wallet home or show success
          console.log("Wallet imported:", wallet);
          if (props.nextPath) {
            navigator.push(props.nextPath, wallet);
          } else {
            navigator.pop(false, wallet);
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
    <Scaffold appBar={<AppBar title="Import Wallet" />}>
      <Padding padding={20}>
        <Column crossAxisAlignment="start">
          <Text text="Wallet Name (Optional):" fontWeight="bold" />
          <Container height={10} />
          <TextField
            text={name}
            onChanged={(val) => setName(val)}
            decoration={{
              hintText: "e.g. My Savings",
              border: { width: 1, color: "#cccccc" }
            }}
          />
          <Container height={20} />
          <Text text="Enter Mnemonic Phrase:" fontWeight="bold" />
          <Container height={10} />
          <TextField
            text={mnemonic}
            onChanged={(val) => setMnemonic(val)}
            maxLines={3}
            decoration={{
              hintText: "separate words with spaces",
              border: { width: 1, color: "#cccccc" }
            }}
          />
          <Container height={20} />
          {error ? <Text text={error} color="red" /> : null}
          <Container height={20} />
          <Button
            text={loading ? "Importing..." : "Import Wallet"}
            onTap={loading ? undefined : handleImport}
          />
        </Column>
      </Padding>
    </Scaffold>
  );
}
