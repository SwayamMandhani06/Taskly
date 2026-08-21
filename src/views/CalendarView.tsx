import React, { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskRow } from '../components/tasks/TaskRow';
import { PriorityLevel } from '../types';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { tasks, openCreateTaskModal } = useTaskStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const selectedDateTasks = tasks.filter(t => t.dueDate === selectedDateStr);

  const getPriorityDotColor = (p: PriorityLevel) => {
    switch (p) {
      case 'urgent': return 'bg-[var(--urgent)]';
      case 'high': return 'bg-[var(--high)]';
      case 'medium': return 'bg-[var(--medium)]';
      case 'low': return 'bg-[var(--low)]';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-sans text-[var(--ink)]">Calendar</h1>
          <p className="text-xs font-mono text-[var(--ink-soft)] mt-1">
            Month overview of deadlines and scheduled commitments
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreateTaskModal(selectedDateStr)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-medium hover:bg-[var(--accent-hover)] transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task on Date</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Grid */}
        <div className="lg:col-span-2 bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 shadow-card space-y-4">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between px-2">
            <h2 className="text-base font-bold font-sans tracking-tight text-[var(--ink)]">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-all active:scale-95"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1.5 text-xs font-mono rounded-full border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--ink)] transition-all active:scale-95"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 rounded-full hover:bg-[var(--surface-2)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition-all active:scale-95"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center font-mono text-[11px] text-[var(--ink-soft)] uppercase tracking-wider py-1.5 border-b border-[var(--border)]">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Month Day Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {days.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayTasks = tasks.filter(t => t.dueDate === dateStr);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonthDay = isSameMonth(day, monthStart);
              const isTodayDay = isToday(day);

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[76px] p-2 rounded-xl border flex flex-col justify-between text-left transition-all duration-150 ease-out active:scale-95 relative ${
                    isSelected
                      ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30 bg-[var(--accent)]/5 shadow-sm'
                      : 'border-transparent hover:bg-[var(--surface-2)]'
                  } ${
                    !isCurrentMonthDay ? 'opacity-35' : ''
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${
                        isTodayDay
                          ? 'bg-[var(--accent)] text-white font-bold shadow-sm'
                          : 'text-[var(--ink)]'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Task Priority Dots */}
                  <div className="flex items-center gap-1 flex-wrap mt-1">
                    {dayTasks.slice(0, 3).map(task => (
                      <span
                        key={task.id}
                        className={`w-2 h-2 rounded-full ${getPriorityDotColor(task.priority)} ${
                          task.completed ? 'opacity-40' : ''
                        }`}
                        title={`${task.title} (${task.priority})`}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[10px] font-mono text-[var(--ink-soft)] font-semibold">
                        +{dayTasks.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Side Panel */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 shadow-card space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div>
              <h3 className="text-sm font-bold font-sans tracking-tight text-[var(--ink)]">
                {format(selectedDate, 'EEEE, MMM d, yyyy')}
              </h3>
              <p className="text-xs font-mono text-[var(--ink-soft)] mt-0.5">
                {selectedDateTasks.length} tasks scheduled
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCreateTaskModal(selectedDateStr)}
              className="p-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--accent)] transition-all active:scale-95"
              aria-label="Add task on this date"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5">
            {selectedDateTasks.length === 0 ? (
              <div className="p-8 text-center text-[var(--ink-soft)] font-mono text-xs space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto opacity-40" />
                <p>No tasks scheduled on this date.</p>
              </div>
            ) : (
              selectedDateTasks.map(task => (
                <TaskRow key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
