import React from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { SegmentedProgressBar } from '../components/common/SegmentedProgressBar';
import { isTaskOverdue, isTaskDueToday, getTodayString } from '../utils/dateHelpers';
import { calculateHabitStreak } from '../utils/streakCalculator';
import { CheckSquare, Square, Circle, CheckCircle2, ListTodo } from 'lucide-react';
import { PriorityLevel } from '../types';

interface UnifiedPlanItem {
  id: string;
  type: 'task' | 'habit';
  title: string;
  priority: PriorityLevel;
  estimateMinutes?: number;
  completed: boolean;
  isOverdue?: boolean;
  streak?: number;
}

export const PlanMyDayView: React.FC = () => {
  const { tasks, habits, habitLogs, toggleTaskComplete, toggleHabitToday, setActiveView } = useTaskStore();
  const todayStr = getTodayString();

  const planItems: UnifiedPlanItem[] = [];

  tasks.forEach(t => {
    const overdue = isTaskOverdue(t.dueDate) && !t.completed;
    const dueToday = isTaskDueToday(t.dueDate);

    if (overdue || dueToday) {
      planItems.push({
        id: t.id,
        type: 'task',
        title: t.title,
        priority: t.priority,
        estimateMinutes: t.estimateMinutes,
        completed: t.completed,
        isOverdue: overdue,
      });
    }
  });

  habits.forEach(h => {
    const { currentStreak, completedToday } = calculateHabitStreak(h.id, habitLogs);
    planItems.push({
      id: h.id,
      type: 'habit',
      title: h.title,
      priority: h.priority,
      estimateMinutes: h.estimateMinutes,
      completed: completedToday,
      streak: currentStreak,
    });
  });

  const priorityWeight: Record<PriorityLevel, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
  planItems.sort((a, b) => {
    const diff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (diff !== 0) return diff;
    return (b.estimateMinutes || 0) - (a.estimateMinutes || 0);
  });

  const totalItems = planItems.length;
  const completedItems = planItems.filter(i => i.completed).length;

  const getPriorityDotColor = (p: PriorityLevel) => {
    switch (p) {
      case 'urgent': return 'bg-[var(--urgent)] shadow-[0_0_8px_0_var(--urgent)]';
      case 'high': return 'bg-[var(--high)]';
      case 'medium': return 'bg-[var(--medium)]';
      case 'low': return 'bg-[var(--low)]';
    }
  };

  const formatEstimate = (mins?: number) => {
    if (!mins) return '—';
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const rem = mins % 60;
      return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 max-w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sans text-[var(--ink)]">Plan My Day</h1>
        <p className="text-xs font-mono text-[var(--ink-soft)] mt-1">
          Unified agenda — work through your high priority items & habits
        </p>
      </div>

      {totalItems > 0 && (
        <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-2xl border border-[var(--border)] shadow-card space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-semibold text-[var(--ink)]">Daily Progress Tally</span>
            <span className="text-[var(--accent)] font-bold">
              {completedItems} / {totalItems} completed ({totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0}%)
            </span>
          </div>
          <SegmentedProgressBar total={totalItems} completed={completedItems} />
        </div>
      )}

      {/* Schedule Table */}
      {totalItems === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-card space-y-3">
          <ListTodo className="w-10 h-10 text-[var(--ink-soft)]/40 mx-auto" />
          <p className="text-sm font-medium text-[var(--ink)]">Your plan for today is empty.</p>
          <p className="text-xs text-[var(--ink-soft)] font-mono max-w-sm mx-auto">
            Schedule tasks for today or add habits to build your daily agenda.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveView('today')}
              className="px-4 py-2 rounded-full text-xs font-mono bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all active:scale-95"
            >
              Go to Today
            </button>
            <button
              type="button"
              onClick={() => setActiveView('inbox')}
              className="px-4 py-2 rounded-full text-xs font-mono border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--surface-2)] transition-all active:scale-95"
            >
              Check Inbox
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-card">
          {/* Table Header */}
          <div className="grid grid-cols-[28px_1fr_60px_40px] sm:grid-cols-[40px_1fr_90px_60px] items-center px-3 sm:px-5 py-3 bg-[var(--surface-2)] border-b border-[var(--border)] text-[11px] font-mono text-[var(--ink-soft)] uppercase tracking-wider">
            <div className="text-center">Pri</div>
            <div>Item Title & Type</div>
            <div className="text-right">Estimate</div>
            <div className="text-center">Done</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[var(--border)]">
            {planItems.map(item => {
              const handleToggle = () => {
                if (item.type === 'task') {
                  toggleTaskComplete(item.id);
                } else {
                  toggleHabitToday(item.id, todayStr);
                }
              };

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className={`grid grid-cols-[28px_1fr_60px_40px] sm:grid-cols-[40px_1fr_90px_60px] items-center px-3 sm:px-5 py-3.5 hover:bg-[var(--surface-2)]/50 transition-colors duration-150 ${
                    item.completed ? 'bg-[var(--surface-2)]/30' : ''
                  }`}
                >
                  {/* Col 1: Priority Dot */}
                  <div className="flex justify-center">
                    <span
                      className={`w-3.5 h-3.5 rounded-full ${getPriorityDotColor(item.priority)} ${
                        item.isOverdue ? 'ring-2 ring-[var(--urgent)]/50' : ''
                      }`}
                      title={`Priority ${item.priority}${item.isOverdue ? ' (Overdue)' : ''}`}
                    />
                  </div>

                  {/* Col 2: Title */}
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-xs sm:text-sm font-medium font-sans leading-snug truncate sm:whitespace-normal ${
                          item.completed ? 'line-through text-[var(--ink-soft)]' : 'text-[var(--ink)]'
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.type === 'habit' && (
                        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shrink-0">
                          Habit
                        </span>
                      )}
                      {item.isOverdue && (
                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono rounded-full bg-[var(--urgent-soft)] text-[var(--urgent)] font-semibold shrink-0">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Col 3: Time estimate in monospace */}
                  <div className="text-right font-mono text-[11px] sm:text-xs text-[var(--ink-soft)] font-medium">
                    {formatEstimate(item.estimateMinutes)}
                  </div>

                  {/* Col 4: Inline Checkbox */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="p-1 rounded-lg text-[var(--ink-soft)] hover:text-[var(--accent)] transition-all duration-150 active:scale-90"
                      aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {item.type === 'task' ? (
                        item.completed ? (
                          <CheckSquare className="w-5 h-5 text-[var(--accent)]" />
                        ) : (
                          <Square className="w-5 h-5 text-[var(--ink-soft)]" />
                        )
                      ) : item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[var(--accent)] fill-[var(--accent)]/10" />
                      ) : (
                        <Circle className="w-5 h-5 text-[var(--ink-soft)]" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
