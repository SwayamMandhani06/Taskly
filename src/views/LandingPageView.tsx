import React, { useState } from 'react';
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
} from 'lucide-react';

interface LandingPageViewProps {
  onNavigate: (route: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onNavigate }) => {
  const [mockChecked, setMockChecked] = useState<Record<string, boolean>>({
    'm-1': true,
    'm-2': false,
    'm-3': false,
  });

  const toggleMock = (id: string) => {
    setMockChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const mockCompletedCount = Object.values(mockChecked).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans antialiased selection:bg-[var(--accent)] selection:text-white transition-colors duration-200">
      {/* Top Marketing Navigation */}
      <header className="sticky top-0 z-40 bg-[var(--surface-2)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-glow">
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
            <a href="#plan-my-day" className="hover:text-[var(--ink)] transition-colors">
              Plan My Day
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

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Local-First + Realtime Supabase Sync</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-sans text-[var(--ink)] max-w-4xl mx-auto leading-[1.15]">
          Turn scattered tasks & daily habits into one <span className="text-[var(--accent)]">clear plan</span> for your day.
        </h1>

        <p className="text-base sm:text-lg text-[var(--ink-soft)] font-sans max-w-2xl mx-auto leading-relaxed">
          Taskly merges priority-based task scheduling, habit streak tracking, and instant offline-first sync into a calm personal workspace.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/signup')}
            className="px-8 py-3.5 rounded-full bg-[var(--accent)] text-white text-sm font-mono font-bold hover:bg-[var(--accent-hover)] transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] shadow-glow flex items-center gap-2"
          >
            <span>Start Planning Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="px-7 py-3.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm font-mono text-[var(--ink)] hover:border-[var(--accent)] transition-all active:scale-95"
          >
            Log In to Account
          </button>
        </div>

        {/* Product Visual Anchor / Interactive Mock Frame */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden text-left font-sans">
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
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
                Live Interactive Preview
              </span>
            </div>

            {/* Agenda Body */}
            <div className="p-6 space-y-5">
              {/* Daily Progress */}
              <div className="bg-[var(--surface-2)] p-4 rounded-2xl border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-[var(--ink)]">Daily Progress Tally</span>
                  <span className="text-[var(--accent)] font-bold">
                    {mockCompletedCount} / 3 completed ({Math.round((mockCompletedCount / 3) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-[var(--border)] rounded-full overflow-hidden flex gap-1 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      mockCompletedCount >= 1 ? 'bg-[var(--accent)] w-1/3' : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      mockCompletedCount >= 2 ? 'bg-[var(--accent)] w-1/3' : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      mockCompletedCount >= 3 ? 'bg-[var(--accent)] w-1/3' : 'bg-transparent'
                    }`}
                  />
                </div>
              </div>

              {/* Mock Agenda Rows */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'm-1',
                    priority: 'urgent',
                    color: 'bg-[var(--urgent)]',
                    title: 'Review Q3 goals & priority milestones',
                    category: 'Work',
                    time: '45m',
                  },
                  {
                    id: 'm-2',
                    priority: 'high',
                    color: 'bg-[var(--high)]',
                    title: 'System Architecture & Offline Sync Audit',
                    category: 'Engineering',
                    time: '60m',
                  },
                  {
                    id: 'm-3',
                    priority: 'medium',
                    color: 'bg-[var(--medium)]',
                    title: 'Morning Deep Work & Habit Routine',
                    category: 'Habit',
                    time: '90m',
                  },
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleMock(item.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      mockChecked[item.id]
                        ? 'bg-[var(--surface-2)]/60 border-[var(--border)] opacity-60'
                        : 'bg-[var(--surface)] border-[var(--border)] shadow-hairline hover:border-[var(--accent)]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${item.color}`} />
                      <button type="button" className="text-[var(--accent)]">
                        {mockChecked[item.id] ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5 text-[var(--ink-soft)]" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p
                          className={`text-xs sm:text-sm font-medium font-sans truncate ${
                            mockChecked[item.id] ? 'line-through text-[var(--ink-soft)]' : 'text-[var(--ink)]'
                          }`}
                        >
                          {item.title}
                        </p>
                      </div>
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
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[var(--border)] space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold font-sans tracking-tight text-[var(--ink)]">
            Everything you need for personal productivity
          </h2>
          <p className="text-sm font-mono text-[var(--ink-soft)] max-w-xl mx-auto">
            Built with modern Geist typography, priority indicators, and local-first persistence.
          </p>
        </div>

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
            <div
              key={i}
              className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-card space-y-3 hover:border-[var(--accent)] transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-base font-bold font-sans text-[var(--ink)]">{f.title}</h3>
              <p className="text-xs font-mono text-[var(--ink-soft)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Callout: Plan My Day */}
      <section id="plan-my-day" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="bg-[var(--surface-2)] rounded-3xl border border-[var(--border)] p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-semibold">
              Signature Feature
            </span>
            <h3 className="text-3xl font-extrabold font-sans text-[var(--ink)] tracking-tight">
              Plan My Day: Your Daily Focus Sheet
            </h3>
            <p className="text-sm font-mono text-[var(--ink-soft)] leading-relaxed">
              Stop context switching between task lists and habit trackers. Plan My Day unites your highest priority tasks and daily routines into a single schedule, with monospace time estimates and a live completion tally.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/signup')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-bold hover:bg-[var(--accent-hover)] transition-all shadow-glow"
            >
              <span>Try Plan My Day</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] shadow-card space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="font-bold text-[var(--ink)]">Today Agenda</span>
              <span className="text-[var(--accent)] font-semibold">3 Total Items</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-2)]">
                <span className="text-[var(--urgent)] font-bold">🔴 Urgent</span>
                <span className="text-[var(--ink)] font-semibold">Review Goals</span>
                <span className="text-[var(--ink-soft)]">45m</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-2)]">
                <span className="text-[var(--high)] font-bold">🟠 High</span>
                <span className="text-[var(--ink)] font-semibold">Deploy Sync</span>
                <span className="text-[var(--ink-soft)]">60m</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-2)]">
                <span className="text-[var(--medium)] font-bold">🟡 Habit</span>
                <span className="text-[var(--ink)] font-semibold">Deep Work</span>
                <span className="text-[var(--ink-soft)]">90m</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[var(--border)] space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold font-sans tracking-tight text-[var(--ink)]">
            How Taskly Works
          </h2>
          <p className="text-sm font-mono text-[var(--ink-soft)]">
            Three simple steps to daily momentum
          </p>
        </div>

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
            <div key={idx} className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-card space-y-4 text-center">
              <span className="font-mono text-xs text-[var(--accent)] font-bold bg-[var(--accent)]/10 px-3 py-1 rounded-full">
                Step {s.step}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] mx-auto flex items-center justify-center">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold font-sans text-[var(--ink)]">{s.title}</h3>
              <p className="text-xs font-mono text-[var(--ink-soft)] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border)] bg-[var(--surface-2)]">
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
