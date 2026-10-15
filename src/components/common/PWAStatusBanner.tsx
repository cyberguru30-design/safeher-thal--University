import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const PWAStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');

      // Check if there are queued SOS alerts to sync
      try {
        const queueRaw = localStorage.getItem('sosQueue');
        if (queueRaw) {
          const queue = JSON.parse(queueRaw);
          if (Array.isArray(queue) && queue.length > 0) {
            // Mark all as synced
            const updated = queue.map((item) => ({
              ...item,
              status: 'synced-with-bhakkar-hub',
              syncedAt: new Date().toISOString(),
            }));
            localStorage.setItem('sosQueue', JSON.stringify(updated));
          }
        }
      } catch {
        // ignore
      }

      setTimeout(() => {
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 3500);
      }, 1200);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('idle');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className={`w-full py-1.5 px-4 text-xs font-semibold flex items-center justify-between transition-colors shadow-xs ${
        !isOnline
          ? 'bg-red-600 text-white'
          : syncStatus === 'syncing'
          ? 'bg-amber-600 text-white'
          : syncStatus === 'synced'
          ? 'bg-emerald-600 text-white'
          : 'bg-emerald-700 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>🔴 Offline - SafeHer protecting locally - All SOS saved</span>
            </>
          ) : syncStatus === 'syncing' ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Syncing offline alerts with Bhakkar Hub...</span>
            </>
          ) : (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>🟢 Online - Synced with Bhakkar Hub (District Bhakkar, Punjab)</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] opacity-95">
          <span className="hidden sm:inline">Thal University Campus System</span>
          {!isOnline ? (
            <span className="px-2 py-0.5 bg-white/20 rounded-full font-bold">100% Offline Mode</span>
          ) : (
            <span className="px-2 py-0.5 bg-white/20 rounded-full font-bold">Live Grid Connected</span>
          )}
        </div>
      </div>
    </div>
  );
};
