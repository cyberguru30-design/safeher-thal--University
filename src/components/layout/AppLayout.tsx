import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  Compass,
  MapPin,
  AlertTriangle,
  BookOpen,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Volume2,
  VolumeX,
  Search,
  ShieldQuestion,
  UserCheck,
  Shield,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSafety } from '../../context/SafetyContext';
import { PWAStatusBanner } from '../common/PWAStatusBanner';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, signOut, isAdmin, switchDemoRole } = useAuth();
  const {
    activeSOSEvent,
    cancelSOS,
    isSirenActive,
    toggleSiren,
    unreadNotificationsCount,
    isDemoMode,
  } = useSafety();

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Emergency SOS', path: '/sos', icon: ShieldAlert, highlight: true },
    { label: 'Trusted Contacts', path: '/contacts', icon: Users },
    { label: 'Safe Journey', path: '/journey', icon: Compass },
    { label: 'Safety Map', path: '/map', icon: MapPin },
    { label: 'Incident Reports', path: '/incidents', icon: AlertTriangle },
    { label: 'Safety Resources', path: '/resources', icon: BookOpen },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { label: 'My Profile', path: '/profile', icon: User },
    { label: 'Settings & Privacy', path: '/settings', icon: Settings },
  ];

  if (isAdmin) {
    navItems.splice(7, 0, {
      label: 'Admin Command',
      path: '/admin',
      icon: ShieldCheck,
      highlight: false,
    });
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('sos') || q.includes('help') || q.includes('danger')) navigate('/sos');
    else if (q.includes('contact') || q.includes('friend') || q.includes('mom')) navigate('/contacts');
    else if (q.includes('journey') || q.includes('trip') || q.includes('travel')) navigate('/journey');
    else if (q.includes('map') || q.includes('police') || q.includes('hospital')) navigate('/map');
    else if (q.includes('report') || q.includes('incident')) navigate('/incidents');
    else if (q.includes('resource') || q.includes('guide') || q.includes('number')) navigate('/resources');
    else navigate('/dashboard');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#FAF9FC] flex flex-col">
      {/* Real-time PWA Status Indicator */}
      <PWAStatusBanner />

      {/* High-Priority Active SOS Banner if an emergency is in progress */}
      {activeSOSEvent && (
        <div className="bg-[#D92D45] text-white px-4 py-3 shadow-md sticky top-0 z-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
            </span>
            <div className="text-sm font-bold flex items-center gap-2">
              <span>EMERGENCY SOS IS ACTIVE</span>
              <span className="font-normal opacity-90 hidden sm:inline">
                — Coordinates shared with {activeSOSEvent.deliveries.length} trusted contacts.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/sos"
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              View Status
            </Link>
            <button
              onClick={() => cancelSOS(activeSOSEvent.id, 'User marked safe from top banner')}
              className="px-3 py-1 bg-white text-[#D92D45] hover:bg-red-50 rounded-lg text-xs font-bold shadow-sm transition-colors"
            >
              I Am Safe (Cancel)
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col border-r border-[#E9E5EE] bg-white transition-all duration-300 z-30 select-none ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Brand Header */}
          <div className="h-20 flex items-center px-4 border-b border-[#E9E5EE] justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A245E] to-[#7651A8] flex items-center justify-center text-white shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              {!collapsed && (
                <div className="truncate">
                  <span className="font-extrabold text-lg tracking-tight text-[#4A245E]">SafeHer</span>
                  <p className="text-[10px] text-[#77717F] font-semibold uppercase tracking-wider">Safety Platform</p>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 text-[#77717F] hover:text-[#4A245E] hover:bg-[#F1EAF8] rounded-lg transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    active
                      ? 'bg-[#4A245E] text-white shadow-sm'
                      : item.highlight
                      ? 'text-[#D92D45] hover:bg-[#D92D45]/10'
                      : 'text-[#25212B] hover:bg-[#F1EAF8] hover:text-[#4A245E]'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                      active
                        ? 'text-white'
                        : item.highlight
                        ? 'text-[#D92D45]'
                        : 'text-[#77717F] group-hover:text-[#4A245E]'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge !== undefined && (
                    <span className="ml-auto bg-[#D92D45] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick SOS Box inside sidebar if expanded */}
          {!collapsed && (
            <div className="p-3 mx-3 mb-3 bg-[#FAF9FC] border border-[#E9E5EE] rounded-2xl text-center">
              <p className="text-[11px] font-semibold text-[#77717F] uppercase tracking-wider mb-2">Emergency Hub</p>
              <Link
                to="/sos"
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#D92D45] hover:bg-[#C2243B] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Open SOS Portal</span>
              </Link>
            </div>
          )}

          {/* User profile footer in sidebar */}
          <div className="p-3 border-t border-[#E9E5EE] bg-[#FAF9FC]">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user?.fullName || 'User'}
                className="w-9 h-9 rounded-full object-cover border border-[#E9E5EE] shrink-0"
              />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#25212B] truncate">{user?.fullName}</p>
                  <p className="text-[10px] text-[#77717F] truncate">{user?.email}</p>
                </div>
              )}
              {!collapsed && (
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[#77717F] hover:text-[#D92D45] rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative w-72 bg-white h-full flex flex-col z-10 shadow-xl">
              <div className="h-16 px-4 border-b border-[#E9E5EE] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[#4A245E]" />
                  <span className="font-bold text-lg text-[#4A245E]">SafeHer Menu</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      location.pathname === item.path
                        ? 'bg-[#4A245E] text-white'
                        : 'text-[#25212B] hover:bg-[#F1EAF8]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t border-[#E9E5EE]">
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-[#D92D45] bg-red-50 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 bg-white border-b border-[#E9E5EE] h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Mobile Menu Toggle & Search */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 text-[#4A245E] hover:bg-[#F1EAF8] rounded-lg"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77717F]" />
                <input
                  type="text"
                  placeholder="Quick jump: SOS, journey, map, contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] placeholder:text-[#77717F] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-colors"
                />
              </form>
            </div>

            {/* Right: Emergency Tools, Audio Siren, Notifications, Role Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* In-App PWA Install Button */}
              <div className="hidden sm:block">
                <PWAInstallButton />
              </div>

              {/* Loud Alarm Siren Synthesizer Button */}
              <button
                onClick={toggleSiren}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  isSirenActive
                    ? 'bg-[#D92D45] text-white border-[#D92D45] animate-bounce'
                    : 'bg-white text-[#77717F] border-[#E9E5EE] hover:text-[#D92D45] hover:border-red-200'
                }`}
                title={isSirenActive ? 'Stop High-Decibel Siren' : 'Trigger Deterrent Siren Sound'}
              >
                {isSirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden md:inline">{isSirenActive ? 'Stop Siren' : 'Audio Alarm'}</span>
              </button>

              {/* Quick SOS Trigger Button */}
              <Link
                to="/sos"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D92D45] hover:bg-[#C2243B] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>SOS</span>
              </Link>

              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="relative p-2 text-[#77717F] hover:text-[#4A245E] hover:bg-[#F1EAF8] rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D92D45]" />
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F1EAF8] transition-colors"
                >
                  <img
                    src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user?.fullName || 'User'}
                    className="w-8 h-8 rounded-full object-cover border border-[#E9E5EE]"
                  />
                  <span className="text-xs font-bold text-[#25212B] hidden lg:block">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E9E5EE] py-2 z-40">
                      <div className="px-4 py-2 border-b border-[#E9E5EE]">
                        <p className="text-xs font-bold text-[#25212B]">{user?.fullName}</p>
                        <p className="text-[11px] text-[#77717F] truncate">{user?.email}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-[#7651A8]">
                          <Shield className="w-3 h-3" />
                          <span>Role: {user?.role.toUpperCase()}</span>
                        </div>
                      </div>

                      {/* Demo Quick Role Switcher for BS IT Evaluators */}
                      <div className="px-3 py-2 bg-[#FAF9FC] border-b border-[#E9E5EE]">
                        <p className="text-[10px] font-bold text-[#77717F] uppercase tracking-wider mb-1.5">
                          Evaluator Demo Switch
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => {
                              switchDemoRole('user');
                              setUserMenuOpen(false);
                            }}
                            className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${
                              user?.role === 'user' ? 'bg-[#4A245E] text-white' : 'bg-white border text-gray-700'
                            }`}
                          >
                            Member View
                          </button>
                          <button
                            onClick={() => {
                              switchDemoRole('admin');
                              setUserMenuOpen(false);
                            }}
                            className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${
                              user?.role === 'admin' ? 'bg-[#4A245E] text-white' : 'bg-white border text-gray-700'
                            }`}
                          >
                            Admin View
                          </button>
                        </div>
                      </div>

                      <div className="py-1 text-xs text-[#25212B]">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-[#F1EAF8] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#77717F]" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-[#F1EAF8] transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#77717F]" />
                          <span>Settings & SQL Schema</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-[#F1EAF8] text-[#7651A8] font-semibold transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Command Panel</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[#E9E5EE] pt-1">
                        <button
                          onClick={async () => {
                            setUserMenuOpen(false);
                            await handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#D92D45] hover:bg-red-50 transition-colors font-medium text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>




          {/* Main Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
