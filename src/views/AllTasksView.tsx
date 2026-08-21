import React, { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskRow } from '../components/tasks/TaskRow';
import { PriorityLevel, Task } from '../types';
import { Search, Filter, ChevronDown, ChevronRight, ListFilter, Plus } from 'lucide-react';

export const AllTasksView: React.FC = () => {
  const { tasks, openCreateTaskModal } = useTaskStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityLevel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Categories in use
  const allCategories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean) as string[]));

  const togglePriorityFilter = (p: PriorityLevel) => {
    setSelectedPriorities(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  // Compose search and filter rules
  const filteredTasks = tasks.filter(task => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(q);
      const notesMatch = task.notes ? task.notes.toLowerCase().includes(q) : false;
      if (!titleMatch && !notesMatch) return false;
    }

    // 2. Priority Multi-Select Filter
    if (selectedPriorities.length > 0) {
      if (!selectedPriorities.includes(task.priority)) return false;
    }

    // 3. Category Filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'none') {
        if (task.category) return false;
      } else {
        if (task.category !== selectedCategory) return false;
      }
    }

    // 4. Status Filter
    if (statusFilter === 'pending' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;

    return true;
  });

  // Group by category
  const categoryGroups = new Map<string, Task[]>();

  filteredTasks.forEach(t => {
    const key = t.category ? t.category : 'Uncategorized';
    const list = categoryGroups.get(key) || [];
    list.push(t);
    categoryGroups.set(key, list);
  });

  // Sort each category group: incomplete first, then by priority, then by title
  const sortedGroupKeys = Array.from(categoryGroups.keys()).sort((a, b) => {
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
  });

  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--ink)]">All Tasks & Archive</h1>
          <p className="text-xs font-mono text-[var(--ink-soft)] mt-0.5">
            Search, filter, and view all tasks across categories
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

      {/* Controls Container */}
      <div className="bg-white p-4 rounded-lg border border-[var(--border)] shadow-hairline space-y-3">
        {/* Live Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--ink-soft)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title or notes..."
            className="w-full pl-9 pr-4 py-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] focus:bg-white focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
          {/* Priority Multi-Select Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[var(--ink-soft)] text-[11px] uppercase mr-1">Priority:</span>
            {(['urgent', 'high', 'medium', 'low'] as PriorityLevel[]).map(p => {
              const active = selectedPriorities.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePriorityFilter(p)}
                  className={`px-2 py-0.5 rounded capitalize border transition-colors ${
                    active
                      ? 'bg-[var(--ink)] text-white border-[var(--ink)] font-semibold'
                      : 'bg-[var(--surface-2)] text-[var(--ink-soft)] border-[var(--border)] hover:text-[var(--ink)]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--ink-soft)] text-[11px] uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 rounded border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] focus:bg-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="none">Uncategorized</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--ink-soft)] text-[11px] uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1 rounded border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--ink)] focus:bg-white focus:outline-none"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grouped Results */}
      {sortedGroupKeys.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-[var(--border)] space-y-2">
          <ListFilter className="w-10 h-10 text-[var(--ink-soft)]/40 mx-auto" />
          <p className="text-sm font-medium text-[var(--ink)]">No tasks matching filters.</p>
          <p className="text-xs text-[var(--ink-soft)] font-mono">
            Try adjusting your search query or priority/category filters.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedGroupKeys.map(key => {
            const rawList = categoryGroups.get(key) || [];
            // Sort: pending first, then by priority weight
            const priorityWeight: Record<PriorityLevel, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
            const groupTasks = [...rawList].sort((a, b) => {
              if (a.completed !== b.completed) return a.completed ? 1 : -1;
              return priorityWeight[b.priority] - priorityWeight[a.priority];
            });

            const isCollapsed = Boolean(collapsedGroups[key]);

            return (
              <div key={key} className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleGroup(key)}
                  className="w-full flex items-center justify-between py-1.5 px-2 rounded hover:bg-[var(--surface-2)] transition-colors group text-left"
                >
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--ink)]">
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-[var(--ink-soft)]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--ink-soft)]" />
                    )}
                    <span>{key}</span>
                  </div>
                  <span className="text-xs font-mono text-[var(--ink-soft)] bg-[var(--surface-2)] group-hover:bg-white px-2 py-0.5 rounded border border-[var(--border)]">
                    {groupTasks.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="space-y-2 pl-2">
                    {groupTasks.map(task => (
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
