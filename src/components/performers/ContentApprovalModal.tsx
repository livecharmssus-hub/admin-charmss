import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Image as ImageIcon, Video, Filter, Calendar } from 'lucide-react';

interface Performer {
  id: string;
  full_name: string;
  stage_name: string;
  avatar_url: string;
}

interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  uploaded_date: string;
  status: 'pending' | 'approved' | 'rejected';
  title?: string;
}

interface ContentApprovalModalProps {
  performer: Performer | null;
  onClose: () => void;
}

const MOCK_MEDIA: MediaItem[] = [
  {
    id: '1',
    type: 'photo',
    url: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg',
    uploaded_date: '2024-10-08',
    status: 'pending',
    title: 'Performance Photo 1'
  },
  {
    id: '2',
    type: 'photo',
    url: 'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg',
    uploaded_date: '2024-10-07',
    status: 'pending',
    title: 'Performance Photo 2'
  },
  {
    id: '3',
    type: 'video',
    url: 'https://example.com/video1.mp4',
    thumbnail: 'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg',
    uploaded_date: '2024-10-06',
    status: 'pending',
    title: 'Performance Video 1'
  },
  {
    id: '4',
    type: 'photo',
    url: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg',
    uploaded_date: '2024-10-05',
    status: 'approved',
    title: 'Performance Photo 3'
  },
  {
    id: '5',
    type: 'video',
    url: 'https://example.com/video2.mp4',
    thumbnail: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    uploaded_date: '2024-10-04',
    status: 'rejected',
    title: 'Performance Video 2'
  },
  {
    id: '6',
    type: 'photo',
    url: 'https://images.pexels.com/photos/718978/pexels-photo-718978.jpeg',
    uploaded_date: '2024-10-03',
    status: 'pending',
    title: 'Performance Photo 4'
  }
];

export default function ContentApprovalModal({ performer, onClose }: ContentApprovalModalProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(MOCK_MEDIA);
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  if (!performer) return null;

  const handleApprove = (id: string) => {
    setMediaItems(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'approved' as const } : item)
    );
  };

  const handleReject = (id: string) => {
    setMediaItems(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'rejected' as const } : item)
    );
  };

  const filteredMedia = mediaItems.filter(item => {
    const typeMatch = filterType === 'all' || item.type === filterType;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const pendingCount = mediaItems.filter(item => item.status === 'pending').length;
  const approvedCount = mediaItems.filter(item => item.status === 'approved').length;
  const rejectedCount = mediaItems.filter(item => item.status === 'rejected').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img
                src={performer.avatar_url}
                alt={performer.stage_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Aprobación de Contenido
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {performer.stage_name} - {performer.full_name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros:</span>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Todos los tipos</option>
              <option value="photo">Fotos</option>
              <option value="video">Videos</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes ({pendingCount})</option>
              <option value="approved">Aprobados ({approvedCount})</option>
              <option value="rejected">Rechazados ({rejectedCount})</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <ImageIcon className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg">No hay contenido que coincida con los filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video">
                    {item.type === 'photo' ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <Video className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="absolute top-2 right-2">
                      {item.type === 'photo' ? (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Foto
                        </span>
                      ) : (
                        <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          Video
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 left-2">
                      {item.status === 'pending' && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Pendiente
                        </span>
                      )}
                      {item.status === 'approved' && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Aprobado
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Rechazado
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.uploaded_date).toLocaleDateString()}</span>
                    </div>

                    {item.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          Rechazar
                        </button>
                      </div>
                    )}

                    {item.status === 'approved' && (
                      <button
                        onClick={() => handleReject(item.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-600 hover:bg-red-600 hover:text-white text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Rechazar
                      </button>
                    )}

                    {item.status === 'rejected' && (
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-600 hover:bg-green-600 hover:text-white text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Aprobar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-750">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Pendientes: <strong className="text-gray-900 dark:text-white">{pendingCount}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Aprobados: <strong className="text-gray-900 dark:text-white">{approvedCount}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Rechazados: <strong className="text-gray-900 dark:text-white">{rejectedCount}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
