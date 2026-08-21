import React, { useEffect } from 'react';
import { useTaskStore } from './store/useTaskStore';
import { AppShell } from './components/layout/AppShell';

export const App: React.FC = () => {
  const loadData = useTaskStore(state => state.loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return <AppShell />;
};

export default App;
