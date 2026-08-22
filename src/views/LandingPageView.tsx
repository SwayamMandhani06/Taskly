import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import {
  Sparkles,
  Flame,
  ListTodo,
  RefreshCw,
  ShieldCheck,
  Inbox,
  Calendar,
  CheckCircle2,
  ArrowRight,
  CheckSquare,
  Square,
  Clock,
  ChevronRight,
  Layers,
  Repeat,
  AlertCircle,
} from 'lucide-react';

interface LandingPageViewProps {
  onNavigate: (route: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onNavigate }) => {
  // Interactive mock state for Hero preview
  const [heroChecked, setHeroChecked] = useState<Record<string, boolean>>({
    'h-1': true,
    'h-2': false,
    'h-3': false,
  });

  // Interactive mock state for Habits preview
  const [habitChecked, setHabitChecked] = useState<Record<string, boolean>>({
    'hab-1': true,
    'hab-2': true,
    'hab-3': false,
  });

  const toggleHeroCheck = (id: string) => {
    setHeroChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHabitCheck = (id: string) => {
    setHabitChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const heroCompletedCount = Object.values(heroChecked).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[var(--bg)] bg-radial-mesh text-[var(--ink)] font-sans antialiased selection:bg-[var(--accent)] selection:text-white transition-colors duration-200 relative overflow-x-hidden">
      {/* Ambient Blurred Color Blobs (Slow CSS Floating Loops) */}
      <div
        className="w-96 h-96 rounded-full bg-[var(--accent)]/15 blur-3xl fixed -top-24 -right-24 pointer-events-none animate-blob-slow z-0"
        aria-hidden="true"
      />
      <div
        className="w-96 h-96 rounded-full bg-[var(--urgent)]/10 blur-3xl fixed top-1/2 -left-32 pointer-events-none animate-blob-reverse z-0"
        aria-hidden="true"
      />

      {/* Top Header / Marketing Navbar */}
      <header className="sticky top-0 z-50 bg-[var(--surface-2)]/85 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('/')}
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <div className="w-1.5 h-5 bg-[var(--urgent)] rounded-full" />
            </div>
            <span className="font-bold font-sans text-xl tracking-tight text-[var(--ink)]">
              Taskly
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-[var(--ink-soft)]">
            <a href="#features" className="hover:text-[var(--ink)] transition-colors">
              Features
            </a>
            <a href="#showcase-plan" className="hover:text-[var(--ink)] transition-colors">
              Plan My Day
            </a>
            <a href="#showcase-habits" className="hover:text-[var(--ink)] transition-colors">
              Habits & Streaks
            </a>
            <a href="#how-it-works" className="hover:text-[var(--ink)] transition-colors">
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <ThemeToggle compact={true} />
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--ink)] hover:border-[var(--accent)] transition-all active:scale-95"
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-medium hover:bg-[var(--accent-hover)] transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] shadow-glow flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section — Asymmetric 2-Column Desktop Layout */}
      <section className="pt-12 sm:pt-16 pb-20 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Subtext, Eyebrow & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Live Status Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-mono font-semibold text-[var(--ink)] shadow-hairline">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--low)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--low)]" />
              </span>
              <span>Local-First + Realtime Supabase Sync</span>
            </div>

            {/* Benefit-led Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-[var(--ink)] leading-[1.1]">
              Turn scattered tasks & daily habits into one <span className="text-[var(--accent)]">clear plan</span> for your day.
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-[var(--ink-soft)] font-sans leading-relaxed max-w-xl">
              Taskly merges priority-based task scheduling, habit streak tracking, and instant offline-first sync into a single calm personal workspace.
            </p>

            {/* Hero CTAs */}
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/signup')}
                className="px-7 py-3.5 rounded-full bg-[var(--accent)] text-white text-xs sm:text-sm font-mono font-bold hover:bg-[var(--accent-hover)] transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] shadow-glow hover:shadow-[0_0_25px_var(--accent-glow)] flex items-center gap-2"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="px-6 py-3.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs sm:text-sm font-mono text-[var(--ink)] hover:border-[var(--accent)] transition-all active:scale-95"
              >
                Log In to Account
              </button>
            </div>
          </motion.div>

          {/* Right Column: 3D Angled Interactive Product Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 32, rotateY: -12 }}
            animate={{ opacity: 1, y: 0, rotateY: -6 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 perspective-1000"
          >
            <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden rotate-3d-hero text-left font-sans shadow-hover">
              {/* Window Bar */}
              <div className="px-5 py-3 bg-[var(--surface-2)] border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  <span className="ml-2 text-xs font-mono text-[var(--ink-soft)]">
                    Taskly — Plan My Day Agenda
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
                  Interactive Mock
                </span>
              </div>

              {/* Interactive Agenda Body */}
              <div className="p-6 space-y-5">
                {/* Progress Bar */}
                <div className="bg-[var(--surface-2)] p-4 rounded-2xl border border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-[var(--ink)]">Daily Progress Tally</span>
                    <span className="text-[var(--accent)] font-bold">
                      {heroCompletedCount} / 3 completed ({Math.round((heroCompletedCount / 3) * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden flex gap-1 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        heroCompletedCount >= 1 ? 'bg-[var(--accent)] w-1/3' : 'bg-transparent'
                      }`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        heroCompletedCount >= 2 ? 'bg-[var(--accent)] w-1/3' : 'bg-transparent'
                      }`}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        heroCompletedCount >= 3 ? 'bg-[var(--accent)] w-1/3' : 'bg-transparent'
                      }`}
                    />
                  </div>
                </div>

                {/* Mock Task Rows */}
                <div className="space-y-2.5">
                  {[
                    {
                      id: 'h-1',
                      priority: 'urgent',
                      color: 'bg-[var(--urgent)]',
                      title: 'Review Q3 goals & priority milestones',
                      category: 'Work',
                      time: '45m',
                    },
                    {
                      id: 'h-2',
                      priority: 'high',
                      color: 'bg-[var(--high)]',
                      title: 'System Architecture & Offline Sync Audit',
                      category: 'Engineering',
                      time: '60m',
                    },
                    {
                      id: 'h-3',
                      priority: 'medium',
                      color: 'bg-[var(--medium)]',
                      title: 'Morning Deep Work & Habit Routine',
                      category: 'Habit',
                      time: '90m',
                    },
                  ].map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleHeroCheck(item.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        heroChecked[item.id]
                          ? 'bg-[var(--surface-2)]/60 border-[var(--border)] opacity-60'
                          : 'bg-[var(--surface)] border-[var(--border)] shadow-card hover:border-[var(--accent)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${item.color}`} />
                        <button type="button" className="text-[var(--accent)]">
                          {heroChecked[item.id] ? (
                            <CheckSquare className="w-5 h-5 text-[var(--accent)]" />
                          ) : (
                            <Square className="w-5 h-5 text-[var(--ink-soft)]" />
                          )}
                        </button>
                        <span
                          className={`text-xs sm:text-sm font-medium font-sans truncate ${
                            heroChecked[item.id] ? 'line-through text-[var(--ink-soft)]' : 'text-[var(--ink)]'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                        <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-soft)]">
                          {item.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[var(--ink-soft)]">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Overview Grid (6 Icon Cards) */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[var(--border)] relative z-10 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl font-bold font-sans tracking-tight text-[var(--ink)]">
            Everything you need for personal productivity
          </h2>
          <p className="text-xs sm:text-sm font-mono text-[var(--ink-soft)] max-w-xl mx-auto">
            Built with modern Geist typography, signature priority indicators, and local-first persistence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Sparkles className="w-6 h-6 text-[var(--urgent)]" />,
              title: 'Priority-Based Planning',
              desc: 'Urgent, High, Medium, and Low visual indicators rank your ledger agenda so critical items stand out instantly.',
            },
            {
              icon: <Flame className="w-6 h-6 text-[var(--high)]" />,
              title: 'Habit Tracking & Streaks',
              desc: 'Track consecutive day streaks computed accurately from real historical habit logs without dummy resets.',
            },
            {
              icon: <ListTodo className="w-6 h-6 text-[var(--accent)]" />,
              title: 'Plan My Day Agenda',
              desc: 'Consolidate today’s urgent tasks and habit templates into a unified schedule sheet with total time estimates.',
            },
            {
              icon: <RefreshCw className="w-6 h-6 text-[var(--accent)]" />,
              title: 'Realtime Cross-Device Sync',
              desc: 'Supabase Postgres backend syncs changes in real time between your laptop browser and mobile phone.',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-[var(--medium)]" />,
              title: 'Offline-First Reliability',
              desc: 'Local IndexedDB caching functions with zero network connection. Queued writes auto-flush when online.',
            },
            {
              icon: <Inbox className="w-6 h-6 text-[var(--low)]" />,
              title: 'Quick-Capture Inbox',
              desc: 'Rapidly drop scattered thoughts into your inbox, with 1-tap triage controls for Today, Tomorrow, or specific dates.',
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-card space-y-3 hover:border-[var(--accent)] hover:-translate-y-1.5 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-base font-bold font-sans text-[var(--ink)]">{f.title}</h3>
              <p className="text-xs font-mono text-[var(--ink-soft)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXPANDED FEATURE SHOWCASE 1: Plan My Day Agenda (Text Left, Mock Right) */}
      <section id="showcase-plan" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--surface-2)] rounded-3xl border border-[var(--border)] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-semibold">
              Showcase 01 — Focus Engine
            </span>
            <h3 className="text-3xl font-extrabold font-sans text-[var(--ink)] tracking-tight">
              Plan My Day: Your Unified Daily Agenda
            </h3>
            <p className="text-sm font-mono text-[var(--ink-soft)] leading-relaxed">
              Stop context-switching between separate task managers and habit trackers. Plan My Day combines your top priority tasks and daily habit templates into a clean schedule sheet with estimate totals.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-bold hover:bg-[var(--accent-hover)] transition-all shadow-glow"
            >
              <span>Explore Plan My Day</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-6 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-card space-y-4 font-mono text-xs text-left">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="font-bold text-[var(--ink)]">Daily Agenda Tally</span>
              <span className="text-[var(--accent)] font-semibold">3 Items (195m total)</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--urgent)] shrink-0" />
                  <span className="text-[var(--ink)] font-semibold">Review Q3 Milestones</span>
                </div>
                <span className="text-[var(--ink-soft)]">45m</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--high)] shrink-0" />
                  <span className="text-[var(--ink)] font-semibold">Deploy Supabase Realtime</span>
                </div>
                <span className="text-[var(--ink-soft)]">60m</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--medium)] shrink-0" />
                  <span className="text-[var(--ink)] font-semibold">Morning Deep Work</span>
                </div>
                <span className="text-[var(--ink-soft)]">90m</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* EXPANDED FEATURE SHOWCASE 2: Habits & Streak Engine (Mock Left, Text Right) */}
      <section id="showcase-habits" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-card"
        >
          {/* Mock Left */}
          <div className="lg:col-span-6 bg-[var(--surface-2)] p-6 rounded-2xl border border-[var(--border)] space-y-4 font-sans text-left">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 font-mono text-xs">
              <span className="font-bold text-[var(--ink)]">Habits & Routines</span>
              <span className="text-[var(--high)] font-bold flex items-center gap-1">
                <Flame className="w-4 h-4 fill-[var(--high)]" />
                <span>12 Day Streak</span>
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'hab-1', name: 'Morning Deep Work Session', category: 'Mindset', streak: 12 },
                { id: 'hab-2', name: 'Read 20 Pages Technical Documentation', category: 'Learning', streak: 8 },
                { id: 'hab-3', name: '30-min Evening Reflection Walk', category: 'Health', streak: 5 },
              ].map(hab => (
                <div
                  key={hab.id}
                  onClick={() => toggleHabitCheck(hab.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] cursor-pointer hover:border-[var(--accent)] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button type="button" className="text-[var(--accent)] shrink-0">
                      {habitChecked[hab.id] ? (
                        <CheckCircle2 className="w-5 h-5 text-[var(--accent)] fill-[var(--accent)]/10" />
                      ) : (
                        <Square className="w-5 h-5 text-[var(--ink-soft)]" />
                      )}
                    </button>
                    <span
                      className={`text-xs font-medium truncate ${
                        habitChecked[hab.id] ? 'line-through text-[var(--ink-soft)]' : 'text-[var(--ink)]'
                      }`}
                    >
                      {hab.name}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[var(--surface-2)] text-[10px] font-mono text-[var(--high)] font-semibold shrink-0">
                    🔥 {hab.streak}d
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Text Right */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="px-3 py-1 rounded-full bg-[var(--high)]/10 text-[var(--high)] text-xs font-mono font-semibold">
              Showcase 02 — Consistency
            </span>
            <h3 className="text-3xl font-extrabold font-sans text-[var(--ink)] tracking-tight">
              Build Consistency with Habit Streaks
            </h3>
            <p className="text-sm font-mono text-[var(--ink-soft)] leading-relaxed">
              Habit streaks are computed with pure function accuracy from your historical completion log records. Check off routines on your phone or laptop and watch your consecutive streak tallies grow.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-bold hover:bg-[var(--accent-hover)] transition-all shadow-glow"
            >
              <span>Build Daily Habits</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* EXPANDED FEATURE SHOWCASE 3: Today View & Overdue Alerting (Text Left, Mock Right) */}
      <section id="showcase-today" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--surface-2)] rounded-3xl border border-[var(--border)] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Text Left */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="px-3 py-1 rounded-full bg-[var(--urgent)]/10 text-[var(--urgent)] text-xs font-mono font-semibold">
              Showcase 03 — Clarity
            </span>
            <h3 className="text-3xl font-extrabold font-sans text-[var(--ink)] tracking-tight">
              Overdue Items Are Impossible to Miss
            </h3>
            <p className="text-sm font-mono text-[var(--ink-soft)] leading-relaxed">
              The Today view features 3 distinct sections: Overdue tasks (visually highlighted with an urgent pulse indicator), Today's scheduled agenda, and Daily Routines — keeping priority items front and center.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-bold hover:bg-[var(--accent-hover)] transition-all shadow-glow"
            >
              <span>Start Today View</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mock Right */}
          <div className="lg:col-span-6 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] space-y-4 font-sans text-left shadow-card">
            {/* Overdue Section Highlight */}
            <div className="p-3.5 rounded-xl bg-[var(--urgent-soft)] border border-[var(--urgent)]/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--urgent)]">
                <AlertCircle className="w-4 h-4 animate-pulse" />
                <span>OVERDUE TASKS (1)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[var(--ink)] font-semibold">
                <span>Finalize System Architecture Specification</span>
                <span className="text-[var(--urgent)]">Yesterday</span>
              </div>
            </div>

            {/* Today Tasks */}
            <div className="space-y-2 font-mono text-xs">
              <span className="font-bold text-[var(--ink-soft)]">TODAY'S SCHEDULE</span>
              <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Square className="w-4 h-4 text-[var(--ink-soft)]" />
                  <span className="text-[var(--ink)] font-medium">Review Q3 goals</span>
                </div>
                <span className="text-[var(--ink-soft)]">14:00</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3-Step How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[var(--border)] relative z-10 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl font-bold font-sans tracking-tight text-[var(--ink)]">
            How Taskly Works
          </h2>
          <p className="text-xs sm:text-sm font-mono text-[var(--ink-soft)]">
            Three simple steps to daily momentum
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Capture',
              icon: <Inbox className="w-6 h-6 text-[var(--accent)]" />,
              desc: 'Quickly drop tasks, subtasks, notes, and habits into your inbox on phone or laptop.',
            },
            {
              step: '02',
              title: 'Plan',
              icon: <Calendar className="w-6 h-6 text-[var(--accent)]" />,
              desc: 'Assign priority tags, due dates, and time estimates to structure your day.',
            },
            {
              step: '03',
              title: 'Track',
              icon: <CheckCircle2 className="w-6 h-6 text-[var(--accent)]" />,
              desc: 'Work through your agenda, log completions, and watch your habit streaks grow.',
            },
          ].map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-card space-y-4 text-center hover:border-[var(--accent)] transition-all"
            >
              <span className="font-mono text-xs text-[var(--accent)] font-bold bg-[var(--accent)]/10 px-3 py-1 rounded-full">
                Step {s.step}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] mx-auto flex items-center justify-center">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold font-sans text-[var(--ink)]">{s.title}</h3>
              <p className="text-xs font-mono text-[var(--ink-soft)] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL FULL-WIDTH CTA SECTION */}
      <section className="py-20 px-4 sm:px-6 relative z-10 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[var(--surface-2)] border border-[var(--border)] p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div
            className="w-80 h-80 rounded-full bg-[var(--accent)]/10 blur-3xl absolute -top-20 left-1/2 -translate-x-1/2 pointer-events-none"
            aria-hidden="true"
          />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans text-[var(--ink)] tracking-tight max-w-2xl mx-auto leading-tight relative z-10">
            Ready for a calm, structured day?
          </h2>

          <p className="text-xs sm:text-sm font-mono text-[var(--ink-soft)] max-w-xl mx-auto relative z-10">
            Sign up in seconds and experience local-first speed with real-time Supabase cloud sync across all your devices.
          </p>

          <div className="pt-2 relative z-10">
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="px-9 py-4 rounded-full bg-[var(--accent)] text-white text-xs sm:text-sm font-mono font-bold hover:bg-[var(--accent-hover)] transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] shadow-glow hover:shadow-[0_0_30px_var(--accent-glow)] inline-flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-[var(--border)] bg-[var(--surface-2)]/50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--ink-soft)]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <div className="w-1 h-3 bg-[var(--urgent)] rounded-full" />
            </div>
            <span className="font-bold text-[var(--ink)] font-sans text-sm">Taskly</span>
            <span>— Personal Productivity Workspace</span>
          </div>

          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onNavigate('/login')} className="hover:text-[var(--ink)] transition-colors">
              Log In
            </button>
            <button type="button" onClick={() => onNavigate('/signup')} className="hover:text-[var(--ink)] transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
