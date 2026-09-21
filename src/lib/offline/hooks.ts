'use client';
import { useState, useEffect } from 'react';
import { getDB } from './db';
import { processSyncQueue } from './sync';

export function useOfflineStatus() {
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [syncStatus, setSyncStatus] = useState<'OFFLINE'|'SYNCING'|'SYNCED'|'SYNC_FAILED'>('SYNCED');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const checkPending = async () => {
      try {
        const db = await getDB();
        const count = await db.count('syncQueue');
        setPendingCount(count);
        if (count > 0 && navigator.onLine) {
          setSyncStatus('SYNC_FAILED'); 
        } else if (count === 0) {
          setSyncStatus('SYNCED');
        } else if (!navigator.onLine) {
          setSyncStatus('OFFLINE');
        }
      } catch (e) {
        console.error('Failed to check pending syncs:', e);
      }
    };

    const handleOnline = () => { 
      setIsOffline(false); 
      processSyncQueue().then(checkPending); 
    };
    const handleOffline = () => {
      setIsOffline(true);
      setSyncStatus('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    checkPending();
    const interval = setInterval(checkPending, 10000);

    return () => { 
      window.removeEventListener('online', handleOnline); 
      window.removeEventListener('offline', handleOffline); 
      clearInterval(interval); 
    };
  }, []);

  return { isOffline, syncStatus, pendingCount, triggerSync: processSyncQueue };
}
