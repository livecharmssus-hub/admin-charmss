import React, { useState } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import PerformerList from '../components/performers/PerformerList';
import PerformersService from '../app/services/performers.service';
import { GetPerformersParams, Performer, PerformerStatus } from '../app/types/performers.types';
import PerformerProfile from '../components/performers/PerformerProfile';
import AssetUploader from '../components/performers/AssetUploader';
import StreamingModal from '../components/performers/StreamingModal';
import ContentApprovalModal from '../components/performers/ContentApprovalModal';

// Performers are loaded from the backend service via `PerformersService`.

export default function Performers() {
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [statusFilterGlobal, setStatusFilterGlobal] = useState<string>('all');
  const [orderBy, setOrderBy] = useState<string>('lastName');
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
  const [activeModal, setActiveModal] = useState<
    'detail' | 'profile' | 'upload' | 'streaming' | 'approval' | null
  >(null);

  const fetchPerformers = async (params?: GetPerformersParams) => {
    setLoading(true);
    try {
      // Construir el objeto where
      const whereConditions: Record<string, unknown> = {};
      
      // Agregar filtro de búsqueda si existe
      const searchTerm = params?.where ?? search;
      if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim()) {
        whereConditions.OR = [
          { firstName: { contains: searchTerm } },
          { lastName: { contains: searchTerm } },
          { email: { contains: searchTerm } },
        ];
      }
      
      // Agregar filtro de status si no es 'all'
      const currentStatus = statusFilterGlobal;
      if (currentStatus !== 'all') {
        // Mapear status string a número según el backend
        const statusMap: Record<string, number> = {
          active: 0,
          inactive: 1,
          pending: 2,
          suspended: 3,
        };
        if (statusMap[currentStatus] !== undefined) {
          whereConditions.status = statusMap[currentStatus];
        }
      }

      const p: GetPerformersParams = {
        page: params?.page ?? page,
        limit: params?.limit ?? limit,
        orderBy: params?.orderBy ?? { [orderBy]: 'asc' },
        where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      };

      const resp = await PerformersService.getPerformers(p);
      setPerformers(resp.items);
      setTotal(resp.total);
      setPage(resp.page);
      setLimit(resp.limit);
    } catch (error) {
      console.error('Error fetching performers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setPerformers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus as PerformerStatus } : p))
    );
  };

  const handleViewProfile = (performer: Performer) => {
    setSelectedPerformer(performer);
    setActiveModal('profile');
  };

  React.useEffect(() => {
    // Initial load
    fetchPerformers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewStreaming = (performer: Performer) => {
    setSelectedPerformer(performer);
    setActiveModal('streaming');
  };

  const handleUploadAssets = (performer: Performer) => {
    setSelectedPerformer(performer);
    setActiveModal('upload');
  };

  const handleApproveContent = (performer: Performer) => {
    setSelectedPerformer(performer);
    setActiveModal('approval');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedPerformer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                Administración de Performers
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Gestiona los performers de la plataforma
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => fetchPerformers()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando performers...</p>
            </div>
          ) : (
            <PerformerList
              performers={performers}
              onToggleStatus={handleToggleStatus}
              onViewProfile={handleViewProfile}
              onViewStreaming={handleViewStreaming}
              onUploadAssets={handleUploadAssets}
              onApproveContent={handleApproveContent}
              totalCount={total}
              currentPage={page}
              itemsPerPage={limit}
              onChangePage={(p) => {
                setPage(p);
                fetchPerformers({ page: p });
              }}
              onChangeItemsPerPage={(n) => {
                setLimit(n);
                setPage(1);
                fetchPerformers({ limit: n, page: 1 });
              }}
              onSearch={(term) => {
                setSearch(term);
                setPage(1);
                fetchPerformers({ where: term, page: 1 });
              }}
              onFilterStatus={(status) => {
                setStatusFilterGlobal(status);
                setPage(1);
                fetchPerformers({ page: 1 });
              }}
              onSort={(field) => {
                setOrderBy(field);
                setPage(1);
                fetchPerformers({ orderBy: field, page: 1 });
              }}
            />
          )}
        </div>
      </div>

      {activeModal === 'profile' && (
        <PerformerProfile performer={selectedPerformer} onClose={handleCloseModal} />
      )}

      {activeModal === 'upload' && (
        <AssetUploader performer={selectedPerformer} onClose={handleCloseModal} />
      )}

      {activeModal === 'streaming' && selectedPerformer && (
        <StreamingModal performer={selectedPerformer} onClose={handleCloseModal} />
      )}

      {activeModal === 'approval' && (
        <ContentApprovalModal performer={selectedPerformer} onClose={handleCloseModal} />
      )}
    </div>
  );
}

