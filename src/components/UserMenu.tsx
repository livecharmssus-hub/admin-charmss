import React, { useState } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  onClose?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onClose }) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
      {/* User Info */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <img 
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" 
            alt="Profile" 
            className="w-12 h-12 rounded-full border-2 border-pink-500"
          />
          <div>
            <div className="text-white font-medium">lgabrielcor</div>
            <div className="text-sm text-gray-400">Administrator</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition-colors text-left">
          <Settings className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-white text-sm">Account Settings</div>
            <div className="text-xs text-gray-400">Manage your profile and preferences</div>
          </div>
        </button>
        
        <button className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition-colors text-left">
          <LogOut className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-white text-sm">Sign Out</div>
            <div className="text-xs text-gray-400">Log out of your account</div>
          </div>
        </button>
      </div>

      {/* Version Info */}
      <div className="px-4 py-3 border-t border-slate-700">
        <div className="text-xs text-gray-500">Version 2.1.0 • Live Charmss</div>
      </div>
    </div>
  );
};

export default UserMenu;