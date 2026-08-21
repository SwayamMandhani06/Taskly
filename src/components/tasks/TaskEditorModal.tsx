import React, { useState, useEffect, useRef } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { PriorityLevel, RecurringInterval, Subtask } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { SubtaskBuilder } from './SubtaskBuilder';
import { getTodayString, getTomorrowString, getNextWeekString } from '../../utils/dateHelpers';
import { getCategoryColor } from '../../utils/categoryColors';
import { X, Calendar, Clock, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

export const TaskEditorModal: React.FC = () => {
  const {
    isEditorOpen,
    editingTaskId,
    editorInitialDate,
    closeTaskModal,
    tasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTaskStore();

  const titleInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState<string | undefined>('');
  const [dueTime, setDueTime] = useState<string | undefined>('');
  const [category, setCategory] = useState('');
  const [estimateMinutes, setEstimateMinutes] = useState<number | undefined>(undefined);
  const [recurring, setRecurring] = useState<RecurringInterval>('none');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const existingCategories = Array.from(
    new Set(tasks.map(t => t.category).filter(Boolean) as string[])
  );

  useEffect(() => {
    if (isEditorOpen) {
      if (editingTaskId) {
        const existing = tasks.find(t => t.id === editingTaskId);
        if (existing) {
          setTitle(existing.title);
          setNotes(existing.notes || '');
          setShowNotes(Boolean(existing.notes));
          setPriority(existing.priority);
          setDueDate(existing.dueDate || '');
          setDueTime(existing.dueTime || '');
          setCategory(existing.category || '');
          setEstimateMinutes(existing.estimateMinutes);
          setRecurring(existing.recurring);
          setSubtasks(existing.subtasks || []);
        }
      } else {
        setTitle('');
        setNotes('');
        setShowNotes(false);
        setPriority('medium');
        setDueDate(editorInitialDate || '');
        setDueTime('');
        setCategory('');
        setEstimateMinutes(undefined);
        setRecurring('none');
        setSubtasks([]);
      }
      setConfirmDelete(false);

      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isEditorOpen, editingTaskId, editorInitialDate, tasks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditorOpen) {
        closeTaskModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditorOpen, closeTaskModal]);

  if (!isEditorOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      notes: notes.trim() || undefined,
      priority,
      dueDate: dueDate ? dueDate : undefined,
      dueTime: dueDate && dueTime ? dueTime : undefined,
      category: category.trim() || undefined,
      estimateMinutes: estimateMinutes ? Number(estimateMinutes) : undefined,
      recurring,
      subtasks,
    };

    if (editingTaskId) {
      updateTask(editingTaskId, payload);
    } else {
      addTask(payload);
    }

    closeTaskModal();
  };

  const handleDelete = () => {
    if (editingTaskId) {
      if (!confirmDelete) {
        setConfirmDelete(true);
        return;
      }
      deleteTask(editingTaskId);
      closeTaskModal();
    }
  };

  const categoryColor = getCategoryColor(category);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-xl bg-[var(--surface)] h-full shadow-2xl flex flex-col border-l border-[var(--border)] animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
          <h2 id="modal-title" className="text-base font-bold font-sans tracking-tight text-[var(--ink)]">
            {editingTaskId ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            type="button"
            onClick={closeTaskModal}
            className="p-2 rounded-full text-[var(--ink-soft)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--ink)] transition-all active:scale-95"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Title */}
          <div>
            <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
              Title *
            </label>
            <input
              ref={titleInputRef}
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-sm font-medium text-[var(--ink)] placeholder-[var(--ink-soft)]/60 focus:bg-[var(--surface)] focus:border-[var(--accent)] transition-colors"
            />
          </div>

          {/* 2. Notes */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider">
                Notes
              </label>
              <button
                type="button"
                onClick={() => setShowNotes(!showNotes)}
                className="text-xs font-mono text-[var(--accent)] flex items-center gap-1 hover:underline"
              >
                {showNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showNotes ? 'Hide' : 'Add Notes'}</span>
              </button>
            </div>
            {showNotes && (
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Context, links, details..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-sm text-[var(--ink)] focus:bg-[var(--surface)] focus:border-[var(--accent)] resize-y transition-colors"
              />
            )}
          </div>

          {/* 3. Priority */}
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

          {/* 4. Due Date & Time */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider">
              Due Date & Time
            </label>
            
            {/* Quick date chips */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setDueDate(getTodayString())}
                className={`px-3 py-1 rounded-full border transition-all active:scale-95 ${
                  dueDate === getTodayString()
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm font-semibold'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDueDate(getTomorrowString())}
                className={`px-3 py-1 rounded-full border transition-all active:scale-95 ${
                  dueDate === getTomorrowString()
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm font-semibold'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setDueDate(getNextWeekString())}
                className={`px-3 py-1 rounded-full border transition-all active:scale-95 ${
                  dueDate === getNextWeekString()
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm font-semibold'
                    : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                Next Week
              </button>
              {dueDate && (
                <button
                  type="button"
                  onClick={() => {
                    setDueDate('');
                    setDueTime('');
                  }}
                  className="px-3 py-1 rounded-full border border-[var(--border)] text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--urgent)] transition-all active:scale-95"
                >
                  Clear Date
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-[var(--ink-soft)]" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-[var(--border)] text-xs font-mono bg-[var(--surface-2)] text-[var(--ink)] focus:bg-[var(--surface)]"
                />
              </div>

              {dueDate ? (
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-3 text-[var(--ink-soft)]" />
                  <input
                    type="time"
                    value={dueTime}
                    onChange={e => setDueTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-[var(--border)] text-xs font-mono bg-[var(--surface-2)] text-[var(--ink)] focus:bg-[var(--surface)]"
                  />
                </div>
              ) : (
                <div className="flex items-center px-3.5 py-2.5 text-xs font-mono text-[var(--ink-soft)]/50 italic bg-[var(--surface-2)] rounded-2xl border border-[var(--border)]">
                  Pick date first for time
                </div>
              )}
            </div>
          </div>

          {/* 5. Category */}
          <div>
            <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="relative">
              <div className="flex items-center">
                {category.trim() && (
                  <span
                    className="w-2.5 h-2.5 rounded-full absolute left-3.5 shrink-0"
                    style={{ backgroundColor: categoryColor.dot }}
                  />
                )}
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  list="category-suggestions"
                  placeholder="e.g. Work, Personal, Health..."
                  className={`w-full py-2.5 pr-4 rounded-2xl border border-[var(--border)] text-xs font-mono bg-[var(--surface-2)] text-[var(--ink)] focus:bg-[var(--surface)] ${
                    category.trim() ? 'pl-9' : 'px-4'
                  }`}
                />
                <datalist id="category-suggestions">
                  {existingCategories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* 6. Time Estimate */}
          <div>
            <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-1.5">
              Estimate (Minutes)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="999"
                value={estimateMinutes || ''}
                onChange={e => setEstimateMinutes(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 30"
                className="w-28 px-3.5 py-2 rounded-2xl border border-[var(--border)] text-xs font-mono text-[var(--ink)] bg-[var(--surface-2)] focus:bg-[var(--surface)]"
              />
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {[15, 30, 45, 60, 90, 120].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setEstimateMinutes(mins)}
                    className={`px-3 py-1 rounded-full border transition-all active:scale-95 ${
                      estimateMinutes === mins
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm font-semibold'
                        : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Recurring */}
          <div>
            <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider mb-2">
              Recurring Schedule
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[var(--surface-2)] rounded-full border border-[var(--border)] text-xs font-mono">
              {(['none', 'daily', 'weekly', 'monthly'] as RecurringInterval[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRecurring(r)}
                  className={`py-1.5 rounded-full text-center transition-all duration-150 capitalize ${
                    recurring === r
                      ? 'bg-[var(--surface)] text-[var(--ink)] shadow-xs font-semibold'
                      : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* 8. Subtasks */}
          <SubtaskBuilder subtasks={subtasks} onChange={setSubtasks} />

          {/* Submit & Footer Actions */}
          <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between">
            {editingTaskId ? (
              <button
                type="button"
                onClick={handleDelete}
                className={`text-xs font-mono transition-all duration-150 flex items-center gap-1.5 px-4 py-2 rounded-full active:scale-95 ${
                  confirmDelete
                    ? 'bg-[var(--urgent-soft)] text-[var(--urgent)] font-semibold'
                    : 'text-[var(--urgent)] hover:bg-[var(--urgent-soft)]'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>{confirmDelete ? 'Click to Confirm Delete' : 'Delete Task'}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeTaskModal}
                className="px-5 py-2.5 text-xs font-mono rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-mono font-medium rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-glow transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Save Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
