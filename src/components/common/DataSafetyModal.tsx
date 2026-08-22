import React, { useRef, useState, useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { BackupSnapshot } from '../../db/database';
import { X, Download, Upload, ShieldCheck, History, AlertTriangle, Database } from 'lucide-react';

export const DataSafetyModal: React.FC = () => {
  const {
    isBackupModalOpen,
    closeBackupModal,
    exportData,
    importData,
    getAutoBackups,
    restoreAutoBackup,
  } = useTaskStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [autoBackups, setAutoBackups] = useState<BackupSnapshot[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);

  const fetchBackups = async () => {
    setLoadingBackups(true);
    const backups = await getAutoBackups();
    setAutoBackups(backups);
    setLoadingBackups(false);
  };

  useEffect(() => {
    if (isBackupModalOpen) {
      fetchBackups();
    }
  }, [isBackupModalOpen]);

  if (!isBackupModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        if (text) {
          const success = await importData(text);
          if (success) {
            closeBackupModal();
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRestoreSnapshot = async (id: string) => {
    if (confirm('Restore database from this auto-backup snapshot? Current items will be updated.')) {
      const success = await restoreAutoBackup(id);
      if (success) {
        closeBackupModal();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col font-sans overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-[var(--ink)]">
                Data Safety & Backups
              </h2>
              <p className="text-xs font-mono text-[var(--ink-soft)]">
                Export, import, and local snapshot recovery
              </p>
            </div>
          </div>
          <button
            onClick={closeBackupModal}
            className="p-2 rounded-full text-[var(--ink-soft)] hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Storage Origin Safety Notice */}
          <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-xs space-y-1.5 font-mono">
            <div className="flex items-center gap-2 font-bold text-[var(--ink)]">
              <Database className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <span>Browser Storage Security Notice</span>
            </div>
            <p className="text-[var(--ink-soft)] leading-relaxed">
              Taskly stores all data in IndexedDB bound strictly to your web application domain (origin). 
              Exporting a backup JSON ensures your data can be moved or restored anytime across devices or domain changes.
            </p>
          </div>

          {/* Manual Export / Import Buttons */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink-soft)]">
              Manual JSON Backup
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={exportData}
                className="flex items-center justify-center gap-2.5 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono font-semibold text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-97 transition-all shadow-hairline"
              >
                <Download className="w-4 h-4 text-[var(--accent)]" />
                <span>Export Data (.JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2.5 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono font-semibold text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-97 transition-all shadow-hairline"
              >
                <Upload className="w-4 h-4 text-[var(--accent)]" />
                <span>Import Data (.JSON)</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Automatic Local Backups */}
          <div className="space-y-3 pt-2 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ink-soft)] flex items-center gap-1.5">
                <History className="w-4 h-4 text-[var(--accent)]" />
                <span>Automatic Snapshots (Last 5 Writes)</span>
              </h3>
            </div>

            {loadingBackups ? (
              <p className="text-xs font-mono text-[var(--ink-soft)] italic">Loading snapshots...</p>
            ) : autoBackups.length === 0 ? (
              <p className="text-xs font-mono text-[var(--ink-soft)] italic">No auto-backup snapshots yet.</p>
            ) : (
              <div className="space-y-2">
                {autoBackups.map(snap => {
                  let itemCount = 0;
                  try {
                    const parsed = JSON.parse(snap.data);
                    itemCount = (parsed.tasks?.length || 0) + (parsed.habits?.length || 0);
                  } catch (e) {}

                  return (
                    <div
                      key={snap.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono"
                    >
                      <div>
                        <p className="font-semibold text-[var(--ink)]">
                          {new Date(snap.timestamp).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-[var(--ink-soft)]">
                          {itemCount} total items stored
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRestoreSnapshot(snap.id)}
                        className="px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all active:scale-95 text-[11px] font-semibold"
                      >
                        Restore
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
