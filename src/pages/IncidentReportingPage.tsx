import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  ShieldAlert,
  MapPin,
  Clock,
  EyeOff,
  CheckCircle2,
  Filter,
  Camera,
  X,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { useAuth } from '../context/AuthContext';
import { IncidentReport, IncidentSeverity } from '../types';

export const IncidentReportingPage: React.FC = () => {
  const { user } = useAuth();
  const { incidents, submitIncidentReport } = useSafety();

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  // Form states
  const [incidentType, setIncidentType] = useState('Street Harassment / Intimidation');
  const [severity, setSeverity] = useState<IncidentSeverity>('Medium');
  const [locationName, setLocationName] = useState('');
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16));
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const openModal = () => {
    setLocationName('College Avenue, Crosswalk by South Library Gate');
    setDescription('');
    setSeverity('Medium');
    setIsAnonymous(false);
    setImagePreview(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleSimulatedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!locationName.trim() || !description.trim()) {
      setFormError('Please fill in both the location and description fields.');
      return;
    }

    await submitIncidentReport({
      reporterName: isAnonymous ? 'Anonymous Member' : user?.fullName || 'Community Member',
      isAnonymous,
      incidentType,
      severity,
      locationName,
      occurredAt: new Date(occurredAt).toISOString(),
      description,
      imageUrl: imagePreview || undefined,
    });

    setModalOpen(false);
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchTab = activeTab === 'all' || inc.userId === user?.id;
    const matchSeverity = filterSeverity === 'All' || inc.severity === filterSeverity;
    return matchTab && matchSeverity;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25212B] tracking-tight">
              Community Incident Portal
            </h1>
            <span className="text-xs font-bold text-[#7651A8] bg-[#F1EAF8] px-2.5 py-0.5 rounded-lg">
              Crowdsourced Awareness
            </span>
          </div>
          <p className="text-sm text-[#77717F] mt-1">
            Report safety hazards, harassment hotspots, or unlit walkways to warn others and trigger campus/municipal
            interventions.
          </p>
        </div>

        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-2xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Report Safety Hazard</span>
        </button>
      </div>

      {/* Emergency Notice */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-[#D92D45]">
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          <strong>Immediate Threat Warning:</strong> This reporting module is for situational awareness and records.
          If you are currently facing physical danger, please trigger the <strong>Emergency SOS</strong> button or dial
          Police Madadgar (15) or Rescue (1122) immediately.
        </p>
      </div>

      {/* Filter and Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* All vs Mine */}
        <div className="flex items-center gap-1 bg-white p-1 border border-[#E9E5EE] rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'all' ? 'bg-[#4A245E] text-white' : 'text-[#77717F] hover:text-[#25212B]'
            }`}
          >
            All Incident Notices ({incidents.length})
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === 'mine' ? 'bg-[#4A245E] text-white' : 'text-[#77717F] hover:text-[#25212B]'
            }`}
          >
            My Reports ({incidents.filter((i) => i.userId === user?.id).length})
          </button>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#77717F]">Severity:</span>
          {['All', 'Low', 'Medium', 'High', 'Critical'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filterSeverity === sev ? 'bg-[#7651A8] text-white' : 'bg-white border border-[#E9E5EE] text-[#77717F]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIncidents.map((inc) => (
          <div
            key={inc.id}
            className="bg-white rounded-3xl p-6 border border-[#E9E5EE] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#7651A8] transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    inc.severity === 'Critical'
                      ? 'bg-red-100 text-[#D92D45]'
                      : inc.severity === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : inc.severity === 'Medium'
                      ? 'bg-purple-100 text-[#7651A8]'
                      : 'bg-gray-100 text-[#77717F]'
                  }`}
                >
                  {inc.severity} Severity
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                    inc.status === 'Verified'
                      ? 'bg-emerald-50 text-[#247A55]'
                      : inc.status === 'Resolved'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {inc.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#25212B] leading-snug">{inc.incidentType}</h3>
                <p className="text-xs text-[#7651A8] font-semibold flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{inc.locationName}</span>
                </p>
              </div>

              <p className="text-xs text-[#77717F] leading-relaxed line-clamp-3">{inc.description}</p>

              {inc.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-[#E9E5EE] h-32 w-full">
                  <img src={inc.imageUrl} alt="Incident attachment" className="w-full h-full object-cover" />
                </div>
              )}

              {inc.adminNotes && (
                <div className="p-2.5 rounded-xl bg-[#FAF9FC] border border-[#E9E5EE] text-[11px] text-[#4A245E]">
                  <strong>Official Action:</strong> {inc.adminNotes}
                </div>
              )}
            </div>

            {/* Reporter Meta Footer */}
            <div className="pt-3 border-t border-[#E9E5EE] flex items-center justify-between text-[11px] text-[#77717F]">
              <span className="flex items-center gap-1">
                {inc.isAnonymous ? <EyeOff className="w-3 h-3 text-[#7651A8]" /> : <User className="w-3 h-3" />}
                {inc.reporterName || 'Anonymous'}
              </span>
              <span>{new Date(inc.occurredAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E9E5EE] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#25212B]">Report a Safety Hazard</h3>
                <p className="text-xs text-[#77717F]">Information is shared to keep women in the area informed.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#77717F] hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-[#D92D45] rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Incident Category
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                >
                  <option value="Street Harassment / Intimidation">Street Harassment / Intimidation</option>
                  <option value="Stalking / Suspicious Following">Stalking / Suspicious Following</option>
                  <option value="Broken Street Lights / Pitch Black Alley">Broken Street Lights / Pitch Black Alley</option>
                  <option value="Unsafe Transit Stop / Solitary Station">Unsafe Transit Stop / Solitary Station</option>
                  <option value="Physical Assault / Threat">Physical Assault / Threat</option>
                  <option value="Unlicensed Taxi / Vehicle Solicitation">Unlicensed Taxi / Vehicle Solicitation</option>
                  <option value="Other Safety Hazard">Other Safety Hazard</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                    Severity Level
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                  >
                    <option value="Low">Low (Maintenance issue)</option>
                    <option value="Medium">Medium (Uncomfortable)</option>
                    <option value="High">High (Direct threat/harassment)</option>
                    <option value="Critical">Critical (Immediate danger)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                    Approximate Time
                  </label>
                  <input
                    type="datetime-local"
                    value={occurredAt}
                    onChange={(e) => setOccurredAt(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Location / Landmarks
                </label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. 5th Ave Subway Exit 2 near coffee kiosk"
                  className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what occurred, descriptions of individuals or vehicles involved, and advice for other pedestrians..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                />
              </div>

              {/* Photo Evidence */}
              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Attach Photo / Evidence (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSimulatedImage}
                  className="w-full text-xs text-[#77717F] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#F1EAF8] file:text-[#4A245E] hover:file:bg-[#e6daf3]"
                />
                {imagePreview && (
                  <div className="mt-2 h-24 w-32 rounded-xl overflow-hidden border border-[#E9E5EE]">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Anonymous Checkbox */}
              <div className="pt-2 border-t border-[#E9E5EE]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4A245E] focus:ring-[#7651A8]"
                  />
                  <span className="text-xs font-bold text-[#25212B]">
                    Submit anonymously (Hides your name and email from public view)
                  </span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#77717F] hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
