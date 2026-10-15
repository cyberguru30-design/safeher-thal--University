import React, { useState } from 'react';
import {
  Compass,
  Navigation,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  Shield,
  StopCircle,
  Calendar,
  X,
  History,
  Info,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { SafeJourney, JourneyStatus } from '../types';

export const SafeJourneyPage: React.FC = () => {
  const {
    journeys,
    activeJourney,
    startJourney,
    completeJourney,
    cancelJourney,
    checkInJourney,
    contacts,
  } = useSafety();

  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [expectedArrivalMinutes, setExpectedArrivalMinutes] = useState('30');
  const [checkInInterval, setCheckInInterval] = useState(15);
  const [selectedContacts, setSelectedContacts] = useState<string[]>(
    contacts.filter((c) => c.canReceiveAlerts).map((c) => c.id)
  );
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const openStartModal = () => {
    setTitle('Return Trip to Residence');
    setDestination('Bhakkar City, District Bhakkar, Punjab, Pakistan');
    setStartLocation('University Library Main Gate');
    setExpectedArrivalMinutes('35');
    setCheckInInterval(15);
    setSelectedContacts(contacts.filter((c) => c.canReceiveAlerts).map((c) => c.id));
    setNotes('Taking the Blue Line Shuttle and walking down Pine Street.');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleStartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !destination.trim()) {
      setErrorMsg('Please specify journey title and destination.');
      return;
    }

    const arrivalTime = new Date(Date.now() + parseInt(expectedArrivalMinutes, 10) * 60 * 1000).toISOString();

    await startJourney({
      title,
      destination,
      startLocation: startLocation || 'Current GPS Location',
      expectedArrivalTime: arrivalTime,
      selectedContactIds: selectedContacts,
      checkInIntervalMinutes: checkInInterval,
      notes,
    });

    setModalOpen(false);
  };

  const toggleContactSelection = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25212B] tracking-tight">
              Safe Journey Companion
            </h1>
            <span className="text-xs font-bold text-[#7651A8] bg-[#F1EAF8] px-2.5 py-0.5 rounded-lg">
              {activeJourney ? '1 In-Progress' : 'Standby'}
            </span>
          </div>
          <p className="text-sm text-[#77717F] mt-1">
            Plan your travel route, share estimated arrival times, and keep your inner circle informed with automated
            check-in prompts.
          </p>
        </div>

        {!activeJourney && (
          <button
            onClick={openStartModal}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-2xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Start Safe Journey</span>
          </button>
        )}
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 bg-[#FAF9FC] border border-[#E9E5EE] rounded-2xl text-xs text-[#77717F] flex items-start gap-3">
        <Info className="w-5 h-5 text-[#7651A8] shrink-0 mt-0.5" />
        <p>
          <strong>Transparent Tracking Guarantee:</strong> SafeHer only records your departure and arrival markers and
          check-ins. We never harvest continuous background location paths without your explicit session trigger.
        </p>
      </div>

      {/* ACTIVE JOURNEY CARD */}
      {activeJourney ? (
        <div className="bg-white rounded-3xl border-2 border-[#7651A8] p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E9E5EE] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#7651A8] text-white flex items-center justify-center">
                <Compass className="w-7 h-7 stroke-[2.2] animate-spin" style={{ animationDuration: '15s' }} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#7651A8] bg-[#F1EAF8] px-2 py-0.5 rounded uppercase tracking-wider">
                  Active En-Route
                </span>
                <h2 className="text-xl font-extrabold text-[#25212B] mt-0.5">{activeJourney.title}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => checkInJourney(activeJourney.id)}
                className="px-4 py-2.5 bg-[#247A55] hover:bg-[#1C6043] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Check-in ({activeJourney.checkInCount} done)</span>
              </button>
              <button
                onClick={() => completeJourney(activeJourney.id)}
                className="px-4 py-2.5 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                Arrived Safely
              </button>
              <button
                onClick={() => cancelJourney(activeJourney.id)}
                className="p-2.5 text-[#D92D45] hover:bg-red-50 rounded-xl transition-colors"
                title="Cancel Journey"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Journey Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#FAF9FC] rounded-2xl border border-[#E9E5EE]">
              <span className="text-[11px] font-bold text-[#77717F] uppercase tracking-wide block mb-1">
                Destination
              </span>
              <p className="text-sm font-extrabold text-[#25212B] flex items-center gap-1.5 truncate">
                <MapPin className="w-4 h-4 text-[#D92D45] shrink-0" />
                <span className="truncate">{activeJourney.destination}</span>
              </p>
            </div>

            <div className="p-4 bg-[#FAF9FC] rounded-2xl border border-[#E9E5EE]">
              <span className="text-[11px] font-bold text-[#77717F] uppercase tracking-wide block mb-1">
                Started From
              </span>
              <p className="text-sm font-bold text-[#25212B] flex items-center gap-1.5 truncate">
                <Navigation className="w-4 h-4 text-[#7651A8] shrink-0" />
                <span className="truncate">{activeJourney.startLocation}</span>
              </p>
            </div>

            <div className="p-4 bg-[#FAF9FC] rounded-2xl border border-[#E9E5EE]">
              <span className="text-[11px] font-bold text-[#77717F] uppercase tracking-wide block mb-1">
                Expected Arrival
              </span>
              <p className="text-sm font-bold text-[#25212B] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#247A55]" />
                <span>{new Date(activeJourney.expectedArrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </p>
            </div>

            <div className="p-4 bg-[#FAF9FC] rounded-2xl border border-[#E9E5EE]">
              <span className="text-[11px] font-bold text-[#77717F] uppercase tracking-wide block mb-1">
                Check-in Frequency
              </span>
              <p className="text-sm font-bold text-[#25212B]">
                Every {activeJourney.checkInIntervalMinutes} mins
              </p>
            </div>
          </div>

          {/* Selected Contacts Receiving Updates */}
          <div className="pt-2">
            <p className="text-xs font-bold text-[#25212B] mb-2 uppercase tracking-wide">
              Contacts Receiving Trip Updates ({activeJourney.selectedContactIds.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {contacts
                .filter((c) => activeJourney.selectedContactIds.includes(c.id))
                .map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F1EAF8] text-xs font-bold text-[#4A245E]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7651A8]" />
                    {c.name} ({c.preferredMethod})
                  </span>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-[#E9E5EE] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF9FC] text-[#77717F] flex items-center justify-center mx-auto border border-[#E9E5EE]">
            <Compass className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-[#25212B]">No Safe Journey is currently in progress</h3>
            <p className="text-xs text-[#77717F]">
              Heading home from campus, a work shift, or taking a ride share? Start a monitored safe journey to let your
              loved ones know you are safe.
            </p>
          </div>
          <button
            onClick={openStartModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A245E] text-white text-xs font-bold rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Start Safe Journey Now</span>
          </button>
        </div>
      )}

      {/* Previous Journeys History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#7651A8]" />
            <h3 className="text-base font-bold text-[#25212B]">Journey Logs & Travel History</h3>
          </div>
          <span className="text-xs text-[#77717F]">{journeys.length} Logged</span>
        </div>

        <div className="divide-y divide-[#E9E5EE]">
          {journeys.map((j) => (
            <div key={j.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#25212B]">{j.title}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      j.status === 'Completed'
                        ? 'bg-emerald-50 text-[#247A55]'
                        : j.status === 'Active'
                        ? 'bg-purple-50 text-[#7651A8]'
                        : 'bg-gray-100 text-[#77717F]'
                    }`}
                  >
                    {j.status}
                  </span>
                </div>
                <p className="text-xs text-[#77717F]">
                  To: <strong>{j.destination}</strong> · From: {j.startLocation} · {j.checkInCount} check-in(s)
                </p>
              </div>

              <div className="text-right text-xs text-[#77717F]">
                <p className="font-medium text-[#25212B]">
                  {new Date(j.startTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p>{new Date(j.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Journey Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E9E5EE] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#25212B]">Plan a Safe Journey</h3>
                <p className="text-xs text-[#77717F]">Your contacts will be notified when you start and arrive safely.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#77717F] hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-[#D92D45] rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleStartSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Trip Name / Reason
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Walking home from metro station"
                  className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                    Starting Location
                  </label>
                  <input
                    type="text"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    placeholder="e.g. City Center Mall Gate 2"
                    className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Bhakkar City, District Bhakkar, Punjab, Pakistan"
                    className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                    Estimated Travel Time
                  </label>
                  <select
                    value={expectedArrivalMinutes}
                    onChange={(e) => setExpectedArrivalMinutes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="90">1.5 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                    Safety Check-in Interval
                  </label>
                  <select
                    value={checkInInterval}
                    onChange={(e) => setCheckInInterval(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                  >
                    <option value={10}>Every 10 Minutes</option>
                    <option value={15}>Every 15 Minutes</option>
                    <option value={20}>Every 20 Minutes</option>
                    <option value={30}>Every 30 Minutes</option>
                  </select>
                </div>
              </div>

              {/* Contacts Selection */}
              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1.5">
                  Select Contacts to Notify
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto border border-[#E9E5EE] rounded-xl p-2 bg-[#FAF9FC]">
                  {contacts.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E9E5EE] cursor-pointer hover:bg-[#F1EAF8]"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(c.id)}
                          onChange={() => toggleContactSelection(c.id)}
                          className="w-4 h-4 rounded text-[#4A245E] focus:ring-[#7651A8]"
                        />
                        <span className="text-xs font-bold text-[#25212B]">{c.name}</span>
                        <span className="text-[11px] text-[#77717F]">({c.relationship})</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#7651A8] bg-[#FAF9FC] px-1.5 py-0.5 rounded">
                        {c.preferredMethod}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Optional Trip Notes (Ride details / Vehicle info)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. In Silver Toyota Prius, License Plate: 7XYZ89"
                  className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
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
                  Start Journey Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
