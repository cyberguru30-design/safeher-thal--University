import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  Trash2,
  Edit2,
  ShieldCheck,
  Search,
  MessageSquare,
  AlertCircle,
  X,
  Send,
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { TrustedContact, NotificationMethod } from '../types';

export const ContactsPage: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact, setPrimaryContact } = useSafety();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredMethod, setPreferredMethod] = useState<NotificationMethod>('SMS');
  const [isPrimary, setIsPrimary] = useState(false);
  const [canReceiveAlerts, setCanReceiveAlerts] = useState(true);
  const [formError, setFormError] = useState('');

  // Test ping simulation state
  const [testSentId, setTestSentId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setRelationship('');
    setPhone('');
    setEmail('');
    setPreferredMethod('SMS');
    setIsPrimary(contacts.length === 0);
    setCanReceiveAlerts(true);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (c: TrustedContact) => {
    setEditingContact(c);
    setName(c.name);
    setRelationship(c.relationship);
    setPhone(c.phone);
    setEmail(c.email);
    setPreferredMethod(c.preferredMethod);
    setIsPrimary(c.isPrimary);
    setCanReceiveAlerts(c.canReceiveAlerts);
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Contact name is required.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Phone number is required for SMS/call alerts.');
      return;
    }
    if (!relationship.trim()) {
      setFormError('Relationship is required (e.g. Mother, Sister, Roommate).');
      return;
    }

    if (editingContact) {
      await updateContact(editingContact.id, {
        name,
        relationship,
        phone,
        email,
        preferredMethod,
        isPrimary,
        canReceiveAlerts,
      });
    } else {
      await addContact({
        name,
        relationship,
        phone,
        email,
        preferredMethod,
        isPrimary,
        canReceiveAlerts,
      });
    }

    setModalOpen(false);
  };

  const handleSimulateTestPing = (c: TrustedContact) => {
    setTestSentId(c.id);
    setTimeout(() => {
      setTestSentId(null);
    }, 3000);
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.relationship.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#25212B] tracking-tight">
              Trusted Emergency Circle
            </h1>
            <span className="text-xs font-bold text-[#7651A8] bg-[#F1EAF8] px-2.5 py-0.5 rounded-lg">
              {contacts.length} Active
            </span>
          </div>
          <p className="text-sm text-[#77717F] mt-1">
            People who will receive instantaneous location alerts, check-in updates, and emergency SOS pings.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-2xl shadow-md transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Trusted Contact</span>
        </button>
      </div>

      {/* Disclose notification behavior policy card */}
      <div className="p-4 bg-[#FAF9FC] border border-[#E9E5EE] rounded-2xl text-xs text-[#77717F] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#247A55] shrink-0 mt-0.5" />
        <p>
          <strong>Privacy Notice:</strong> SafeHer does not spam or passively track your contacts. Contacts are only
          dispatched messages when you trigger an Emergency SOS or start a Safe Journey with active alerts enabled.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77717F]" />
          <input
            type="text"
            placeholder="Search by name, relation, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
          />
        </div>
      </div>

      {/* Contacts Grid */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#E9E5EE] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F1EAF8] text-[#7651A8] flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="text-lg font-bold text-[#25212B]">You haven&apos;t added any trusted contacts yet</h3>
            <p className="text-xs text-[#77717F]">
              Add at least one family member, friend, or roommate to receive alerts during emergencies.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4A245E] text-white text-xs font-bold rounded-xl"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Your First Contact</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-3xl p-6 border transition-all ${
                contact.isPrimary ? 'border-[#7651A8] shadow-md' : 'border-[#E9E5EE] shadow-sm'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4A245E] to-[#7651A8] text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {contact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#25212B] flex items-center gap-1.5">
                      {contact.name}
                      {contact.isPrimary && (
                        <span className="text-[10px] font-bold text-[#7651A8] bg-[#F1EAF8] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#7651A8]" /> Primary
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#77717F] font-medium">{contact.relationship}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(contact)}
                    className="p-1.5 text-[#77717F] hover:text-[#4A245E] hover:bg-[#F1EAF8] rounded-lg transition-colors"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-1.5 text-[#77717F] hover:text-[#D92D45] hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-2 py-3 border-y border-[#E9E5EE] text-xs">
                <div className="flex items-center gap-2 text-[#25212B]">
                  <Phone className="w-3.5 h-3.5 text-[#77717F]" />
                  <span className="font-medium">{contact.phone}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2 text-[#77717F] truncate">
                    <Mail className="w-3.5 h-3.5 text-[#77717F] shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-[#77717F]">Preferred Dispatch:</span>
                  <span className="font-bold text-[#4A245E] bg-[#FAF9FC] border border-[#E9E5EE] px-2 py-0.5 rounded-lg">
                    {contact.preferredMethod}
                  </span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${contact.canReceiveAlerts ? 'bg-[#247A55]' : 'bg-gray-400'}`}
                  />
                  <span className="text-[11px] font-semibold text-[#77717F]">
                    {contact.canReceiveAlerts ? 'SOS Receiver' : 'Standby only'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!contact.isPrimary && (
                    <button
                      onClick={() => setPrimaryContact(contact.id)}
                      className="text-[11px] font-bold text-[#7651A8] hover:underline"
                    >
                      Make Primary
                    </button>
                  )}
                  <button
                    onClick={() => handleSimulateTestPing(contact)}
                    className="text-[11px] font-semibold px-2 py-1 bg-[#FAF9FC] hover:bg-[#F1EAF8] border border-[#E9E5EE] rounded-lg text-[#4A245E] flex items-center gap-1 transition-colors"
                    title="Send a harmless test ping to test channel"
                  >
                    <Send className="w-3 h-3" />
                    <span>{testSentId === contact.id ? 'Test Sent!' : 'Test'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Contact Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E9E5EE] space-y-6">
            <div className="flex items-center justify-between border-b border-[#E9E5EE] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#25212B]">
                  {editingContact ? 'Edit Trusted Contact' : 'Add New Trusted Contact'}
                </h3>
                <p className="text-xs text-[#77717F]">Configure contact details and alert preferences.</p>
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
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Jenkins"
                  className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    required
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Mother, Roommate, Colleague"
                    className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full px-3 py-2 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1.5">
                  Preferred Alert Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['SMS', 'Call', 'WhatsApp', 'Email'] as NotificationMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPreferredMethod(method)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        preferredMethod === method
                          ? 'bg-[#4A245E] text-white border-[#4A245E]'
                          : 'bg-[#FAF9FC] text-[#77717F] border-[#E9E5EE] hover:bg-white'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-2 border-t border-[#E9E5EE]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4A245E] focus:ring-[#7651A8]"
                  />
                  <span className="text-xs font-bold text-[#25212B]">Make this contact my Primary Responder</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canReceiveAlerts}
                    onChange={(e) => setCanReceiveAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-[#4A245E] focus:ring-[#7651A8]"
                  />
                  <span className="text-xs text-[#77717F]">
                    Authorize this contact to receive live Emergency SOS alerts and GPS pins
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
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
                  {editingContact ? 'Save Changes' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
