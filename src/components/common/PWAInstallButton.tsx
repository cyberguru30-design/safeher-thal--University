import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  className?: string;
  variant?: 'button' | 'badge' | 'nav';
}

export const PWAInstallButton: React.FC<Props> = ({ className = '', variant = 'button' }) => {
  const { isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running standalone
  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>App Installed</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    const res = await install();
    if (res) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 3000);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Install SafeHer App like WhatsApp"
        className={
          className ||
          'inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] hover:from-[#6D28D9] hover:to-[#4338CA] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0'
        }
      >
        <Smartphone className="w-4 h-4 animate-bounce" />
        <span>Install SafeHer App - Like WhatsApp</span>
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-purple-100 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white flex items-center justify-center font-bold">
                  S
                </div>
                <h3 className="text-base font-bold text-gray-900">Install SafeHer on iOS</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs sm:text-sm text-gray-600">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">
                  1
                </span>
                <p>
                  Tap the <strong>Share</strong> button <span className="text-blue-600 font-bold">[↑]</span> at the
                  bottom of your Safari browser.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">
                  2
                </span>
                <p>
                  Scroll down the share options and tap <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">
                  3
                </span>
                <p>
                  Tap <strong>Add</strong> in the top right. SafeHer opens in fullscreen mode like a native app.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#7C3AED] py-2.5 text-xs font-bold text-white hover:bg-[#6D28D9] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
