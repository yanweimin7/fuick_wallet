import React, { useEffect, useState, useMemo } from 'react';
import { Scaffold, AppBar, Center, Column, Text, Container, Padding, SizedBox } from 'fuickjs';
// @ts-ignore
import { CustomPaint, CustomPainter } from 'fuickjs';
import QRCode from 'qrcode';
import { WalletInfo } from '../../services/WalletManager';
import { ChainConfig, getSelectedChain } from '../../services/ChainRegistry';
import { Theme } from '../../theme';
import { Card } from '../../components/common';

export default function ReceivePage(props: { wallet: WalletInfo }) {
  const [chain, setChain] = useState<ChainConfig | null>(null);
  const wallet = props.wallet;

  useEffect(() => {
    (async () => {
      const c = await getSelectedChain();
      setChain(c);
    })();
  }, []);

  const address = wallet?.addresses?.[chain?.id || ''] || wallet?.address;

  const [error, setError] = useState<string>('');

  const painter = useMemo(() => {
    if (!address) return null;
    try {
      setError('');
      // @ts-ignore
      const qr = QRCode.create(address, { errorCorrectionLevel: 'M' });

      const size = qr.modules.size;
      const data = qr.modules.data;
      const qrSize = 200;
      const containerSize = 220;
      const pixelSize = qrSize / size;
      const offset = (containerSize - qrSize) / 2;

      return new CustomPainter((p: any) => {
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            if (data[y * size + x]) {
              p.drawRect(
                {
                  left: -qrSize / 2 + x * pixelSize,
                  top: -qrSize / 2 + y * pixelSize,
                  width: pixelSize + 0.5,
                  height: pixelSize + 0.5
                },
                { color: '#000000', style: 'fill' }
              );
            }
          }
        }
      });
    } catch (e) {
      console.error("QR create error", e);
      return null;
    }
  }, [address]);

  return (
    <Scaffold appBar={<AppBar title="Receive" backgroundColor={Theme.colors.surface} foregroundColor={Theme.colors.textPrimary} />}>
      <Container color={Theme.colors.background}>
        <Center>
          <Column mainAxisAlignment="center" crossAxisAlignment="center">
            <Text text={chain?.name || 'Loading...'} fontWeight="bold" fontSize={20} color={Theme.colors.textPrimary} />
            <SizedBox height={30} />
            {painter ? (
              <Container
                width={240}
                height={240}
                alignment="center"
                decoration={{
                  color: 'white',
                  borderRadius: Theme.borderRadius.l,
                  boxShadow: Theme.shadows.medium
                }}
              >
                <CustomPaint painter={painter} size={{ width: 220, height: 220 }} />
              </Container>
            ) : (
              <Container
                width={240}
                height={240}
                decoration={{
                  color: Theme.colors.surface,
                  borderRadius: Theme.borderRadius.l,
                  boxShadow: Theme.shadows.medium
                }}
                alignment="center"
              >
                <Column mainAxisAlignment="center" crossAxisAlignment="center">
                  <Text text={error ? "QR Generation Failed" : (address ? "Generating..." : "Address not ready")} color={error ? Theme.colors.error : Theme.colors.textSecondary} fontWeight="bold" />
                  {error && <Padding padding={{ top: 10 }}><Text text={error} fontSize={12} color={Theme.colors.error} maxLines={10} textAlign="center" /></Padding>}
                </Column>
              </Container>
            )}
            <SizedBox height={30} />
            <Padding padding={{ horizontal: Theme.spacing.xl }}>
              <Container
                padding={Theme.spacing.m}
                decoration={{
                  color: Theme.colors.surface,
                  borderRadius: Theme.borderRadius.m,
                  border: { width: 1, color: Theme.colors.divider }
                }}
              >
                <Text text={address || ''} textAlign="center" color={Theme.colors.textPrimary} fontSize={14} />
              </Container>
            </Padding>
            <SizedBox height={20} />
            <Text text="Scan QR code to receive assets" color={Theme.colors.textSecondary} fontSize={14} />
          </Column>
        </Center>
      </Container>
    </Scaffold>
  );
}

