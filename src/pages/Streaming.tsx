import React, { useState } from 'react';
import { Play, Square, Camera, Mic, MicOff, CameraOff, Settings, Users, Eye } from 'lucide-react';
import ChatComponent from '../components/ChatComponent';

interface StreamingProps {
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
}

const Streaming: React.FC<StreamingProps> = ({ isStreaming, setIsStreaming }) => {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [streamType, setStreamType] = useState('public');
  const [viewers, setViewers] = useState(0);
  const [streamingTime, setStreamingTime] = useState('0:00');

  const handleStartStream = () => {
    setIsStreaming(true);
    setViewers(Math.floor(Math.random() * 50) + 10);
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    setViewers(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Live Streaming</h1>
        <div className="flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-red-500' : 'bg-gray-500'}`}></div>
            <span className="text-xs md:text-sm text-gray-400">
              Status: {isStreaming ? 'Live' : 'Offline'}
            </span>
          </div>
          {isStreaming && (
            <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{viewers} viewers</span>
              </div>
              <div className="hidden md:block">Streaming time: {streamingTime}</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        {/* Main Streaming Area */}
        <div className="lg:col-span-2 space-y-3 md:space-y-4">
          {/* Camera Preview */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 aspect-video relative overflow-hidden">
            {cameraEnabled ? (
              <div className="w-full h-full bg-gradient-to-br from-pink-900 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-2 md:mb-4" />
                  <p className="text-white text-base md:text-lg">Camera Preview</p>
                  <p className="text-gray-300 text-xs md:text-sm">Your live stream will appear here</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <CameraOff className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-2 md:mb-4" />
                  <p className="text-gray-400 text-base md:text-lg">Camera Disabled</p>
                </div>
              </div>
            )}
            
            {isStreaming && (
              <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-red-600 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold flex items-center space-x-1 md:space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>LIVE</span>
              </div>
            )}
          </div>

          {/* Stream Controls */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-4">Stream Controls</h3>
            
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`p-2 md:p-3 rounded-lg transition-colors ${
                    cameraEnabled 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {cameraEnabled ? <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <CameraOff className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                </button>
                
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`p-2 md:p-3 rounded-lg transition-colors ${
                    micEnabled 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {micEnabled ? <Mic className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <MicOff className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                </button>

                <button className="p-2 md:p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                  <Settings className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3">
                {!isStreaming ? (
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                    <button
                      onClick={handleStartStream}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center space-x-2 transition-colors text-sm md:text-base"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Start Public Show</span>
                    </button>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base">
                      Start Private Show
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStopStream}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center space-x-2 transition-colors text-sm md:text-base"
                  >
                    <Square className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Stop Show</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
              <div className="bg-slate-700 p-2 md:p-3 rounded-lg">
                <div className="text-gray-400">Streaming time:</div>
                <div className="text-white font-medium">{streamingTime}</div>
              </div>
              <div className="bg-slate-700 p-2 md:p-3 rounded-lg">
                <div className="text-gray-400">Status:</div>
                <div className="text-white font-medium">{isStreaming ? 'Live' : 'Offline'}</div>
              </div>
              <div className="bg-slate-700 p-2 md:p-3 rounded-lg">
                <div className="text-gray-400">Bytes sent:</div>
                <div className="text-white font-medium">{isStreaming ? '1.2MB' : '0'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Chat */}
        <div className="space-y-3 md:space-y-4">
          {/* Live Chat */}
          <div className="h-64 md:h-80">
            <ChatComponent 
              title="Live Chat"
              isPublic={true}
              className="h-full"
            />
          </div>
          
          {/* Stream Settings */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-4">Stream Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">Streaming Type:</label>
                <select
                  value={streamType}
                  onChange={(e) => setStreamType(e.target.value)}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                >
                  <option value="public">Public Show</option>
                  <option value="private">Private Show</option>
                  <option value="group">Group Show</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">Quality:</label>
                <select className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm">
                  <option value="hd">HD (720p)</option>
                  <option value="fhd">Full HD (1080p)</option>
                  <option value="sd">SD (480p)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">Language:</label>
                <select className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Stats */}
          {isStreaming && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4">Live Stats</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current Viewers:</span>
                  <span className="text-white font-medium">{viewers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Tips:</span>
                  <span className="text-green-500 font-medium">$45.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Private Requests:</span>
                  <span className="text-pink-500 font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">New Followers:</span>
                  <span className="text-blue-500 font-medium">12</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-colors text-sm">
                Send Notification
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm">
                Share Stream Link
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors text-sm">
                Schedule Stream
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Streaming;