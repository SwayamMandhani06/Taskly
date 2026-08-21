import React, { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskRow } from '../components/tasks/TaskRow';
import { Task } from '../types';
import { format, parseISO, addDays, isAfter, startOfDay, isTomorrow } from 'date-fns';
import { ChevronDown, ChevronRight, CalendarDays, Plus } from 'lucide-react';

interface DateGroup {
  key: string;
  label: string;
  tasks: Task[];
}

export const UpcomingView: React.FC = () => {
  const { tasks, openCreateTaskModal } = useTaskStore();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const today = startOfDay(new Date());

  // Filter tasks due after today
  const upcomingTasks = tasks.filter(t => t.dueDate && isAfter(parseISO(t.dueDate), today));

  // Group upcoming tasks by date
  const groupMap = new Map<string, Task[]>();

  upcomingTasks.forEach(t => {
    const key = t.dueDate!;
    const list = groupMap.get(key) || [];
    list.push(t);
    groupMap.set(key, list);
  });

  // Sort dates
  const sortedDates = Array.from(groupMap.keys()).sort();

  const groups: DateGroup[] = sortedDates.map(dateStr => {
    const parsed = parseISO(dateStr);
    let label = format(parsed, 'EEEE, MMM d, yyyy');
    if (isTomorrow(parsed)) {
      label = `Tomorrow — ${format(parsed, 'MMM d')}`;
    }

    return {
      key: dateStr,
      label,
      tasks: groupMap.get(dateStr) || [],
    };
  });

  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--ink)]">Upcoming</h1>
          <p className="text-xs font-mono text-[var(--ink-soft)] mt-0.5">
            Scheduled tasks for the next days & weeks
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreateTaskModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[var(--accent)] text-white text-xs font-mono font-medium hover:bg-[var(--accent-hover)] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-[var(--border)] space-y-3">
          <CalendarDays className="w-10 h-10 text-[var(--ink-soft)]/40 mx-auto" />
          <p className="text-sm font-medium text-[var(--ink)]">No upcoming tasks scheduled.</p>
          <p className="text-xs text-[var(--ink-soft)] font-mono max-w-sm mx-auto">
            Tasks with future due dates will automatically appear here sorted by day.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(group => {
            const isCollapsed = Boolean(collapsedGroups[group.key]);

            return (
              <div key={group.key} className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.key)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded hover:bg-[var(--surface-2)] transition-colors group text-left"
                >
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--ink)]">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-[var(--ink-soft)]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--ink-soft)]" />
                    )}
                    <span>{group.label}</span>
                  </div>
                  <span className="text-xs font-mono text-[var(--ink-soft)] bg-[var(--surface-2)] group-hover:bg-white px-2 py-0.5 rounded border border-[var(--border)]">
                    {group.tasks.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="space-y-2 pl-2">
                    {group.tasks.map(task => (
                      <TaskRow key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
