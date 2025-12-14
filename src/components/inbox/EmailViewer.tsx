import React from 'react';
import {
  Reply,
  ReplyAll,
  Forward,
  Star,
  Archive,
  Trash2,
  Printer as Print,
  Download,
  MoreVertical,
} from 'lucide-react';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  preview?: string;
  date: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  type: 'message' | 'videocall' | 'admin' | 'model';
  avatar?: string;
  priority: 'high' | 'normal' | 'low';
  attachments?: Array<{ name: string; size: string; type: string }>;
}

interface EmailViewerProps {
  email: Email;
  onReply: (email: Email) => void;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

const EmailViewer: React.FC<EmailViewerProps> = ({
  email,
  onReply,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex-1 bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-3 md:p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-xs text-white ${getTypeColor(email.type)}`}
            >
              {email.type.toUpperCase()}
            </span>
            <span className={`text-sm font-medium ${getPriorityColor(email.priority)}`}>
              {email.priority.toUpperCase()} PRIORITY
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleStar(email.id)}
              className={`p-2 rounded-lg transition-colors ${
                email.isStarred
                  ? 'text-yellow-500 bg-slate-700'
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              <Star className="w-5 h-5" fill={email.isStarred ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors">
              <Print className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{email.subject}</h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {email.avatar && (
              <img src={email.avatar} alt={email.from} className="w-10 h-10 rounded-full" />
            )}
            <div>
              <div className="text-sm font-medium text-white">From: {email.from}</div>
              <div className="text-sm text-gray-400">To: {email.to}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-300">{email.date}</div>
            <div className="text-sm text-gray-400">{email.time}</div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-slate-800 border-b border-slate-700 p-2 md:p-3">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => onReply(email)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
          >
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm whitespace-nowrap">
            <ReplyAll className="w-4 h-4" />
            <span>Reply All</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm whitespace-nowrap">
            <Forward className="w-4 h-4" />
            <span>Forward</span>
          </button>
          <button
            onClick={() => onArchive(email.id)}
            className="flex items-center space-x-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
          >
            <Archive className="w-4 h-4" />
            <span>Archive</span>
          </button>
          <button
            onClick={() => onDelete(email.id)}
            className="flex items-center space-x-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6">
        <div className="max-w-4xl">
          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <div className="mb-6 p-4 bg-slate-800 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-3">
                Attachments ({email.attachments.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {email.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-700 p-3 rounded border border-slate-600"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {attachment.type.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{attachment.name}</div>
                        <div className="text-xs text-gray-400">{attachment.size}</div>
                      </div>
                    </div>
                    <button className="p-2 text-pink-400 hover:text-pink-300 rounded-lg hover:bg-slate-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Body */}
          <div className="prose max-w-none">
            <div className="text-white leading-relaxed whitespace-pre-wrap text-sm md:text-base">
              {email.message}
            </div>
          </div>

          {/* Marketing Insights */}
          {email.type === 'message' && (
            <div className="mt-8 p-4 bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-lg border border-pink-500/30">
              <h3 className="text-sm font-medium text-pink-400 mb-2">💡 Marketing Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-800 p-3 rounded border border-slate-600">
                  <div className="text-gray-400">Engagement Score</div>
                  <div className="text-lg font-bold text-pink-600">8.5/10</div>
                </div>
                <div className="bg-slate-800 p-3 rounded border border-slate-600">
                  <div className="text-gray-400">Response Rate</div>
                  <div className="text-lg font-bold text-green-600">92%</div>
                </div>
                <div className="bg-slate-800 p-3 rounded border border-slate-600">
                  <div className="text-gray-400">Revenue Potential</div>
                  <div className="text-lg font-bold text-purple-600">High</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                💡 This user has high engagement. Consider sending personalized content or exclusive
                offers.
              </div>
            </div>
          )}

          {/* Quick Actions for Marketing */}
          <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-600">
            <h3 className="text-sm font-medium text-pink-400 mb-3">🚀 Quick Marketing Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <button className="text-left p-2 bg-slate-700 border border-slate-600 text-white rounded text-sm hover:bg-slate-600 transition-colors">
                📸 Send Photo Preview
              </button>
              <button className="text-left p-2 bg-slate-700 border border-slate-600 text-white rounded text-sm hover:bg-slate-600 transition-colors">
                🎥 Invite to Private Show
              </button>
              <button className="text-left p-2 bg-slate-700 border border-slate-600 text-white rounded text-sm hover:bg-slate-600 transition-colors">
                💎 Offer Premium Content
              </button>
              <button className="text-left p-2 bg-slate-700 border border-slate-600 text-white rounded text-sm hover:bg-slate-600 transition-colors">
                🎁 Send Special Discount
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailViewer;
