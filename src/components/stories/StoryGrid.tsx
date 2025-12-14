import React from 'react';
import { Play, Eye, Heart, Clock, Plus } from 'lucide-react';

interface Story {
  id: string;
  type: 'photo' | 'video';
  url: string;
  comment: string;
  publishDate: string;
  publishTime: string;
  duration: number;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  isActive: boolean;
  timeRemaining: string;
}

interface StoryGridProps {
  stories: Story[];
  onStoryClick: (index: number) => void;
  onCreateStory: () => void;
}

const StoryGrid: React.FC<StoryGridProps> = ({ stories, onStoryClick, onCreateStory }) => {
  const activeStories = stories.filter(story => story.isActive);
  const expiredStories = stories.filter(story => !story.isActive);

  return (
    <div className="space-y-6">
      {/* Active Stories */}
      {activeStories.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Historias Activas ({activeStories.length})</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Create new story button */}
            <button
              onClick={onCreateStory}
              className="aspect-[9/16] bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex flex-col items-center justify-center text-white hover:from-purple-700 hover:to-pink-700 transition-all border-2 border-dashed border-white/30 hover:border-white/50"
            >
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Nueva Historia</span>
            </button>

            {activeStories.map((story, index) => (
              <div
                key={story.id}
                onClick={() => onStoryClick(stories.indexOf(story))}
                className="aspect-[9/16] relative rounded-xl overflow-hidden cursor-pointer group hover:scale-105 transition-transform"
              >
                {/* Story preview */}
                <div className="absolute inset-0">
                  {story.type === 'photo' ? (
                    <img
                      src={story.url}
                      alt="Story"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        src={story.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                {/* Story info */}
                <div className="absolute top-3 left-3 right-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      story.type === 'video' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {story.type === 'video' ? 'Video' : 'Foto'}
                    </span>
                    <div className="flex items-center space-x-1 text-white text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{story.timeRemaining}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white text-xs mb-2 line-clamp-2">
                    {story.comment}
                  </div>
                  <div className="flex items-center justify-between text-white/80 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{story.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{story.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active indicator */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expired Stories */}
      {expiredStories.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Historias Expiradas ({expiredStories.length})</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {expiredStories.map((story, index) => (
              <div
                key={story.id}
                className="aspect-[9/16] relative rounded-xl overflow-hidden opacity-60"
              >
                {/* Story preview */}
                <div className="absolute inset-0">
                  {story.type === 'photo' ? (
                    <img
                      src={story.url}
                      alt="Story"
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        src={story.url}
                        className="w-full h-full object-cover grayscale"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                {/* Expired label */}
                <div className="absolute top-3 left-3 right-3">
                  <span className="px-2 py-1 bg-gray-600 text-white rounded-full text-xs font-medium">
                    Expirada
                  </span>
                </div>

                {/* Stats */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white text-xs mb-2 line-clamp-2">
                    {story.comment}
                  </div>
                  <div className="flex items-center space-x-3 text-white/60 text-xs">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{story.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{story.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {stories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">¡Crea tu primera historia!</h3>
          <p className="text-white/70 mb-6">Comparte momentos especiales con tus seguidores</p>
          <button
            onClick={onCreateStory}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Crear Historia
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryGrid;