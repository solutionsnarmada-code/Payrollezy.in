import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PlanId } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  selectedPlanId?: PlanId;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess
}) => {
  const { loginWithEmail, signupWithEmail, loginWithGoogle, resetPassword, startQuickDemo } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!agreedToTerms) {
          setError('Please agree to the Terms of Service and Privacy Policy.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        await signupWithEmail(email, password, fullName);
        onSuccess();
      } else if (mode === 'login') {
        await loginWithEmail(email, password);
        onSuccess();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setInfoMessage('Password reset link sent to your email.');
        setMode('login');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = 'Authentication failed. Please verify your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email address is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    startQuickDemo();
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-7 sm:p-8">
          {/* Logo & Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              payrollezy<span className="text-blue-600">.in</span>
            </span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'signup' && 'Create your payrollezy.in account'}
            {mode === 'login' && 'Sign in to your organization'}
            {mode === 'forgot' && 'Reset your password'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            {mode === 'signup' && 'Set up compliant Indian payroll in just a few clicks.'}
            {mode === 'login' && 'Access employee records, statutory compliance and payroll runs.'}
            {mode === 'forgot' && 'Enter your work email to receive password reset instructions.'}
          </p>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {infoMessage && (
            <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs">
              {infoMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vikramaditya Sen"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-blue-700 hover:text-blue-800 font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-600 leading-tight">
                  I agree to the <span className="font-semibold text-slate-900">Terms of Service</span> and <span className="font-semibold text-slate-900">Privacy Policy</span>.
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : mode === 'signup' ? (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>

          {/* Social login divider */}
          {mode !== 'forgot' && (
            <div className="mt-5 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-white px-3 text-slate-400 font-semibold">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                ⚡ Explore Instant Demo Organization
              </button>
            </div>
          )}

          {/* Toggle Login / Signup */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'login' && (
              <p>
                Don't have an organization account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Create an account
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  onClick={() => { setMode('login'); setError(null); }}
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
