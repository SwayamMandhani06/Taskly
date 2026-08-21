import { format, subDays, parseISO, isValid } from 'date-fns';
import { HabitLogEntry } from '../types';

/**
 * Calculates current streak for a habit.
 * Streak counts consecutive completed days going backwards.
 * If today is completed, count starting today.
 * If today is not completed yet, count starting yesterday (so today isn't penalized until tomorrow).
 */
export function calculateHabitStreak(
  habitId: string,
  logs: HabitLogEntry[],
  referenceDate: Date = new Date()
): { currentStreak: number; bestStreak: number; completedToday: boolean } {
  const todayStr = format(referenceDate, 'yyyy-MM-dd');
  
  // Create a fast lookup map: date -> boolean
  const logMap = new Map<string, boolean>();
  for (const entry of logs) {
    if (entry.completedHabits && entry.completedHabits[habitId] === true) {
      logMap.set(entry.date, true);
    }
  }

  const completedToday = logMap.get(todayStr) === true;

  let currentStreak = 0;
  let startDate = referenceDate;

  if (!completedToday) {
    // If today is not completed, start checking from yesterday
    startDate = subDays(referenceDate, 1);
  }

  // Count backwards continuously until a day is missed
  let checkDate = startDate;
  while (true) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    if (logMap.get(dateStr)) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  // Best streak calculation across all logs
  // Gather all unique sorted dates where habit was completed
  const completedDates = Array.from(logMap.keys())
    .filter(d => logMap.get(d))
    .sort();

  let maxStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const dateStr of completedDates) {
    const parsed = parseISO(dateStr);
    if (!isValid(parsed)) continue;

    if (!lastDate) {
      tempStreak = 1;
    } else {
      const diffInDays = Math.round((parsed.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffInDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }
    lastDate = parsed;
  }

  return {
    currentStreak,
    bestStreak: Math.max(currentStreak, maxStreak),
    completedToday,
  };
}
