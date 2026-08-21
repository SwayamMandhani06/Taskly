import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { TodayView } from '../../views/TodayView';
import { UpcomingView } from '../../views/UpcomingView';
import { InboxView } from '../../views/InboxView';
import { PlanMyDayView } from '../../views/PlanMyDayView';
import { HabitsView } from '../../views/HabitsView';
import { AllTasksView } from '../../views/AllTasksView';
import { CalendarView } from '../../views/CalendarView';
import { TaskEditorModal } from '../tasks/TaskEditorModal';
import { HabitEditorModal } from '../habits/HabitEditorModal';
import { ToastContainer } from '../common/Toast';
import { Plus, Bug } from 'lucide-react';
import { DebugPanel } from '../debug/DebugPanel';

export const AppShell: React.FC = () => {
  const { activeView, openCreateTaskModal, initialized } = useTaskStore();
  const [showDebug, setShowDebug] = React.useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'today':
        return <TodayView />;
      case 'upcoming':
        return <UpcomingView />;
      case 'inbox':
        return <InboxView />;
      case 'plan':
        return <PlanMyDayView />;
      case 'habits':
        return <HabitsView />;
      case 'all':
        return <AllTasksView />;
      case 'calendar':
        return <CalendarView />;
      default:
        return <TodayView />;
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center font-mono text-xs text-[var(--ink-soft)]">
        <div className="flex items-center gap-3 p-4 rounded bg-white border border-[var(--border)] shadow-sm">
          <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span>Initializing Taskly ledger database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row text-[var(--ink)]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-y-auto mb-16 md:mb-0">
        {/* Top Header Row for Mobile & Debug Toggle */}
        <header className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border)] md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-4 h-6 rounded bg-[var(--accent)] flex items-center justify-center">
              <div className="w-1 h-3 bg-[var(--urgent)] rounded-full" />
            </div>
            <span className="font-bold font-display text-base tracking-tight text-[var(--ink)]">
              Taskly
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowDebug(!showDebug)}
            className="p-1.5 rounded border border-[var(--border)] bg-white text-[var(--ink-soft)] text-xs font-mono"
            aria-label="Toggle debug panel"
          >
            <Bug className="w-4 h-4" />
          </button>
        </header>

        {/* View Component */}
        {renderActiveView()}
      </main>

      {/* Floating Action Button (FAB) on Mobile */}
      <button
        type="button"
        onClick={() => openCreateTaskModal()}
        aria-label="Create new task"
        className="md:hidden fixed right-5 bottom-20 z-40 w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--accent-hover)] transition-transform active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Desktop Debug Toggle in Bottom Corner */}
      <div className="hidden md:block fixed bottom-4 right-4 z-30">
        <button
          type="button"
          onClick={() => setShowDebug(!showDebug)}
          className="p-2 rounded-full bg-white border border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--accent)] shadow-hairline transition-colors"
          title="Toggle Debug Panel"
        >
          <Bug className="w-4 h-4" />
        </button>
      </div>

      {/* Debug Panel Modal */}
      {showDebug && <DebugPanel onClose={() => setShowDebug(false)} />}

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Slide-over Task Editor */}
      <TaskEditorModal />

      {/* Habit Editor Modal */}
      <HabitEditorModal />

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};
