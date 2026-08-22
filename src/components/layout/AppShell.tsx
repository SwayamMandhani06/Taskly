import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from './ThemeToggle';
import { TodayView } from '../../views/TodayView';
import { UpcomingView } from '../../views/UpcomingView';
import { InboxView } from '../../views/InboxView';
import { PlanMyDayView } from '../../views/PlanMyDayView';
import { HabitsView } from '../../views/HabitsView';
import { CategoriesView } from '../../views/CategoriesView';
import { AllTasksView } from '../../views/AllTasksView';
import { CalendarView } from '../../views/CalendarView';
import { TaskEditorModal } from '../tasks/TaskEditorModal';
import { HabitEditorModal } from '../habits/HabitEditorModal';
import { DataSafetyModal } from '../common/DataSafetyModal';
import { AuthScreen } from '../common/AuthScreen';
import { ToastContainer } from '../common/Toast';
import { Plus, Bug, LogOut } from 'lucide-react';
import { DebugPanel } from '../debug/DebugPanel';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AppShell: React.FC = () => {
  const {
    activeView,
    openCreateTaskModal,
    initialized,
    user,
    authInitialized,
    signOut,
  } = useTaskStore();

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
      case 'categories':
        return <CategoriesView />;
      case 'all':
        return <AllTasksView />;
      case 'calendar':
        return <CalendarView />;
      default:
        return <TodayView />;
    }
  };

  if (!initialized || !authInitialized) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center font-mono text-xs text-[var(--ink-soft)]">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-card">
          <div className="w-4 h-4 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span>Initializing Taskly database & auth...</span>
        </div>
      </div>
    );
  }

  // Display Supabase Auth Screen if configured and user not logged in
  if (isSupabaseConfigured() && !user) {
    return (
      <>
        <AuthScreen />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row text-[var(--ink)] max-w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-y-auto pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-8 max-w-full">
        {/* Top Header Row for Mobile */}
        <header className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border)] md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-glow">
              <div className="w-1.5 h-4 bg-[var(--urgent)] rounded-full" />
            </div>
            <span className="font-bold font-sans text-lg tracking-tight text-[var(--ink)]">
              Taskly
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            <ThemeToggle compact={true} />

            {/* Mobile Sign Out Button */}
            {user && (
              <button
                type="button"
                onClick={signOut}
                aria-label="Sign Out"
                title="Sign Out"
                className="p-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-soft)] active:scale-95 flex items-center justify-center min-w-[36px] min-h-[36px]"
              >
                <LogOut className="w-4 h-4 text-[var(--urgent)]" />
              </button>
            )}

            {/* Mobile Debug Toggle */}
            <button
              type="button"
              onClick={() => setShowDebug(!showDebug)}
              className="p-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-soft)] text-xs font-mono active:scale-95 flex items-center justify-center min-w-[36px] min-h-[36px]"
              aria-label="Toggle debug panel"
            >
              <Bug className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Active View */}
        {renderActiveView()}
      </main>

      {/* Floating Action Button (FAB) on Mobile — Enlarged 60x60px */}
      <button
        type="button"
        onClick={() => openCreateTaskModal()}
        aria-label="Create new task"
        className="md:hidden fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 w-15 h-15 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-glow active:scale-95 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Desktop Debug Toggle in Bottom Corner */}
      <div className="hidden md:block fixed bottom-4 right-4 z-30">
        <button
          type="button"
          onClick={() => setShowDebug(!showDebug)}
          className="p-2.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-soft)] hover:text-[var(--accent)] shadow-card transition-all active:scale-95"
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

      {/* Data Safety & Backup Modal */}
      <DataSafetyModal />

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};
