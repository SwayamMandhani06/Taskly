import { create } from 'zustand';
import { db, BackupSnapshot } from '../db/database';
import { Task, Habit, HabitLogEntry, ViewMode, ToastMessage } from '../types';
import { getTodayString, calculateNextDueDate } from '../utils/dateHelpers';

export type ThemeMode = 'light' | 'dark';

interface TaskStore {
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLogEntry[];
  initialized: boolean;
  activeView: ViewMode;
  theme: ThemeMode;
  
  // Lock screen / PIN protection state
  isLocked: boolean;
  isLockEnabled: boolean;
  pinCode: string;

  // UI state
  isEditorOpen: boolean;
  editingTaskId: string | null;
  editorInitialDate?: string;

  isHabitEditorOpen: boolean;
  editingHabitId: string | null;

  isBackupModalOpen: boolean;

  toasts: ToastMessage[];

  // Database initialization & load
  loadData: () => Promise<void>;

  // Navigation & Theme
  setActiveView: (view: ViewMode) => void;
  toggleTheme: () => void;

  // App Lock actions
  unlockApp: (pin: string) => boolean;
  toggleLockEnabled: (enabled: boolean) => void;
  setPinCode: (newPin: string) => void;
  lockApp: () => void;

  // Task Actions
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;

  // Habit Actions
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitToday: (habitId: string, dateStr?: string) => Promise<void>;

  // UI modal actions
  openCreateTaskModal: (initialDate?: string) => void;
  openEditTaskModal: (taskId: string) => void;
  closeTaskModal: () => void;

  openCreateHabitModal: () => void;
  openEditHabitModal: (habitId: string) => void;
  closeHabitModal: () => void;

  openBackupModal: () => void;
  closeBackupModal: () => void;

  // Data Safety Net (Export, Import, Auto-Backup)
  exportData: () => void;
  importData: (jsonString: string) => Promise<boolean>;
  createAutoBackup: () => Promise<void>;
  getAutoBackups: () => Promise<BackupSnapshot[]>;
  restoreAutoBackup: (backupId: string) => Promise<boolean>;
  wipeDatabase: () => Promise<void>;

  // Toast notification system
  addToast: (type: 'info' | 'success' | 'error', message: string) => void;
  removeToast: (id: string) => void;
}

const getSavedTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('taskly-theme') as ThemeMode;
    if (saved && ['light', 'dark'].includes(saved)) {
      return saved;
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const applyThemeToDOM = (theme: ThemeMode) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const getSavedLockState = (): { isLockEnabled: boolean; pinCode: string } => {
  if (typeof window !== 'undefined') {
    const enabled = localStorage.getItem('taskly-lock-enabled');
    const pin = localStorage.getItem('taskly-pin');
    return {
      isLockEnabled: enabled !== null ? enabled === 'true' : true,
      pinCode: pin || '2506',
    };
  }
  return { isLockEnabled: true, pinCode: '2506' };
};

export const useTaskStore = create<TaskStore>((set, get) => {
  const initialLock = getSavedLockState();

  return {
    tasks: [],
    habits: [],
    habitLogs: [],
    initialized: false,
    activeView: 'today',
    theme: getSavedTheme(),
    
    isLocked: initialLock.isLockEnabled,
    isLockEnabled: initialLock.isLockEnabled,
    pinCode: initialLock.pinCode,

    isEditorOpen: false,
    editingTaskId: null,
    editorInitialDate: undefined,

    isHabitEditorOpen: false,
    editingHabitId: null,

    isBackupModalOpen: false,

    toasts: [],

    loadData: async () => {
      try {
        applyThemeToDOM(get().theme);

        let tasks = await db.tasks.toArray();
        let habits = await db.habits.toArray();
        let habitLogs = await db.habitLogs.toArray();

        // Seed initial data if database is empty
        if (tasks.length === 0 && habits.length === 0) {
          const today = getTodayString();
          
          const seedTasks: Task[] = [
            {
              id: 'task-1',
              title: 'Review quarterly goals & project milestones',
              notes: 'Check progress against annual metrics and re-align team priorities.',
              priority: 'urgent',
              dueDate: today,
              dueTime: '09:30',
              category: 'Work',
              subtasks: [
                { id: 'st-1', text: 'Audit completed deliverables', done: true },
                { id: 'st-2', text: 'Draft summary report', done: false },
              ],
              recurring: 'weekly',
              estimateMinutes: 45,
              completed: false,
              createdAt: Date.now() - 3600000,
            },
            {
              id: 'task-2',
              title: 'Read 2 chapters of System Design Interview',
              notes: 'Focus on distributed caching and load balancing strategies.',
              priority: 'high',
              dueDate: today,
              dueTime: '17:00',
              category: 'Learning',
              subtasks: [],
              recurring: 'daily',
              estimateMinutes: 60,
              completed: false,
              createdAt: Date.now() - 7200000,
            },
            {
              id: 'task-3',
              title: 'Schedule dentist checkup & hygiene appointment',
              priority: 'medium',
              category: 'Personal',
              subtasks: [],
              recurring: 'none',
              estimateMinutes: 15,
              completed: false,
              createdAt: Date.now() - 86400000,
            },
            {
              id: 'task-4',
              title: 'Refactor state persistence layer for offline mode',
              priority: 'urgent',
              dueDate: '2026-08-20',
              category: 'Development',
              subtasks: [
                { id: 'st-3', text: 'Configure Dexie schema', done: true },
                { id: 'st-4', text: 'Add sync handlers', done: false }
              ],
              recurring: 'none',
              estimateMinutes: 90,
              completed: false,
              createdAt: Date.now() - 172800000,
            }
          ];

          const seedHabits: Habit[] = [
            {
              id: 'habit-1',
              title: 'Morning Deep Work (90 mins)',
              category: 'Productivity',
              priority: 'urgent',
              estimateMinutes: 90,
              createdAt: Date.now(),
            },
            {
              id: 'habit-2',
              title: 'Daily Walk & Sun Exposure',
              category: 'Health',
              priority: 'medium',
              estimateMinutes: 30,
              createdAt: Date.now(),
            },
            {
              id: 'habit-3',
              title: 'Nightly Review & Plan Tomorrow',
              category: 'Personal',
              priority: 'high',
              estimateMinutes: 15,
              createdAt: Date.now(),
            }
          ];

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          const seedLogs: HabitLogEntry[] = [
            {
              date: yesterdayStr,
              completedHabits: {
                'habit-1': true,
                'habit-2': true,
              }
            }
          ];

          await db.tasks.bulkAdd(seedTasks);
          await db.habits.bulkAdd(seedHabits);
          await db.habitLogs.bulkAdd(seedLogs);

          tasks = seedTasks;
          habits = seedHabits;
          habitLogs = seedLogs;

          // Initial snapshot
          await get().createAutoBackup();
        }

        set({ tasks, habits, habitLogs, initialized: true });
      } catch (err) {
        console.error('Failed to load data from IndexedDB', err);
        get().addToast('error', 'Failed to load local database.');
      }
    },

    setActiveView: (view: ViewMode) => set({ activeView: view }),

    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('taskly-theme', nextTheme);
      applyThemeToDOM(nextTheme);
      set({ theme: nextTheme });
    },

    unlockApp: (inputPin: string) => {
      if (inputPin === get().pinCode) {
        set({ isLocked: false });
        get().addToast('success', 'App unlocked.');
        return true;
      }
      return false;
    },

    toggleLockEnabled: (enabled: boolean) => {
      localStorage.setItem('taskly-lock-enabled', String(enabled));
      set({ isLockEnabled: enabled, isLocked: enabled });
      get().addToast('info', enabled ? 'PIN lock enabled.' : 'PIN lock disabled.');
    },

    setPinCode: (newPin: string) => {
      if (/^\d{4}$/.test(newPin)) {
        localStorage.setItem('taskly-pin', newPin);
        set({ pinCode: newPin });
        get().addToast('success', 'PIN code updated successfully.');
      } else {
        get().addToast('error', 'PIN must be 4 digits.');
      }
    },

    lockApp: () => {
      if (get().isLockEnabled) {
        set({ isLocked: true });
        get().addToast('info', 'Taskly locked.');
      }
    },

    // --- Safety Net: Automatic Local Backup ---
    createAutoBackup: async () => {
      try {
        const tasks = await db.tasks.toArray();
        const habits = await db.habits.toArray();
        const habitLogs = await db.habitLogs.toArray();

        const timestamp = Date.now();
        const backupId = `auto-backup-${timestamp}`;
        const data = JSON.stringify({ tasks, habits, habitLogs });

        await db.backups.put({ id: backupId, timestamp, data });

        // Maintain a rotating window of the last 5 snapshots
        const allBackups = await db.backups.orderBy('timestamp').toArray();
        if (allBackups.length > 5) {
          const toRemove = allBackups.slice(0, allBackups.length - 5);
          for (const item of toRemove) {
            await db.backups.delete(item.id);
          }
        }
      } catch (err) {
        console.error('Failed to create auto-backup snapshot', err);
      }
    },

    getAutoBackups: async () => {
      try {
        return await db.backups.orderBy('timestamp').reverse().toArray();
      } catch (err) {
        console.error('Failed to fetch auto-backups', err);
        return [];
      }
    },

    restoreAutoBackup: async (backupId: string) => {
      try {
        const snapshot = await db.backups.get(backupId);
        if (!snapshot) {
          get().addToast('error', 'Backup snapshot not found.');
          return false;
        }

        const parsed = JSON.parse(snapshot.data);
        if (!parsed || !Array.isArray(parsed.tasks)) {
          get().addToast('error', 'Invalid backup data format.');
          return false;
        }

        await db.transaction('rw', [db.tasks, db.habits, db.habitLogs], async () => {
          await db.tasks.clear();
          await db.habits.clear();
          await db.habitLogs.clear();

          if (parsed.tasks.length > 0) await db.tasks.bulkAdd(parsed.tasks);
          if (parsed.habits && parsed.habits.length > 0) await db.habits.bulkAdd(parsed.habits);
          if (parsed.habitLogs && parsed.habitLogs.length > 0) await db.habitLogs.bulkAdd(parsed.habitLogs);
        });

        set({
          tasks: parsed.tasks,
          habits: parsed.habits || [],
          habitLogs: parsed.habitLogs || [],
        });

        get().addToast('success', `Restored from backup (${new Date(snapshot.timestamp).toLocaleTimeString()})`);
        return true;
      } catch (err) {
        console.error('Failed to restore auto backup', err);
        get().addToast('error', 'Error restoring backup.');
        return false;
      }
    },

    // --- Safety Net: Manual Export & Import JSON ---
    exportData: () => {
      try {
        const { tasks, habits, habitLogs, theme, isLockEnabled } = get();
        const exportPayload = {
          version: '1.0.0',
          app: 'Taskly',
          exportedAt: new Date().toISOString(),
          settings: { theme, isLockEnabled },
          tasks,
          habits,
          habitLogs,
        };

        const jsonString = JSON.stringify(exportPayload, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const todayStr = getTodayString();
        const link = document.createElement('a');
        link.href = url;
        link.download = `taskly-backup-${todayStr}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        get().addToast('success', 'Backup exported successfully.');
      } catch (err) {
        console.error('Failed to export data', err);
        get().addToast('error', 'Error exporting data.');
      }
    },

    importData: async (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString);

        if (!parsed || (!parsed.tasks && !parsed.habits)) {
          get().addToast('error', 'Invalid JSON backup file format.');
          return false;
        }

        const importedTasks: Task[] = Array.isArray(parsed.tasks) ? parsed.tasks : [];
        const importedHabits: Habit[] = Array.isArray(parsed.habits) ? parsed.habits : [];
        const importedLogs: HabitLogEntry[] = Array.isArray(parsed.habitLogs) ? parsed.habitLogs : [];

        // Transactional restore
        await db.transaction('rw', [db.tasks, db.habits, db.habitLogs], async () => {
          await db.tasks.clear();
          await db.habits.clear();
          await db.habitLogs.clear();

          if (importedTasks.length > 0) await db.tasks.bulkAdd(importedTasks);
          if (importedHabits.length > 0) await db.habits.bulkAdd(importedHabits);
          if (importedLogs.length > 0) await db.habitLogs.bulkAdd(importedLogs);
        });

        set({
          tasks: importedTasks,
          habits: importedHabits,
          habitLogs: importedLogs,
        });

        await get().createAutoBackup();
        get().addToast('success', `Imported ${importedTasks.length} tasks and ${importedHabits.length} habits!`);
        return true;
      } catch (err) {
        console.error('Failed to import data', err);
        get().addToast('error', 'Failed to parse JSON file.');
        return false;
      }
    },

    wipeDatabase: async () => {
      try {
        await db.tasks.clear();
        await db.habits.clear();
        await db.habitLogs.clear();
        set({ tasks: [], habits: [], habitLogs: [] });
        get().addToast('info', 'All database tables wiped.');
      } catch (err) {
        console.error('Failed to wipe database', err);
        get().addToast('error', 'Error wiping database.');
      }
    },

    // Task Actions
    addTask: async (taskData) => {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        completed: false,
        createdAt: Date.now(),
      };

      try {
        await db.tasks.add(newTask);
        set(state => ({ tasks: [newTask, ...state.tasks] }));
        await get().createAutoBackup();
        get().addToast('success', `Created task "${newTask.title.slice(0, 24)}${newTask.title.length > 24 ? '...' : ''}"`);
      } catch (err) {
        console.error('Failed to add task', err);
        get().addToast('error', 'Error creating task.');
      }
    },

    updateTask: async (id, updates) => {
      try {
        await db.tasks.update(id, updates);
        set(state => ({
          tasks: state.tasks.map(t => (t.id === id ? { ...t, ...updates } : t))
        }));
        await get().createAutoBackup();
        get().addToast('info', 'Task updated.');
      } catch (err) {
        console.error('Failed to update task', err);
        get().addToast('error', 'Error updating task.');
      }
    },

    deleteTask: async (id) => {
      try {
        await db.tasks.delete(id);
        set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }));
        await get().createAutoBackup();
        get().addToast('info', 'Task deleted.');
      } catch (err) {
        console.error('Failed to delete task', err);
        get().addToast('error', 'Error deleting task.');
      }
    },

    toggleTaskComplete: async (id) => {
      const { tasks } = get();
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const willBeCompleted = !task.completed;

      if (willBeCompleted && task.recurring !== 'none') {
        const updatedCurrent: Task = {
          ...task,
          completed: true,
          completedAt: Date.now(),
        };

        const nextDueDate = calculateNextDueDate(task.dueDate, task.recurring);
        const newRecurringTask: Task = {
          ...task,
          id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          dueDate: nextDueDate,
          completed: false,
          completedAt: undefined,
          createdAt: Date.now(),
          subtasks: task.subtasks.map(st => ({ ...st, done: false })),
        };

        try {
          await db.tasks.update(id, { completed: true, completedAt: Date.now() });
          await db.tasks.add(newRecurringTask);

          set(state => ({
            tasks: [
              newRecurringTask,
              ...state.tasks.map(t => (t.id === id ? updatedCurrent : t))
            ]
          }));
          await get().createAutoBackup();
          get().addToast('success', `Completed task & scheduled next for ${nextDueDate}`);
        } catch (err) {
          console.error('Failed recurring task toggle', err);
          get().addToast('error', 'Error processing recurring task.');
        }
      } else {
        const updates = {
          completed: willBeCompleted,
          completedAt: willBeCompleted ? Date.now() : undefined,
        };

        try {
          await db.tasks.update(id, updates);
          set(state => ({
            tasks: state.tasks.map(t => (t.id === id ? { ...t, ...updates } : t))
          }));
          await get().createAutoBackup();
        } catch (err) {
          console.error('Failed to toggle task', err);
          get().addToast('error', 'Error toggling task completion.');
        }
      }
    },

    addHabit: async (habitData) => {
      const newHabit: Habit = {
        ...habitData,
        id: `habit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: Date.now(),
      };

      try {
        await db.habits.add(newHabit);
        set(state => ({ habits: [newHabit, ...state.habits] }));
        await get().createAutoBackup();
        get().addToast('success', `Added habit "${newHabit.title}"`);
      } catch (err) {
        console.error('Failed to add habit', err);
        get().addToast('error', 'Error creating habit.');
      }
    },

    updateHabit: async (id, updates) => {
      try {
        await db.habits.update(id, updates);
        set(state => ({
          habits: state.habits.map(h => (h.id === id ? { ...h, ...updates } : h))
        }));
        await get().createAutoBackup();
        get().addToast('info', 'Habit updated.');
      } catch (err) {
        console.error('Failed to update habit', err);
        get().addToast('error', 'Error updating habit.');
      }
    },

    deleteHabit: async (id) => {
      try {
        await db.habits.delete(id);
        set(state => ({ habits: state.habits.filter(h => h.id !== id) }));
        await get().createAutoBackup();
        get().addToast('info', 'Habit deleted.');
      } catch (err) {
        console.error('Failed to delete habit', err);
        get().addToast('error', 'Error deleting habit.');
      }
    },

    toggleHabitToday: async (habitId, dateStr) => {
      const targetDate = dateStr || getTodayString();
      const { habitLogs } = get();

      const existingLog = habitLogs.find(l => l.date === targetDate);
      let updatedCompleted: Record<string, boolean> = {};

      if (existingLog) {
        updatedCompleted = {
          ...existingLog.completedHabits,
          [habitId]: !existingLog.completedHabits?.[habitId],
        };
      } else {
        updatedCompleted = { [habitId]: true };
      }

      try {
        await db.habitLogs.put({
          date: targetDate,
          completedHabits: updatedCompleted,
        });

        const updatedLogs = habitLogs.some(l => l.date === targetDate)
          ? habitLogs.map(l => (l.date === targetDate ? { ...l, completedHabits: updatedCompleted } : l))
          : [...habitLogs, { date: targetDate, completedHabits: updatedCompleted }];

        set({ habitLogs: updatedLogs });
        await get().createAutoBackup();
      } catch (err) {
        console.error('Failed to toggle habit', err);
        get().addToast('error', 'Error updating habit log.');
      }
    },

    openCreateTaskModal: (initialDate) => set({ isEditorOpen: true, editingTaskId: null, editorInitialDate: initialDate }),
    openEditTaskModal: (taskId) => set({ isEditorOpen: true, editingTaskId: taskId, editorInitialDate: undefined }),
    closeTaskModal: () => set({ isEditorOpen: false, editingTaskId: null, editorInitialDate: undefined }),

    openCreateHabitModal: () => set({ isHabitEditorOpen: true, editingHabitId: null }),
    openEditHabitModal: (habitId) => set({ isHabitEditorOpen: true, editingHabitId: habitId }),
    closeHabitModal: () => set({ isHabitEditorOpen: false, editingHabitId: null }),

    openBackupModal: () => set({ isBackupModalOpen: true }),
    closeBackupModal: () => set({ isBackupModalOpen: false }),

    addToast: (type, message) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      set(state => ({ toasts: [...state.toasts, { id, type, message }] }));

      setTimeout(() => {
        get().removeToast(id);
      }, 3200);
    },

    removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
  };
});
