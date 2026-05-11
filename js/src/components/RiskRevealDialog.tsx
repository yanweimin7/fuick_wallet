import React from "react";
import {
  AlertDialog,
  Text,
  useNavigator,
  Container,
  InkWell,
  Column,
} from "fuickjs";
import { Theme } from "../theme";

export default function RiskRevealDialog({
  type,
}: {
  type: "mnemonic" | "privateKey";
}) {
  const navigator = useNavigator();
  const onCancel = () => navigator.pop(false);
  const onOk = () => navigator.pop(true);

  return (
    <AlertDialog
      backgroundColor={Theme.colors.surface}
      title={
        <Text
          text="Risk Warning"
          fontWeight="bold"
          color={Theme.colors.textPrimary}
        />
      }
      content={
        <Column crossAxisAlignment="start" mainAxisSize="min">
          <Text
            text={
              type === "mnemonic"
                ? "Revealing mnemonic phrase exposes full control. Ensure you are in a safe environment."
                : "Revealing private key exposes funds control. Ensure you are in a safe environment."
            }
            color={Theme.colors.textPrimary}
          />
          <Container height={12} />
          <Text
            text="Do not screenshot or share. We do not store this information."
            color={Theme.colors.error}
          />
        </Column>
      }
      actions={[
        <InkWell key="cancel" onTap={onCancel}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="Cancel" color={Theme.colors.textSecondary} />
          </Container>
        </InkWell>,
        <InkWell key="confirm" onTap={onOk}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text
              text="Confirm Reveal"
              color={Theme.colors.error}
              fontWeight="bold"
            />
          </Container>
        </InkWell>,
      ]}
    />
  );
}
