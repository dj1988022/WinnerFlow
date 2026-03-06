import { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import FutureWinners from './pages/FutureWinners';
import IntentMiner from './pages/IntentMiner';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'trends': return <FutureWinners />;
      case 'intent-miner': return <IntentMiner />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </AppLayout>
  );
}
