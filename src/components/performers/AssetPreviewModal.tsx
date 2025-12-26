import React from 'react';
import { X, Heart, MessageSquare } from 'lucide-react';
import type { ContentItem } from '../../types/content';

interface AssetPreviewModalProps {
  asset: ContentItem;
  onClose: () => void;
}

export default function AssetPreviewModal({ asset, onClose }: AssetPreviewModalProps) {
  const statusMap: Record<number, { label: string; color: string }> = {
    1: { label: 'Subida', color: 'bg-gray-400' },
    2: { label: 'Aprobado', color: 'bg-green-500' },
    3: { label: 'Rechazado', color: 'bg-red-500' },
    4: { label: 'Inactiva', color: 'bg-blue-500' },
  };

  const s = asset.status && statusMap[asset.status] ? statusMap[asset.status] : { label: 'Pendiente', color: 'bg-yellow-500' };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose} />

      <div className="relative z-10 max-w-5xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded ${s.color}`} />
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{asset.assetName || asset.description || 'Sin título'}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {asset.creator?.username} • {new Date(asset.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Heart className="h-4 w-4" /> <span>{asset.likes ?? 0}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <MessageSquare className="h-4 w-4" /> <span>{asset.comments ?? 0}</span>
            </div>

            <button
              aria-label="Cerrar preview"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex items-center justify-center">
            {asset.type === 'photo' ? (
              <img
                src={asset.fileURL || asset.fileURLThumb}
                alt={asset.assetName || asset.description}
                className="max-h-[70vh] w-auto object-contain"
              />
            ) : (
              <video
                src={asset.fileURL}
                poster={asset.fileURLThumb}
                controls
                className="max-h-[70vh] w-full h-auto bg-black rounded"
              />
            )}
          </div>

          <div className="w-full md:w-64">
            <div className="mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Estado</div>
              <div className="mt-1 font-medium text-gray-900 dark:text-white">{s.label}</div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">Detalles</div>
              <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>
                  <strong>Likes:</strong> {asset.likes ?? 0}
                </li>
                <li>
                  <strong>Comments:</strong> {asset.comments ?? 0}
                </li>
                {asset.duration && (
                  <li>
                    <strong>Duración:</strong> {Math.round(asset.duration)}s
                  </li>
                )}
                <li>
                  <strong>Fecha:</strong> {new Date(asset.createdAt).toLocaleString()}
                </li>
                <li>
                  <strong>Nombre:</strong> {asset.assetName || asset.description || 'Sin título'}
                </li>
              </ul>
            </div>

            <div className="mt-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
