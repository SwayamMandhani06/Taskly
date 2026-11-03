import React, { useState, useEffect } from 'react';
import { Subtask } from '../../types';
import { Plus, Trash2, Check, Square, CheckSquare } from 'lucide-react';

interface SubtaskBuilderProps {
  subtasks: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
}

export const SubtaskBuilder: React.FC<SubtaskBuilderProps> = ({ subtasks, onChange }) => {
  const [newText, setNewText] = useState('');

  const handleAdd = () => {
    if (!newText.trim()) return;
    const newItem: Subtask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      text: newText.trim(),
      done: false,
    };
    onChange([...subtasks, newItem]);
    setNewText('');
  };

  const handleToggle = (id: string) => {
    onChange(subtasks.map(st => (st.id === id ? { ...st, done: !st.done } : st)));
  };

  const handleUpdateText = (id: string, text: string) => {
    onChange(subtasks.map(st => (st.id === id ? { ...st, text } : st)));
  };

  const handleDelete = (id: string) => {
    onChange(subtasks.filter(st => st.id !== id));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-[var(--ink-soft)] uppercase tracking-wider">
        Subtasks ({subtasks.filter(s => s.done).length}/{subtasks.length})
      </label>

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {subtasks.map(st => (
          <div key={st.id} className="flex items-center gap-2 group p-1.5 rounded hover:bg-[var(--surface-2)]">
            <button
              type="button"
              onClick={() => handleToggle(st.id)}
              className="text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors"
            >
              {st.done ? (
                <CheckSquare className="w-4 h-4 text-[var(--accent)]" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={st.text}
              onChange={e => handleUpdateText(st.id, e.target.value)}
              className={`flex-1 text-xs bg-transparent border-b border-transparent focus:border-[var(--border)] focus:outline-none ${
                st.done ? 'line-through text-[var(--ink-soft)]' : 'text-[var(--ink)]'
              }`}
            />

            <button
              type="button"
              onClick={() => handleDelete(st.id)}
              className="text-[var(--ink-soft)] hover:text-[var(--urgent)] p-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              aria-label="Delete subtask"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Add subtask..."
          className="flex-1 text-xs px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink)] focus:bg-[var(--surface)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--bg)] disabled:opacity-40"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
