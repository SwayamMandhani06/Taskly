import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { ViewMode } from '../../types';
import {
  Sun,
  CalendarDays,
  Inbox,
  ListTodo,
  Sparkles,
  Layers,
  Calendar,
  Plus,
} from 'lucide-react';

interface NavItem {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
  countKey?: 'today' | 'overdue' | 'inbox';
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, tasks, habits, openCreateTaskModal } = useTaskStore();

  const todayCount = tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0] && !t.completed).length;
  const inboxCount = tasks.filter(t => !t.dueDate && !t.completed).length;

  const navItems: NavItem[] = [
    { id: 'today', label: 'Today', icon: <Sun className="w-4 h-4" /> },
    { id: 'upcoming', label: 'Upcoming', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4" /> },
    { id: 'plan', label: 'Plan My Day', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'habits', label: 'Habits', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'all', label: 'All Tasks', icon: <Layers className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen bg-[var(--surface-2)] border-r border-[var(--border)] sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-7 rounded bg-[var(--accent)] flex items-center justify-center shadow-xs">
            <div className="w-1 h-4 bg-[var(--urgent)] rounded-full" />
          </div>
          <div>
            <h1 className="text-base font-bold font-display tracking-tight text-[var(--ink)]">
              Taskly
            </h1>
            <p className="text-[10px] font-mono text-[var(--ink-soft)] uppercase tracking-wider">
              Personal Ledger
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Main Navigation" className="flex-1 p-3 space-y-1 overflow-y-auto">
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
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-mono transition-all text-left ${
                isActive
                  ? 'bg-white text-[var(--accent)] font-semibold shadow-hairline border border-[var(--border)]'
                  : 'text-[var(--ink-soft)] hover:bg-white/60 hover:text-[var(--ink)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[var(--accent)]' : 'text-[var(--ink-soft)]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isActive
                      ? 'bg-[var(--accent)] text-white font-bold'
                      : 'bg-black/5 text-[var(--ink-soft)]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Add Button */}
      <div className="p-3 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={() => openCreateTaskModal()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md bg-[var(--accent)] text-white text-xs font-mono font-medium hover:bg-[var(--accent-hover)] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add Task</span>
        </button>
      </div>
    </aside>
  );
};
