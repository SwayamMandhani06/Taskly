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
} from 'lucide-react';

interface MobileNavItem {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
}

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView } = useTaskStore();

  const navItems: MobileNavItem[] = [
    { id: 'today', label: 'Today', icon: <Sun className="w-5 h-5" /> },
    { id: 'upcoming', label: 'Upcoming', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-5 h-5" /> },
    { id: 'plan', label: 'Plan', icon: <ListTodo className="w-5 h-5" /> },
    { id: 'habits', label: 'Habits', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface-2)] border-t border-[var(--border)] px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-panel"
    >
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
                isActive
                  ? 'text-[var(--accent)] font-semibold'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              <div className={isActive ? 'text-[var(--accent)] scale-110 transition-transform' : ''}>
                {item.icon}
              </div>
              <span className="text-[10px] font-mono leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
