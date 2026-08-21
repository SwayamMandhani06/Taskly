import React from 'react';
import { Task } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { PriorityBar } from '../common/PriorityBar';
import { CategoryChip } from '../common/CategoryChip';
import { MonospaceTag } from '../common/MonospaceTag';
import { formatDueDateDisplay, isTaskOverdue } from '../../utils/dateHelpers';
import { CheckSquare, Square, Repeat, FileText, CheckCircle2, Clock } from 'lucide-react';

interface TaskRowProps {
  task: Task;
  showInlineTriage?: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, showInlineTriage = false }) => {
  const { toggleTaskComplete, openEditTaskModal, updateTask } = useTaskStore();

  const isOverdue = isTaskOverdue(task.dueDate) && !task.completed;
  const completedSubtasks = task.subtasks.filter(s => s.done).length;
  const totalSubtasks = task.subtasks.length;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskComplete(task.id);
  };

  const handleRowClick = () => {
    openEditTaskModal(task.id);
  };

  const handleInlineDateChange = (e: React.MouseEvent, dateStr: string) => {
    e.stopPropagation();
    updateTask(task.id, { dueDate: dateStr });
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
      aria-label={`Task ${task.title}, priority ${task.priority}${task.completed ? ', completed' : ''}`}
      className={`group relative flex items-center gap-3 p-3.5 rounded-lg border transition-all cursor-pointer bg-white hover:border-[var(--accent)] hover:shadow-hairline ${
        task.completed ? 'opacity-60 bg-[var(--surface-2)]/60 border-[var(--border)]' : 'border-[var(--border)]'
      }`}
    >
      {/* Signature vertical priority color bar */}
      <PriorityBar priority={task.priority} className="shrink-0" />

      {/* Checkbox button */}
      <button
        type="button"
        onClick={handleCheckboxClick}
        aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
        className="p-1 rounded text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors shrink-0"
      >
        {task.completed ? (
          <CheckSquare className="w-5 h-5 text-[var(--accent)]" />
        ) : (
          <Square className="w-5 h-5 text-[var(--ink-soft)]" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-medium leading-snug break-words ${
              task.completed ? 'line-through text-[var(--ink-soft)]' : 'text-[var(--ink)]'
            }`}
          >
            {task.title}
          </span>
          <CategoryChip category={task.category} />
        </div>

        {/* Details row: due date, subtasks count, estimate, recurring */}
        <div className="flex items-center gap-3 flex-wrap text-xs text-[var(--ink-soft)]">
          {task.dueDate && (
            <MonospaceTag variant={isOverdue ? 'urgent' : 'default'} icon={<Clock className="w-3 h-3" />}>
              {formatDueDateDisplay(task.dueDate, task.dueTime)}
            </MonospaceTag>
          )}

          {totalSubtasks > 0 && (
            <MonospaceTag icon={<CheckCircle2 className="w-3 h-3 text-[var(--ink-soft)]" />}>
              {completedSubtasks}/{totalSubtasks}
            </MonospaceTag>
          )}

          {task.estimateMinutes && (
            <MonospaceTag>{task.estimateMinutes}m</MonospaceTag>
          )}

          {task.recurring !== 'none' && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--accent)] capitalize">
              <Repeat className="w-3 h-3" />
              <span>{task.recurring}</span>
            </span>
          )}

          {task.notes && (
            <span title="Has notes" className="inline-flex items-center">
              <FileText className="w-3 h-3 text-[var(--ink-soft)] opacity-70" />
            </span>
          )}
        </div>
      </div>

      {/* Inline Triage Actions for Inbox View */}
      {showInlineTriage && !task.completed && (
        <div
          onClick={e => e.stopPropagation()}
          className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <button
            type="button"
            onClick={e => handleInlineDateChange(e, new Date().toISOString().split('T')[0])}
            className="px-2 py-1 text-[11px] font-mono rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={e => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              handleInlineDateChange(e, tomorrow.toISOString().split('T')[0]);
            }}
            className="px-2 py-1 text-[11px] font-mono rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            Tomorrow
          </button>
        </div>
      )}
    </div>
  );
};
