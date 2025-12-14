import React, { useState } from 'react';
import { Upload, Video, Eye, Heart, Download, Edit, Plus, Play, Calendar, DollarSign, MoreVertical } from 'lucide-react';

const Videos: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  

  const categories = [
    { id: 'all', label: 'All Videos', count: 18 },
    { id: 'public', label: 'Public', count: 8 },
    { id: 'premium', label: 'Premium', count: 6 },
    { id: 'private', label: 'Private', count: 4 },
  ];

  const videos = [
    {
      id: 1,
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      title: 'Morning Routine ✨',
      description:
        'Starting my day with positive energy and good vibes! Join me in my morning routine.',
      category: 'premium',
      duration: '2:45',
      views: 1234,
      likes: 189,
      earnings: 67.5,
      uploadDate: '2025-01-15',
      size: '15.2 MB',
    },
    {
      id: 2,
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnail:
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      title: 'Dance Challenge 💃',
      description: 'Learning the latest dance trend! What do you think of my moves?',
      category: 'public',
      duration: '1:30',
      views: 892,
      likes: 156,
      earnings: 0,
      uploadDate: '2025-01-14',
      size: '8.7 MB',
    },
    {
      id: 3,
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      title: 'Behind the Scenes 🎬',
      description: 'Exclusive look at my photoshoot preparation. Premium members only!',
      category: 'premium',
      duration: '4:12',
      views: 567,
      likes: 98,
      earnings: 89.3,
      uploadDate: '2025-01-13',
      size: '22.1 MB',
    },
    {
      id: 4,
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnail:
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      title: 'Personal Message 💕',
      description: 'Special thank you message for my most loyal supporters.',
      category: 'private',
      duration: '3:20',
      views: 234,
      likes: 67,
      earnings: 125.0,
      uploadDate: '2025-01-12',
      size: '18.5 MB',
    },
    {
      id: 5,
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      title: 'Workout Session 💪',
      description: 'Join me for my daily workout routine! Stay fit and healthy together.',
      category: 'public',
      duration: '5:45',
      views: 1456,
      likes: 234,
      earnings: 0,
      uploadDate: '2025-01-11',
      size: '31.2 MB',
    },
    {
      id: 6,
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnail:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      title: 'Cooking Tutorial 👩‍🍳',
      description: 'Making my favorite healthy recipe! Perfect for a cozy evening.',
      category: 'premium',
      duration: '6:30',
      views: 789,
      likes: 145,
      earnings: 45.8,
      uploadDate: '2025-01-10',
      size: '28.9 MB',
    },
  ];

  const filteredVideos =
    selectedCategory === 'all'
      ? videos
      : videos.filter((video) => video.category === selectedCategory);

  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
  const totalEarnings = videos.reduce((sum, video) => sum + video.earnings, 0);
  const totalLikes = videos.reduce((sum, video) => sum + video.likes, 0);

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const formatDuration = (duration: string) => duration;
  const formatFileSize = (size: string) => size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Video Gallery</h1>
        <button className="bg-pink-600 hover:bg-pink-700 text-white px-3 md:px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm md:text-base">
          <Upload className="w-4 h-4" />
          <span className="hidden md:inline">Upload Video</span>
          <span className="md:hidden">Upload</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Total Videos</p>
              <p className="text-lg md:text-2xl font-bold text-white">{videos.length}</p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-blue-600">
              <Video className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Total Views</p>
              <p className="text-lg md:text-2xl font-bold text-white">
                {totalViews.toLocaleString()}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-green-600">
              <Eye className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Total Likes</p>
              <p className="text-lg md:text-2xl font-bold text-white">{totalLikes}</p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-pink-600">
              <Heart className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-3 md:p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs md:text-sm">Video Earnings</p>
              <p className="text-lg md:text-2xl font-bold text-white">
                ${totalEarnings.toFixed(2)}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-lg bg-purple-600">
              <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Management */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 md:p-6">
        {/* Header with filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto w-full md:w-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 md:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm ${
                  selectedCategory === category.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm">
              <Filter className="w-4 h-4" />
              <span className="hidden md:inline">Filter</span>
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm">
              <Calendar className="w-4 h-4" />
              <span className="hidden md:inline">Sort</span>
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-slate-700 rounded-lg overflow-hidden group hover:bg-slate-600 transition-colors"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleVideoClick(video.id.toString())}
                    className="w-12 h-12 md:w-16 md:h-16 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
                  </button>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
                  {formatDuration(video.duration)}
                </div>

                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      video.category === 'premium'
                        ? 'bg-yellow-600 text-white'
                        : video.category === 'private'
                        ? 'bg-red-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
                  </span>
                </div>

                {/* Lock icon for Premium/Private */}
                {(video.category === 'premium' || video.category === 'private') && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                      <span className="text-xs">🔒</span>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1">
                    <button className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                      <Edit className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </button>
                    <button className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                      <Download className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </button>
                    <button className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
                      <MoreVertical className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 md:p-4">
                <h3 className="text-white font-medium mb-2 text-sm md:text-base line-clamp-1">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center justify-between text-xs md:text-sm text-gray-400 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{video.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{video.likes}</span>
                    </div>
                  </div>
                  {video.earnings > 0 && (
                    <span className="text-green-500 font-medium">${video.earnings}</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{video.uploadDate}</span>
                  <span>{formatFileSize(video.size)}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Upload New Video Card */}
          <div className="bg-slate-700 rounded-lg border-2 border-dashed border-slate-600 hover:border-pink-500 transition-colors cursor-pointer group">
            <div className="aspect-video flex items-center justify-center">
              <div className="text-center">
                <Plus className="w-8 h-8 md:w-12 md:h-12 text-gray-400 group-hover:text-pink-500 mx-auto mb-2 transition-colors" />
                <p className="text-gray-400 group-hover:text-pink-500 transition-colors text-xs md:text-sm">
                  Upload New Video
                </p>
                <p className="text-gray-500 text-xs mt-1">Max 100MB • MP4, MOV, AVI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Analytics */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4">Video Performance</h3>

        <div className="space-y-4">
          {videos.slice(0, 5).map((video, _index) => (
            <div
              key={video.id}
              className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-4 h-4 md:w-6 md:h-6 text-white opacity-75" />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm md:text-base line-clamp-1">
                    {video.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-xs md:text-sm text-gray-400">
                    <span>{formatDuration(video.duration)}</span>
                    <span>{video.uploadDate}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        video.category === 'premium'
                          ? 'bg-yellow-600 text-white'
                          : video.category === 'private'
                          ? 'bg-red-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {video.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="text-white font-medium">{video.views.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{video.likes}</div>
                    <div className="text-gray-400 text-xs">likes</div>
                  </div>
                  {video.earnings > 0 && (
                    <div className="text-center">
                      <div className="text-green-500 font-medium">${video.earnings}</div>
                      <div className="text-gray-400 text-xs">earned</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold">Video Player</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                className="w-full h-full"
                controls
                autoPlay
                src={videos.find((v) => v.id.toString() === selectedVideo)?.url}
              />
            </div>
            <div className="p-4">
              <h4 className="text-white font-medium mb-2">
                {videos.find((v) => v.id.toString() === selectedVideo)?.title}
              </h4>
              <p className="text-gray-400 text-sm">
                {videos.find((v) => v.id.toString() === selectedVideo)?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
