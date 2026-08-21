import React, { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskRow } from '../components/tasks/TaskRow';
import { Task } from '../types';
import { format, parseISO, addDays, isAfter, startOfDay, isTomorrow, differenceInDays } from 'date-fns';
import { ChevronDown, ChevronRight, CalendarDays, Plus } from 'lucide-react';

interface DateGroup {
  key: string;
  label: string;
  tasks: Task[];
  isLaterBucket?: boolean;
}

export const UpcomingView: React.FC = () => {
  const { tasks, openCreateTaskModal } = useTaskStore();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const today = startOfDay(new Date());
  const fourteenDaysLater = addDays(today, 14);

  // Filter tasks due after today
  const upcomingTasks = tasks.filter(t => t.dueDate && isAfter(parseISO(t.dueDate), today));

  const nearTermGroupMap = new Map<string, Task[]>();
  const laterTasks: Task[] = [];

  upcomingTasks.forEach(t => {
    const parsed = parseISO(t.dueDate!);
    if (isAfter(parsed, fourteenDaysLater)) {
      laterTasks.push(t);
    } else {
      const list = nearTermGroupMap.get(t.dueDate!) || [];
      list.push(t);
      nearTermGroupMap.set(t.dueDate!, list);
    }
  });

  const sortedDates = Array.from(nearTermGroupMap.keys()).sort();

  const groups: DateGroup[] = sortedDates.map(dateStr => {
    const parsed = parseISO(dateStr);
    let label = format(parsed, 'EEEE, MMM d, yyyy');
    if (isTomorrow(parsed)) {
      label = `Tomorrow — ${format(parsed, 'MMM d')}`;
    }

    return {
      key: dateStr,
      label,
      tasks: nearTermGroupMap.get(dateStr) || [],
    };
  });

  if (laterTasks.length > 0) {
    groups.push({
      key: 'later-bucket',
      label: `Later (${laterTasks.length} tasks scheduled beyond 14 days)`,
      tasks: laterTasks,
      isLaterBucket: true,
    });
  }

  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-sans text-[var(--ink)]">Upcoming</h1>
          <p className="text-xs font-mono text-[var(--ink-soft)] mt-0.5">
            Scheduled tasks for the next days, weeks & beyond
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreateTaskModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--accent)] text-white text-xs font-mono font-medium hover:bg-[var(--accent-hover)] transition-all duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.97] shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="p-12 text-center bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-card space-y-3">
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
              <div key={group.key} className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.key)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--surface-2)] transition-all duration-150 group text-left ${
                    group.isLaterBucket ? 'bg-[var(--surface-2)]/60 border border-dashed border-[var(--border)]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--ink)]">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-[var(--ink-soft)]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--ink-soft)]" />
                    )}
                    <span>{group.label}</span>
                  </div>
                  <span className="text-xs font-mono text-[var(--ink-soft)] bg-[var(--surface)] group-hover:bg-white dark:group-hover:bg-[var(--surface)] px-2.5 py-0.5 rounded-full border border-[var(--border)]">
                    {group.tasks.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="space-y-2.5 pl-2">
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
