'use client';
import React from 'react';
import { useOfflineStatus } from '@/lib/offline/hooks';
import { CloudOff, Cloud, RefreshCw } from 'lucide-react';

export function OfflineIndicator() {
  const { isOffline, syncStatus, pendingCount, triggerSync } = useOfflineStatus();

  if (!isOffline && pendingCount === 0) return null;

  const bgColor = isOffline 
    ? 'bg-red-600' 
    : syncStatus === 'SYNCING' 
      ? 'bg-yellow-500' 
      : syncStatus === 'SYNC_FAILED' 
        ? 'bg-orange-500' 
        : 'bg-green-600';

  return (
    <div className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 text-sm text-white shadow-md ${bgColor}`}>
      <div className="flex items-center gap-2 font-medium">
        {isOffline ? <CloudOff size={16} /> : <Cloud size={16} />}
        <span>
          {isOffline 
            ? 'You are offline. Working locally.' 
            : `Online. ${pendingCount} items pending sync.`}
        </span>
      </div>
      {!isOffline && pendingCount > 0 && (
        <button 
          onClick={() => triggerSync()} 
          className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition shadow-sm"
        >
          <RefreshCw size={14} className={syncStatus === 'SYNCING' ? 'animate-spin' : ''} />
          <span>Sync Now</span>
        </button>
      )}
    </div>
  );
}
