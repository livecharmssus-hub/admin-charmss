import React from 'react';
import { Star, Paperclip, Trash2, Archive } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  preview?: string;
  date: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  type: 'message' | 'videocall' | 'admin' | 'model';
  avatar?: string;
  priority: 'high' | 'normal' | 'low';
}

interface EmailListProps {
  emails: Email[];
  selectedEmail: string | null;
  setSelectedEmail: (id: string) => void;
  folder: string;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmail,
  setSelectedEmail,
  folder,
  onToggleStar,
  onDelete,
  onArchive,
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'videocall':
        return 'bg-blue-500';
      case 'admin':
        return 'bg-red-500';
      case 'model':
        return 'bg-purple-500';
      default:
        return 'bg-cyan-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'videocall':
        return 'VideoCall';
      case 'admin':
        return 'Admin';
      case 'model':
        return 'Model';
      default:
        return 'Message';
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const emailDate = new Date(date);
    const diffInMonths = Math.floor(
      (now.getTime() - emailDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    if (diffInMonths >= 12) {
      return `about ${Math.floor(diffInMonths / 12)} year${
        Math.floor(diffInMonths / 12) > 1 ? 's' : ''
      } ago`;
    } else if (diffInMonths >= 1) {
      return `about ${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else {
      return 'less than a month ago';
    }
  };

  return (
    <div className="flex-1 bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-3 md:p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-semibold text-white capitalize">{folder}</h2>
          <div className="flex items-center space-x-2">
            <select className="bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-sm">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-400">entries</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Showing 1 to {Math.min(10, emails.length)} of {emails.length} entries
          </span>
          <div className="flex items-center space-x-1">
            <input
              type="text"
              placeholder="Search:"
              className="bg-slate-700 border border-slate-600 text-white rounded px-2 py-1 text-sm w-32 md:w-48 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Email List Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-2 md:p-3">
        <div className="grid grid-cols-12 gap-2 md:gap-4 text-xs md:text-sm font-medium text-gray-400">
          <div className="col-span-2 md:col-span-2">Sent</div>
          <div className="col-span-1 md:col-span-1 text-center">★</div>
          <div className="col-span-1 md:col-span-1 text-center">📎</div>
          <div className="col-span-2 md:col-span-2">To</div>
          <div className="col-span-5 md:col-span-5">Subject</div>
          <div className="col-span-1 md:col-span-1 text-center">🗑️</div>
        </div>
      </div>

      {/* Email List */}
      <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
        {emails.map((email) => (
          <div
            key={email.id}
            onClick={() => setSelectedEmail(email.id)}
            className={`border-b border-slate-700 p-2 md:p-3 hover:bg-slate-800 cursor-pointer transition-colors ${
              selectedEmail === email.id ? 'bg-slate-700 border-pink-500' : ''
            } ${!email.isRead ? 'bg-slate-800 font-medium' : ''}`}
          >
            <div className="grid grid-cols-12 gap-2 md:gap-4 items-center text-xs md:text-sm">
              {/* Date */}
              <div className="col-span-2 md:col-span-2 text-gray-400">
                <div className="text-xs">{email.date}</div>
                <div className="text-xs text-gray-500">{email.time}</div>
              </div>

              {/* Star */}
              <div className="col-span-1 md:col-span-1 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(email.id);
                  }}
                  className={`p-1 rounded ${
                    email.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Star className="w-4 h-4" fill={email.isStarred ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Attachment */}
              <div className="col-span-1 md:col-span-1 text-center">
                {email.hasAttachment && <Paperclip className="w-4 h-4 text-gray-400" />}
              </div>

              {/* To */}
              <div className="col-span-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  {email.avatar && (
                    <img src={email.avatar} alt={email.to} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="text-white truncate">{email.to}</span>
                </div>
              </div>

              {/* Subject */}
              <div className="col-span-5 md:col-span-5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs text-white ${getTypeColor(
                      email.type
                    )}`}
                  >
                    {formatTimeAgo(email.date)}
                  </span>
                  <span className="text-pink-400 hover:text-pink-300 truncate cursor-pointer">
                    {email.subject}
                  </span>
                  <span className="ml-2 px-2 py-0.5 rounded text-xs bg-slate-700 text-gray-300">
                    {getTypeLabel(email.type)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1 md:col-span-1 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(email.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(email.id);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-200 rounded ml-1"
                  title="Archive"
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-slate-800 border-t border-slate-700 p-3 md:p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Showing 1 to 10 of 60 entries</span>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1 border border-slate-600 bg-slate-700 text-white rounded text-sm hover:bg-slate-600">
              Previous
            </button>
            <button className="px-3 py-1 bg-pink-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-slate-600 bg-slate-700 text-white rounded text-sm hover:bg-slate-600">
              2
            </button>
            <button className="px-3 py-1 border border-slate-600 bg-slate-700 text-white rounded text-sm hover:bg-slate-600">
              3
            </button>
            <button className="px-3 py-1 border border-slate-600 bg-slate-700 text-white rounded text-sm hover:bg-slate-600">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailList;
