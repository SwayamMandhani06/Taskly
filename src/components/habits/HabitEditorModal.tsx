import React, { useState, useEffect, useRef } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { PriorityLevel } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { getCategoryColor } from '../../utils/categoryColors';
import { X, Trash2 } from 'lucide-react';

export const HabitEditorModal: React.FC = () => {
  const {
    isHabitEditorOpen,
    editingHabitId,
    closeHabitModal,
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    tasks,
  } = useTaskStore();

  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [estimateMinutes, setEstimateMinutes] = useState<number | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const existingCategories = Array.from(
    new Set([...habits.map(h => h.category), ...tasks.map(t => t.category)].filter(Boolean) as string[])
  );

  useEffect(() => {
    if (isHabitEditorOpen) {
      if (editingHabitId) {
        const existing = habits.find(h => h.id === editingHabitId);
        if (existing) {
          setTitle(existing.title);
          setCategory(existing.category || '');
          setPriority(existing.priority);
          setEstimateMinutes(existing.estimateMinutes);
        }
      } else {
        setTitle('');
        setCategory('');
        setPriority('medium');
        setEstimateMinutes(undefined);
      }
      setConfirmDelete(false);

      setTimeout(() => {
        titleRef.current?.focus();
      }, 50);
    }
  }, [isHabitEditorOpen, editingHabitId, habits]);

  if (!isHabitEditorOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      category: category.trim() || undefined,
      priority,
      estimateMinutes: estimateMinutes ? Number(estimateMinutes) : undefined,
    };

    if (editingHabitId) {
      updateHabit(editingHabitId, payload);
    } else {
      addHabit(payload);
    }

    closeHabitModal();
  };

  const handleDelete = () => {
    if (editingHabitId) {
      if (!confirmDelete) {
        setConfirmDelete(true);
        return;
      }
      deleteHabit(editingHabitId);
      closeHabitModal();
    }
  };

  const categoryColor = getCategoryColor(category);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-lg bg-[var(--surface)] h-full shadow-2xl flex flex-col border-l border-[var(--border)] animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-labelledby="habit-modal-title"
      >
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
          <h2 id="habit-modal-title" className="text-base font-semibold font-display text-[var(--ink)]">
            {editingHabitId ? 'Edit Habit' : 'New Habit'}
          </h2>
          <button
            type="button"
            onClick={closeHabitModal}
            className="p-1 rounded-md text-[var(--ink-soft)] hover:bg-black/5 hover:text-[var(--ink)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1">
              Habit Name *
            </label>
            <input
              ref={titleRef}
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Daily Meditation, Read 20 pages..."
              className="w-full px-3.5 py-2.5 rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-sm font-medium text-[var(--ink)] focus:bg-[var(--surface)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-2">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'urgent'] as PriorityLevel[]).map(p => (
                <PriorityBadge
                  key={p}
                  priority={p}
                  selected={priority === p}
                  onClick={() => setPriority(p)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1">
              Category
            </label>
            <div className="relative">
              <div className="flex items-center">
                {category.trim() && (
                  <span
                    className="w-2.5 h-2.5 rounded-full absolute left-3 shrink-0"
                    style={{ backgroundColor: categoryColor.dot }}
                  />
                )}
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  list="habit-category-suggestions"
                  placeholder="e.g. Health, Mindfulness, Learning..."
                  className={`w-full py-2 pr-3 rounded-md border border-[var(--border)] text-xs font-mono bg-[var(--surface-2)] text-[var(--ink)] focus:bg-[var(--surface)] ${
                    category.trim() ? 'pl-8' : 'px-3'
                  }`}
                />
                <datalist id="habit-category-suggestions">
                  {existingCategories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
              Time Estimate (Minutes)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="999"
                value={estimateMinutes || ''}
                onChange={e => setEstimateMinutes(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 15"
                className="w-28 px-3 py-1.5 rounded-md border border-[var(--border)] text-xs font-mono text-[var(--ink)] bg-[var(--surface-2)] focus:bg-[var(--surface)]"
              />
              <div className="flex flex-wrap gap-1 text-xs font-mono">
                {[10, 15, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setEstimateMinutes(mins)}
                    className={`px-2 py-1 rounded border transition-colors ${
                      estimateMinutes === mins
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Submit & Footer Actions */}
        <div className="sticky bottom-0 bg-[var(--surface)] px-6 py-4 border-t border-[var(--border)] flex items-center justify-between shadow-panel z-20 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {editingHabitId ? (
            <button
              type="button"
              onClick={handleDelete}
              className={`text-xs font-mono transition-colors flex items-center gap-1.5 px-3 py-2 rounded-full ${
                confirmDelete
                  ? 'bg-[var(--urgent-soft)] text-[var(--urgent)] font-semibold'
                  : 'text-[var(--urgent)] hover:bg-[var(--urgent-soft)]'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{confirmDelete ? 'Confirm' : 'Delete'}</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeHabitModal}
              className="px-4 py-2 text-xs font-mono rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-mono font-medium rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors shadow-glow"
            >
              Save Habit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
