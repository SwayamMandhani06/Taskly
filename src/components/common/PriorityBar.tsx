import React from 'react';
import { PriorityLevel } from '../../types';

interface PriorityBarProps {
  priority: PriorityLevel;
  className?: string;
}

export const PriorityBar: React.FC<PriorityBarProps> = ({ priority, className = '' }) => {
  const getBarColor = (p: PriorityLevel) => {
    switch (p) {
      case 'urgent':
        return 'bg-[var(--urgent)]';
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
      className={`w-[4px] h-full min-h-[32px] rounded-full transition-colors ${getBarColor(priority)} ${className}`}
    />
  );
};
