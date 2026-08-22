import React from "react";
import {
  Container,
  Text,
  InkWell,
  Column,
  Row,
  Icon,
  SizedBox,
  CircularProgressIndicator,
  TextField,
} from "fuickjs";
import { Theme } from "../theme";

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  margin?: number | { top?: number; bottom?: number; left?: number; right?: number };
  onTap?: () => void;
  color?: string;
  bordered?: boolean;
}

export const Card = ({
  children,
  padding = Theme.spacing.m,
  margin = 0,
  onTap,
  color = Theme.colors.surface,
  bordered = true,
}: CardProps) => {
  const content = (
    <Container
      padding={padding}
      margin={margin}
      decoration={{
        color: color,
        borderRadius: Theme.borderRadius.l,
        boxShadow: Theme.shadows.small,
        border: bordered ? { color: Theme.colors.border, width: 1 } : undefined,
      }}
    >
      {children}
    </Container>
  );

  if (onTap) {
    return <InkWell onTap={onTap}>{content}</InkWell>;
  }
  return content;
};

interface ButtonProps {
  text: string;
  onTap: () => void;
  variant?: "primary" | "secondary" | "outline" | "text" | "danger";
  icon?: string;
  loading?: boolean;
  fullWidth?: boolean;
}

export const ThemeButton = ({
  text,
  onTap,
  variant = "primary",
  icon,
  loading,
  fullWidth = false,
}: ButtonProps) => {
  let bgColor: any = Theme.colors.primaryGradient;
  let textColor = Theme.colors.onPrimary;
  let border = undefined;

  if (variant === "secondary") {
    bgColor = Theme.colors.accentGradient;
    textColor = Theme.colors.onAccent;
  } else if (variant === "outline") {
    bgColor = "transparent";
    textColor = Theme.colors.primary;
    border = { color: Theme.colors.primary, width: 1 };
  } else if (variant === "text") {
    bgColor = "transparent";
    textColor = Theme.colors.primary;
  } else if (variant === "danger") {
    bgColor = Theme.colors.error;
    textColor = "#FFFFFF";
  }

  return (
    <InkWell onTap={loading ? undefined : onTap}>
      <Container
        width={fullWidth ? Infinity : undefined}
        padding={{ vertical: 14, horizontal: 24 }}
        alignment="center"
        decoration={{
          color: variant === "outline" || variant === "text" ? "transparent" : undefined,
          gradient:
            variant === "primary" || variant === "secondary"
              ? bgColor
              : undefined,
          borderRadius: Theme.borderRadius.full,
          border: border,
        }}
      >
        {loading ? (
          <CircularProgressIndicator color={textColor} strokeWidth={2} />
        ) : (
          <Row mainAxisSize="min" crossAxisAlignment="center">
            {icon && (
              <>
                <Icon name={icon} color={textColor} size={20} />
                <SizedBox width={8} />
              </>
            )}
            <Text
              text={text}
              color={textColor}
              fontWeight="bold"
              fontSize={16}
            />
          </Row>
        )}
      </Container>
    </InkWell>
  );
};

export const ScreenTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <Column crossAxisAlignment="start">
    <Text
      text={title}
      fontSize={28}
      fontWeight="bold"
      color={Theme.colors.textPrimary}
    />
    {subtitle && (
      <>
        <SizedBox height={4} />
        <Text
          text={subtitle}
          fontSize={15}
          color={Theme.colors.textSecondary}
        />
      </>
    )}
  </Column>
);

export interface InputProps {
  label?: string;
  value: string;
  onChanged: (val: string) => void;
  hint?: string;
  maxLines?: number;
  secure?: boolean;
}

export const ThemeInput = ({
  label,
  value,
  onChanged,
  hint,
  maxLines = 1,
  secure = false,
}: InputProps) => (
  <Column crossAxisAlignment="start">
    {label && (
      <Text text={label} fontWeight="bold" color={Theme.colors.textPrimary} />
    )}
    {label && <SizedBox height={8} />}
    <Container
      padding={{ horizontal: 14, vertical: 6 }}
      decoration={{
        color: Theme.colors.surfaceVariant,
        borderRadius: Theme.borderRadius.m,
        border: { width: 1, color: Theme.colors.border },
      }}
    >
      <TextField
        text={value}
        onChanged={onChanged}
        maxLines={maxLines}
        obscureText={secure}
        textInputAction="none"
        hintText={hint}
        border="none"
      />
    </Container>
  </Column>
);

export const SectionHeader = ({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) => (
  <Row mainAxisAlignment="spaceBetween" crossAxisAlignment="center">
    <Text
      text={title}
      fontSize={18}
      fontWeight="bold"
      color={Theme.colors.textPrimary}
    />
    {action}
  </Row>
);

export const IconBadge = ({
  icon,
  color = Theme.colors.accent,
  size = 44,
  soft = true,
}: {
  icon: string;
  color?: string;
  size?: number;
  soft?: boolean;
}) => (
  <Container
    width={size}
    height={size}
    alignment="center"
    decoration={{
      color: soft ? color + "22" : color,
      borderRadius: size / 2,
    }}
  >
    <Icon name={icon} color={soft ? color : "#FFFFFF"} size={size * 0.5} />
  </Container>
);

export const Chip = ({
  label,
  color = Theme.colors.primary,
  soft = true,
}: {
  label: string;
  color?: string;
  soft?: boolean;
}) => (
  <Container
    padding={{ horizontal: 10, vertical: 4 }}
    decoration={{
      color: soft ? color + "1F" : color,
      borderRadius: Theme.borderRadius.full,
    }}
  >
    <Text
      text={label}
      fontSize={11}
      fontWeight="bold"
      color={soft ? color : "#0B0E14"}
    />
  </Container>
);

export const ChangeBadge = ({ value }: { value: number }) => {
  const up = value >= 0;
  const color = up ? Theme.colors.success : Theme.colors.error;
  return (
    <Container
      padding={{ horizontal: 8, vertical: 4 }}
      decoration={{
        color: up ? Theme.colors.successSoft : Theme.colors.errorSoft,
        borderRadius: Theme.borderRadius.full,
      }}
    >
      <Row mainAxisSize="min" crossAxisAlignment="center">
        <Icon
          name={up ? "north_east" : "south_west"}
          color={color}
          size={12}
        />
        <SizedBox width={3} />
        <Text
          text={`${up ? "+" : ""}${value.toFixed(2)}%`}
          fontSize={12}
          fontWeight="bold"
          color={color}
        />
      </Row>
    </Container>
  );
};
