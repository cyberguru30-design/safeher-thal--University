import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { resetPasswordRequest } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please provide your registered email address.');
      return;
    }

    setLoading(true);
    const res = await resetPasswordRequest(email);
    setLoading(false);

    if (res.success) {
      setMessage(res.message);
    } else {
      setError(res.message || 'Unable to process reset request.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4A245E] to-[#7651A8] flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#4A245E]">SafeHer</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#25212B]">Reset your password</h2>
        <p className="mt-1.5 text-xs text-[#77717F]">
          Enter your email to receive recovery instructions and a secure reset token.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E9E5EE] rounded-3xl sm:px-10">
          {message && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#247A55] text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#D92D45] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#25212B] uppercase tracking-wide mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77717F]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sanam.baloch@thaluni.edu.pk"
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-[#FAF9FC] border border-[#E9E5EE] rounded-xl text-[#25212B] placeholder:text-[#77717F] focus:outline-none focus:border-[#7651A8] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#4A245E] hover:bg-[#3D1D4E] text-white text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-60"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7651A8] hover:text-[#4A245E]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
