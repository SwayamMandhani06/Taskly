import React, { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskRow } from '../components/tasks/TaskRow';
import { getCategoryColor } from '../utils/categoryColors';
import { Folder, Plus, ArrowLeft, CheckCircle2, ListTodo, Layers } from 'lucide-react';
import { PriorityLevel } from '../types';

export const CategoriesView: React.FC = () => {
  const { tasks, openCreateTaskModal } = useTaskStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories (including Uncategorized)
  const categoryNames = Array.from(
    new Set(tasks.map(t => (t.category?.trim() ? t.category.trim() : 'Uncategorized')))
  ).sort();

  // Category stats map
  const categoryStats = categoryNames.map(name => {
    const categoryTasks = tasks.filter(t => {
      if (name === 'Uncategorized') return !t.category || !t.category.trim();
      return t.category?.trim() === name;
    });

    const total = categoryTasks.length;
    const completed = categoryTasks.filter(t => t.completed).length;
    const pending = total - completed;
    const color = getCategoryColor(name === 'Uncategorized' ? '' : name);

    const priorityCounts: Record<PriorityLevel, number> = {
      urgent: categoryTasks.filter(t => t.priority === 'urgent' && !t.completed).length,
      high: categoryTasks.filter(t => t.priority === 'high' && !t.completed).length,
      medium: categoryTasks.filter(t => t.priority === 'medium' && !t.completed).length,
      low: categoryTasks.filter(t => t.priority === 'low' && !t.completed).length,
    };

    return {
      name,
      tasks: categoryTasks,
      total,
      completed,
      pending,
      color,
      priorityCounts,
    };
  });

  // Selected category view
  if (selectedCategory) {
    const activeGroup = categoryStats.find(g => g.name === selectedCategory);
    const categoryTasks = activeGroup ? activeGroup.tasks : [];

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="p-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--ink)] active:scale-95 transition-all"
              aria-label="Back to Categories"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-sans tracking-tight text-[var(--ink)]">
                  {selectedCategory}
                </h1>
                {activeGroup && (
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: activeGroup.color.dot }}
                  />
                )}
              </div>
              <p className="text-xs font-mono text-[var(--ink-soft)] mt-0.5">
                {activeGroup?.pending} pending · {activeGroup?.completed} completed
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openCreateTaskModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-medium hover:bg-[var(--accent-hover)] transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>

        {categoryTasks.length === 0 ? (
          <div className="p-12 text-center bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-card space-y-2">
            <Folder className="w-10 h-10 text-[var(--ink-soft)]/40 mx-auto" />
            <p className="text-sm font-medium text-[var(--ink)]">No tasks in this category.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {categoryTasks.map(task => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-sans text-[var(--ink)]">Categories</h1>
          <p className="text-xs font-mono text-[var(--ink-soft)] mt-1">
            Task distribution grouped by topic & project domain
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreateTaskModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-medium hover:bg-[var(--accent-hover)] transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Categories Grid */}
      {categoryStats.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-card space-y-2">
          <Layers className="w-10 h-10 text-[var(--ink-soft)]/40 mx-auto" />
          <p className="text-sm font-medium text-[var(--ink)]">No category items found.</p>
          <p className="text-xs text-[var(--ink-soft)] font-mono">
            Categorize your tasks when creating them to group your work.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map(cat => {
            const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;

            return (
              <div
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="group bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-card hover:border-[var(--accent)] hover:shadow-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color.dot }}
                      />
                      <h3 className="text-base font-bold font-sans text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-[var(--ink-soft)] bg-[var(--surface-2)] px-2.5 py-0.5 rounded-full border border-[var(--border)]">
                      {cat.total} tasks
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[var(--ink-soft)]">
                    <span>{cat.pending} pending</span>
                    <span>·</span>
                    <span>{cat.completed} completed</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[var(--ink-soft)]">Completion</span>
                    <span className="font-semibold text-[var(--ink)]">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)] transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
