import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Heart,
  FileText,
  MapPin,
  CheckCircle2,
  Save,
  Camera,
  GraduationCap,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Editable form fields with user or requested default values
  const [fullName, setFullName] = useState(user?.fullName || 'Sanam Baloch');
  const [email, setEmail] = useState(user?.email || 'sanam.baloch@thaluni.edu.pk');
  const [phone, setPhone] = useState(user?.phone || '0316-7054627');
  const [bloodType, setBloodType] = useState(user?.bloodType || 'O Positive');
  const [address, setAddress] = useState(
    user?.address || 'Bhakkar City, District Bhakkar, Punjab, Pakistan'
  );
  const [university, setUniversity] = useState(
    user?.university || 'Thal University Bhakkar'
  );
  const [department, setDepartment] = useState(
    user?.department || 'BSIT Department of Computer Science'
  );
  const [emergencyNotes, setEmergencyNotes] = useState(
    user?.emergencyNotes || 'Carries asthma inhaler in side pocket. Penicillin allergy.'
  );
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync state if user context updates from external storage
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.bloodType) setBloodType(user.bloodType);
      if (user.address) setAddress(user.address);
      if (user.university) setUniversity(user.university);
      if (user.department) setDepartment(user.department);
      if (user.emergencyNotes) setEmergencyNotes(user.emergencyNotes);
      if (user.avatarUrl) setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    await updateProfile({
      fullName,
      email,
      phone,
      bloodType,
      address,
      university,
      department,
      emergencyNotes,
      avatarUrl,
    });

    setLoading(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Clickable Avatar Photo */}
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#7651A8] shadow-sm group-hover:opacity-85 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
              <Camera className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">Change</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[#25212B] tracking-tight">{fullName}</h1>
              <span className="text-[10px] font-bold text-[#7651A8] bg-[#F1EAF8] px-2.5 py-0.5 rounded-full uppercase">
                {user?.role || 'user'} Account
              </span>
            </div>
            <p className="text-xs text-[#77717F] mt-0.5">{email}</p>
            <div className="flex items-center gap-2 text-xs text-[#7651A8] font-semibold mt-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{university} · {department}</span>
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#247A55] rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile Updated Successfully - Thal University Bhakkar</span>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E5EE] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#25212B] uppercase tracking-wider">
                Personal Information
              </h3>
              <span className="text-[11px] text-[#7651A8] font-semibold">
                Click any field to edit & customize
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77717F]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sanam Baloch"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77717F]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sanam.baloch@thaluni.edu.pk"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Primary Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77717F]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0316-7054627"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-all font-medium"
                >
                  <option value="O Positive">O Positive (O+)</option>
                  <option value="O Negative">O Negative (O-)</option>
                  <option value="A Positive">A Positive (A+)</option>
                  <option value="A Negative">A Negative (A-)</option>
                  <option value="B Positive">B Positive (B+)</option>
                  <option value="B Negative">B Negative (B-)</option>
                  <option value="AB Positive">AB Positive (AB+)</option>
                  <option value="AB Negative">AB Negative (AB-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  University / Institute
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77717F]" />
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="Thal University Bhakkar"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                  Academic Department
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77717F]" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="BSIT Department of Computer Science"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Residence & Location */}
          <div className="pt-4 border-t border-[#E9E5EE]">
            <h3 className="text-sm font-bold text-[#25212B] uppercase tracking-wider mb-4">
              Primary Safe Address
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                Home / Campus Residence Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77717F]" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Bhakkar City, District Bhakkar, Punjab, Pakistan"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Paramedic & First Responder Notes */}
          <div className="pt-4 border-t border-[#E9E5EE]">
            <h3 className="text-sm font-bold text-[#25212B] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#D92D45]" />
              <span>Paramedic & First Responder Emergency Info</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1">
                Emergency Medical Notes & Critical Allergies
              </label>
              <textarea
                rows={3}
                value={emergencyNotes}
                onChange={(e) => setEmergencyNotes(e.target.value)}
                placeholder="e.g. Carries asthma inhaler in side pocket. Penicillin allergy. Diabetic insulin dependent."
                className="w-full px-3 py-2.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-all font-medium leading-relaxed"
              />
              <p className="text-[11px] text-[#77717F] mt-1">
                These notes will be displayed on your digital wallet emergency card and shared with medical first responders (Rescue 1122) during an active SOS dispatch.
              </p>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-[#E9E5EE] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#77717F]">
              Changes are saved directly to your browser storage and stay active after refresh.
            </span>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Profile...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
