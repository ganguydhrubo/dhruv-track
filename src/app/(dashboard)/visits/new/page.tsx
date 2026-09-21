'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { GPSCapture, GPSLocation } from '@/components/shared/gps-capture';
import { useRouter } from 'next/navigation';
import { QrCode } from 'lucide-react';

const QRScanner = dynamic(() => import('@/components/shared/qr-scanner'), { ssr: false });

export default function NewVisitPage() {
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [locationId, setLocationId] = useState('');
  const [purpose, setPurpose] = useState('INSPECTION');
  const [notes, setNotes] = useState('');
  const [gps, setGps] = useState<GPSLocation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submit to supabase
    console.log('Submitting:', { locationId, purpose, notes, gps });
    // Redirect to visit detail
    router.push('/visits/1');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Field Visit</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Location</label>
          <div className="flex gap-2">
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              required
            >
              <option value="">Select Location manually...</option>
              <option value="loc_1">Retail Outlet A</option>
              <option value="loc_2">LPG Plant B</option>
            </select>
            <Button type="button" variant="outline" onClick={() => setShowScanner(true)}>
              <QrCode className="w-4 h-4 mr-2" />
              Scan QR
            </Button>
          </div>
          {showScanner && (
            <div className="mt-2">
              <QRScanner onScan={(id) => { setLocationId(id); setShowScanner(false); }} onClose={() => setShowScanner(false)} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Purpose</label>
          <select 
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            <option value="INSPECTION">Inspection</option>
            <option value="AUDIT">Audit</option>
            <option value="TRAINING">Training</option>
            <option value="BEHAVIORAL">Behavioral Observation</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Location Capture (GPS)</label>
          <GPSCapture onLocationCaptured={setGps} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Notes (Optional)</label>
          <textarea 
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional context here..."
          />
        </div>

        <Button type="submit" className="w-full">Create Visit</Button>
      </form>
    </div>
  );
}
