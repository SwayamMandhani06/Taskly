import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { ViewMode } from '../../types';
import { ThemeToggle } from './ThemeToggle';
import {
  Sun,
  CalendarDays,
  Inbox,
  ListTodo,
  Sparkles,
  Layers,
  Calendar,
  Plus,
  FolderKanban,
  Lock,
  ShieldCheck,
  LogOut,
  User,
} from 'lucide-react';

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    tasks,
    openCreateTaskModal,
    lockApp,
    isLockEnabled,
    user,
    signOut,
  } = useTaskStore();

  const todayCount = tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0] && !t.completed).length;
  const inboxCount = tasks.filter(t => !t.dueDate && !t.completed).length;

  const navItems: NavItem[] = [
    { id: 'today', label: 'Today', icon: <Sun className="w-4 h-4" /> },
    { id: 'upcoming', label: 'Upcoming', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4" /> },
    { id: 'plan', label: 'Plan My Day', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'habits', label: 'Habits', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'all', label: 'All Tasks', icon: <Layers className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[var(--surface-2)] border-r border-[var(--border)] sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-glow">
              <div className="w-1.5 h-5 bg-[var(--urgent)] rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-sans tracking-tight text-[var(--ink)]">
                Taskly
              </h1>
              <p className="text-[10px] font-mono text-[var(--ink-soft)] uppercase tracking-wider">
                Personal Workspace
              </p>
            </div>
          </div>

          {isLockEnabled && (
            <button
              type="button"
              onClick={lockApp}
              aria-label="Lock application"
              title="Lock Taskly with PIN code"
              className="p-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)] active:scale-95 transition-all"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* User Account Info */}
        {user && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-mono">
            <div className="flex items-center gap-2 truncate pr-2">
              <User className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
              <span className="truncate text-[var(--ink)]" title={user.email}>
                {user.email}
              </span>
            </div>
            <button
              type="button"
              onClick={signOut}
              title="Sign Out"
              className="p-1 text-[var(--ink-soft)] hover:text-[var(--urgent)] transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Custom Theme Switcher Toggle */}
        <div className="pt-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Main Navigation" className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeView === item.id;
          let count = 0;
          if (item.id === 'today') count = todayCount;
          if (item.id === 'inbox') count = inboxCount;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-150 ease-out text-left active:scale-[0.98] ${
                isActive
                  ? 'bg-[var(--surface)] text-[var(--accent)] font-semibold shadow-hairline border border-[var(--border)]'
                  : 'text-[var(--ink-soft)] hover:bg-[var(--surface)]/70 hover:text-[var(--ink)] hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[var(--accent)]' : 'text-[var(--ink-soft)]'}>
                  {item.icon}
                </span>
                <span className="font-sans font-medium text-xs">{item.label}</span>
              </div>

              {count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive
                      ? 'bg-[var(--accent)] text-white font-bold'
                      : 'bg-black/5 dark:bg-white/10 text-[var(--ink-soft)]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Add & Backup Buttons */}
      <div className="p-4 border-t border-[var(--border)] space-y-2">
        <button
          type="button"
          onClick={useTaskStore.getState().openBackupModal}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-xs font-mono font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-150 active:scale-[0.97]"
        >
          <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
          <span>Data Backup</span>
        </button>

        <button
          type="button"
          onClick={() => openCreateTaskModal()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-medium hover:bg-[var(--accent-hover)] transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add Task</span>
        </button>
      </div>
    </aside>
  );
};
