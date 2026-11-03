import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTaskStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-card font-mono text-xs transition-all ${
            toast.type === 'error'
              ? 'bg-[var(--urgent-soft)] border-[var(--urgent)]/30 text-[var(--urgent)]'
              : toast.type === 'success'
              ? 'bg-[var(--low-soft)] border-[var(--low)]/30 text-[var(--low)]'
              : 'bg-[var(--surface)] border-[var(--border)] text-[var(--ink)]'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0 text-[var(--accent)]" />}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded hover:bg-black/5 transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      ))}
    </div>
  );
};
