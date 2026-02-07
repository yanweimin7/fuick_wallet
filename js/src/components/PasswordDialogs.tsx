import React, { useState } from 'react';
import { AlertDialog, Text, useNavigator, Container, InkWell, Column, SizedBox } from 'fuickjs';
import { Theme } from '../theme';
import { PasswordService } from '../services/PasswordService';
import { ThemeInput } from './common';

export function SetPasswordDialog() {
  const navigator = useNavigator();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    await PasswordService.setPassword(password);
    // @ts-ignore
    navigator.pop(password);
  };

  return (
    <AlertDialog
      title={<Text text="Set Local Password" fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />}
      content={
        <Column mainAxisSize="min">
          <Text text="Please set a password to protect your wallet." fontSize={14} color={Theme.colors.textSecondary} />
          <SizedBox height={16} />
          <ThemeInput
            label="Password"
            value={password}
            onChanged={setPassword}
            hint="Enter password"
            secure={true}
          />
          <SizedBox height={12} />
          <ThemeInput
            label="Confirm Password"
            value={confirm}
            onChanged={setConfirm}
            hint="Confirm password"
            secure={true}
          />
          {error ? <Container margin={{ top: 8 }}><Text text={error} color={Theme.colors.error} fontSize={12} /></Container> : null}
        </Column>
      }
      actions={[
        <InkWell onTap={() => navigator.pop(false)}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Cancel" color={Theme.colors.textSecondary} fontWeight="bold" />
          </Container>
        </InkWell>,
        <InkWell onTap={handleSubmit}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Confirm" color={Theme.colors.primary} fontWeight="bold" />
          </Container>
        </InkWell>
      ]}
    />
  );
}

export function VerifyPasswordDialog() {
  const navigator = useNavigator();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const isValid = await PasswordService.verifyPassword(password);
    if (isValid) {
      // @ts-ignore
      navigator.pop(password);
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <AlertDialog
      title={<Text text="Verify Password" fontWeight="bold" fontSize={18} color={Theme.colors.textPrimary} />}
      content={
        <Column mainAxisSize="min">
          <Text text="Enter your local password to continue." fontSize={14} color={Theme.colors.textSecondary} />
          <SizedBox height={16} />
          <ThemeInput
            label="Password"
            value={password}
            onChanged={setPassword}
            hint="Enter password"
            secure={true}
          />
          {error ? <Container margin={{ top: 8 }}><Text text={error} color={Theme.colors.error} fontSize={12} /></Container> : null}
        </Column>
      }
      actions={[
        <InkWell onTap={() => navigator.pop(false)}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Cancel" color={Theme.colors.textSecondary} fontWeight="bold" />
          </Container>
        </InkWell>,
        <InkWell onTap={handleSubmit}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Verify" color={Theme.colors.primary} fontWeight="bold" />
          </Container>
        </InkWell>
      ]}
    />
  );
}
