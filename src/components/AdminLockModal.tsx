import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  X, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  HelpCircle,
  LogIn
} from 'lucide-react';
import { verifyAdminPin, setAdminAuthenticated } from '../services/adminAuth';
import { googleSignIn } from '../services/firebaseAuth';
import { ACADEMY_DATA } from '../types/form';

interface AdminLockModalProps {
  targetTabName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLockModal: React.FC<AdminLockModalProps> = ({
  targetTabName,
  onSuccess,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pin.trim()) {
      setError('Please enter the admin passcode.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const isValid = verifyAdminPin(pin);
      if (isValid) {
        setIsVerifying(false);
        onSuccess();
      } else {
        setIsVerifying(false);
        setError('Incorrect passcode. Please check with academy management.');
      }
    }, 250);
  };

  const handleGoogleAdminLogin = async () => {
    setError(null);
    setIsVerifying(true);
    try {
      const result = await googleSignIn();
      if (result?.user) {
        setAdminAuthenticated(true);
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20 font-black">
            <Lock className="w-7 h-7" />
          </div>

          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Protected Admin Area
          </span>

          <h3 className="text-xl font-black font-display mt-2 text-white">
            Staff Passcode Required
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Access to <strong>{targetTabName}</strong> and student contact records is restricted to {ACADEMY_DATA.name} counselors.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Enter Academy Admin PIN:</span>
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-amber-600 hover:text-amber-700 font-semibold text-[11px] flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" /> {showHint ? 'Hide Hint' : 'Default PIN?'}
                </button>
              </label>

              {showHint && (
                <div className="mb-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                  <p className="font-semibold">💡 Staff Quick PINs:</p>
                  <p className="text-[11px] mt-0.5">
                    Use <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300">9365</strong> (matches helpline) or <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300">allinone</strong>
                  </p>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter 4-digit PIN / Passcode"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium tracking-wider focus:outline-none focus:border-amber-500 focus:bg-white"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl shadow-md shadow-amber-500/20 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying...' : 'Unlock Admin Portal'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-semibold uppercase">Or Sign In</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google Sign In option for admin */}
          <button
            type="button"
            onClick={handleGoogleAdminLogin}
            disabled={isVerifying}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
          >
            <LogIn className="w-4 h-4 text-slate-600" />
            <span>Unlock via Google Account ({ACADEMY_DATA.email})</span>
          </button>

          <div className="pt-2 text-center">
            <button
              onClick={onCancel}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium hover:underline"
            >
              ← Back to Student Registration Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
