import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  MapPin,
  Users,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Share2,
  PhoneCall,
  Clock,
  ExternalLink,
  Shield,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { useAuth } from '../context/AuthContext';

export const SOSPage: React.FC = () => {
  const { user } = useAuth();
  const {
    activeSOSEvent,
    triggerSOS,
    cancelSOS,
    contacts,
    isSirenActive,
    toggleSiren,
    currentCoords,
    refreshLocation,
    isLocating,
    locationError,
    isDemoMode,
    setIsDemoMode,
    sosCountdownDuration,
  } = useSafety();

  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [emergencyNote, setEmergencyNote] = useState('');

  const pressTimerRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);

  // Press-and-hold trigger handling
  const startPress = () => {
    if (activeSOSEvent || isActivating) return;
    setIsPressing(true);
    setPressProgress(0);

    const startTime = Date.now();
    const duration = 1200; // 1.2s hold required to prevent accidental click

    pressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setPressProgress(progress);

      if (progress >= 100) {
        clearInterval(pressTimerRef.current!);
        setIsPressing(false);
        setPressProgress(0);
        executeCountdownFlow();
      }
    }, 30);
  };

  const endPress = () => {
    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsPressing(false);
    setPressProgress(0);
  };

  // Countdown before permanent dispatch (cancel window)
  const executeCountdownFlow = () => {
    if (sosCountdownDuration === 0) {
      finalizeSOS();
      return;
    }

    setCountdown(sosCountdownDuration);
    countdownIntervalRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          finalizeSOS();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(null);
  };

  const finalizeSOS = async () => {
    setIsActivating(true);
    await triggerSOS(emergencyNote);
    setIsActivating(false);
    setEmergencyNote('');
  };

  const handleCopyLocation = () => {
    if (!currentCoords) return;
    const mapUrl = `https://www.google.com/maps?q=${currentCoords.latitude},${currentCoords.longitude}`;
    navigator.clipboard.writeText(`SafeHer SOS Alert! My current coordinates: ${mapUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner with Demo Mode Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-[#E9E5EE] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4A245E]/10 text-[#4A245E] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#25212B]">Emergency SOS Command Gateway</h2>
            <p className="text-xs text-[#77717F]">
              Dispatches encrypted GPS coordinates and alerts your trusted circle instantly.
            </p>
          </div>
        </div>

        {/* Demo Mode Toggle Switch */}
        <div className="flex items-center gap-2 bg-[#FAF9FC] px-3 py-1.5 rounded-xl border border-[#E9E5EE]">
          <span className="text-xs font-semibold text-[#25212B]">Mode:</span>
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
              isDemoMode
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
          >
            {isDemoMode ? '🛡️ DEMO SIMULATION' : '🚨 LIVE DEPLOYMENT'}
          </button>
        </div>
      </div>

      {/* Countdown Interstitial Modal / Overlay if countdown is ticking */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border-4 border-[#D92D45]">
            <div className="w-20 h-20 rounded-full bg-red-100 text-[#D92D45] flex items-center justify-center mx-auto text-4xl font-extrabold animate-bounce">
              {countdown}
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#25212B]">Dispatching SOS in {countdown}s</h3>
              <p className="text-xs text-[#77717F]">
                Alert will be delivered to {contacts.filter((c) => c.canReceiveAlerts).length} trusted contacts.
                Accidental trigger? Tap Cancel immediately.
              </p>
            </div>

            <button
              onClick={cancelCountdown}
              className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-[#25212B] font-bold text-sm rounded-2xl transition-colors"
            >
              Cancel SOS (I Am Safe)
            </button>
          </div>
        </div>
      )}

      {/* Main SOS Interaction Stage */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E9E5EE] shadow-sm text-center relative overflow-hidden">
        {/* Active Emergency State Display */}
        {activeSOSEvent ? (
          <div className="space-y-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-[#D92D45] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#D92D45] animate-ping" />
              Active Emergency Alert in Progress
            </div>

            <div className="max-w-md mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold text-[#25212B]">Emergency SOS Dispatched</h2>
              <p className="text-xs text-[#77717F]">
                Your location link has been broadcasted to your emergency contacts. Stay in a visible or secure area if
                possible.
              </p>
            </div>

            {/* Live GPS Coordinates Card */}
            <div className="bg-[#FAF9FC] border border-[#E9E5EE] rounded-2xl p-5 max-w-lg mx-auto text-left space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#25212B] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D92D45]" />
                  Broadcast Coordinates
                </span>
                <span className="text-[11px] text-[#247A55] font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Accuracy: ±{activeSOSEvent.accuracy || 15}m
                </span>
              </div>

              <div className="text-xs font-mono text-[#4A245E] bg-white p-2.5 rounded-xl border border-[#E9E5EE] flex items-center justify-between">
                <span>
                  Lat: {activeSOSEvent.latitude?.toFixed(5) || '37.77490'} | Lng:{' '}
                  {activeSOSEvent.longitude?.toFixed(5) || '-122.41940'}
                </span>
                <button
                  onClick={handleCopyLocation}
                  className="p-1 hover:bg-[#F1EAF8] rounded text-[#7651A8]"
                  title="Copy location link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href={`https://www.google.com/maps?q=${activeSOSEvent.latitude},${activeSOSEvent.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#7651A8] hover:text-[#4A245E]"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <span className="text-[11px] text-[#77717F]">
                  Started at {new Date(activeSOSEvent.activatedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Delivery Logs to Trusted Contacts */}
            <div className="max-w-lg mx-auto bg-white border border-[#E9E5EE] rounded-2xl p-4 text-left">
              <p className="text-xs font-bold text-[#25212B] uppercase tracking-wider mb-2.5">
                Contact Alert Delivery Status
              </p>
              <div className="space-y-2">
                {activeSOSEvent.deliveries.map((del) => (
                  <div
                    key={del.contactId}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#FAF9FC] text-xs"
                  >
                    <span className="font-semibold text-[#25212B]">{del.contactName}</span>
                    <span className="flex items-center gap-1 text-[#247A55] font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {del.method} {del.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Siren Toggle & Deactivation Controls */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <button
                onClick={toggleSiren}
                className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                  isSirenActive
                    ? 'bg-[#D92D45] text-white animate-bounce'
                    : 'bg-white border border-[#E9E5EE] text-[#D92D45] hover:bg-red-50'
                }`}
              >
                {isSirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isSirenActive ? 'Stop Emergency Siren' : 'Sound Deterrent Siren'}</span>
              </button>

              <button
                onClick={() => cancelSOS(activeSOSEvent.id, 'User manually marked safe')}
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-[#247A55] hover:bg-[#1D6345] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                I Am Safe (Cancel Alert)
              </button>
            </div>
          </div>
        ) : (
          /* Ready State: Big Circular SOS Button */
          <div className="space-y-8">
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#25212B] tracking-tight">
                Hold to Trigger Emergency SOS
              </h2>
              <p className="text-xs sm:text-sm text-[#77717F]">
                Press and hold for 1.2 seconds to initiate high-priority dispatch. An anti-accidental safety delay is
                active.
              </p>
            </div>

            {/* Giant Circular Button */}
            <div className="relative inline-block my-4 select-none">
              {/* Outer Pulsing Aura */}
              <div className="absolute inset-0 rounded-full bg-[#D92D45]/20 animate-pulse-ring -z-10" />

              <button
                type="button"
                onMouseDown={startPress}
                onMouseUp={endPress}
                onMouseLeave={endPress}
                onTouchStart={startPress}
                onTouchEnd={endPress}
                disabled={isActivating}
                className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#E63950] via-[#D92D45] to-[#B31D33] text-white flex flex-col items-center justify-center shadow-2xl shadow-[#D92D45]/40 active:scale-95 transition-all transform border-8 border-white ${
                  isPressing ? 'scale-95' : 'hover:scale-102'
                }`}
              >
                <ShieldAlert className="w-14 h-14 sm:w-16 sm:h-16 stroke-[2.2] mb-1" />
                <span className="text-3xl sm:text-4xl font-black tracking-widest uppercase">SOS</span>
                <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider mt-1">
                  {isPressing ? `Holding ${pressProgress}%` : 'Hold 1.2s'}
                </span>
              </button>

              {/* Progress Ring if Pressing */}
              {isPressing && (
                <div
                  className="absolute -inset-2 rounded-full border-4 border-[#D92D45] transition-all"
                  style={{ opacity: pressProgress / 100 }}
                />
              )}
            </div>

            {/* Optional Distress Note */}
            <div className="max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Optional quick note: e.g. 'Car following me on 4th'"
                value={emergencyNote}
                onChange={(e) => setEmergencyNote(e.target.value)}
                className="w-full px-4 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] placeholder:text-[#77717F] text-center focus:outline-none focus:border-[#7651A8]"
              />
            </div>

            {/* Location & Contact Readiness Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF9FC] border border-[#E9E5EE]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-[#25212B] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7651A8]" />
                    GPS Readiness
                  </span>
                  <button
                    onClick={() => refreshLocation()}
                    className="text-[10px] text-[#7651A8] font-bold hover:underline"
                  >
                    Refresh
                  </button>
                </div>
                <p className="text-xs text-[#77717F]">
                  {isLocating
                    ? 'Acquiring GPS fix...'
                    : currentCoords
                    ? `Lat ${currentCoords.latitude.toFixed(3)}, Lng ${currentCoords.longitude.toFixed(3)}`
                    : 'Awaiting permission'}
                </p>
                {locationError && <p className="text-[10px] text-[#D92D45] mt-1">{locationError}</p>}
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9FC] border border-[#E9E5EE]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-[#25212B] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#7651A8]" />
                    Trusted Circle
                  </span>
                  <span className="text-[10px] text-[#247A55] font-semibold">
                    {contacts.filter((c) => c.canReceiveAlerts).length} Ready
                  </span>
                </div>
                <p className="text-xs text-[#77717F] truncate">
                  Primary: {contacts.find((c) => c.isPrimary)?.name || 'None chosen'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Immediate Helpline Dispatch Bar */}
      <div className="p-6 bg-white border border-[#E9E5EE] rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-[#D92D45] flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#25212B]">Pakistan Official Emergency Helplines</h4>
            <p className="text-[11px] text-[#77717F]">District Bhakkar & Punjab immediate telephone dispatch</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="tel:15"
            className="px-3 py-1.5 bg-[#FAF9FC] hover:bg-red-50 text-[#D92D45] border border-red-200 rounded-xl text-xs font-bold"
            title="Police Madadgar Helpline (15)"
          >
            Police Madadgar: 15
          </a>
          <a
            href="tel:1122"
            className="px-3 py-1.5 bg-[#FAF9FC] hover:bg-red-50 text-[#D92D45] border border-red-200 rounded-xl text-xs font-bold"
            title="Rescue Emergency (1122)"
          >
            Rescue: 1122
          </a>
          <a
            href="tel:1098"
            className="px-3 py-1.5 bg-[#FAF9FC] hover:bg-purple-50 text-[#4A245E] border border-[#E9E5EE] rounded-xl text-xs font-bold"
            title="Women Safety / Madadgar Helpline (1098)"
          >
            Women Safety: 1098
          </a>
          <a
            href="tel:1099"
            className="px-3 py-1.5 bg-[#FAF9FC] hover:bg-purple-50 text-[#4A245E] border border-[#E9E5EE] rounded-xl text-xs font-bold"
            title="Women Protection Authority Punjab (1099)"
          >
            Punjab Women Protection: 1099
          </a>
          <a
            href="tel:115"
            className="px-3 py-1.5 bg-[#FAF9FC] hover:bg-emerald-50 text-[#247A55] border border-[#E9E5EE] rounded-xl text-xs font-bold"
            title="Edhi Ambulance (115)"
          >
            Edhi: 115
          </a>
          <a
            href="tel:1124"
            className="px-3 py-1.5 bg-[#FAF9FC] hover:bg-purple-50 text-[#4A245E] border border-[#E9E5EE] rounded-xl text-xs font-bold"
            title="Child Protection Helpline (1124)"
          >
            Child Protection: 1124
          </a>
        </div>
      </div>
    </div>
  );
};
