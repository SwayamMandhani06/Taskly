import { supabase, isSupabaseConfigured } from './supabase';
import { db } from '../db/database';
import { Task, Habit, HabitLogEntry } from '../types';

export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

// Queue for offline mutations
interface OfflineQueueItem {
  id: string;
  table: 'tasks' | 'habits' | 'habit_logs';
  type: 'upsert' | 'delete';
  payload: any;
  timestamp: number;
}

const QUEUE_KEY = 'taskly-offline-queue-v1';

export const getOfflineQueue = (): OfflineQueueItem[] => {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveOfflineQueue = (queue: OfflineQueueItem[]) => {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to save offline queue', err);
  }
};

export const enqueueOfflineOp = (op: Omit<OfflineQueueItem, 'id' | 'timestamp'>) => {
  const queue = getOfflineQueue();
  queue.push({
    ...op,
    id: `op-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
  });
  saveOfflineQueue(queue);
};

// Flush offline queue when connectivity is restored
export const flushOfflineQueue = async (userId: string) => {
  if (!isSupabaseConfigured() || !supabase || !isOnline()) return;

  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  const remaining: OfflineQueueItem[] = [];

  for (const item of queue) {
    try {
      if (item.type === 'upsert') {
        if (item.table === 'habit_logs') {
          await supabase.from(item.table).upsert({ ...item.payload, user_id: userId }, { onConflict: 'user_id, date' });
        } else {
          await supabase.from(item.table).upsert({ ...item.payload, user_id: userId });
        }
      } else if (item.type === 'delete') {
        await supabase.from(item.table).delete().eq('id', item.payload.id).eq('user_id', userId);
      }
    } catch (err) {
      console.error(`Failed to flush queue item ${item.id}`, err);
      remaining.push(item);
    }
  }

  saveOfflineQueue(remaining);
};

// One-time initial migration from local IndexedDB to Supabase cloud
export const migrateLocalDataToCloud = async (userId: string) => {
  if (!isSupabaseConfigured() || !supabase) return;

  const migrationKey = `taskly-initial-migrated-${userId}`;
  if (localStorage.getItem(migrationKey) === 'true') return;

  try {
    const localTasks = await db.tasks.toArray();
    const localHabits = await db.habits.toArray();
    const localLogs = await db.habitLogs.toArray();

    if (localTasks.length > 0) {
      const taskRows = localTasks.map(t => ({
        id: t.id,
        user_id: userId,
        title: t.title,
        notes: t.notes || null,
        priority: t.priority,
        due_date: t.dueDate || null,
        due_time: t.dueTime || null,
        category: t.category || null,
        subtasks: t.subtasks || [],
        recurring: t.recurring || 'none',
        estimate_minutes: t.estimateMinutes || null,
        completed: t.completed,
        completed_at: t.completedAt || null,
        created_at: t.createdAt,
        updated_at: new Date().toISOString(),
      }));

      await supabase.from('tasks').upsert(taskRows);
    }

    if (localHabits.length > 0) {
      const habitRows = localHabits.map(h => ({
        id: h.id,
        user_id: userId,
        title: h.title,
        category: h.category || null,
        priority: h.priority,
        estimate_minutes: h.estimateMinutes || null,
        created_at: h.createdAt,
        updated_at: new Date().toISOString(),
      }));

      await supabase.from('habits').upsert(habitRows);
    }

    if (localLogs.length > 0) {
      const logRows = localLogs.map(l => ({
        id: `log-${userId}-${l.date}`,
        user_id: userId,
        date: l.date,
        completed_habits: l.completedHabits || {},
        updated_at: new Date().toISOString(),
      }));

      await supabase.from('habit_logs').upsert(logRows, { onConflict: 'user_id, date' });
    }

    localStorage.setItem(migrationKey, 'true');
  } catch (err) {
    console.error('Error during initial local-to-cloud data migration', err);
  }
};

// Pull remote data from Supabase and merge into IndexedDB
export const pullAndMergeFromCloud = async (userId: string): Promise<{
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLogEntry[];
}> => {
  if (!isSupabaseConfigured() || !supabase || !isOnline()) {
    const tasks = await db.tasks.toArray();
    const habits = await db.habits.toArray();
    const habitLogs = await db.habitLogs.toArray();
    return { tasks, habits, habitLogs };
  }

  try {
    const [tasksRes, habitsRes, logsRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', userId),
      supabase.from('habits').select('*').eq('user_id', userId),
      supabase.from('habit_logs').select('*').eq('user_id', userId),
    ]);

    const remoteTasks: Task[] = (tasksRes.data || []).map(r => ({
      id: r.id,
      title: r.title,
      notes: r.notes || undefined,
      priority: r.priority,
      dueDate: r.due_date || undefined,
      dueTime: r.due_time || undefined,
      category: r.category || undefined,
      subtasks: r.subtasks || [],
      recurring: r.recurring || 'none',
      estimateMinutes: r.estimate_minutes || undefined,
      completed: r.completed,
      completedAt: r.completed_at || undefined,
      createdAt: r.created_at,
    }));

    const remoteHabits: Habit[] = (habitsRes.data || []).map(r => ({
      id: r.id,
      title: r.title,
      category: r.category || undefined,
      priority: r.priority,
      estimateMinutes: r.estimate_minutes || undefined,
      createdAt: r.created_at,
    }));

    const remoteLogs: HabitLogEntry[] = (logsRes.data || []).map(r => ({
      date: r.date,
      completedHabits: r.completed_habits || {},
    }));

    // Perform safe merge preserving all local and remote data
    const localTasks = await db.tasks.toArray();
    const localHabits = await db.habits.toArray();
    const localLogs = await db.habitLogs.toArray();

    // 1. Tasks: union remote + local (preserving unpushed local tasks)
    const combinedTasksMap = new Map<string, Task>();
    remoteTasks.forEach(t => combinedTasksMap.set(t.id, t));
    const unpushedTasks: Task[] = [];
    localTasks.forEach(t => {
      if (!combinedTasksMap.has(t.id)) {
        combinedTasksMap.set(t.id, t);
        unpushedTasks.push(t);
      }
    });
    const finalTasks = Array.from(combinedTasksMap.values());

    // 2. Habits: union remote + local
    const combinedHabitsMap = new Map<string, Habit>();
    remoteHabits.forEach(h => combinedHabitsMap.set(h.id, h));
    const unpushedHabits: Habit[] = [];
    localHabits.forEach(h => {
      if (!combinedHabitsMap.has(h.id)) {
        combinedHabitsMap.set(h.id, h);
        unpushedHabits.push(h);
      }
    });
    const finalHabits = Array.from(combinedHabitsMap.values());

    // 3. Habit logs: merge checkmarks per date
    const combinedLogsMap = new Map<string, HabitLogEntry>();
    remoteLogs.forEach(l => combinedLogsMap.set(l.date, l));
    const unpushedLogs: HabitLogEntry[] = [];
    localLogs.forEach(l => {
      const existing = combinedLogsMap.get(l.date);
      if (!existing) {
        combinedLogsMap.set(l.date, l);
        unpushedLogs.push(l);
      } else {
        const mergedCompleted = { ...existing.completedHabits, ...l.completedHabits };
        combinedLogsMap.set(l.date, { date: l.date, completedHabits: mergedCompleted });
      }
    });
    const finalLogs = Array.from(combinedLogsMap.values());

    await db.transaction('rw', [db.tasks, db.habits, db.habitLogs], async () => {
      await db.tasks.clear();
      await db.habits.clear();
      await db.habitLogs.clear();

      if (finalTasks.length > 0) await db.tasks.bulkAdd(finalTasks);
      if (finalHabits.length > 0) await db.habits.bulkAdd(finalHabits);
      if (finalLogs.length > 0) await db.habitLogs.bulkAdd(finalLogs);
    });

    // Background push any un-synced items to cloud
    if (unpushedTasks.length > 0 || unpushedHabits.length > 0 || unpushedLogs.length > 0) {
      setTimeout(async () => {
        for (const t of unpushedTasks) await pushTaskUpsert(t, userId);
        for (const h of unpushedHabits) await pushHabitUpsert(h, userId);
        for (const l of unpushedLogs) await pushHabitLogUpsert(l, userId);
      }, 200);
    }

    return { tasks: finalTasks, habits: finalHabits, habitLogs: finalLogs };
  } catch (err) {
    console.error('Failed to pull remote data from Supabase', err);
    const tasks = await db.tasks.toArray();
    const habits = await db.habits.toArray();
    const habitLogs = await db.habitLogs.toArray();
    return { tasks, habits, habitLogs };
  }
};

// Push write operations to Supabase
export const pushTaskUpsert = async (task: Task, userId: string) => {
  const row = {
    id: task.id,
    user_id: userId,
    title: task.title,
    notes: task.notes || null,
    priority: task.priority,
    due_date: task.dueDate || null,
    due_time: task.dueTime || null,
    category: task.category || null,
    subtasks: task.subtasks || [],
    recurring: task.recurring || 'none',
    estimate_minutes: task.estimateMinutes || null,
    completed: task.completed,
    completed_at: task.completedAt || null,
    created_at: task.createdAt,
    updated_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured() || !supabase || !isOnline()) {
    enqueueOfflineOp({ table: 'tasks', type: 'upsert', payload: row });
    return;
  }

  try {
    await supabase.from('tasks').upsert(row);
  } catch (err) {
    console.error('Task cloud push failed, queuing offline op', err);
    enqueueOfflineOp({ table: 'tasks', type: 'upsert', payload: row });
  }
};

export const pushTaskDelete = async (taskId: string, userId: string) => {
  if (!isSupabaseConfigured() || !supabase || !isOnline()) {
    enqueueOfflineOp({ table: 'tasks', type: 'delete', payload: { id: taskId } });
    return;
  }

  try {
    await supabase.from('tasks').delete().eq('id', taskId).eq('user_id', userId);
  } catch (err) {
    console.error('Task delete cloud push failed, queuing offline op', err);
    enqueueOfflineOp({ table: 'tasks', type: 'delete', payload: { id: taskId } });
  }
};

export const pushHabitUpsert = async (habit: Habit, userId: string) => {
  const row = {
    id: habit.id,
    user_id: userId,
    title: habit.title,
    category: habit.category || null,
    priority: habit.priority,
    estimate_minutes: habit.estimateMinutes || null,
    created_at: habit.createdAt,
    updated_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured() || !supabase || !isOnline()) {
    enqueueOfflineOp({ table: 'habits', type: 'upsert', payload: row });
    return;
  }

  try {
    await supabase.from('habits').upsert(row);
  } catch (err) {
    console.error('Habit cloud push failed, queuing offline op', err);
    enqueueOfflineOp({ table: 'habits', type: 'upsert', payload: row });
  }
};

export const pushHabitDelete = async (habitId: string, userId: string) => {
  if (!isSupabaseConfigured() || !supabase || !isOnline()) {
    enqueueOfflineOp({ table: 'habits', type: 'delete', payload: { id: habitId } });
    return;
  }

  try {
    await supabase.from('habits').delete().eq('id', habitId).eq('user_id', userId);
  } catch (err) {
    console.error('Habit delete cloud push failed, queuing offline op', err);
    enqueueOfflineOp({ table: 'habits', type: 'delete', payload: { id: habitId } });
  }
};

export const pushHabitLogUpsert = async (log: HabitLogEntry, userId: string) => {
  const row = {
    id: `log-${userId}-${log.date}`,
    user_id: userId,
    date: log.date,
    completed_habits: log.completedHabits || {},
    updated_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured() || !supabase || !isOnline()) {
    enqueueOfflineOp({ table: 'habit_logs', type: 'upsert', payload: row });
    return;
  }

  try {
    await supabase.from('habit_logs').upsert(row, { onConflict: 'user_id, date' });
  } catch (err) {
    console.error('Habit log cloud push failed, queuing offline op', err);
    enqueueOfflineOp({ table: 'habit_logs', type: 'upsert', payload: row });
  }
};

// Supabase Realtime Subscription Setup
export const setupSupabaseRealtime = (userId: string, onSync: () => void) => {
  if (!isSupabaseConfigured() || !supabase) return () => {};

  const client = supabase;
  let timer: any = null;

  const debouncedSync = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      onSync();
    }, 400);
  };

  const channel = client
    .channel(`taskly-realtime-${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` },
      debouncedSync
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'habits', filter: `user_id=eq.${userId}` },
      debouncedSync
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'habit_logs', filter: `user_id=eq.${userId}` },
      debouncedSync
    )
    .subscribe();

  return () => {
    if (timer) clearTimeout(timer);
    client.removeChannel(channel);
  };
};
