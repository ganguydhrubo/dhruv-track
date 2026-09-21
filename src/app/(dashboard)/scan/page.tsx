'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, ArrowLeft, MapPin, ShieldCheck, Eye } from 'lucide-react';
import Link from 'next/link';

// Dynamically import QR scanner with SSR turned off because camera APIs require client browser window
const QRScanner = dynamic(() => import('@/components/shared/qr-scanner'), { ssr: false });

export default function ScanPage() {
  const router = useRouter();
  const [scannedLocationId, setScannedLocationId] = useState<string | null>(null);

  const handleScan = (locationId: string) => {
    setScannedLocationId(locationId);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <Link href="/field" className="p-2 rounded-lg border hover:bg-slate-100 text-slate-600">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            Location QR Scanner
          </h1>
          <p className="text-xs text-slate-500">
            Scan physical outlet QR code to verify presence and launch actions
          </p>
        </div>
      </div>

      {!scannedLocationId ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <QRScanner
            onScan={handleScan}
            onClose={() => router.push('/field')}
          />
          <p className="text-xs text-slate-400 text-center max-w-xs">
            Point camera at the official Dhruv Track QR code displayed on the forecourt canopy or outlet office.
          </p>
        </div>
      ) : (
        <Card className="border-green-200 bg-green-50/50 shadow-md">
          <CardContent className="p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Location Verified!</h2>
              <p className="font-mono text-xs text-slate-500 mt-1">ID: {scannedLocationId}</p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={() => router.push(`/safety/check?location=${scannedLocationId}`)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold"
              >
                Run Safety Check Here
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/locations/${scannedLocationId}`)}
                className="w-full bg-white"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Location Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => setScannedLocationId(null)}
                className="w-full text-xs text-slate-500"
              >
                Scan Another Location
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
