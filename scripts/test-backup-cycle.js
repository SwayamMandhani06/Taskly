import fs from 'fs';

const samplePayload = {
  version: '1.0.0',
  app: 'Taskly',
  exportedAt: new Date().toISOString(),
  settings: { theme: 'dark', isLockEnabled: true },
  tasks: [
    {
      id: 'task-test-1',
      title: 'Export/Import Integrity Test Task',
      priority: 'high',
      completed: false,
      createdAt: Date.now(),
      subtasks: [{ id: 'st-1', text: 'Subtask 1', done: true }]
    }
  ],
  habits: [
    {
      id: 'habit-test-1',
      title: 'Daily Coding Habit',
      priority: 'urgent',
      createdAt: Date.now()
    }
  ],
  habitLogs: [
    {
      date: '2026-08-22',
      completedHabits: { 'habit-test-1': true }
    }
  ]
};

// 1. Export JSON string
const jsonString = JSON.stringify(samplePayload, null, 2);
console.log('1. Export Payload Generated. Length:', jsonString.length);

// 2. Simulate Wipe (Empty state)
let stateTasks = [];
let stateHabits = [];
let stateLogs = [];
console.log('2. Simulated Wipe. Tasks count:', stateTasks.length);

// 3. Simulate Import JSON
const parsed = JSON.parse(jsonString);
if (parsed.tasks && parsed.habits && parsed.habitLogs) {
  stateTasks = parsed.tasks;
  stateHabits = parsed.habits;
  stateLogs = parsed.habitLogs;
  console.log('3. Import Successful!');
  console.log('   Restored Tasks:', stateTasks.length, 'Title:', stateTasks[0].title);
  console.log('   Restored Habits:', stateHabits.length, 'Title:', stateHabits[0].title);
  console.log('   Restored Habit Logs:', stateLogs.length, 'Date:', stateLogs[0].date);
} else {
  console.error('Import Failed: Invalid JSON structure');
}
