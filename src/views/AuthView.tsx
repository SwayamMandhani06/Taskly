import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import {
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  ArrowLeft,
  LogIn,
  UserPlus,
  Send,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AuthViewProps {
  mode: 'login' | 'signup' | 'forgot' | 'reset';
  onNavigate: (route: string) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ mode, onNavigate }) => {
  const isConfigured = isSupabaseConfigured();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured || !supabase) {
      setErrorMessage('Supabase credentials missing. Please check your configuration.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Logged in successfully!');
        setTimeout(() => onNavigate('/app'), 300);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured || !supabase) {
      setErrorMessage('Supabase credentials missing.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.user) {
        if (data.session) {
          setSuccessMessage('Account created successfully! Syncing workspace...');
          setTimeout(() => onNavigate('/app'), 500);
        } else {
          setSuccessMessage('Registration successful! Please check your email to confirm registration.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Sign up error.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured || !supabase) {
      setErrorMessage('Supabase credentials missing.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Password reset email sent! Check your inbox for instructions.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error sending password reset email.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset Password Submit
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured || !supabase) {
      setErrorMessage('Supabase credentials missing.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Password updated successfully! Redirecting to login...');
        setTimeout(() => onNavigate('/login'), 1200);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans flex flex-col md:flex-row antialiased selection:bg-[var(--accent)] selection:text-white transition-colors duration-200">
      {/* LEFT/TOP BRANDED PANEL (~45% Width on Desktop) */}
      <div className="w-full md:w-[45%] bg-[var(--surface-2)] border-b md:border-b-0 md:border-r border-[var(--border)] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Decorative priority bar background motif */}
        <div className="absolute right-0 top-0 bottom-0 w-2 flex gap-1 opacity-20 pointer-events-none">
          <div className="w-1.5 h-full bg-[var(--urgent)]" />
          <div className="w-1.5 h-full bg-[var(--high)]" />
          <div className="w-1.5 h-full bg-[var(--medium)]" />
          <div className="w-1.5 h-full bg-[var(--low)]" />
        </div>

        {/* Brand Header */}
        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => onNavigate('/')}
            >
              <img src="/logo.png" alt="Taskly Logo" className="w-9 h-9 rounded-xl object-contain shadow-glow" />
              <span className="font-bold font-sans text-xl tracking-tight text-[var(--ink)]">
                Taskly
              </span>
            </div>

            <div className="w-9 h-9 flex items-center justify-center">
              <ThemeToggle compact={true} />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Private & Sync Encrypted</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-[var(--ink)] tracking-tight">
              One account for all your devices.
            </h2>
            <p className="text-xs sm:text-sm font-mono text-[var(--ink-soft)] leading-relaxed">
              Your tasks, habit logs, and daily schedules remain end-to-end private to your account and sync seamlessly across laptop and mobile.
            </p>
          </div>
        </div>

        {/* Reassuring Footer Quote */}
        <div className="hidden md:block pt-12 relative z-10">
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-hairline space-y-1.5">
            <p className="text-xs font-mono font-medium text-[var(--ink)]">
              "Local-first speed with real-time cloud peace of mind."
            </p>
            <p className="text-[11px] font-mono text-[var(--ink-soft)]">
              Built for high focus & zero context switching.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT/MAIN FORM PANEL (~55% Width on Desktop) */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 max-w-xl mx-auto w-full">
        <div className="space-y-6">
          {/* Back to Homepage Button */}
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          {/* Form Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-[var(--ink)]">
              {mode === 'login' && 'Log in to Taskly'}
              {mode === 'signup' && 'Create your account'}
              {mode === 'forgot' && 'Reset your password'}
              {mode === 'reset' && 'Set new password'}
            </h1>
            <p className="text-xs font-mono text-[var(--ink-soft)] mt-1">
              {mode === 'login' && 'Enter your credentials to sync your workspace'}
              {mode === 'signup' && 'Get started with instant cross-device sync'}
              {mode === 'forgot' && 'Enter your account email to receive a password reset link'}
              {mode === 'reset' && 'Enter your new secure password below'}
            </p>
          </div>

          {/* Configuration Missing Banner */}
          {!isConfigured && (
            <div className="p-4 rounded-2xl bg-[var(--urgent-soft)] border border-[var(--urgent)]/30 text-xs font-mono text-[var(--urgent)] space-y-1">
              <span className="font-bold">Supabase Config Required:</span> Set <code className="bg-black/10 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> & <code className="bg-black/10 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> in environment variables.
            </div>
          )}

          {/* MODE: LOG IN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--ink-soft)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] placeholder-[var(--ink-soft)]/50 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('/forgot-password')}
                    className="text-xs font-mono text-[var(--accent)] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--ink-soft)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] placeholder-[var(--ink-soft)]/50 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-3.5 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-2xl bg-[var(--urgent-soft)] text-[var(--urgent)] text-xs font-mono font-medium">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-semibold">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-bold hover:bg-[var(--accent-hover)] transition-all duration-150 active:scale-[0.98] shadow-glow disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Log In</span>
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-[var(--border)] text-center">
                <p className="text-xs font-mono text-[var(--ink-soft)]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('/signup')}
                    className="text-[var(--accent)] font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE: SIGN UP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--ink-soft)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] placeholder-[var(--ink-soft)]/50 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--ink-soft)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] placeholder-[var(--ink-soft)]/50 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--ink-soft)]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] placeholder-[var(--ink-soft)]/50 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-2xl bg-[var(--urgent-soft)] text-[var(--urgent)] text-xs font-mono font-medium">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-bold hover:bg-[var(--accent-hover)] transition-all duration-150 active:scale-[0.98] shadow-glow disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-[var(--border)] text-center">
                <p className="text-xs font-mono text-[var(--ink-soft)]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('/login')}
                    className="text-[var(--accent)] font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--ink-soft)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] placeholder-[var(--ink-soft)]/50 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-2xl bg-[var(--urgent-soft)] text-[var(--urgent)] text-xs font-mono font-medium">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-semibold">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-bold hover:bg-[var(--accent-hover)] transition-all duration-150 active:scale-[0.98] shadow-glow disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-[var(--border)] text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('/login')}
                  className="text-xs font-mono text-[var(--accent)] font-semibold hover:underline"
                >
                  Remember password? Log in
                </button>
              </div>
            </form>
          )}

          {/* MODE: RESET PASSWORD */}
          {mode === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--ink-soft)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] placeholder-[var(--ink-soft)]/50 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--ink-soft)]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] placeholder-[var(--ink-soft)]/50 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-2xl bg-[var(--urgent-soft)] text-[var(--urgent)] text-xs font-mono font-medium">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-semibold">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-bold hover:bg-[var(--accent-hover)] transition-all duration-150 active:scale-[0.98] shadow-glow disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
