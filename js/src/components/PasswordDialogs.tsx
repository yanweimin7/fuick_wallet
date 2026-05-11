import React, { useState } from "react";
import {
  AlertDialog,
  Text,
  useNavigator,
  Container,
  InkWell,
  Column,
  SizedBox,
  Row,
  CircularProgressIndicator,
} from "fuickjs";
import { Theme } from "../theme";
import { PasswordService } from "../services/PasswordService";
import { LocalAuthService } from "../services/LocalAuthService";
import { ThemeInput } from "./common";

export function SetPasswordDialog() {
  const navigator = useNavigator();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (val: string) => {
    setPassword(val);
  };

  const handleSubmit = async () => {
    if (password.length < 6) {
      setError("密码至少需要6位字符");
      return;
    }
    if (password !== confirm) {
      setError("两次输入的密码不一致");
      return;
    }
    navigator.pop(password);
  };

  return (
    <AlertDialog
      backgroundColor={Theme.colors.surface}
      title={
        <Text
          text="设置密码"
          fontWeight="bold"
          fontSize={18}
          color={Theme.colors.textPrimary}
        />
      }
      content={
        <Column mainAxisSize="min">
          <Text
            text="请设置一个密码来保护您的钱包"
            fontSize={14}
            color={Theme.colors.textSecondary}
          />
          <SizedBox height={16} />
          <ThemeInput
            label="密码"
            value={password}
            onChanged={handlePasswordChange}
            hint="请输入密码"
            secure={true}
          />
          <SizedBox height={12} />
          <ThemeInput
            label="确认密码"
            value={confirm}
            onChanged={setConfirm}
            hint="请再次输入密码"
            secure={true}
          />
          {error ? (
            <Container margin={{ top: 8 }}>
              <Text text={error} color={Theme.colors.error} fontSize={12} />
            </Container>
          ) : null}
        </Column>
      }
      actions={[
        <InkWell key="cancel" onTap={() => navigator.pop(false)}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text
              text="取消"
              color={Theme.colors.textSecondary}
              fontWeight="bold"
            />
          </Container>
        </InkWell>,
        <InkWell key="confirm" onTap={handleSubmit}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text text="确认" color={Theme.colors.primary} fontWeight="bold" />
          </Container>
        </InkWell>,
      ]}
    />
  );
}

export function VerifyPasswordDialog() {
  const navigator = useNavigator();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const passwordRef = React.useRef(password);

  // Update ref when password changes
  React.useEffect(() => {
    passwordRef.current = password;
  }, [password]);

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    passwordRef.current = val;
  };

  const handleSubmit = async () => {
    const currentPassword = passwordRef.current;
    setIsVerifying(true);
    setError("");
    try {
      // 直接解锁获取 encryptionKey，避免重复 Argon2 计算
      const encryptionKey =
        await LocalAuthService.unlockWithPassword(currentPassword);
      if (encryptionKey) {
        navigator.pop(encryptionKey);
      } else {
        setError("密码错误");
      }
    } catch {
      setError("验证失败");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AlertDialog
      backgroundColor={Theme.colors.surface}
      title={
        <Text
          text="验证密码"
          fontWeight="bold"
          fontSize={18}
          color={Theme.colors.textPrimary}
        />
      }
      content={
        <Column mainAxisSize="min">
          <Text
            text="请输入您的密码以继续"
            fontSize={14}
            color={Theme.colors.textSecondary}
          />
          <SizedBox height={16} />
          <ThemeInput
            label="密码"
            value={password}
            onChanged={handlePasswordChange}
            hint="请输入密码"
            secure={true}
          />
          {error ? (
            <Container margin={{ top: 8 }}>
              <Text text={error} color={Theme.colors.error} fontSize={12} />
            </Container>
          ) : null}
        </Column>
      }
      actions={[
        <InkWell
          key="cancel"
          onTap={() => !isVerifying && navigator.pop(false)}
        >
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            <Text
              text="取消"
              color={
                isVerifying ? Theme.colors.textHint : Theme.colors.textSecondary
              }
              fontWeight="bold"
            />
          </Container>
        </InkWell>,
        <InkWell key="verify" onTap={!isVerifying ? handleSubmit : undefined}>
          <Container padding={{ horizontal: 16, vertical: 8 }}>
            {isVerifying ? (
              <Row mainAxisSize="min" crossAxisAlignment="center">
                <Container width={16} height={16}>
                  <CircularProgressIndicator
                    color={Theme.colors.primary}
                    strokeWidth={2}
                  />
                </Container>
                <SizedBox width={8} />
                <Text
                  text="验证中..."
                  color={Theme.colors.primary}
                  fontWeight="bold"
                />
              </Row>
            ) : (
              <Text
                text="验证"
                color={Theme.colors.primary}
                fontWeight="bold"
              />
            )}
          </Container>
        </InkWell>,
      ]}
    />
  );
}
