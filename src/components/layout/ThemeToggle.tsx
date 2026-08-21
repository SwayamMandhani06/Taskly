import React from 'react';
import { useTaskStore, ThemeMode } from '../../store/useTaskStore';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTaskStore();

  const options: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'system', label: 'System', icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-0.5 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-full shadow-hairline">
      {options.map(opt => {
        const isActive = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            title={`Switch to ${opt.label} mode`}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all duration-150 active:scale-95 ${
              isActive
                ? 'bg-[var(--accent)] text-white font-medium shadow-sm'
                : 'text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)]'
            }`}
          >
            {opt.icon}
            <span className="capitalize">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
