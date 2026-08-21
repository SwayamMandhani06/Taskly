import React from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { HabitRow } from '../components/habits/HabitRow';
import { Sparkles, Plus, Info } from 'lucide-react';

export const HabitsView: React.FC = () => {
  const { habits, openCreateHabitModal } = useTaskStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--ink)]">Habits & Routines</h1>
          <p className="text-xs font-mono text-[var(--ink-soft)] mt-0.5">
            Daily repeating practices to build consistency
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateHabitModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[var(--accent)] text-white text-xs font-mono font-medium hover:bg-[var(--accent-hover)] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-3 text-xs text-[var(--ink-soft)] font-mono">
        <Info className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[var(--ink)]">Habits vs. Tasks</p>
          <p>
            A <strong>Habit</strong> is a recurring daily practice with no end date (e.g., Reading, Exercise, Review).
            A <strong>Task</strong> is an outcome-oriented item with a definite completion state.
          </p>
        </div>
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-[var(--border)] space-y-3">
          <Sparkles className="w-10 h-10 text-[var(--ink-soft)]/40 mx-auto" />
          <p className="text-sm font-medium text-[var(--ink)]">No habits created yet.</p>
          <p className="text-xs text-[var(--ink-soft)] font-mono max-w-sm mx-auto">
            Create daily habits to start tracking consecutive completion streaks.
          </p>
          <button
            type="button"
            onClick={openCreateHabitModal}
            className="px-4 py-2 rounded text-xs font-mono bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {habits.map(habit => (
            <HabitRow key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
};
