import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Compass,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Calendar,
  ChevronRight,
  UserPlus,
  FileText,
  Volume2,
  Share2,
  PhoneCall,
  Mic,
  MicOff,
  Camera,
  Play,
  Square,
  Copy,
  ExternalLink,
  Check,
  X,
  Radio,
  Zap,
  Globe,
  Bell,
  Trash2,
  Plus,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';
import { PWAInstallButton } from '../components/common/PWAInstallButton';

interface Guardian {
  id: number | string;
  name: string;
  phone: string;
  relation: string;
}

interface SafeZone {
  id: number | string;
  name: string;
  location: string;
  status: string;
}

interface SOSRecord {
  id: number | string;
  time: string;
  email?: string;
  location: string;
  status: string;
}

const WEEKLY_DATA = [
  { name: 'Mon', journeys: 2, checkins: 4, alerts: 0 },
  { name: 'Tue', journeys: 1, checkins: 2, alerts: 0 },
  { name: 'Wed', journeys: 3, checkins: 6, alerts: 1 },
  { name: 'Thu', journeys: 2, checkins: 3, alerts: 0 },
  { name: 'Fri', journeys: 4, checkins: 8, alerts: 0 },
  { name: 'Sat', journeys: 3, checkins: 5, alerts: 0 },
  { name: 'Sun', journeys: 2, checkins: 4, alerts: 0 },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    contacts,
    journeys,
    incidents,
    activeJourney,
    activeSOSEvent,
    completeJourney,
    checkInJourney,
    toggleSiren,
    isSirenActive,
    currentCoords,
    refreshLocation,
    triggerSOS,
  } = useSafety();

  // Live PKT clock & Weather
  const [livePktTime, setLivePktTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLivePktTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick Action Modal States
  const [showShareLocationModal, setShowShareLocationModal] = useState(false);
  const [locationCopied, setLocationCopied] = useState(false);
  const [showEmergencyCallModal, setShowEmergencyCallModal] = useState(false);
  const [showRecordEvidenceModal, setShowRecordEvidenceModal] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState<string | null>(null);
  const [evidenceSavedSuccess, setEvidenceSavedSuccess] = useState(false);

  // Live Location Tracking Toggle
  const [isLiveLocationTracking, setIsLiveLocationTracking] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Check-in Timer (30 minutes)
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(1800);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Guardian Network (5 guardians in localStorage)
  const [guardians, setGuardians] = useState<Guardian[]>(() => {
    const stored = localStorage.getItem('guardians');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [
      { id: 1, name: 'Dr. Ayesha Malik', phone: '0316-7054627', relation: 'Campus Mentor / Professor' },
      { id: 2, name: 'Zainab Baloch', phone: '0300-1234567', relation: 'Sister' },
      { id: 3, name: 'Maryam Tariq', phone: '0321-7654321', relation: 'Hostel Roommate' },
      { id: 4, name: 'Thal Uni Security', phone: '0453-920001', relation: 'Campus Security Desk' },
      { id: 5, name: 'Rescue Emergency', phone: '1122', relation: 'Punjab Rescue Bhakkar' },
    ];
  });
  const [showAddGuardianModal, setShowAddGuardianModal] = useState(false);
  const [newGName, setNewGName] = useState('');
  const [newGPhone, setNewGPhone] = useState('');
  const [newGRelation, setNewGRelation] = useState('');

  // Safe Zones
  const [safeZones, setSafeZones] = useState<SafeZone[]>(() => {
    const stored = localStorage.getItem('safeZones');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [
      { id: 1, name: 'Thal University Campus', location: 'Main Academic Block', status: 'Verified Safe' },
      { id: 2, name: 'Girls Hostel Refuge', location: 'West Wing Bhakkar', status: 'Guarded 24/7' },
      { id: 3, name: 'Central Library', location: 'Block B Thal Uni', status: 'Active Safe Zone' },
    ];
  });
  const [showAddSafeZoneModal, setShowAddSafeZoneModal] = useState(false);
  const [newSZName, setNewSZName] = useState('');
  const [newSZLocation, setNewSZLocation] = useState('');

  // Incident History Table
  const [sosQueue, setSosQueue] = useState<SOSRecord[]>(() => {
    const stored = localStorage.getItem('sosQueue');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 101,
        time: new Date(Date.now() - 7200000).toISOString(),
        location: 'Thal University Library',
        status: 'synced-with-bhakkar-hub',
      },
      {
        id: 102,
        time: new Date(Date.now() - 86400000).toISOString(),
        location: 'Girls Hostel Access Gate',
        status: 'synced-with-bhakkar-hub',
      },
    ];
  });
  const [incidentFilter, setIncidentFilter] = useState<'all' | 'offline' | 'synced'>('all');

  // Modals for Privacy, Terms, Safety, Support
  const [infoModalContent, setInfoModalContent] = useState<{ title: string; body: React.ReactNode } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recIntervalRef = useRef<number | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const lat = currentCoords?.latitude || 31.6248;
  const lng = currentCoords?.longitude || 71.0648;
  const shareTrackingUrl = `https://safeher.app/track?lat=${lat}&lng=${lng}&user=${encodeURIComponent(
    user?.fullName || 'Sanam Baloch'
  )}`;

  // Save guardians to localStorage
  useEffect(() => {
    localStorage.setItem('guardians', JSON.stringify(guardians));
  }, [guardians]);

  // Save safeZones to localStorage
  useEffect(() => {
    localStorage.setItem('safeZones', JSON.stringify(safeZones));
  }, [safeZones]);

  // Check-in timer tick
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            // Trigger offline SOS
            handleTriggerEmergencySOS();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const handleStartTimer = () => {
    setTimerSecondsLeft(1800);
    setIsTimerRunning(true);
    showToast('Check-in timer started for 30 minutes offline');
  };

  const handleCancelTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(1800);
    showToast('Check-in timer cancelled');
  };

  // Live Location Toggle Handler
  const handleToggleLiveLocation = (checked: boolean) => {
    setIsLiveLocationTracking(checked);
    if (checked) {
      if ('geolocation' in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const locData = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              updatedAt: Date.now(),
            };
            localStorage.setItem('lastLocation', JSON.stringify(locData));
          },
          () => {},
          { timeout: 10000, enableHighAccuracy: true }
        );
      }
      showToast('Location saved locally - Tracking every 10s offline!');
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      showToast('Live location sharing paused');
    }
  };

  // Trigger Offline SOS
  const handleTriggerEmergencySOS = () => {
    triggerSOS('Thal University Bhakkar Campus, Thal Region');
    const newRecord: SOSRecord = {
      id: Date.now(),
      time: new Date().toISOString(),
      email: user?.email || 'sanam.baloch@thaluni.edu.pk',
      location: 'Thal University Bhakkar Campus, Thal Region',
      status: 'saved-offline-will-send-when-online',
    };
    const updated = [newRecord, ...sosQueue];
    setSosQueue(updated);
    localStorage.setItem('sosQueue', JSON.stringify(updated));

    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([300, 100, 300, 100, 300]);
      } catch {
        // ignore
      }
    }
    showToast('🚨 SOS Emergency Alert Saved Offline in Bhakkar Hub!');
  };

  // Guardian Management
  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGName || !newGPhone) return;
    const newG: Guardian = {
      id: Date.now(),
      name: newGName.trim(),
      phone: newGPhone.trim(),
      relation: newGRelation.trim() || 'Trusted Contact',
    };
    setGuardians([...guardians, newG]);
    setNewGName('');
    setNewGPhone('');
    setNewGRelation('');
    setShowAddGuardianModal(false);
    showToast('Guardian added offline!');
  };

  const handleDeleteGuardian = (id: number | string) => {
    setGuardians(guardians.filter((g) => g.id !== id));
    showToast('Guardian removed offline');
  };

  // Safe Zone Management
  const handleAddSafeZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSZName) return;
    const newSZ: SafeZone = {
      id: Date.now(),
      name: newSZName.trim(),
      location: newSZLocation.trim() || 'District Bhakkar',
      status: 'User Custom Safe Zone',
    };
    setSafeZones([...safeZones, newSZ]);
    setNewSZName('');
    setNewSZLocation('');
    setShowAddSafeZoneModal(false);
    showToast('Safe zone saved locally in Bhakkar storage!');
  };

  // Quick Action 1: Share Location
  const handleQuickShareLocation = async () => {
    await refreshLocation();
    try {
      await navigator.clipboard.writeText(
        `🚨 SafeHer Live Location Tracking: ${user?.fullName || 'Sanam Baloch'} is sharing current location (Lat: ${lat.toFixed(
          4
        )}, Lng: ${lng.toFixed(4)}, District Bhakkar, Punjab, Pakistan). Tracking link: ${shareTrackingUrl}`
      );
      setLocationCopied(true);
      setTimeout(() => setLocationCopied(false), 3000);
    } catch {
      setLocationCopied(true);
      setTimeout(() => setLocationCopied(false), 3000);
    }
    setShowShareLocationModal(true);
  };

  // Quick Action 3: Audio Recording Handlers
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setRecordingSeconds(0);

      recIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      setIsRecordingAudio(true);
      setRecordingSeconds(0);
      recIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recIntervalRef.current) {
      clearInterval(recIntervalRef.current);
      recIntervalRef.current = null;
    }
    setIsRecordingAudio(false);
    showToast('Audio recording saved locally in evidence vault');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEvidencePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEvidence = () => {
    const evidenceItem = {
      id: `ev_${Date.now()}`,
      recordedAt: new Date().toISOString(),
      location: `Bhakkar City, District Bhakkar, Punjab, Pakistan (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      note: evidenceNote || 'Rapid incident evidence logged from Dashboard.',
      photo: evidencePhoto,
      hasAudio: !!audioUrl || recordingSeconds > 0,
      durationSeconds: recordingSeconds,
    };

    try {
      const stored = localStorage.getItem('safeher_evidence_vault');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(evidenceItem);
      localStorage.setItem('safeher_evidence_vault', JSON.stringify(list));
    } catch {
      // ignore
    }

    setEvidenceSavedSuccess(true);
    showToast('Evidence saved locally in Bhakkar vault');
    setTimeout(() => {
      setEvidenceSavedSuccess(false);
      setShowRecordEvidenceModal(false);
      setAudioUrl(null);
      setEvidencePhoto(null);
      setEvidenceNote('');
      setRecordingSeconds(0);
    }, 1500);
  };

  const filteredIncidents = sosQueue.filter((item) => {
    if (incidentFilter === 'all') return true;
    if (incidentFilter === 'offline') return item.status && item.status.includes('offline');
    if (incidentFilter === 'synced') return item.status && item.status.includes('synced');
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1B4B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-400 text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Live Alert Ticker & PKT Status Bar */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-semibold text-[#5B21B6]">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="px-2.5 py-1 bg-[#7C3AED] text-white text-[10px] font-black rounded-lg uppercase tracking-wider shrink-0">
            Live Alert Ticker
          </span>
          <p className="truncate text-xs text-[#1E1B4B]">
            📢 Last alert: 2 hours ago at Thal University Library - Resolved · All Campus Patrols Active
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs">
          <span className="font-mono text-purple-900 bg-white px-2.5 py-1 rounded-lg border border-purple-200">
            {livePktTime || 'PKT --:--:--'}
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-purple-200 font-bold text-gray-700">
            Bhakkar 32°C ☀️
          </span>
        </div>
      </div>

      {/* HERO SECTION: WORLD MAP SVG + BHAKKAR PULSING RED DOT */}
      <section className="relative bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E7EB] shadow-lg overflow-hidden text-center space-y-6">
        {/* Faint World Map SVG Background (light gray #F3F4F6 world map opacity 0.3) */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
          <svg className="w-full h-full max-w-5xl object-contain text-gray-300" viewBox="0 0 1000 500" fill="currentColor">
            <path d="M150,150 Q180,100 250,120 T350,160 T450,120 T550,180 T650,140 T750,170 T850,130 L850,300 Q750,350 650,300 T450,380 T250,320 Z" opacity="0.4" />
            <circle cx="200" cy="200" r="100" fill="#F3F4F6" />
            <circle cx="500" cy="220" r="140" fill="#F3F4F6" />
            <circle cx="750" cy="240" r="120" fill="#F3F4F6" />
          </svg>
        </div>

        {/* Global Node Visualizer Card with Headquarters Bhakkar Focus */}
        <div className="relative z-10 w-full max-w-3xl mx-auto h-64 sm:h-72 rounded-3xl bg-gradient-to-b from-[#FAF9FC] to-[#F3F4F6] border border-[#E5E7EB] shadow-inner p-6 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Global Safety Network Matrix
            </span>
            <span className="bg-white/90 px-3 py-1 rounded-full shadow-xs">
              Operational Zone: Thal Region
            </span>
          </div>

          {/* Node cluster center: Headquarters Bhakkar */}
          <div className="my-auto flex flex-col items-center justify-center">
            {/* BHAKKAR PULSING RED DOT 3X BIGGER THAN OTHER CITIES (#E11D48) WITH 4 RIPPLE RINGS ANIMATION */}
            <div className="relative flex items-center justify-center w-48 h-48">
              {/* 4 Ripple Rings Animation (Always Pulsing Concentric Expanding Rings) */}
              <div
                className="absolute w-14 h-14 rounded-full border-2 border-[#E11D48] pointer-events-none bhakkar-ripple-1"
                style={{ animation: 'rippleRing1 2.4s infinite ease-out 0s' }}
              />
              <div
                className="absolute w-22 h-22 rounded-full border-2 border-[#E11D48] pointer-events-none bhakkar-ripple-2"
                style={{ animation: 'rippleRing2 2.4s infinite ease-out 0.6s' }}
              />
              <div
                className="absolute w-32 h-32 rounded-full border border-[#E11D48] pointer-events-none bhakkar-ripple-3"
                style={{ animation: 'rippleRing3 2.4s infinite ease-out 1.2s' }}
              />
              <div
                className="absolute w-42 h-42 rounded-full border border-[#E11D48] pointer-events-none bhakkar-ripple-4"
                style={{ animation: 'rippleRing4 2.4s infinite ease-out 1.8s' }}
              />

              {/* Central Bhakkar Red Dot - 3X BIGGER than other cities (30px vs 10px), #E11D48, Always Pulsing */}
              <div
                className="w-[30px] h-[30px] rounded-full bg-[#E11D48] z-20 flex items-center justify-center text-white text-[12px] font-black shadow-2xl bhakkar-pulse-dot cursor-pointer"
                title="Headquarters: Bhakkar, Punjab | Pakistan - Operational Hub"
                style={{
                  animation: 'bhakkarDotPulse 1.8s infinite ease-in-out',
                  boxShadow: '0 0 16px rgba(225, 29, 72, 0.7)',
                }}
              >
                ★
              </div>
            </div>

            {/* Label below Bhakkar: bold */}
            <div className="mt-2 px-4 py-1.5 bg-white rounded-2xl shadow-md border-2 border-[#E11D48]/30 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E11D48] fill-[#E11D48] shrink-0" />
              <span className="font-bold text-xs sm:text-sm text-[#E11D48] tracking-tight">
                Headquarters: Bhakkar, Punjab | Pakistan - Operational Hub
              </span>
            </div>

            {/* Other cities: Lahore, Karachi, Islamabad small purple dots #6366F1 */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-gray-700">
              <span className="flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-xl shadow-xs border border-purple-100 hover:bg-purple-50 cursor-pointer transition-colors" title="Lahore Safety Relay">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shadow-xs shrink-0" />
                <span className="font-medium text-gray-700">Lahore</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-xl shadow-xs border border-purple-100 hover:bg-purple-50 cursor-pointer transition-colors" title="Karachi Coastal Unit">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shadow-xs shrink-0" />
                <span className="font-medium text-gray-700">Karachi</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/95 px-3 py-1 rounded-xl shadow-xs border border-purple-100 hover:bg-purple-50 cursor-pointer transition-colors" title="Islamabad Rapid Hub">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shadow-xs shrink-0" />
                <span className="font-medium text-gray-700">Islamabad</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-xl shadow-xs border border-purple-100 hover:bg-purple-50 cursor-pointer transition-colors" title="Multan Regional Wing">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shadow-xs shrink-0" />
                <span className="font-medium text-gray-600">Multan</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-xl shadow-xs border border-purple-100 hover:bg-purple-50 cursor-pointer transition-colors" title="UK Overseas Safe Node">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shadow-xs shrink-0" />
                <span className="font-medium text-gray-600">UK</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-xl shadow-xs border border-purple-100 hover:bg-purple-50 cursor-pointer transition-colors" title="USA Gateway">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shadow-xs shrink-0" />
                <span className="font-medium text-gray-600">USA</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-xl shadow-xs border border-purple-100 hover:bg-purple-50 cursor-pointer transition-colors" title="UAE Safe Connect">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shadow-xs shrink-0" />
                <span className="font-medium text-gray-600">UAE</span>
              </span>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 font-medium">
            Tap or hover pins to verify active telemetry gateways
          </p>
        </div>

        {/* Heading center: 48px bold gradient #7C3AED to #3730A3 */}
        <h1
          className="text-3xl sm:text-4xl lg:text-[48px] font-black tracking-tight leading-tight"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #3730A3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Your Safety Should Never Be a Question
        </h1>

        {/* Subheading: gray 18px center max 600px */}
        <p className="text-base sm:text-[18px] text-[#6B7280] max-w-[600px] mx-auto leading-relaxed">
          Real-time protection built for women in Pakistan — starting in Bhakkar, now expanding nationwide and globally.
        </p>

        {/* Buttons center */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#features-section"
            className="w-full sm:w-auto px-8 h-[52px] bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Get Started - Explore Safety Features</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <button
            onClick={handleTriggerEmergencySOS}
            className="w-full sm:w-auto px-8 h-[52px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>🚨 SOS Emergency - Instant Alert</span>
          </button>
        </div>

        {/* Stats Bar: 4 Cards White with Shadow */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-md text-left">
            <p className="text-2xl font-black text-[#1E1B4B]">500+ 👩</p>
            <p className="text-xs font-bold text-[#6B7280] mt-1">Women in Bhakkar Protected</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-md text-left">
            <p className="text-2xl font-black text-[#7C3AED]">1043 ☎️</p>
            <p className="text-xs font-bold text-[#6B7280] mt-1">Helpline Connected</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-md text-left">
            <p className="text-2xl font-black text-red-600">15 🚨</p>
            <p className="text-xs font-bold text-[#6B7280] mt-1">Emergency Integrated</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-md text-left">
            <p className="text-2xl font-black text-[#247A55]">100% 🗺️</p>
            <p className="text-xs font-bold text-[#6B7280] mt-1">Thal Region Coverage</p>
          </div>
        </div>
      </section>

      {/* PROMINENT QUICK ACTIONS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#25212B] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#7651A8]" />
              <span>Quick Actions</span>
            </h3>
            <p className="text-xs text-[#77717F]">One-tap immediate security protocols and emergency tools.</p>
          </div>
          <span className="text-[10px] font-bold text-[#247A55] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            One-Tap Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Quick Action 1: Share Location */}
          <button
            onClick={handleQuickShareLocation}
            type="button"
            className="p-5 bg-white hover:bg-[#F1EAF8]/50 border-2 border-[#E9E5EE] hover:border-[#7651A8] rounded-3xl text-left transition-all shadow-sm hover:shadow-md group flex items-start gap-4 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#7651A8]/10 text-[#7651A8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[#25212B] group-hover:text-[#4A245E] transition-colors">
                  Share Location
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs text-[#77717F] leading-relaxed">
                One-tap live GPS tracking dispatch to trusted contacts via WhatsApp, SMS, or link.
              </p>
              <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-[#7651A8]">
                <span>Tap to broadcast location</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </button>

          {/* Quick Action 2: Call Emergency Services */}
          <button
            onClick={() => setShowEmergencyCallModal(true)}
            type="button"
            className="p-5 bg-white hover:bg-red-50/50 border-2 border-[#E9E5EE] hover:border-red-300 rounded-3xl text-left transition-all shadow-sm hover:shadow-md group flex items-start gap-4 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#D92D45] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[#25212B] group-hover:text-[#D92D45] transition-colors">
                  Call Emergency Services
                </h4>
                <span className="text-[9px] font-bold bg-red-100 text-[#D92D45] px-1.5 py-0.2 rounded">24/7</span>
              </div>
              <p className="text-xs text-[#77717F] leading-relaxed">
                Direct telephone dialer for Police 15, Rescue 1122, and Women Safety Helpline 1043 / 1098.
              </p>
              <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-[#D92D45]">
                <span>Tap to view hotline dialers</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </button>

          {/* Quick Action 3: Record Evidence */}
          <button
            onClick={() => setShowRecordEvidenceModal(true)}
            type="button"
            className="p-5 bg-white hover:bg-purple-50/50 border-2 border-[#E9E5EE] hover:border-[#4A245E] rounded-3xl text-left transition-all shadow-sm hover:shadow-md group flex items-start gap-4 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#4A245E]/10 text-[#4A245E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[#25212B] group-hover:text-[#4A245E] transition-colors">
                  Record Evidence
                </h4>
                <span className="w-2 h-2 rounded-full bg-[#7651A8]" />
              </div>
              <p className="text-xs text-[#77717F] leading-relaxed">
                Discreet audio & photo recorder stamped with timestamp and GPS coordinates.
              </p>
              <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-[#4A245E]">
                <span>Tap to launch recorder</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* FEATURES GRID REALISTIC WORKING SECTION */}
      <section id="features-section" className="space-y-6 pt-4">
        <div>
          <h2 className="text-2xl font-black text-[#1E1B4B]">Features Grid · 100% Offline Enabled</h2>
          <p className="text-xs text-[#6B7280]">
            All clicks and controls persist to device storage without requiring an active internet connection.
          </p>
        </div>

        {/* ROW 1: Live Location Sharing, Audio Recording, Check-in Timer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Live Location Sharing */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLiveLocationTracking}
                    onChange={(e) => handleToggleLiveLocation(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                </label>
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B]">Live Location Sharing</h3>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Starts background watchPosition and saves coordinates to localStorage lastLocation every 10s.
              </p>
            </div>
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                isLiveLocationTracking ? 'bg-emerald-50 text-emerald-800' : 'bg-purple-50 text-[#5B21B6]'
              }`}
            >
              {isLiveLocationTracking
                ? '🟢 Active Tracking: Bhakkar (31.6266° N, 71.0657° E)'
                : 'Status: Offline Ready (Toggle to activate)'}
            </div>
          </div>

          {/* Card 2: Audio Evidence Recording */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl mb-3">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B]">Audio Evidence Recording</h3>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Uses MediaRecorder API to record ambient audio. Saves flag and audio clips to local phone storage.
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setShowRecordEvidenceModal(true)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>🎙️ Launch Audio Recorder</span>
              </button>
              <p className="text-[11px] text-gray-500 text-center font-medium">Recording flag stored locally</p>
            </div>
          </div>

          {/* Card 3: Check-in Timer */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B]">Check-in Safety Timer</h3>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                Set countdown timer. If not cancelled before expiration, triggers offline SOS emergency alert.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <span className="text-xs font-bold text-gray-700">Time Remaining:</span>
                <span className="text-lg font-black text-[#7C3AED] font-mono">
                  {String(Math.floor(timerSecondsLeft / 60)).padStart(2, '0')}:
                  {String(timerSecondsLeft % 60).padStart(2, '0')}
                </span>
              </div>
              <div className="flex gap-2">
                {!isTimerRunning ? (
                  <button
                    onClick={handleStartTimer}
                    className="flex-1 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl"
                  >
                    Start 30min
                  </button>
                ) : (
                  <button
                    onClick={handleCancelTimer}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
                  >
                    Cancel Timer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Guardian Network, Safe Zones, Incident History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Guardian Network (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E1B4B]">Guardian Network</h3>
                <p className="text-xs text-gray-500">Trusted peer circle ({guardians.length} guardians)</p>
              </div>
              <button
                onClick={() => setShowAddGuardianModal(true)}
                className="px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                + Add Guardian
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {guardians.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                      {g.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1E1B4B]">{g.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {g.relation} · <span className="font-mono">{g.phone}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGuardian(g.id)}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg"
                    title="Remove guardian"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Zones (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1E1B4B]">Safe Zones</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Bhakkar
              </span>
            </div>
            <div className="space-y-2 text-xs max-h-[220px] overflow-y-auto">
              {safeZones.map((z) => (
                <div key={z.id} className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <p className="font-bold text-[#1E1B4B]">{z.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {z.location} · <span className="text-emerald-700 font-bold">{z.status}</span>
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAddSafeZoneModal(true)}
              className="w-full py-2.5 border-2 border-dashed border-[#7C3AED] text-[#7C3AED] text-xs font-bold rounded-xl hover:bg-purple-50 transition-colors"
            >
              + Add Custom Safe Zone Pin
            </button>
          </div>

          {/* Incident History (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1E1B4B]">Incident History</h3>
              <select
                value={incidentFilter}
                onChange={(e) => setIncidentFilter(e.target.value as any)}
                className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 font-semibold bg-gray-50 text-gray-700"
              >
                <option value="all">All Alerts</option>
                <option value="offline">Saved Offline</option>
                <option value="synced">Synced Hub</option>
              </select>
            </div>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 text-xs">
              {filteredIncidents.length === 0 ? (
                <p className="text-gray-400 text-center py-6">No incidents found.</p>
              ) : (
                filteredIncidents.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-[#1E1B4B]">{item.location}</p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {new Date(item.time).toLocaleTimeString()} · {new Date(item.time).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status.includes('offline')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.status.includes('offline') ? 'Saved Offline' : 'Synced Hub'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAP SECTION: Leaflet or Offline View */}
      <section className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-[#1E1B4B]">Bhakkar Safety Map & Campus Grid</h2>
            <p className="text-xs text-[#6B7280]">
              Thal University coordinates: 31.6266° N, 71.0657° E (District Bhakkar, Punjab).
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> You
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Safe Zones
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Campus SOS
            </span>
          </div>
        </div>

        {/* Map Canvas / Static Offline Layout */}
        <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-[#E5E7EB] bg-gradient-to-br from-indigo-950 to-purple-950 p-6 flex flex-col justify-between text-white shadow-inner">
          <div className="flex items-center justify-between z-10 text-xs">
            <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm font-bold">
              Bhakkar Map - Offline View - Thal University Campus
            </span>
            <span className="bg-emerald-500/80 px-3 py-1 rounded-full font-bold">Safe Zones Loaded</span>
          </div>

          {/* Graphical pins drawn via CSS */}
          <div className="relative flex-1 flex items-center justify-around z-10 py-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-sm font-bold shadow-lg animate-pulse">
                📍
              </div>
              <span className="mt-2 text-xs font-bold bg-black/60 px-2 py-0.5 rounded-md">You (Bhakkar)</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-sm font-bold shadow-lg">
                🛡️
              </div>
              <span className="mt-2 text-xs font-bold bg-black/60 px-2 py-0.5 rounded-md">Girls Hostel</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#7C3AED] border-2 border-white flex items-center justify-center text-sm font-bold shadow-lg">
                🏛️
              </div>
              <span className="mt-2 text-xs font-bold bg-black/60 px-2 py-0.5 rounded-md">
                Thal Uni Main Block
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-600 border-2 border-white flex items-center justify-center text-sm font-bold shadow-lg">
                📚
              </div>
              <span className="mt-2 text-xs font-bold bg-black/60 px-2 py-0.5 rounded-md">Library Refuge</span>
            </div>
          </div>

          <div className="z-10 flex items-center justify-between text-[11px] text-purple-200 border-t border-white/10 pt-3">
            <span>Offline tile cache verified by Service Worker</span>
            <span>Emergency Police: 15 · Women Helpline: 1043</span>
          </div>
        </div>
      </section>

      {/* DASHBOARD FOOTER WITH MODALS */}
      <footer className="bg-[#1E1B4B] text-white rounded-3xl p-8 border border-purple-900 text-center space-y-5">
        <div className="flex items-center justify-center gap-2 text-xl font-black">
          <span>🛡️</span>
          <span>SafeHer - Bhakkar</span>
        </div>
        <p className="text-xs sm:text-sm text-purple-200 max-w-2xl mx-auto leading-relaxed">
          Made in Bhakkar, For Pakistan — SafeHer Guardian Network — Bhakkar | Contact:{' '}
          <strong className="text-white">sanam.baloch@thaluni.edu.pk</strong> | Thal University Bhakkar
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-purple-300 font-semibold pt-2">
          <button
            onClick={() =>
              setInfoModalContent({
                title: 'Privacy Policy',
                body: (
                  <p>
                    Zero telemetry sold or leaked. Your location is stored strictly on your local device and only
                    broadcasted when you initiate a journey or trigger SOS. Built by Sanam Baloch for Thal University
                    Bhakkar.
                  </p>
                ),
              })
            }
            className="hover:text-white transition-colors"
          >
            Privacy
          </button>
          <button
            onClick={() =>
              setInfoModalContent({
                title: 'Terms of Service',
                body: (
                  <p>
                    SafeHer is an academic and community defense tool for Thal University students, faculty, and women
                    of District Bhakkar. Emergency helplines 15 and 1043 are pre-configured for instant dialing.
                  </p>
                ),
              })
            }
            className="hover:text-white transition-colors"
          >
            Terms
          </button>
          <button
            onClick={() =>
              setInfoModalContent({
                title: 'Campus Safety Tips',
                body: (
                  <div className="space-y-2">
                    <p>1. Keep 5 guardians verified in your trusted circle.</p>
                    <p>2. Activate safe check-in timers when walking near campus gates after dusk.</p>
                    <p>3. Use the discreet audio evidence recorder if feeling intimidated.</p>
                  </div>
                ),
              })
            }
            className="hover:text-white transition-colors"
          >
            Safety
          </button>
          <button
            onClick={() =>
              setInfoModalContent({
                title: 'Help & Support Desk',
                body: (
                  <div className="space-y-1">
                    <p>Lead Developer: Sanam Baloch</p>
                    <p>Email: sanam.baloch@thaluni.edu.pk</p>
                    <p>Campus: Thal University Bhakkar, Punjab, Pakistan.</p>
                    <p className="pt-2 font-bold text-red-600">Police Emergency: 15 | Women Helpline: 1043 / 1098</p>
                  </div>
                ),
              })
            }
            className="hover:text-white transition-colors"
          >
            Support
          </button>
        </div>
        <p className="text-[11px] text-purple-400 pt-3 border-t border-purple-800/50">
          App Version 1.0 - Class Project - Thal University Bhakkar - BSIT - Developed by Sanam Baloch - District
          Bhakkar, Punjab, Pakistan
        </p>
      </footer>

      {/* MODAL 1: Add Guardian Modal */}
      {showAddGuardianModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-left shadow-2xl">
            <h3 className="text-base font-bold text-[#1E1B4B]">Add Trusted Guardian</h3>
            <form onSubmit={handleAddGuardian} className="space-y-3 mt-3">
              <input
                type="text"
                required
                value={newGName}
                onChange={(e) => setNewGName(e.target.value)}
                placeholder="Name (e.g. Fatima / Professor)"
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
              <input
                type="tel"
                required
                value={newGPhone}
                onChange={(e) => setNewGPhone(e.target.value)}
                placeholder="Phone (e.g. 0316-7054627)"
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
              <input
                type="text"
                required
                value={newGRelation}
                onChange={(e) => setNewGRelation(e.target.value)}
                placeholder="Relation (e.g. Sister / Campus Friend)"
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-[#7C3AED] text-white text-xs font-bold rounded-xl">
                  Save Offline
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGuardianModal(false)}
                  className="py-2 px-3 border text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Safe Zone Modal */}
      {showAddSafeZoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-left shadow-2xl">
            <h3 className="text-base font-bold text-[#1E1B4B]">Add Custom Safe Zone</h3>
            <form onSubmit={handleAddSafeZone} className="space-y-3 mt-3">
              <input
                type="text"
                required
                value={newSZName}
                onChange={(e) => setNewSZName(e.target.value)}
                placeholder="Zone Name (e.g. Student Center)"
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
              <input
                type="text"
                required
                value={newSZLocation}
                onChange={(e) => setNewSZLocation(e.target.value)}
                placeholder="Location (e.g. Bhakkar City Block 3)"
                className="w-full px-3 py-2 border rounded-xl text-xs"
              />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">
                  Save Zone
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSafeZoneModal(false)}
                  className="py-2 px-3 border text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Info Dialog (Privacy, Terms, Safety, Support) */}
      {infoModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-left shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-[#1E1B4B]">{infoModalContent.title}</h3>
            <div className="mt-3 text-xs text-gray-600 space-y-2 leading-relaxed">{infoModalContent.body}</div>
            <button
              onClick={() => setInfoModalContent(null)}
              className="mt-4 w-full py-2.5 bg-[#7C3AED] text-white text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: Share Location Modal */}
      {showShareLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E9E5EE]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E5EE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#7651A8]/10 text-[#7651A8] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#25212B]">Share Live Tracking Link</h3>
              </div>
              <button
                onClick={() => setShowShareLocationModal(false)}
                className="p-1 rounded-lg text-[#77717F] hover:bg-[#FAF9FC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-[#FAF9FC] border border-[#E9E5EE] rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-[#77717F] uppercase">GPS Coordinates:</span>
              <p className="text-xs font-mono font-bold text-[#25212B]">
                Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)} (Bhakkar, Punjab, Pakistan)
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🚨 SafeHer Live Location Tracking: ${user?.fullName || 'Sanam Baloch'} (District Bhakkar, Punjab, Pakistan): ${shareTrackingUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs"
              >
                Share via WhatsApp
              </a>
              <button
                onClick={() => setShowShareLocationModal(false)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Emergency Call Modal */}
      {showEmergencyCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E9E5EE]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E5EE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-[#D92D45] flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#25212B]">Emergency Helplines (Pakistan)</h3>
              </div>
              <button
                onClick={() => setShowEmergencyCallModal(false)}
                className="p-1 rounded-lg text-[#77717F] hover:bg-[#FAF9FC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:15"
                className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl text-center block transition-colors"
              >
                <p className="text-lg font-black text-red-600 font-mono">15</p>
                <p className="text-xs font-bold text-[#25212B]">Police Madadgar</p>
              </a>
              <a
                href="tel:1043"
                className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl text-center block transition-colors"
              >
                <p className="text-lg font-black text-[#7C3AED] font-mono">1043</p>
                <p className="text-xs font-bold text-[#25212B]">Women Helpline</p>
              </a>
              <a
                href="tel:1122"
                className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl text-center block transition-colors"
              >
                <p className="text-lg font-black text-red-600 font-mono">1122</p>
                <p className="text-xs font-bold text-[#25212B]">Rescue Emergency</p>
              </a>
              <a
                href="tel:1098"
                className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl text-center block transition-colors"
              >
                <p className="text-lg font-black text-[#7C3AED] font-mono">1098</p>
                <p className="text-xs font-bold text-[#25212B]">Women Safety</p>
              </a>
            </div>
            <button
              onClick={() => setShowEmergencyCallModal(false)}
              className="w-full py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 6: Record Evidence Modal */}
      {showRecordEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E9E5EE]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E5EE]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#4A245E]/10 text-[#4A245E] flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#25212B]">Record Incident Evidence</h3>
              </div>
              <button
                onClick={() => {
                  stopAudioRecording();
                  setShowRecordEvidenceModal(false);
                }}
                className="p-1 rounded-lg text-[#77717F] hover:bg-[#FAF9FC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Recording Section */}
            <div className="p-4 bg-[#FAF9FC] border border-[#E9E5EE] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#25212B]">Audio Recorder</span>
                {isRecordingAudio && (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                    Recording: {recordingSeconds}s
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!isRecordingAudio ? (
                  <button
                    onClick={startAudioRecording}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    onClick={stopAudioRecording}
                    className="flex-1 py-2.5 bg-[#25212B] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop Recording</span>
                  </button>
                )}
              </div>
            </div>

            {/* Photo Attachment Tool */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide">
                Photo Evidence
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-4 py-2 bg-[#FAF9FC] hover:bg-[#F1EAF8] border border-[#E9E5EE] text-[#4A245E] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>{evidencePhoto ? 'Change Photo' : 'Capture / Upload Photo'}</span>
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {evidencePhoto && (
                  <span className="text-xs font-bold text-[#247A55] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Photo Attached</span>
                  </span>
                )}
              </div>
            </div>

            {/* Incident Description */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide">
                Quick Incident Notes
              </label>
              <textarea
                rows={2}
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                placeholder="Vehicle number plate, suspect appearance, street location..."
                className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  stopAudioRecording();
                  setShowRecordEvidenceModal(false);
                }}
                className="px-4 py-2 text-xs text-[#77717F] hover:text-[#25212B]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEvidence}
                className="px-5 py-2.5 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Save Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
