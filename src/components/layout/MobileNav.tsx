import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { ViewMode } from '../../types';
import {
  Sun,
  CalendarDays,
  Inbox,
  ListTodo,
  Sparkles,
  FolderKanban,
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
    { id: 'today', label: 'Today', icon: <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'upcoming', label: 'Upcoming', icon: <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'plan', label: 'Plan', icon: <ListTodo className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'categories', label: 'Category', icon: <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'habits', label: 'Habits', icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface-2)]/95 backdrop-blur-md border-t border-[var(--border)] px-1 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-panel max-w-full"
    >
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-0.5 px-0.5">
        {navItems.map(item => {
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              aria-label={item.label}
              className={`flex-1 min-w-[42px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 p-1 rounded-xl transition-all duration-150 active:scale-95 shrink-0 ${
                isActive
                  ? 'text-[var(--accent)] font-semibold bg-[var(--surface)] shadow-hairline border border-[var(--border)]/50'
                  : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              <div className={isActive ? 'text-[var(--accent)] scale-105 transition-transform' : ''}>
                {item.icon}
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono leading-none truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
