import Dexie, { Table } from 'dexie';
import { Task, Habit, HabitLogEntry } from '../types';

export interface BackupSnapshot {
  id: string;
  timestamp: number;
  data: string; // JSON stringified { tasks, habits, habitLogs }
}

export class TasklyDatabase extends Dexie {
  tasks!: Table<Task, string>;
  habits!: Table<Habit, string>;
  habitLogs!: Table<HabitLogEntry, string>;
  backups!: Table<BackupSnapshot, string>;

  constructor() {
    super('TasklyDB');
    
    // Schema version 1
    this.version(1).stores({
      tasks: 'id, priority, dueDate, category, completed, createdAt',
      habits: 'id, priority, category, createdAt',
      habitLogs: 'date',
    });

    // Schema version 2: add backups table with non-destructive versioning
    this.version(2).stores({
      tasks: 'id, priority, dueDate, category, completed, createdAt',
      habits: 'id, priority, category, createdAt',
      habitLogs: 'date',
      backups: 'id, timestamp',
    });
  }
}

export const db = new TasklyDatabase();
