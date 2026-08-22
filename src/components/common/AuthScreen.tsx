import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Lock, Mail, KeyRound, Sparkles, ShieldCheck, ArrowRight, LogIn, UserPlus } from 'lucide-react';

interface AuthScreenProps {
  onAuthenticated?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = () => {
  const isConfigured = isSupabaseConfigured();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured || !supabase) {
      setErrorMessage('Supabase credentials missing. Check your environment variables.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
        } else if (data.user) {
          if (data.session) {
            setSuccessMessage('Account created! Syncing database...');
          } else {
            setSuccessMessage('Account created! Please check your email to confirm registration or log in.');
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage('Logged in successfully!');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg)] flex items-center justify-center p-4 selection:bg-none select-none">
      <div className="w-full max-w-md bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)] shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[var(--accent)] text-white flex items-center justify-center shadow-glow">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold font-sans text-[var(--ink)] tracking-tight">
            Taskly Cloud Sync
          </h1>
          <p className="text-xs font-mono text-[var(--ink-soft)]">
            Sign in to sync tasks & habits across all your devices
          </p>
        </div>

        {/* Configuration Missing Warning */}
        {!isConfigured && (
          <div className="p-4 rounded-2xl bg-[var(--urgent-soft)] border border-[var(--urgent)]/30 text-xs font-mono text-[var(--urgent)] space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Supabase Credentials Required</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--ink)]">
              Set <code className="bg-black/10 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="bg-black/10 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> in your environment variables to enable cross-device sync.
            </p>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
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
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-sm font-mono text-[var(--ink)] placeholder-[var(--ink-soft)]/50 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--ink-soft)]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-sm font-mono text-[var(--ink)] placeholder-[var(--ink-soft)]/50 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-[var(--urgent-soft)] text-[var(--urgent)] text-xs font-mono font-medium">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-semibold">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isConfigured}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[var(--accent)] text-white text-xs font-mono font-bold hover:bg-[var(--accent-hover)] transition-all duration-150 active:scale-[0.98] shadow-glow disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In & Sync</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="pt-2 border-t border-[var(--border)] text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className="text-xs font-mono text-[var(--accent)] hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
