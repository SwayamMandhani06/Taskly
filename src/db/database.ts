import Dexie, { Table } from 'dexie';
import { Task, Habit, HabitLogEntry } from '../types';

export class TasklyDatabase extends Dexie {
  tasks!: Table<Task, string>;
  habits!: Table<Habit, string>;
  habitLogs!: Table<HabitLogEntry, string>;

  constructor() {
    super('TasklyDB');
    this.version(1).stores({
      tasks: 'id, priority, dueDate, category, completed, createdAt',
      habits: 'id, priority, category, createdAt',
      habitLogs: 'date',
    });
  }
}

export const db = new TasklyDatabase();
