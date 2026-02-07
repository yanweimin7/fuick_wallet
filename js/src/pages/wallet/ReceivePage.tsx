import React, { useEffect, useState, useMemo } from 'react';
import { Scaffold, AppBar, Center, Column, Text, Container, Padding, CustomPaint, CustomPainter } from 'fuickjs';
import QRCode from 'qrcode';
import { WalletInfo } from '../../services/WalletManager';
import { ChainConfig, getSelectedChain } from '../../services/ChainRegistry';

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

  const painter = useMemo(() => {
    if (!address) return null;
    try {
      // @ts-ignore
      const qr = QRCode.create(address, { errorCorrectionLevel: 'M' });

      const size = qr.modules.size;
      const data = qr.modules.data;
      const qrSize = 200;
      const containerSize = 220;
      const pixelSize = qrSize / size;
      const offset = (containerSize - qrSize) / 2;

      return new CustomPainter((p: any) => {
        // Manually apply offset to avoid translate issues
        // p.translate(offset, offset);

        // Use Hex colors to ensure compatibility
        // p.drawRect({ left: 0, top: 0, width: boxSize, height: boxSize }, { color: '#FFFFFF', style: 'fill' });
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
    <Scaffold appBar={<AppBar title="Receive" />}>
      <Center>
        <Column mainAxisAlignment="center" crossAxisAlignment="center">
          <Text text={chain?.name || 'Loading...'} fontWeight="bold" fontSize={18} />
          <Container height={30} />
          {painter ? (
            <Container
              width={220}
              height={220}
              alignment="center"
              decoration={{
                color: 'white',
                borderRadius: 10,
                boxShadow: { color: '#0000001A', blurRadius: 10, offset: { dx: 0, dy: 4 } }
              }}
            >
              <CustomPaint painter={painter} size={{ width: 220, height: 220 }} />
            </Container>
          ) : (
            <Container width={220} height={220} color="#f0f0f0" alignment="center">
              <Text text="Generating..." />
            </Container>
          )}
          <Container height={30} />
          <Padding padding={{ horizontal: 40 }}>
            <Container padding={16} decoration={{ color: '#f5f5f5', borderRadius: 8 }}>
              <Text text={address || ''} textAlign="center" color="#333" fontSize={14} />
            </Container>
          </Padding>
          <Container height={30} />
          <Text text="Scan QR code to receive assets" color="#888" fontSize={12} />
        </Column>
      </Center>
    </Scaffold>
  );
}
