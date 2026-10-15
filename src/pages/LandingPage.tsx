import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Compass,
  MapPin,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  PhoneCall,
  Navigation,
  Activity,
  HeartHandshake,
  Smartphone,
  EyeOff,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9FC] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background radial glow in Soft Lavender */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#F1EAF8] rounded-full blur-3xl opacity-60 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F1EAF8] border border-[#E9E5EE]">
                <ShieldCheck className="w-4 h-4 text-[#7651A8]" />
                <span className="text-xs font-semibold text-[#4A245E] tracking-wide">
                  Designed for Everyday Commutes & Late-Night Safety
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#25212B] leading-[1.12]">
                Your Safety Should <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A245E] via-[#7651A8] to-[#4A245E]">
                  Never Be a Question.
                </span>
              </h1>

              <p className="text-lg text-[#77717F] max-w-xl leading-relaxed">
                Stay connected, plan safer journeys, and reach trusted contacts when you need support. SafeHer brings
                essential personal safety tools together in one secure, privacy-first platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#4A245E] hover:bg-[#3D1D4E] text-white font-bold text-base px-7 py-3.5 rounded-2xl shadow-lg shadow-[#4A245E]/20 hover:shadow-xl transition-all group"
                >
                  <span>Get Started — It&apos;s Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F1EAF8] text-[#4A245E] font-semibold text-base px-6 py-3.5 rounded-2xl border border-[#E9E5EE] shadow-sm transition-colors"
                >
                  <span>Explore Safety Features</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E9E5EE] flex flex-wrap items-center gap-6 text-xs text-[#77717F]">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#247A55]" />
                  <span className="font-medium">Encrypted Coordinates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7651A8]" />
                  <span className="font-medium">Consent-Based Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#4A245E]" />
                  <span className="font-medium">Direct Browser Geolocation</span>
                </div>
              </div>
            </div>

            {/* Right Product Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E9E5EE] space-y-5">
                {/* Mockup Header */}
                <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4A245E] to-[#7651A8] flex items-center justify-center text-white">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#25212B]">SafeHer Active Shield</p>
                      <p className="text-[10px] text-[#247A55] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#247A55] animate-pulse" />
                        Guardian Mode Armed
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#7651A8] bg-[#F1EAF8] px-2.5 py-1 rounded-lg">
                    GPS Ready
                  </span>
                </div>

                {/* Simulated SOS interactive preview */}
                <div className="bg-[#FAF9FC] border border-[#E9E5EE] rounded-2xl p-4 text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-[#D92D45] flex flex-col items-center justify-center text-white shadow-lg shadow-[#D92D45]/30 mb-3 border-4 border-white">
                    <ShieldAlert className="w-7 h-7 mb-0.5" />
                    <span className="text-xs font-black tracking-wider uppercase">SOS</span>
                  </div>
                  <p className="text-xs font-bold text-[#25212B]">Instant Emergency Dispatch</p>
                  <p className="text-[11px] text-[#77717F] mt-0.5">
                    1-Tap dispatches location link & alert to 3 trusted contacts
                  </p>
                </div>

                {/* Journey Card preview */}
                <div className="p-3.5 bg-white border border-[#E9E5EE] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#25212B] flex items-center gap-1.5 truncate max-w-[210px]">
                      <Navigation className="w-3.5 h-3.5 text-[#7651A8] shrink-0" />
                      <span className="truncate">En Route → Bhakkar City, District Bhakkar</span>
                    </span>
                    <span className="text-[10px] font-semibold text-[#7651A8] bg-[#F1EAF8] px-2 py-0.5 rounded">
                      Active Journey
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#77717F]">
                    <span>Next Check-in: 12 min</span>
                    <span>ETA: 11:05 PM</span>
                  </div>
                  <div className="w-full bg-[#FAF9FC] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#7651A8] h-full w-2/3 rounded-full" />
                  </div>
                </div>

                {/* Trusted Circle preview */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"
                      alt="Mom"
                    />
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100"
                      alt="Aisha"
                    />
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                      alt="David"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#25212B]">3 Contacts Connected</p>
                    <p className="text-[10px] text-[#77717F]">SMS & WhatsApp channels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 bg-white border-y border-[#E9E5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-[#7651A8] uppercase tracking-wider">
              Comprehensive Personal Defense
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#25212B] tracking-tight">
              Essential Tools Designed to Protect Every Step
            </h2>
            <p className="text-sm text-[#77717F]">
              From daily college commutes to unexpected travel dilemmas, SafeHer equips you with instant emergency
              action and trusted network support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-[#FAF9FC] border border-[#E9E5EE] hover:border-[#7651A8] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D92D45]/10 text-[#D92D45] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-[#25212B] mb-2">Emergency SOS Portal</h3>
              <p className="text-xs text-[#77717F] leading-relaxed">
                High-priority emergency activation with location pin capture, anti-accidental countdown, audio deterrent
                siren, and direct notification dispatch.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-[#FAF9FC] border border-[#E9E5EE] hover:border-[#7651A8] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#7651A8]/10 text-[#7651A8] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-[#25212B] mb-2">Trusted Contacts Circle</h3>
              <p className="text-xs text-[#77717F] leading-relaxed">
                Manage your inner circle of family and friends. Assign primary responders and customize preferred
                delivery via SMS, WhatsApp, Phone call, or Email.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-[#FAF9FC] border border-[#E9E5EE] hover:border-[#7651A8] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#4A245E]/10 text-[#4A245E] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-[#25212B] mb-2">Safe Journey Tracking</h3>
              <p className="text-xs text-[#77717F] leading-relaxed">
                Plan late-night trips or daily transit. Set expected arrival times, destination details, and stop
                sharing with a single tap once safely arrived.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-[#FAF9FC] border border-[#E9E5EE] hover:border-[#7651A8] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#247A55]/10 text-[#247A55] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-[#25212B] mb-2">Interactive Safety Map</h3>
              <p className="text-xs text-[#77717F] leading-relaxed">
                Leaflet & OpenStreetMap locator showing verified 24/7 police stations, trauma hospitals, safe transport
                hubs, and women emergency shelters.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-[#FAF9FC] border border-[#E9E5EE] hover:border-[#7651A8] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#7651A8]/10 text-[#7651A8] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-[#25212B] mb-2">Periodic Safety Check-ins</h3>
              <p className="text-xs text-[#77717F] leading-relaxed">
                Automated check-in prompts ensure your network knows you are safe throughout lengthy journeys without
                constant invasive tracking.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-[#FAF9FC] border border-[#E9E5EE] hover:border-[#7651A8] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D92D45]/10 text-[#D92D45] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-lg font-bold text-[#25212B] mb-2">Incident Reporting</h3>
              <p className="text-xs text-[#77717F] leading-relaxed">
                Report street harassment, poor lighting, or suspicious activity anonymously or with verified credentials
                to safeguard the broader community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pakistan Emergency Helplines Section */}
      <section id="emergency-helplines" className="py-16 bg-[#FAF9FC] border-b border-[#E9E5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#D92D45] uppercase tracking-wider bg-red-100 px-3 py-1 rounded-full">
              District Bhakkar & Punjab 24/7 Helplines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#25212B] tracking-tight">
              In Immediate Life-Threatening Danger? Call Pakistan Emergency Helplines
            </h2>
            <p className="text-xs sm:text-sm text-[#77717F]">
              Direct one-tap connection to verified government emergency responders, rescue ambulances, and women safety authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Helpline 1 */}
            <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D92D45] animate-ping" />
                  <span className="text-[10px] font-bold text-[#D92D45] uppercase">Emergency Priority</span>
                </div>
                <h4 className="text-sm font-bold text-[#25212B] mt-0.5">Police Madadgar</h4>
                <p className="text-[11px] text-[#77717F]">District Bhakkar Police Dispatch</p>
                <p className="text-lg font-black text-[#4A245E] mt-1 font-mono">15</p>
              </div>
              <a
                href="tel:15"
                className="px-3 py-2 bg-[#D92D45] hover:bg-[#C2243B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 15</span>
              </a>
            </div>

            {/* Helpline 2 */}
            <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs flex items-center justify-between gap-3 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D92D45]" />
                  <span className="text-[10px] font-bold text-[#D92D45] uppercase">Ambulance & Rescue</span>
                </div>
                <h4 className="text-sm font-bold text-[#25212B] mt-0.5">Rescue Emergency</h4>
                <p className="text-[11px] text-[#77717F]">Punjab Emergency Service</p>
                <p className="text-lg font-black text-[#4A245E] mt-1 font-mono">1122</p>
              </div>
              <a
                href="tel:1122"
                className="px-3 py-2 bg-[#D92D45] hover:bg-[#C2243B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1122</span>
              </a>
            </div>

            {/* Helpline 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E9E5EE] shadow-xs flex items-center justify-between gap-3 hover:border-[#7651A8] transition-colors">
              <div>
                <span className="text-[10px] font-bold text-[#7651A8] uppercase">Toll-Free Helpline</span>
                <h4 className="text-sm font-bold text-[#25212B] mt-0.5">Women Safety Helpline</h4>
                <p className="text-[11px] text-[#77717F]">Madadgar Protection Help</p>
                <p className="text-lg font-black text-[#4A245E] mt-1 font-mono">1098</p>
              </div>
              <a
                href="tel:1098"
                className="px-3 py-2 bg-[#7651A8] hover:bg-[#654394] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1098</span>
              </a>
            </div>

            {/* Helpline 4 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E9E5EE] shadow-xs flex items-center justify-between gap-3 hover:border-[#7651A8] transition-colors">
              <div>
                <span className="text-[10px] font-bold text-[#247A55] uppercase">Punjab Authority</span>
                <h4 className="text-sm font-bold text-[#25212B] mt-0.5">Women Protection Punjab</h4>
                <p className="text-[11px] text-[#77717F]">Violence & Harassment Relief</p>
                <p className="text-lg font-black text-[#4A245E] mt-1 font-mono">1099</p>
              </div>
              <a
                href="tel:1099"
                className="px-3 py-2 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1099</span>
              </a>
            </div>

            {/* Helpline 5 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E9E5EE] shadow-xs flex items-center justify-between gap-3 hover:border-[#247A55] transition-colors">
              <div>
                <span className="text-[10px] font-bold text-[#247A55] uppercase">24/7 Ambulance</span>
                <h4 className="text-sm font-bold text-[#25212B] mt-0.5">Edhi Ambulance Service</h4>
                <p className="text-[11px] text-[#77717F]">Bhakkar & Nationwide Relief</p>
                <p className="text-lg font-black text-[#4A245E] mt-1 font-mono">115</p>
              </div>
              <a
                href="tel:115"
                className="px-3 py-2 bg-[#247A55] hover:bg-[#1E6446] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 115</span>
              </a>
            </div>

            {/* Helpline 6 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E9E5EE] shadow-xs flex items-center justify-between gap-3 hover:border-[#7651A8] transition-colors">
              <div>
                <span className="text-[10px] font-bold text-[#7651A8] uppercase">Child Protection</span>
                <h4 className="text-sm font-bold text-[#25212B] mt-0.5">Child Protection Bureau</h4>
                <p className="text-[11px] text-[#77717F]">Punjab Child Welfare Hotline</p>
                <p className="text-lg font-black text-[#4A245E] mt-1 font-mono">1124</p>
              </div>
              <a
                href="tel:1124"
                className="px-3 py-2 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 1124</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#FAF9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-[#7651A8] uppercase tracking-wider">Simple 3-Step Setup</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#25212B] tracking-tight">How SafeHer Works</h2>
            <p className="text-sm text-[#77717F]">
              Designed to be fast, reliable, and frictionless in high-stress moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 border border-[#E9E5EE] shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-[#4A245E] text-white flex items-center justify-center text-sm font-black mb-5">
                01
              </div>
              <h4 className="text-base font-bold text-[#25212B] mb-2">Set Up Your Trusted Contacts</h4>
              <p className="text-xs text-[#77717F] leading-relaxed">
                Add guardians, friends, or campus peers who should be alerted first. Choose whether they receive SMS,
                WhatsApp, or direct automated calls.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 border border-[#E9E5EE] shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-[#7651A8] text-white flex items-center justify-center text-sm font-black mb-5">
                02
              </div>
              <h4 className="text-base font-bold text-[#25212B] mb-2">Start a Safe Journey</h4>
              <p className="text-xs text-[#77717F] leading-relaxed">
                Heading home late? Enter your destination and estimated arrival time. SafeHer prompts you for check-ins
                along the route.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 border border-[#E9E5EE] shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-[#D92D45] text-white flex items-center justify-center text-sm font-black mb-5">
                03
              </div>
              <h4 className="text-base font-bold text-[#25212B] mb-2">Instant Emergency SOS</h4>
              <p className="text-xs text-[#77717F] leading-relaxed">
                If threatened or in danger, tap or hold the SOS button. Your exact coordinates and a live tracking link
                are instantly queued to your trusted circle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and Trust Section */}
      <section id="privacy" className="py-20 bg-white border-t border-[#E9E5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#4A245E] to-[#361945] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="max-w-2xl relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-Compromise Privacy Architecture</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Your Location Belongs to You. Never Sold, Never Leaked.
              </h2>

              <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
                We believe security tools should never turn into surveillance. SafeHer does not track you passively in
                the background without explicit consent. Your GPS coordinates are fetched only when you initiate a
                journey or trigger an SOS alert.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#247A55] shrink-0 mt-0.5" />
                  <span>Row Level Security (RLS) ensures only you and your chosen recipients view your coordinates.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <EyeOff className="w-4 h-4 text-[#F1EAF8] shrink-0 mt-0.5" />
                  <span>Anonymous reporting option hides personal identity from community incident boards.</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4A245E] font-bold text-sm rounded-xl hover:bg-[#F1EAF8] transition-colors"
                >
                  <span>Create Your Free Safety Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About SafeHer Section */}
      <section id="about" className="py-20 bg-[#FAF9FC] border-t border-[#E9E5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E9E5EE] shadow-sm">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1EAF8] text-[#4A245E] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#7651A8]" />
                <span>Thal University Bhakkar - Class Project</span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#25212B] tracking-tight">About SafeHer</h2>
              <p className="text-base sm:text-lg text-[#25212B] leading-relaxed font-medium">
                Developed by Sanam Baloch, BSIT Student, as a class project assigned by Sir. This project aims to empower women safety in our local community - Bhakkar, Punjab, Pakistan.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#77717F]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7651A8]" />
                  <span>District Bhakkar, Punjab, Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#D92D45]" />
                  <span>Local Community Defense & Emergency SOS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
