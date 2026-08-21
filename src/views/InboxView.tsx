import React, { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskRow } from '../components/tasks/TaskRow';
import { Inbox, CornerDownLeft } from 'lucide-react';

export const InboxView: React.FC = () => {
  const { tasks, addTask } = useTaskStore();
  const [quickTitle, setQuickTitle] = useState('');

  const inboxTasks = tasks.filter(t => !t.dueDate && !t.completed);
  const completedInboxTasks = tasks.filter(t => !t.dueDate && t.completed);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addTask({
      title: quickTitle.trim(),
      priority: 'medium',
      subtasks: [],
      recurring: 'none',
    });

    setQuickTitle('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sans text-[var(--ink)]">Inbox</h1>
        <p className="text-xs font-mono text-[var(--ink-soft)] mt-1">
          Unsorted capture bin — process and triage items into dates
        </p>
      </div>

      {/* Fast Capture Quick Add Banner */}
      <form onSubmit={handleQuickAdd} className="relative flex items-center">
        <input
          type="text"
          value={quickTitle}
          onChange={e => setQuickTitle(e.target.value)}
          placeholder="Quick capture task... (press Enter)"
          className="w-full pl-5 pr-28 py-3.5 rounded-full border-2 border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--ink)] placeholder-[var(--ink-soft)]/60 focus:border-[var(--accent)] focus:outline-none shadow-card transition-all duration-150"
        />
        <div className="absolute right-3 flex items-center gap-1">
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--accent)] text-white text-xs font-mono disabled:opacity-40 hover:bg-[var(--accent-hover)] transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] shadow-glow"
          >
            <span>Add</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Pending Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
          <h2 className="text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider font-semibold">
            Unscheduled Items ({inboxTasks.length})
          </h2>
        </div>

        {inboxTasks.length === 0 ? (
          <div className="p-12 text-center bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-card space-y-2">
            <Inbox className="w-10 h-10 text-[var(--ink-soft)]/40 mx-auto" />
            <p className="text-sm font-medium text-[var(--ink)] font-sans">Inbox Zero!</p>
            <p className="text-xs text-[var(--ink-soft)] font-mono">
              All tasks have been scheduled or completed. Type above to quickly capture new ideas.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {inboxTasks.map(task => (
              <TaskRow key={task.id} task={task} showInlineTriage={true} />
            ))}
          </div>
        )}
      </div>

      {/* Completed Inbox Items */}
      {completedInboxTasks.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-[var(--border)]">
          <h3 className="text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider font-semibold">
            Completed Items ({completedInboxTasks.length})
          </h3>
          <div className="space-y-2.5 opacity-75">
            {completedInboxTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
