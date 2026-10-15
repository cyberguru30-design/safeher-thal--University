import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export const LoadingSplash: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show splash for 1.5s
    const timer = setTimeout(() => {
      setFading(true);
      const removeTimer = setTimeout(() => {
        setVisible(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #4F46E5 100%)',
      }}
    >
      <div className="flex flex-col items-center text-center p-6 space-y-6 max-w-sm">
        {/* Animated Brand Logo */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl animate-pulse">
            <ShieldCheck className="w-14 h-14 stroke-[2.2] text-white" />
          </div>
          <div className="absolute -inset-2 rounded-3xl bg-white/20 blur-md -z-10 animate-ping opacity-30" />
        </div>

        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">SafeHer</h1>
          <p className="text-xs uppercase tracking-widest text-purple-200 mt-1 font-bold">
            Thal University Bhakkar
          </p>
        </div>

        {/* Spinner */}
        <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />

        <div className="space-y-1">
          <p className="text-sm font-semibold text-white drop-shadow">
            Securing Thal University Bhakkar...
          </p>
          <p className="text-[11px] text-purple-200">
            Offline Protection Ready · WhatsApp-Grade Encryption
          </p>
        </div>
      </div>
    </div>
  );
};
