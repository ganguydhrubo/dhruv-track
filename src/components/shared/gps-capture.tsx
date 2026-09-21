'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GPSCaptureProps {
  onLocationCaptured: (location: GPSLocation) => void;
  className?: string;
}

export function GPSCapture({ onLocationCaptured, className = '' }: GPSCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GPSLocation | null>(null);

  const captureGPS = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsCapturing(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLoc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setLocation(newLoc);
        setIsCapturing(false);
        onLocationCaptured(newLoc);
      },
      (err) => {
        setIsCapturing(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Button 
        type="button" 
        variant={location ? 'secondary' : 'outline'} 
        onClick={captureGPS}
        disabled={isCapturing}
      >
        <MapPin className="w-4 h-4 mr-2" />
        {isCapturing ? 'Acquiring GPS...' : location ? 'GPS Captured' : 'Capture GPS'}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {location && (
        <p className="text-xs text-muted-foreground">
          Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)} (±{Math.round(location.accuracy)}m)
        </p>
      )}
    </div>
  );
}
