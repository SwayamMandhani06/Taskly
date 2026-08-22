import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTaskStore();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="w-full flex items-center justify-between px-3 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-hairline hover:border-[var(--accent)] transition-all duration-200 active:scale-95 group"
    >
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink)]">
        {isDark ? (
          <Moon className="w-4 h-4 text-[var(--accent)]" />
        ) : (
          <Sun className="w-4 h-4 text-[var(--high)]" />
        )}
        <span className="font-sans font-medium text-xs">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>

      <div
        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
          isDark ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-in-out ${
            isDark ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
};
