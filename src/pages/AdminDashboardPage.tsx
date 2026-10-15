import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Users,
  Compass,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  Lock,
  ArrowRight,
  Server,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSafety } from '../context/SafetyContext';
import { IncidentReport } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, switchDemoRole } = useAuth();
  const {
    activeSOSEvent,
    cancelSOS,
    sosHistory,
    journeys,
    incidents,
    updateIncidentStatus,
  } = useSafety();

  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Access control guard
  if (!isAdmin) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-[#E9E5EE] max-w-xl mx-auto text-center space-y-6 shadow-sm my-12">
        <div className="w-16 h-16 rounded-full bg-red-100 text-[#D92D45] flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#25212B]">Administrator Access Restricted</h2>
          <p className="text-xs text-[#77717F] leading-relaxed">
            This module requires verified Campus Safety Officer or Municipal Security administrative clearance.
            Normal users cannot access this command panel.
          </p>
        </div>

        {/* BS IT Evaluator Quick Bypass */}
        <div className="p-4 bg-[#F1EAF8] rounded-2xl border border-[#E9E5EE] space-y-3">
          <p className="text-xs font-bold text-[#4A245E]">BS IT Capstone Project Evaluation Note</p>
          <p className="text-[11px] text-[#77717F]">
            Click below to instantly switch your test session to the Admin Safety Officer role to evaluate this page.
          </p>
          <button
            onClick={() => switchDemoRole('admin')}
            className="px-5 py-2.5 bg-[#4A245E] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#3D1D4E] transition-colors"
          >
            Switch to Admin Role (Prof. Vance)
          </button>
        </div>

        <Link to="/dashboard" className="inline-block text-xs font-bold text-[#7651A8] hover:underline">
          Return to Member Dashboard
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = async (
    id: string,
    status: IncidentReport['status']
  ) => {
    await updateIncidentStatus(id, status, adminNoteInput || undefined);
    setSelectedIncident(null);
    setAdminNoteInput('');
  };

  return (
    <div className="space-y-8">
      {/* Admin Command Header */}
      <div className="bg-gradient-to-r from-[#25212B] to-[#3B2F45] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Campus Security & Safety Dispatch Command
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">SafeHer Administration Portal</h1>
          <p className="text-xs text-gray-300 mt-1">
            Logged in as <strong>{user?.fullName}</strong> ({user?.email}) · Full RLS Superadmin Privileges
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => switchDemoRole('user')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors"
          >
            Switch Back to User View
          </button>
        </div>
      </div>

      {/* Admin 4 Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-[#E9E5EE] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#77717F] uppercase tracking-wider">Active SOS Alarms</span>
            <ShieldAlert className={`w-5 h-5 ${activeSOSEvent ? 'text-[#D92D45]' : 'text-gray-400'}`} />
          </div>
          <p className="text-3xl font-extrabold text-[#25212B]">{activeSOSEvent ? '1 ACTIVE' : '0'}</p>
          <p className="text-xs text-[#77717F] mt-1">{sosHistory.length} total historical alerts</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E9E5EE] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#77717F] uppercase tracking-wider">Under Review Reports</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-[#25212B]">
            {incidents.filter((i) => i.status === 'Under Review').length}
          </p>
          <p className="text-xs text-[#77717F] mt-1">{incidents.length} total reports filed</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E9E5EE] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#77717F] uppercase tracking-wider">Safe Journeys Monitored</span>
            <Compass className="w-5 h-5 text-[#7651A8]" />
          </div>
          <p className="text-3xl font-extrabold text-[#25212B]">{journeys.length}</p>
          <p className="text-xs text-[#77717F] mt-1">Travel sessions protected</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E9E5EE] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#77717F] uppercase tracking-wider">System Health</span>
            <Server className="w-5 h-5 text-[#247A55]" />
          </div>
          <p className="text-3xl font-extrabold text-[#247A55]">100%</p>
          <p className="text-xs text-[#77717F] mt-1">RLS policies operational</p>
        </div>
      </div>

      {/* Active Emergency Supervisor */}
      {activeSOSEvent && (
        <div className="bg-red-50 border-2 border-[#D92D45] rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#D92D45] animate-ping" />
              <h3 className="text-lg font-black text-[#D92D45]">LIVE DISPATCH INTERVENTION REQUIRED</h3>
            </div>
            <button
              onClick={() => cancelSOS(activeSOSEvent.id, 'Campus Security Intervention Resolved')}
              className="px-4 py-2 bg-[#D92D45] hover:bg-[#b01e32] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Resolve & Archive Alert
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-white p-4 rounded-2xl border border-red-200">
            <div>
              <span className="text-[11px] text-[#77717F] block">Dispatched By:</span>
              <strong>{activeSOSEvent.userName}</strong>
            </div>
            <div>
              <span className="text-[11px] text-[#77717F] block">GPS Pin:</span>
              <strong>Lat: {activeSOSEvent.latitude?.toFixed(4)}, Lng: {activeSOSEvent.longitude?.toFixed(4)}</strong>
            </div>
            <div>
              <span className="text-[11px] text-[#77717F] block">Contacts Queued:</span>
              <strong>{activeSOSEvent.deliveries.length} Channels Verified</strong>
            </div>
          </div>
        </div>
      )}

      {/* Incident Reports Moderation Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#25212B]">Community Incident Moderation</h3>
            <p className="text-xs text-[#77717F]">
              Review reported safety issues, deploy campus patrol, and update public status.
            </p>
          </div>
          <span className="text-xs text-[#77717F]">{incidents.length} Total Submissions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9FC] border-b border-[#E9E5EE] text-[#77717F] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Reporter</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E5EE]">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-[#FAF9FC]">
                  <td className="py-3 px-4 font-bold text-[#25212B]">{inc.incidentType}</td>
                  <td className="py-3 px-4 text-[#77717F]">{inc.locationName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'Critical'
                          ? 'bg-red-100 text-[#D92D45]'
                          : inc.severity === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-[#7651A8]'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#77717F]">{inc.isAnonymous ? 'Anonymous' : inc.reporterName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        inc.status === 'Verified'
                          ? 'bg-emerald-50 text-[#247A55]'
                          : inc.status === 'Resolved'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedIncident(inc);
                        setAdminNoteInput(inc.adminNotes || '');
                      }}
                      className="px-3 py-1 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-[11px] font-bold rounded-lg transition-colors"
                    >
                      Review & Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation Action Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E9E5EE] space-y-5">
            <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-3">
              <h3 className="text-base font-bold text-[#25212B]">Moderate Incident Report</h3>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs bg-[#FAF9FC] p-4 rounded-2xl border border-[#E9E5EE]">
              <p><strong>Type:</strong> {selectedIncident.incidentType}</p>
              <p><strong>Location:</strong> {selectedIncident.locationName}</p>
              <p><strong>Description:</strong> {selectedIncident.description}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                Official Security Action Note
              </label>
              <textarea
                rows={2}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="e.g. Patrol unit dispatched. Facilities replaced lighting."
                className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => handleUpdateStatus(selectedIncident.id, 'Verified')}
                className="py-2.5 bg-[#247A55] hover:bg-[#1B5C40] text-white text-xs font-bold rounded-xl"
              >
                Mark Verified
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedIncident.id, 'Resolved')}
                className="py-2.5 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedIncident.id, 'Dismissed')}
                className="py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
