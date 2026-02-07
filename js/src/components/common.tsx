import React from 'react';
import { Container, Text, InkWell, Center, Column, Row, Icon, SizedBox, CircularProgressIndicator, TextField } from 'fuickjs';
import { Theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  margin?: number;
  onTap?: () => void;
  color?: string;
}

export const Card = ({ children, padding = Theme.spacing.m, margin = 0, onTap, color = Theme.colors.surface }: CardProps) => {
  const content = (
    <Container
      padding={padding}
      margin={margin}
      decoration={{
        color: color,
        borderRadius: Theme.borderRadius.m,
        boxShadow: Theme.shadows.small,
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
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  icon?: string;
  loading?: boolean;
  fullWidth?: boolean;
}

export const ThemeButton = ({ text, onTap, variant = 'primary', icon, loading, fullWidth = false }: ButtonProps) => {
  let bgColor = Theme.colors.primary;
  let textColor = Theme.colors.surface;
  let border = undefined;

  if (variant === 'secondary') {
    bgColor = Theme.colors.secondary;
  } else if (variant === 'outline') {
    bgColor = 'transparent';
    textColor = Theme.colors.primary;
    border = { color: Theme.colors.primary, width: 1 };
  } else if (variant === 'text') {
    bgColor = 'transparent';
    textColor = Theme.colors.primary;
  } else if (variant === 'danger') {
    bgColor = Theme.colors.error;
    textColor = Theme.colors.surface;
  }

  return (
    <InkWell onTap={loading ? undefined : onTap}>
      <Container
        width={fullWidth ? Infinity : undefined}
        padding={{ vertical: 12, horizontal: 24 }}
        alignment="center"
        decoration={{
          color: bgColor,
          borderRadius: Theme.borderRadius.s,
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
            <Text text={text} color={textColor} fontWeight="bold" fontSize={16} />
          </Row>
        )}
      </Container>
    </InkWell>
  );
};

export const ScreenTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <Column crossAxisAlignment="start">
    <Text text={title} fontSize={28} fontWeight="bold" color={Theme.colors.textPrimary} />
    {subtitle && (
      <>
        <SizedBox height={4} />
        <Text text={subtitle} fontSize={16} color={Theme.colors.textSecondary} />
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

export const ThemeInput = ({ label, value, onChanged, hint, maxLines = 1, secure = false }: InputProps) => (
  <Column crossAxisAlignment="start">
    {label && <Text text={label} fontWeight="bold" color={Theme.colors.textPrimary} />}
    {label && <SizedBox height={8} />}
    <Container
      padding={{ horizontal: 12, vertical: 4 }}
      decoration={{
        color: Theme.colors.surface,
        borderRadius: Theme.borderRadius.s,
        border: { width: 1, color: Theme.colors.divider },
      }}
    >
      <TextField
        text={value}
        onChanged={onChanged}
        maxLines={maxLines}
        obscureText={secure}
        textInputAction='none'
        hintText={hint}
        border='none'
      />
    </Container>
  </Column>
);
