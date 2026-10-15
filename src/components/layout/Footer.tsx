import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, HeartHandshake, Lock, ExternalLink, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#25212B] text-white pt-16 pb-12 border-t border-[#373140]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Emergency Bar */}
        <div className="p-6 rounded-2xl bg-[#322A3B] border border-[#443B50] mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D92D45]/20 text-[#D92D45] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base">In Immediate Life-Threatening Danger? Call Pakistan Emergency Helplines</h4>
                <span className="text-[11px] font-semibold text-[#D92D45] bg-[#D92D45]/10 px-2 py-0.5 rounded">
                  Priority 1
                </span>
              </div>
              <p className="text-xs text-[#A8A2B2] mt-0.5">
                Always dial local Pakistan emergency services directly (Police: 15, Rescue: 1122, Women Helpline: 1098 / 1099). Serving District Bhakkar, Punjab, Pakistan.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:15"
              className="px-3 py-1.5 bg-[#D92D45] hover:bg-[#C2243B] text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              title="Police Emergency (15)"
            >
              Police: 15
            </a>
            <a
              href="tel:1122"
              className="px-3 py-1.5 bg-[#D92D45] hover:bg-[#C2243B] text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              title="Rescue Emergency (1122)"
            >
              Rescue: 1122
            </a>
            <a
              href="tel:1098"
              className="px-3 py-1.5 bg-[#7651A8] hover:bg-[#654394] text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              title="Women Safety / Madadgar Helpline (1098)"
            >
              Women Safety: 1098
            </a>
            <a
              href="tel:1099"
              className="px-3 py-1.5 bg-[#443B50] hover:bg-[#534863] text-white font-semibold text-xs rounded-xl transition-colors"
              title="Women Protection Authority Punjab (1099)"
            >
              Punjab Women Protection: 1099
            </a>
            <a
              href="tel:115"
              className="px-3 py-1.5 bg-[#443B50] hover:bg-[#534863] text-white font-semibold text-xs rounded-xl transition-colors"
              title="Edhi Ambulance Service (115)"
            >
              Edhi: 115
            </a>
            <a
              href="tel:1124"
              className="px-3 py-1.5 bg-[#443B50] hover:bg-[#534863] text-white font-semibold text-xs rounded-xl transition-colors"
              title="Child Protection Helpline (1124)"
            >
              Child Protection: 1124
            </a>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#373140]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7651A8] flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">SafeHer</span>
            </div>
            <p className="text-[#B9B3C4] text-sm leading-relaxed max-w-sm">
              Developed by Sanam Baloch, BSIT Student, Department of Computer Science, Thal University Bhakkar, as a class project assigned by Sir. This project aims to empower women safety in our local community - Bhakkar, Punjab, Pakistan.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#A8A2B2]">
              <GraduationCap className="w-4 h-4 text-[#7651A8]" />
              <span>BSIT · Department of Computer Science · Thal University Bhakkar</span>
            </div>
          </div>

          {/* Core Tools */}
          <div>
            <h5 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Core Platform</h5>
            <ul className="space-y-2.5 text-sm text-[#A8A2B2]">
              <li>
                <Link to="/sos" className="hover:text-white transition-colors">
                  Emergency SOS
                </Link>
              </li>
              <li>
                <Link to="/journey" className="hover:text-white transition-colors">
                  Safe Journey Tracking
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-white transition-colors">
                  Trusted Circle
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">
                  Interactive Safety Map
                </Link>
              </li>
              <li>
                <Link to="/incidents" className="hover:text-white transition-colors">
                  Incident Reporting
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Resources & Guides</h5>
            <ul className="space-y-2.5 text-sm text-[#A8A2B2]">
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">
                  Emergency Directory
                </Link>
              </li>
              <li>
                <Link to="/resources#guides" className="hover:text-white transition-colors">
                  Self-Defense Strategies
                </Link>
              </li>
              <li>
                <Link to="/resources#rights" className="hover:text-white transition-colors">
                  Legal Rights & Policies
                </Link>
              </li>
              <li>
                <Link to="/resources#card" className="hover:text-white transition-colors">
                  Printable SOS Card
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Database & RLS Specs
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Trust */}
          <div>
            <h5 className="font-bold text-sm text-white uppercase tracking-wider mb-4">Trust & Compliance</h5>
            <ul className="space-y-2.5 text-sm text-[#A8A2B2]">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#247A55]" />
                <span>Zero Unauthorized Sharing</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#7651A8]" />
                <span>Peer-Consented Alerts</span>
              </li>
              <li>
                <span className="text-xs text-[#77717F]">PostgreSQL Row-Level Security</span>
              </li>
              <li>
                <span className="text-xs text-[#77717F]">Browser Geolocation Encrypted</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#878092] gap-4">
          <p>© {new Date().getFullYear()} SafeHer. Designed for university evaluation and real-world safety impact.</p>
          <div className="flex items-center gap-6">
            <span>Client-side Privacy Preserving</span>
            <span aria-hidden="true">·</span>
            <span>WCAG 2.1 AA Compliant</span>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="text-[#A8A2B2] hover:text-white flex items-center gap-1">
              Admin Portal <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
