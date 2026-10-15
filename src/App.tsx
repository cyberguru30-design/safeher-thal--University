import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SafetyProvider } from './context/SafetyContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoadingSplash } from './components/common/LoadingSplash';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { SOSPage } from './pages/SOSPage';
import { ContactsPage } from './pages/ContactsPage';
import { SafeJourneyPage } from './pages/SafeJourneyPage';
import { SafetyMapPage } from './pages/SafetyMapPage';
import { IncidentReportingPage } from './pages/IncidentReportingPage';
import { SafetyResourcesPage } from './pages/SafetyResourcesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Root Route: If safeher_loggedIn is 'true', go to dashboard; if not, show LoginPage
const RootRoute: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9FC]">
        <div className="w-10 h-10 border-4 border-[#7651A8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLoggedIn = localStorage.getItem('safeher_loggedIn') === 'true';

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return <Navigate to="/dashboard" replace />;
};

// Protected Route Component (requires safeher_loggedIn)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9FC]">
        <div className="w-10 h-10 border-4 border-[#7651A8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isLoggedIn = localStorage.getItem('safeher_loggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// Landing Route: only accessible if logged in
const LandingRoute: React.FC = () => {
  const isLoggedIn = localStorage.getItem('safeher_loggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <LandingPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <SafetyProvider>
        {/* Full-screen 1.5s brand splash screen */}
        <LoadingSplash />
        
        <Router>
          <Routes>
            {/* Entry Route */}
            <Route path="/" element={<RootRoute />} />

            {/* Public Authentication Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/landing" element={<LandingRoute />} />

            {/* Authenticated Application Pages */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sos"
              element={
                <ProtectedRoute>
                  <SOSPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <ContactsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/journey"
              element={
                <ProtectedRoute>
                  <SafeJourneyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <SafetyMapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents"
              element={
                <ProtectedRoute>
                  <IncidentReportingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <SafetyResourcesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SafetyProvider>
    </AuthProvider>
  );
}
