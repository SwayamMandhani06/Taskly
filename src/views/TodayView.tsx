import React from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskRow } from '../components/tasks/TaskRow';
import { HabitRow } from '../components/habits/HabitRow';
import { isTaskOverdue, isTaskDueToday } from '../utils/dateHelpers';
import { AlertCircle, Calendar, Sparkles, Plus } from 'lucide-react';

export const TodayView: React.FC = () => {
  const { tasks, habits, openCreateTaskModal } = useTaskStore();

  // Overdue tasks: incomplete, dueDate before today
  const overdueTasks = tasks.filter(t => !t.completed && isTaskOverdue(t.dueDate));

  // Today tasks: dueDate is today
  const todayTasks = tasks
    .filter(t => isTaskDueToday(t.dueDate))
    .sort((a, b) => {
      // Sort priority descending: urgent -> high -> medium -> low
      const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
      const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (diff !== 0) return diff;
      return (a.dueTime || '99:99').localeCompare(b.dueTime || '99:99');
    });

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--ink)]">Today</h1>
          <p className="text-xs font-mono text-[var(--ink-soft)] mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreateTaskModal(new Date().toISOString().split('T')[0])}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[var(--accent)] text-white text-xs font-mono font-medium hover:bg-[var(--accent-hover)] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* 1. Overdue Section */}
      {overdueTasks.length > 0 && (
        <section className="space-y-3 p-4 rounded-lg border-2 border-[var(--urgent)]/40 bg-[var(--urgent-soft)]/30">
          <div className="flex items-center gap-2 text-[var(--urgent)] font-mono text-xs font-semibold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Overdue ({overdueTasks.length})</span>
          </div>
          <div className="space-y-2">
            {overdueTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Today's Tasks Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
          <h2 className="text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider font-semibold">
            Tasks Due Today ({todayTasks.filter(t => !t.completed).length} pending)
          </h2>
        </div>

        {todayTasks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg border border-[var(--border)] space-y-2">
            <Calendar className="w-8 h-8 text-[var(--ink-soft)]/40 mx-auto" />
            <p className="text-sm font-medium text-[var(--ink)]">No tasks scheduled for today.</p>
            <p className="text-xs text-[var(--ink-soft)] font-mono">
              Capture items in your Inbox or plan ahead in the Upcoming view.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Habits Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
          <h2 className="text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider font-semibold">
            Daily Habits ({habits.length})
          </h2>
        </div>

        {habits.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-lg border border-[var(--border)] space-y-1">
            <Sparkles className="w-6 h-6 text-[var(--ink-soft)]/40 mx-auto" />
            <p className="text-xs text-[var(--ink-soft)] font-mono">
              No habits created yet. Build routines in the Habits view.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {habits.map(habit => (
              <HabitRow key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
