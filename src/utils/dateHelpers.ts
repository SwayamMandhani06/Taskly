import { format, addDays, addMonths, parseISO, isToday, isTomorrow, isBefore, isAfter, startOfDay } from 'date-fns';

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
 * If the current due date is in the past, advances to the next future occurrence.
 */
export function calculateNextDueDate(currentDueDateStr: string | undefined, interval: 'daily' | 'weekly' | 'monthly'): string {
  let baseDate = currentDueDateStr ? parseISO(currentDueDateStr) : new Date();
  const today = startOfDay(new Date());

  const advanceOneInterval = (date: Date): Date => {
    if (interval === 'daily') return addDays(date, 1);
    if (interval === 'weekly') return addDays(date, 7);
    if (interval === 'monthly') return addMonths(date, 1);
    return date;
  };

  // Advance by interval
  baseDate = advanceOneInterval(baseDate);

  // If the calculated next due date is still in the past, advance until it reaches today or future
  while (isBefore(baseDate, today)) {
    baseDate = advanceOneInterval(baseDate);
  }

  return format(baseDate, 'yyyy-MM-dd');
}
