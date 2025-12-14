import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Streaming from './pages/Streaming';
import VideoCall from './pages/VideoCall';
import Payments from './pages/Payments';
import Photos from './pages/Photos';
import Videos from './pages/Videos';
import Stories from './pages/Stories';
import CustomerRegister from './pages/CustomerRegister';
import Inbox from './pages/Inbox';
import Login from './pages/Login';
import Performers from './pages/Performers';
import HelpModal from './components/help/HelpModal';
import InstallPrompt from './components/InstallPrompt';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [earnings, setEarnings] = useState(0.00);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const handlePageChange = (page: string) => {
    if (page === 'help') {
      setShowHelpModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard earnings={earnings} isStreaming={isStreaming} />;
      case 'chat':
        return <Chat />;
      case 'profile':
        return <Profile />;
      case 'streaming':
        return <Streaming isStreaming={isStreaming} setIsStreaming={setIsStreaming} />;
      case 'videocall':
        return <VideoCall />;
      case 'payments':
        return <Payments earnings={earnings} />;
      case 'photos':
        return <Photos />;
      case 'videos':
        return <Videos />;
      case 'stories':
        return <Stories />;
      case 'customer-register':
        return <CustomerRegister />;
      case 'inbox':
        return <Inbox />;
      case 'performers':
        return <Performers />;
      case 'help':
        return <Dashboard earnings={earnings} isStreaming={isStreaming} />;
      default:
        return <Dashboard earnings={earnings} isStreaming={isStreaming} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden transition-colors">
      <div className="flex h-screen">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            earnings={earnings}
            onlineStatus={onlineStatus}
            setOnlineStatus={setOnlineStatus}
            setSidebarOpen={setSidebarOpen}
          />
          <main className="flex-1 p-3 md:p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900">
            {renderPage()}
          </main>
        </div>
      </div>
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
      <InstallPrompt />
    </div>
  );
}

export default App;