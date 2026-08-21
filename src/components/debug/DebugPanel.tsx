import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { X, RefreshCw, Trash2 } from 'lucide-react';
import { db } from '../../db/database';

interface DebugPanelProps {
  onClose: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ onClose }) => {
  const { tasks, habits, habitLogs, loadData, addToast } = useTaskStore();

  const handleResetData = async () => {
    if (confirm('Clear IndexedDB and re-seed sample data?')) {
      await db.tasks.clear();
      await db.habits.clear();
      await db.habitLogs.clear();
      await loadData();
      addToast('info', 'Database reset and re-seeded.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-[var(--border)] shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-[var(--ink)]">
            <span>IndexedDB Store Debug Inspector</span>
            <span className="px-2 py-0.5 rounded bg-[var(--accent)] text-white text-[10px]">
              Dexie v4
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--ink-soft)] hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h4 className="font-bold text-[var(--accent)] mb-1">
              Tasks ({tasks.length})
            </h4>
            <pre className="bg-[var(--surface-2)] p-3 rounded border border-[var(--border)] overflow-x-auto max-h-48 text-[11px] text-[var(--ink)]">
              {JSON.stringify(tasks, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="font-bold text-[var(--accent)] mb-1">
              Habits ({habits.length})
            </h4>
            <pre className="bg-[var(--surface-2)] p-3 rounded border border-[var(--border)] overflow-x-auto max-h-40 text-[11px] text-[var(--ink)]">
              {JSON.stringify(habits, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="font-bold text-[var(--accent)] mb-1">
              Habit Completion Logs ({habitLogs.length})
            </h4>
            <pre className="bg-[var(--surface-2)] p-3 rounded border border-[var(--border)] overflow-x-auto max-h-40 text-[11px] text-[var(--ink)]">
              {JSON.stringify(habitLogs, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--urgent-soft)] text-[var(--urgent)] hover:bg-[var(--urgent)] hover:text-white transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset & Re-seed DB</span>
          </button>

          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--bg)] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Store</span>
          </button>
        </div>
      </div>
    </div>
  );
};
