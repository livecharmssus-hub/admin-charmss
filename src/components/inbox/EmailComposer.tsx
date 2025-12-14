import React, { useState } from 'react';
import { Send, Paperclip, Image, Smile, Bold, Italic, Underline, Link, Save, X } from 'lucide-react';

interface EmailComposerProps {
  onClose: () => void;
  onSend: (email: any) => void;
  replyTo?: any;
}

const EmailComposer: React.FC<EmailComposerProps> = ({ onClose, onSend, replyTo }) => {
  const [to, setTo] = useState(replyTo?.from || '');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'high' | 'normal' | 'low'>('normal');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSend = () => {
    const newEmail = {
      id: Date.now().toString(),
      to,
      subject,
      message,
      priority,
      attachments,
      date: new Date().toISOString(),
    };
    onSend(newEmail);
    onClose();
  };

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-orange-500 text-white p-3 md:p-4 flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold">
          {replyTo ? 'Reply' : 'Compose New Message'}
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-orange-600 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 p-3 md:p-6 overflow-y-auto">
        <div className="space-y-4 max-w-4xl">
          {/* Recipients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">To *</label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter recipient email or username"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'normal' | 'low')}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              required
            />
          </div>

          {/* Formatting Toolbar */}
          <div className="border border-slate-600 rounded-lg">
            <div className="bg-slate-800 border-b border-slate-600 p-2 flex items-center space-x-2 flex-wrap">
              <button className="p-2 hover:bg-slate-700 text-gray-300 rounded transition-colors">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-slate-700 text-gray-300 rounded transition-colors">
                <Italic className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-slate-700 text-gray-300 rounded transition-colors">
                <Underline className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-600"></div>
              <button className="p-2 hover:bg-slate-700 text-gray-300 rounded transition-colors">
                <Link className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-slate-700 text-gray-300 rounded transition-colors">
                <Smile className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-600"></div>
              <label className="p-2 hover:bg-slate-700 text-gray-300 rounded transition-colors cursor-pointer">
                <Paperclip className="w-4 h-4" />
                <input
                  type="file"
                  multiple
                  onChange={handleAttachment}
                  className="hidden"
                />
              </label>
              <label className="p-2 hover:bg-slate-700 text-gray-300 rounded transition-colors cursor-pointer">
                <Image className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAttachment}
                  className="hidden"
                />
              </label>
            </div>

            {/* Message Body */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={12}
              className="w-full bg-slate-900 text-white p-4 resize-none focus:outline-none text-sm"
              required
            />
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Attachments</label>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-white">{file.name}</span>
                      <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marketing Templates */}
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
            <h3 className="text-sm font-medium text-pink-400 mb-2">Quick Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <button
                onClick={() => setMessage('Hi! I have some exciting new content available. Would you like to see a preview? 💕')}
                className="text-left p-2 bg-slate-700 border border-slate-600 text-white rounded text-sm hover:bg-slate-600 transition-colors"
              >
                🎬 New Content Available
              </button>
              <button
                onClick={() => setMessage('Thank you for your support! I really appreciate you being part of my community. ❤️')}
                className="text-left p-2 bg-slate-700 border border-slate-600 text-white rounded text-sm hover:bg-slate-600 transition-colors"
              >
                💝 Thank You Message
              </button>
              <button
                onClick={() => setMessage('I\'m going live in 30 minutes! Don\'t miss out on the fun. See you there! 🔥')}
                className="text-left p-2 bg-slate-700 border border-slate-600 text-white rounded text-sm hover:bg-slate-600 transition-colors"
              >
                📺 Going Live Soon
              </button>
              <button
                onClick={() => setMessage('Special offer just for you! Get exclusive access to my premium content. Limited time only! ✨')}
                className="text-left p-2 bg-slate-700 border border-slate-600 text-white rounded text-sm hover:bg-slate-600 transition-colors"
              >
                🎁 Special Offer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-slate-800 border-t border-slate-700 p-3 md:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSend}
            disabled={!to || !subject || !message}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 text-white px-4 md:px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm md:text-base"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
          <button className="bg-slate-600 hover:bg-slate-500 text-white px-4 md:px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm md:text-base">
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white px-4 py-2 text-sm md:text-base"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EmailComposer;