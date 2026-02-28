/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {StrictMode, useState} from 'react';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AdDecoder from './pages/AdDecoder';
import IntentMiner from './pages/IntentMiner';
import Settings from './pages/Settings';
import Automation from './pages/Automation';
import FutureWinners from './pages/FutureWinners';
import './i18n';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'trends':
        return <FutureWinners />;
      case 'ad-decoder':
        return <AdDecoder />;
      case 'intent-miner':
        return <IntentMiner />;
      case 'automation':
        return <Automation />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </AppLayout>
  );
}
