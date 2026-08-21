import React from 'react';
import { PriorityLevel } from '../../types';

interface PriorityBarProps {
  priority: PriorityLevel;
  isCompleted?: boolean;
  className?: string;
}

export const PriorityBar: React.FC<PriorityBarProps> = ({ priority, isCompleted = false, className = '' }) => {
  const getBarColor = (p: PriorityLevel) => {
    if (isCompleted) return 'bg-[var(--border)] scale-y-75 opacity-40';
    switch (p) {
      case 'urgent':
        return 'bg-[var(--urgent)] shadow-[0_0_8px_0_var(--urgent)]';
      case 'high':
        return 'bg-[var(--high)]';
      case 'medium':
        return 'bg-[var(--medium)]';
      case 'low':
        return 'bg-[var(--low)]';
      default:
        return 'bg-[var(--ink-soft)]';
    }
  };

  return (
    <div
      aria-label={`Priority ${priority}`}
      className={`w-[4px] h-full min-h-[36px] rounded-full transition-all duration-300 ease-out ${getBarColor(priority)} ${className}`}
    />
  );
};
