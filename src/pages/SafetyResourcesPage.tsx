import React, { useState } from 'react';
import {
  PhoneCall,
  Shield,
  BookOpen,
  Printer,
  Scale,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  AlertOctagon,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';

const HOTLINES = [
  {
    title: 'Police Madadgar Helpline',
    number: '15',
    dial: '15',
    hours: '24/7 Always Open',
    description: 'Immediate police response, emergency dispatch, and crime prevention in Punjab.',
    priority: true,
  },
  {
    title: 'Rescue Emergency Service Punjab',
    number: '1122',
    dial: '1122',
    hours: '24/7 Rapid Response',
    description: 'Emergency ambulance, fire rescue, road traffic accident trauma care, and disaster management.',
    priority: true,
  },
  {
    title: 'Women Safety / Madadgar Helpline',
    number: '1098',
    dial: '1098',
    hours: '24/7 Toll-Free Support',
    description: 'Specialized women safety assistance, legal guidance, and anti-harassment emergency intervention.',
    priority: true,
  },
  {
    title: 'Women Protection Authority Punjab',
    number: '1099',
    dial: '1099',
    hours: '24/7 Toll-Free',
    description: 'Punjab Women Protection Authority hotline for reporting domestic violence, harassment, and shelter assistance.',
    priority: true,
  },
  {
    title: 'Edhi Ambulance Service',
    number: '115',
    dial: '115',
    hours: '24/7 Toll-Free',
    description: 'Nationwide Edhi Foundation emergency ambulance dispatch and medical transport.',
    priority: false,
  },
  {
    title: 'Child Protection Helpline',
    number: '1124',
    dial: '1124',
    hours: '24/7 Toll-Free',
    description: 'Child Protection & Welfare Bureau Punjab assistance for children in danger, distress, or abuse.',
    priority: false,
  },
];

const GUIDES = [
  {
    id: 'rideshare',
    title: 'Rideshare & Taxi Safety Protocol (Uber/Lyft/Cabs)',
    summary: 'Essential 4-step checklist before stepping inside any vehicle.',
    points: [
      'Ask the driver "Who are you picking up?" never "Are you for [My Name]?" to verify they have your actual ride booking.',
      'Cross-check the vehicle make, model, color, and license plate number with your app dispatch.',
      'Check child-lock handle functionality on rear doors before settling into the seat.',
      'Share the live ride tracker with your primary SafeHer contact.',
    ],
  },
  {
    id: 'transit',
    title: 'Late-Night Public Transit & Walking Guidelines',
    summary: 'Maintaining tactical situational awareness in subway platforms and alleys.',
    points: [
      'Keep one ear free of headphones; audio awareness gives you 3-5 seconds of early warning before someone approaches from behind.',
      'Stand near the illuminated platform conductor booth or transit emergency intercoms.',
      'If you suspect you are being followed, cross the street twice or turn into an open convenience store or pharmacy.',
      'Never hesitate to make loud verbal boundaries: "Back away from me" draws immediate bystander intervention.',
    ],
  },
  {
    id: 'deescalate',
    title: 'Verbal De-escalation & Defensive Stances',
    summary: 'Techniques to break target fixation and create escape corridors.',
    points: [
      'Adopt a non-confrontational defensive posture: hands open at chest height, weight balanced, eyes scanning escape paths.',
      'Use firm, neutral, non-apologetic commands instead of aggressive arguments.',
      'Target vulnerable areas if forced to defend physically: eyes, throat, groin, or knee strike, then sprint immediately toward light.',
    ],
  },
];

export const SafetyResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const { contacts } = useSafety();

  const [expandedGuide, setExpandedGuide] = useState<string | null>('rideshare');

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25212B] tracking-tight">
              Safety Resources & Guides
            </h1>
            <span className="text-xs font-bold text-[#7651A8] bg-[#F1EAF8] px-2.5 py-0.5 rounded-lg">
              Verified Emergency Directory
            </span>
          </div>
          <p className="text-sm text-[#77717F] mt-1">
            Official emergency hotlines, self-defense tactics, legal protections, and your printable wallet emergency
            card.
          </p>
        </div>

        <button
          onClick={handlePrintCard}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FAF9FC] hover:bg-[#F1EAF8] border border-[#E9E5EE] text-[#4A245E] text-xs font-bold rounded-xl transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Emergency Card</span>
        </button>
      </div>

      {/* Emergency Hotlines Directory */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#25212B] uppercase tracking-wider flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-[#D92D45]" />
          <span>Immediate 24/7 Telephone Hotlines</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {HOTLINES.map((hotline, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between ${
                hotline.priority ? 'border-red-200 bg-red-50/20' : 'border-[#E9E5EE]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#247A55] bg-emerald-50 px-2 py-0.5 rounded">
                    {hotline.hours}
                  </span>
                  {hotline.priority && (
                    <span className="text-[10px] font-bold text-[#D92D45] bg-red-100 px-2 py-0.5 rounded uppercase">
                      Urgent Dispatch
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#25212B] leading-tight">{hotline.title}</h3>
                <p className="text-xs text-[#77717F] leading-relaxed">{hotline.description}</p>
              </div>

              <div className="pt-4 mt-2 border-t border-[#E9E5EE] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#4A245E]">{hotline.number}</span>
                <a
                  href={`tel:${hotline.dial}`}
                  className="px-3 py-1.5 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet SOS Card Preview */}
      <div id="card" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#7651A8] shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E9E5EE] pb-4">
          <div>
            <span className="text-[10px] font-bold text-[#7651A8] bg-[#F1EAF8] px-2 py-0.5 rounded uppercase tracking-wider">
              Offline Physical Backup
            </span>
            <h3 className="text-lg font-bold text-[#25212B] mt-1">Printable SafeHer Emergency Wallet Card</h3>
            <p className="text-xs text-[#77717F]">
              Carry this in your wallet or phone case for emergency responders if your battery dies.
            </p>
          </div>

          <button
            onClick={handlePrintCard}
            className="px-4 py-2 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Save / Print PDF</span>
          </button>
        </div>

        {/* Printable Card Representation */}
        <div className="max-w-md mx-auto bg-gradient-to-br from-[#4A245E] via-[#5A2C72] to-[#7651A8] text-white rounded-2xl p-6 shadow-xl space-y-4 border-2 border-white/20">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              <span className="font-extrabold text-sm tracking-wider uppercase">SafeHer Emergency Card</span>
            </div>
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded">BS IT Defense ID</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-purple-200 uppercase tracking-wide block">Cardholder</span>
              <p className="font-bold text-sm">{user?.fullName || 'Sanam Baloch'}</p>
            </div>
            <div>
              <span className="text-[10px] text-purple-200 uppercase tracking-wide block">Blood Group</span>
              <p className="font-bold text-sm">{user?.bloodType || 'O+'}</p>
            </div>
          </div>

          <div className="bg-black/20 p-2.5 rounded-xl text-xs space-y-1">
            <span className="text-[10px] text-purple-200 uppercase tracking-wide block">Primary Emergency Contact</span>
            <p className="font-bold text-sm">
              {primaryContact ? `${primaryContact.name} (${primaryContact.relationship})` : 'Mother (Family Guardian)'}
            </p>
            <p className="font-mono text-xs">{primaryContact?.phone || '0300-1234567'}</p>
          </div>

          {user?.emergencyNotes && (
            <div className="text-[11px] text-purple-100 bg-white/10 p-2 rounded-lg">
              <strong>Medical/Allergies:</strong> {user.emergencyNotes}
            </div>
          )}

          <div className="text-[9px] text-purple-200 text-center pt-1 border-t border-white/10">
            In medical or safety emergency, dial Police Madadgar (15) or Rescue (1122), or contact the listed primary responder immediately.
          </div>
        </div>
      </div>

      {/* Practical Safety Guides Accordion */}
      <div id="guides" className="space-y-4">
        <h2 className="text-base font-bold text-[#25212B] uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#7651A8]" />
          <span>Situational Defense & Commute Strategies</span>
        </h2>

        <div className="space-y-3">
          {GUIDES.map((guide) => {
            const isOpen = expandedGuide === guide.id;
            return (
              <div key={guide.id} className="bg-white rounded-2xl border border-[#E9E5EE] overflow-hidden shadow-xs">
                <button
                  onClick={() => setExpandedGuide(isOpen ? null : guide.id)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-[#FAF9FC] transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#25212B]">{guide.title}</h4>
                    <p className="text-xs text-[#77717F] mt-0.5">{guide.summary}</p>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#7651A8]" /> : <ChevronDown className="w-5 h-5 text-[#77717F]" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#E9E5EE] space-y-2 bg-[#FAF9FC]">
                    {guide.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#25212B]">
                        <CheckCircle2 className="w-4 h-4 text-[#247A55] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal Rights Section */}
      <div id="rights" className="bg-[#FAF9FC] rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#4A245E]" />
          <h3 className="text-base font-bold text-[#25212B]">Legal Rights & Protections</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#77717F]">
          <div className="bg-white p-4 rounded-2xl border border-[#E9E5EE]">
            <h5 className="font-bold text-[#25212B] mb-1">Right to Zero-FIR Registration</h5>
            <p>
              A woman can file a police complaint (Zero-FIR) at any police station regardless of jurisdiction where the
              crime occurred.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E9E5EE]">
            <h5 className="font-bold text-[#25212B] mb-1">Confidential Medical Exam</h5>
            <p>
              Victims of gender violence are entitled to free, confidential forensic healthcare and trauma counseling
              without delay.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E9E5EE]">
            <h5 className="font-bold text-[#25212B] mb-1">Workplace & Campus Safety (Title IX / POSH)</h5>
            <p>
              Institutions must provide an Internal Complaints Committee and protective escort accommodations upon
              request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
