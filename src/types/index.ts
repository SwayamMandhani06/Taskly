export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type RecurringInterval = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: PriorityLevel;
  dueDate?: string;        // YYYY-MM-DD local date string
  dueTime?: string;        // HH:mm format (24h)
  category?: string;
  subtasks: Subtask[];
  recurring: RecurringInterval;
  estimateMinutes?: number;
  completed: boolean;
  completedAt?: number;
  createdAt: number;
}

export interface Habit {
  id: string;
  title: string;
  category?: string;
  priority: PriorityLevel;
  estimateMinutes?: number;
  createdAt: number;
}

export interface HabitLogEntry {
  date: string; // YYYY-MM-DD
  completedHabits: Record<string, boolean>; // habitId -> boolean
}

export type ViewMode = 'today' | 'upcoming' | 'inbox' | 'plan' | 'habits' | 'categories' | 'all' | 'calendar';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'error';
  message: string;
}
