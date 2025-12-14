import React from 'react';
import { Inbox, Send, Users, Star, Trash2, Archive, Plus, Search } from 'lucide-react';

interface EmailSidebarProps {
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  unreadCounts: { [key: string]: number };
}

const EmailSidebar: React.FC<EmailSidebarProps> = ({
  selectedFolder,
  setSelectedFolder,
  unreadCounts,
}) => {
  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: unreadCounts.inbox || 0 },
    { id: 'sent', label: 'Sent', icon: Send, count: 0 },
    { id: 'starred', label: 'Starred', icon: Star, count: unreadCounts.starred || 0 },
    { id: 'contacts', label: 'Contacts', icon: Users, count: 0 },
    { id: 'archive', label: 'Archive', icon: Archive, count: 0 },
    { id: 'trash', label: 'Trash', icon: Trash2, count: 0 },
  ];

  return (
    <div className="w-full md:w-64 bg-slate-800 border-r border-slate-700 flex flex-col text-white">
      {/* Compose Button */}
      <div className="p-3 md:p-4 border-b border-slate-700">
        <button
          onClick={() => setSelectedFolder('compose')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 md:py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Compose</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-3 md:p-4 border-b border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search emails..."
            className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
          />
        </div>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 md:p-3">
          <h3 className="text-xs md:text-sm font-medium text-gray-400 mb-2 px-2">FOLDERS</h3>
          <nav className="space-y-1">
            {folders.map((folder) => {
              const Icon = folder.icon;
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-sm ${
                    selectedFolder === folder.id
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{folder.label}</span>
                  </div>
                  {folder.count > 0 && (
                    <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                      {folder.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Storage Info */}
      <div className="p-3 md:p-4 border-t border-slate-700">
        <div className="text-xs text-gray-400">
          <div className="flex justify-between mb-1">
            <span>Storage used</span>
            <span>2.1 GB / 15 GB</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-pink-500 h-2 rounded-full" style={{ width: '14%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSidebar;
