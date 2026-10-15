import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, User, Phone, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    const result = await signUp({
      email,
      pass: password,
      fullName,
      phone,
    });
    setLoading(false);

    if (result.success) {
      localStorage.setItem('safeher_loggedIn', 'true');
      setSuccessMsg('Account created successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);
    } else {
      setErrorMsg(result.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4A245E] to-[#7651A8] flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#4A245E]">SafeHer</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#25212B]">Create your safety shield</h2>
        <p className="mt-1.5 text-xs text-[#77717F]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#7651A8] hover:text-[#4A245E]">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E9E5EE] rounded-3xl sm:px-10">
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#D92D45] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#247A55] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77717F]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] placeholder:text-[#77717F] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77717F]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] placeholder:text-[#77717F] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1.5">
                Phone Number <span className="text-[#77717F] font-normal lowercase">(optional for SMS)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77717F]" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0316-7054627"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] placeholder:text-[#77717F] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77717F]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] placeholder:text-[#77717F] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1.5">
                  Confirm
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#77717F]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat pass"
                    className="w-full pl-9 pr-8 py-2.5 text-xs bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] placeholder:text-[#77717F] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#77717F]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#4A245E] focus:ring-[#7651A8] border-[#E9E5EE]"
                />
                <span className="text-xs text-[#77717F] leading-tight">
                  I agree to the SafeHer Terms of Service and Privacy Policy, consenting to emergency location
                  processing during active alerts.
                </span>
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-sm font-bold rounded-xl shadow-md shadow-[#4A245E]/20 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Create SafeHer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
