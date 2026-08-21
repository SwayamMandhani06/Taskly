import React from 'react';
import { Habit } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { PriorityBar } from '../common/PriorityBar';
import { CategoryChip } from '../common/CategoryChip';
import { MonospaceTag } from '../common/MonospaceTag';
import { calculateHabitStreak } from '../../utils/streakCalculator';
import { Flame, CheckCircle2, Circle } from 'lucide-react';

interface HabitRowProps {
  habit: Habit;
}

export const HabitRow: React.FC<HabitRowProps> = ({ habit }) => {
  const { habitLogs, toggleHabitToday, openEditHabitModal } = useTaskStore();

  const { currentStreak, completedToday } = calculateHabitStreak(habit.id, habitLogs);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHabitToday(habit.id);
  };

  const handleRowClick = () => {
    openEditHabitModal(habit.id);
  };

  return (
    <div
      onClick={handleRowClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          if ((e.target as HTMLElement).tagName !== 'BUTTON') {
            e.preventDefault();
            handleRowClick();
          }
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Habit ${habit.title}, current streak ${currentStreak} days${completedToday ? ', completed today' : ''}`}
      className={`group relative flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-200 ease-out cursor-pointer bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-hover hover:-translate-y-0.5 active:scale-[0.99] ${
        completedToday ? 'bg-[var(--surface-2)]/50 border-[var(--border)]' : 'border-[var(--border)] shadow-card'
      }`}
    >
      <PriorityBar priority={habit.priority} isCompleted={completedToday} className="shrink-0" />

      {/* Ring Checkbox for Habit */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={completedToday ? 'Uncheck habit for today' : 'Check habit for today'}
        className="p-1 rounded-lg text-[var(--ink-soft)] hover:text-[var(--accent)] transition-all duration-150 active:scale-90 shrink-0"
      >
        {completedToday ? (
          <CheckCircle2 className="w-5 h-5 text-[var(--accent)] fill-[var(--accent)]/10" />
        ) : (
          <Circle className="w-5 h-5 text-[var(--ink-soft)]" />
        )}
      </button>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium font-sans leading-snug ${completedToday ? 'line-through text-[var(--ink-soft)]' : 'text-[var(--ink)]'}`}>
            {habit.title}
          </span>
          <CategoryChip category={habit.category} />
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--ink-soft)] font-mono">
          {habit.estimateMinutes && (
            <MonospaceTag>{habit.estimateMinutes}m</MonospaceTag>
          )}
        </div>
      </div>

      {/* Streak badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] font-mono text-xs text-[var(--ink)] shrink-0">
        <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'text-[var(--high)] fill-[var(--high)]/20 animate-bounce' : 'text-[var(--ink-soft)]'}`} />
        <span className="font-semibold">{currentStreak}</span>
        <span className="text-[10px] text-[var(--ink-soft)]">d</span>
      </div>
    </div>
  );
};
