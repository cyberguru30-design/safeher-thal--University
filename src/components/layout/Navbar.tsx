import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Menu, X, ArrowRight, PhoneCall } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from '../common/PWAInstallButton';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9FC]/90 backdrop-blur-md border-b border-[#E9E5EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#4A245E] to-[#7651A8] flex items-center justify-center text-white shadow-sm shadow-[#4A245E]/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#4A245E]">SafeHer</span>
              <span className="text-[10px] font-bold text-[#7651A8] bg-[#F1EAF8] px-1.5 py-0.5 rounded tracking-wide uppercase">
                SOS Safe
              </span>
            </div>
            <p className="text-[11px] text-[#77717F] font-medium hidden sm:block">Women Safety & Journey Defense</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#25212B]">
          <Link to="/" className="text-[#4A245E] hover:text-[#7651A8] transition-colors">
            Home
          </Link>
          <a href="#features" className="text-[#77717F] hover:text-[#4A245E] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-[#77717F] hover:text-[#4A245E] transition-colors">
            How It Works
          </a>
          <Link to="/resources" className="text-[#77717F] hover:text-[#4A245E] transition-colors">
            Safety Resources
          </Link>
          <a href="#about" className="text-[#77717F] hover:text-[#4A245E] transition-colors">
            About
          </a>
          <a href="#privacy" className="text-[#77717F] hover:text-[#4A245E] transition-colors">
            Trust & Privacy
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <PWAInstallButton />

          <Link
            to="/resources"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#D92D45] bg-[#D92D45]/10 hover:bg-[#D92D45]/15 px-3 py-2 rounded-xl transition-colors"
            title="Immediate 24/7 National Emergency Numbers"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Helplines</span>
          </Link>

          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-[#4A245E] hover:text-[#7651A8] px-3.5 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-semibold bg-[#4A245E] text-white px-3 py-1.5 rounded-lg"
            >
              Dashboard
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#4A245E] hover:bg-[#F1EAF8] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E9E5EE] bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#4A245E]"
          >
            Home
          </Link>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#77717F]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#77717F]"
          >
            How It Works
          </a>
          <Link
            to="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#77717F]"
          >
            Safety Resources & Hotlines
          </Link>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#77717F]"
          >
            About SafeHer
          </a>
          <a
            href="#privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#77717F]"
          >
            Trust & Privacy
          </a>

          <div className="pt-3 border-t border-[#E9E5EE] space-y-2">
            <Link
              to="/sos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#D92D45] text-white font-bold rounded-xl text-sm"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Instant Emergency SOS</span>
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 bg-[#4A245E] text-white font-semibold rounded-xl text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 border border-[#E9E5EE] text-[#4A245E] font-semibold rounded-xl text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 bg-[#4A245E] text-white font-semibold rounded-xl text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
