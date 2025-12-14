import React, { useState } from 'react';

import { Bell, Menu, Sun, Moon } from 'lucide-react';
import UserMenu from './UserMenu';
import NotificationPanel from './NotificationPanel';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  earnings: number;
  onlineStatus: boolean;
  setOnlineStatus: (status: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ earnings, onlineStatus, setOnlineStatus, setSidebarOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-slate-800 dark:bg-slate-800 border-b border-slate-700 dark:border-slate-700 px-3 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-400" />
            )}
          </button>
          {/* Notification Bell - Always visible */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></div>
            </button>
            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
          <div className="flex items-center space-x-2 md:space-x-3 relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 md:space-x-3 hover:bg-slate-700 rounded-lg p-1 transition-colors"
            >
              <img 
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" 
                alt="Profile" 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-pink-500"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-medium">lgabrielcor</span>
                <span className="text-xs text-gray-400">Premium Member</span>
              </div>
            </button>
            {showUserMenu && (
              <UserMenu onClose={() => setShowUserMenu(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;