import { format, addDays, parseISO, isToday, isTomorrow, isBefore, isAfter, startOfDay } from 'date-fns';

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getTomorrowString(): string {
  return format(addDays(new Date(), 1), 'yyyy-MM-dd');
}

export function getNextWeekString(): string {
  return format(addDays(new Date(), 7), 'yyyy-MM-dd');
}

export function formatDueDateDisplay(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return '';
  
  const parsed = parseISO(dateStr);
  let label = dateStr;
  
  if (isToday(parsed)) {
    label = 'Today';
  } else if (isTomorrow(parsed)) {
    label = 'Tomorrow';
  } else {
    label = format(parsed, 'EEE, MMM d');
  }

  if (timeStr) {
    label += ` ${timeStr}`;
  }

  return label;
}

export function isTaskOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  const parsed = parseISO(dateStr);
  const today = startOfDay(new Date());
  return isBefore(parsed, today);
}

export function isTaskDueToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr === getTodayString();
}

/**
 * Calculates recurring next due date.
 */
export function calculateNextDueDate(currentDueDateStr: string | undefined, interval: 'daily' | 'weekly' | 'monthly'): string {
  const baseDate = currentDueDateStr ? parseISO(currentDueDateStr) : new Date();
  
  if (interval === 'daily') {
    return format(addDays(baseDate, 1), 'yyyy-MM-dd');
  } else if (interval === 'weekly') {
    return format(addDays(baseDate, 7), 'yyyy-MM-dd');
  } else if (interval === 'monthly') {
    // Add 1 month approx 30 days or date-fns addMonths
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const day = baseDate.getDate();
    const nextMonth = new Date(year, month + 1, day);
    return format(nextMonth, 'yyyy-MM-dd');
  }
  return currentDueDateStr || getTodayString();
}
