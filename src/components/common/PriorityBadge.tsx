import React from 'react';
import { PriorityLevel } from '../../types';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  selected?: boolean;
  onClick?: () => void;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, selected = false, onClick }) => {
  const getStyles = () => {
    switch (priority) {
      case 'urgent':
        return selected
          ? 'bg-[var(--urgent)] text-white border-[var(--urgent)] font-semibold'
          : 'bg-[var(--urgent-soft)] text-[var(--urgent)] border-transparent hover:border-[var(--urgent)]';
      case 'high':
        return selected
          ? 'bg-[var(--high)] text-white border-[var(--high)] font-semibold'
          : 'bg-[var(--high-soft)] text-[var(--high)] border-transparent hover:border-[var(--high)]';
      case 'medium':
        return selected
          ? 'bg-[var(--medium)] text-white border-[var(--medium)] font-semibold'
          : 'bg-[var(--medium-soft)] text-[var(--medium)] border-transparent hover:border-[var(--medium)]';
      case 'low':
        return selected
          ? 'bg-[var(--low)] text-white border-[var(--low)] font-semibold'
          : 'bg-[var(--low-soft)] text-[var(--low)] border-transparent hover:border-[var(--low)]';
    }
  };

  const label = priority.charAt(0).toUpperCase() + priority.slice(1);

  if (!onClick) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border font-mono tracking-tight ${getStyles()}`}>
        {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-mono border transition-all cursor-pointer ${getStyles()}`}
    >
      {selected && <span className="mr-1">✓</span>}
      {label}
    </button>
  );
};
