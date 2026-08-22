import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Lock, Delete, ShieldAlert, RefreshCw } from 'lucide-react';

export const AppLockScreen: React.FC = () => {
  const { unlockApp } = useTaskStore();

  const [enteredPin, setEnteredPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);

  const handleDigitClick = (digit: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setErrorShake(false);

      if (nextPin.length === 4) {
        setTimeout(() => {
          const success = unlockApp(nextPin);
          if (!success) {
            setErrorShake(true);
            setTimeout(() => {
              setEnteredPin('');
            }, 400);
          }
        }, 150);
      }
    }
  };

  const handleClear = () => {
    setEnteredPin('');
    setErrorShake(false);
  };

  const handleDelete = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorShake(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg)] flex items-center justify-center p-4 selection:bg-none select-none">
      <div className="w-full max-w-sm bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)] shadow-2xl text-center space-y-6">
        {/* Header Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold font-sans text-[var(--ink)] tracking-tight">
            Taskly Locked
          </h2>
          <p className="text-xs font-mono text-[var(--ink-soft)] mt-1">
            Enter 4-digit PIN code to unlock Taskly
          </p>
        </div>

        {/* PIN Dots Indicator */}
        <div
          className={`flex items-center justify-center gap-4 py-2 transition-transform duration-200 ${
            errorShake ? 'animate-bounce text-[var(--urgent)]' : ''
          }`}
        >
          {Array.from({ length: 4 }).map((_, idx) => {
            const isFilled = idx < enteredPin.length;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                  isFilled
                    ? 'bg-[var(--accent)] border-[var(--accent)] scale-110 shadow-glow'
                    : 'border-[var(--border)] bg-[var(--surface-2)]'
                } ${errorShake ? 'border-[var(--urgent)] bg-[var(--urgent-soft)]' : ''}`}
              />
            );
          })}
        </div>

        {errorShake && (
          <p className="text-xs font-mono text-[var(--urgent)] font-semibold flex items-center justify-center gap-1 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Incorrect PIN code</span>
          </p>
        )}

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigitClick(num)}
              className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-lg font-mono font-bold text-[var(--ink)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] active:scale-95 transition-all duration-150 shadow-hairline flex items-center justify-center mx-auto"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            disabled={enteredPin.length === 0}
            className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)] disabled:opacity-30 active:scale-95 transition-all flex items-center justify-center mx-auto"
            title="Clear"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDigitClick('0')}
            className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-lg font-mono font-bold text-[var(--ink)] hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] active:scale-95 transition-all duration-150 shadow-hairline flex items-center justify-center mx-auto"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={enteredPin.length === 0}
            className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--ink-soft)] hover:text-[var(--urgent)] disabled:opacity-30 active:scale-95 transition-all flex items-center justify-center mx-auto"
            title="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
