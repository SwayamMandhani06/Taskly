import React, { useEffect, useState } from 'react';
import { useTaskStore } from './store/useTaskStore';
import { AppShell } from './components/layout/AppShell';
import { LandingPageView } from './views/LandingPageView';
import { AuthView } from './views/AuthView';
import { isSupabaseConfigured } from './lib/supabase';

export const App: React.FC = () => {
  const { loadData, user, authInitialized } = useTaskStore();
  const [currentRoute, setCurrentRoute] = useState<string>(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (routePath: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', routePath);
      setCurrentRoute(routePath);
      window.scrollTo(0, 0);
    }
  };

  // Render Routes
  const renderRouteContent = () => {
    const isConfigured = isSupabaseConfigured();

    // Reset password route
    if (currentRoute === '/reset-password') {
      return <AuthView mode="reset" onNavigate={navigate} />;
    }

    // Forgot password route
    if (currentRoute === '/forgot-password') {
      return <AuthView mode="forgot" onNavigate={navigate} />;
    }

    // Signup route
    if (currentRoute === '/signup') {
      if (user) {
        return <AppShell />;
      }
      return <AuthView mode="signup" onNavigate={navigate} />;
    }

    // Login route
    if (currentRoute === '/login') {
      if (user) {
        return <AppShell />;
      }
      return <AuthView mode="login" onNavigate={navigate} />;
    }

    // Main App route (/app)
    if (currentRoute === '/app') {
      if (isConfigured && !user && authInitialized) {
        return <AuthView mode="login" onNavigate={navigate} />;
      }
      return <AppShell />;
    }

    // Root homepage (/)
    if (currentRoute === '/' || currentRoute === '') {
      return <LandingPageView onNavigate={navigate} />;
    }

    // Fallback to App shell or Landing
    return <LandingPageView onNavigate={navigate} />;
  };

  return renderRouteContent();
};

export default App;
