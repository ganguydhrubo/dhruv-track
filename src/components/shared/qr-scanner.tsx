'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { decodeLocationQR } from '@/lib/qr/decode';
import { X } from 'lucide-react';

interface QRScannerProps {
  onScan: (locationId: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        const decoded = decodeLocationQR(decodedText);
        if (decoded) {
          scanner.clear();
          onScan(decoded.locationId);
        } else {
          setError('Invalid QR code format');
        }
      },
      (err) => {
        // Just suppress frequent scan errors until successful
        // console.warn(err);
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center p-4 bg-background border rounded-lg shadow-md relative w-full max-w-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 z-10" 
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </Button>
      <h3 className="text-lg font-semibold mb-4">Scan Location QR</h3>
      <div id="qr-reader" className="w-full"></div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
