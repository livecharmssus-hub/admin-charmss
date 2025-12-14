import React, { useState } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import PerformerList from '../components/performers/PerformerList';
import PerformerProfile from '../components/performers/PerformerProfile';
import AssetUploader from '../components/performers/AssetUploader';
import StreamingModal from '../components/performers/StreamingModal';
import ContentApprovalModal from '../components/performers/ContentApprovalModal';

interface Performer {
  id: string;
  full_name: string;
  stage_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  bio: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'online' | 'offline';
  rating: number;
  total_shows: number;
  joined_date: string;
  last_active: string;
  country: string;
  languages: string[];
  categories: string[];
  hourly_rate: number;
}

const MOCK_PERFORMERS: Performer[] = [
  {
    id: '1',
    full_name: 'Diana Herrera',
    stage_name: 'Di Goddess',
    email: 'diana@example.com',
    phone: '+1234567806',
    avatar_url:
      'https://images.pexels.com/photos/1752806/pexels-photo-1752806.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Premium performer with exclusive content',
    status: 'online',
    rating: 4.9,
    total_shows: 310,
    joined_date: '2023-01-15',
    last_active: '2024-10-08',
    country: 'Dominican Republic',
    languages: ['Spanish', 'English'],
    categories: ['Music', 'Theater', 'Dance'],
    hourly_rate: 62,
  },
  {
    id: '2',
    full_name: 'Isabella Martinez',
    stage_name: 'Bella Charm',
    email: 'isabella@example.com',
    phone: '+1234567891',
    avatar_url:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'International performer with captivating presence',
    status: 'online',
    rating: 4.9,
    total_shows: 320,
    joined_date: '2022-11-20',
    last_active: '2024-10-08',
    country: 'Colombia',
    languages: ['Spanish', 'English', 'Portuguese'],
    categories: ['Dance', 'Music', 'Theater'],
    hourly_rate: 60,
  },
  {
    id: '3',
    full_name: 'María González',
    stage_name: 'Maria Star',
    email: 'maria@example.com',
    phone: '+1234567890',
    avatar_url:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Experienced entertainer with professional approach',
    status: 'online',
    rating: 4.8,
    total_shows: 250,
    joined_date: '2023-03-10',
    last_active: '2024-10-07',
    country: 'Spain',
    languages: ['Spanish', 'English'],
    categories: ['Dance', 'Music'],
    hourly_rate: 50,
  },
  {
    id: '4',
    full_name: 'Natalia Vargas',
    stage_name: 'Nat Angel',
    email: 'natalia@example.com',
    phone: '+1234567899',
    avatar_url:
      'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Professional entertainer with dedication to craft',
    status: 'online',
    rating: 4.8,
    total_shows: 275,
    joined_date: '2023-02-14',
    last_active: '2024-10-08',
    country: 'Costa Rica',
    languages: ['Spanish', 'English'],
    categories: ['Theater', 'Performance'],
    hourly_rate: 58,
  },
  {
    id: '5',
    full_name: 'Camila Diaz',
    stage_name: 'Cami Love',
    email: 'camila@example.com',
    phone: '+1234567896',
    avatar_url:
      'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Creative artist with unique style and energy',
    status: 'active',
    rating: 4.7,
    total_shows: 195,
    joined_date: '2023-04-22',
    last_active: '2024-10-07',
    country: 'Peru',
    languages: ['Spanish', 'English'],
    categories: ['Music', 'Performance'],
    hourly_rate: 52,
  },
  {
    id: '6',
    full_name: 'Patricia Rojas',
    stage_name: 'Patty Flame',
    email: 'patricia@example.com',
    phone: '+1234567803',
    avatar_url:
      'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Charismatic performer with natural talent',
    status: 'active',
    rating: 4.7,
    total_shows: 235,
    joined_date: '2023-01-30',
    last_active: '2024-10-08',
    country: 'Guatemala',
    languages: ['Spanish', 'English'],
    categories: ['Theater', 'Dance'],
    hourly_rate: 54,
  },
  {
    id: '7',
    full_name: 'Lucia Fernandez',
    stage_name: 'Lucia Fire',
    email: 'lucia@example.com',
    phone: '+1234567893',
    avatar_url:
      'https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Versatile artist with passionate performances',
    status: 'offline',
    rating: 4.7,
    total_shows: 210,
    joined_date: '2022-12-05',
    last_active: '2024-09-15',
    country: 'Chile',
    languages: ['Spanish', 'English'],
    categories: ['Music', 'Art'],
    hourly_rate: 55,
  },
  {
    id: '8',
    full_name: 'Sofia Rodriguez',
    stage_name: 'Sofia Dreams',
    email: 'sofia@example.com',
    phone: '+1234567894',
    avatar_url:
      'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Artistic performer with creative vision',
    status: 'active',
    rating: 4.6,
    total_shows: 180,
    joined_date: '2023-05-18',
    last_active: '2024-10-08',
    country: 'Mexico',
    languages: ['Spanish', 'English'],
    categories: ['Art', 'Performance'],
    hourly_rate: 45,
  },
  {
    id: '9',
    full_name: 'Laura Sanchez',
    stage_name: 'Lau Mystique',
    email: 'laura@example.com',
    phone: '+1234567808',
    avatar_url:
      'https://images.pexels.com/photos/935835/pexels-photo-935835.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Versatile entertainer with broad appeal',
    status: 'active',
    rating: 4.6,
    total_shows: 200,
    joined_date: '2023-03-25',
    last_active: '2024-10-07',
    country: 'Bolivia',
    languages: ['Spanish', 'English'],
    categories: ['Dance', 'Music'],
    hourly_rate: 51,
  },
  {
    id: '10',
    full_name: 'Carolina Reyes',
    stage_name: 'Carol Shine',
    email: 'carolina@example.com',
    phone: '+1234567800',
    avatar_url:
      'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Talented artist with diverse performance skills',
    status: 'active',
    rating: 4.6,
    total_shows: 165,
    joined_date: '2023-04-10',
    last_active: '2024-10-08',
    country: 'Uruguay',
    languages: ['Spanish', 'English'],
    categories: ['Dance', 'Music'],
    hourly_rate: 49,
  },
  {
    id: '11',
    full_name: 'Valentina Torres',
    stage_name: 'Valen Queen',
    email: 'valentina@example.com',
    phone: '+1234567895',
    avatar_url:
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Passionate performer with expertise in entertainment',
    status: 'active',
    rating: 4.5,
    total_shows: 155,
    joined_date: '2023-06-01',
    last_active: '2024-10-08',
    country: 'Venezuela',
    languages: ['Spanish', 'English'],
    categories: ['Dance', 'Theater'],
    hourly_rate: 48,
  },
  {
    id: '12',
    full_name: 'Mariana Jimenez',
    stage_name: 'Mari Fantasy',
    email: 'mariana@example.com',
    phone: '+1234567807',
    avatar_url:
      'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Creative artist with innovative performances',
    status: 'active',
    rating: 4.5,
    total_shows: 175,
    joined_date: '2023-05-05',
    last_active: '2024-10-07',
    country: 'Paraguay',
    languages: ['Spanish', 'Portuguese'],
    categories: ['Art', 'Performance'],
    hourly_rate: 50,
  },
  {
    id: '13',
    full_name: 'Melissa Castro',
    stage_name: 'Mel Wonder',
    email: 'melissa@example.com',
    phone: '+1234567802',
    avatar_url:
      'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Experienced entertainer with loyal following',
    status: 'offline',
    rating: 4.5,
    total_shows: 190,
    joined_date: '2023-02-20',
    last_active: '2024-09-20',
    country: 'Honduras',
    languages: ['Spanish'],
    categories: ['Dance', 'Music'],
    hourly_rate: 46,
  },
  {
    id: '14',
    full_name: 'Daniela Morales',
    stage_name: 'Dani Star',
    email: 'daniela@example.com',
    phone: '+1234567897',
    avatar_url:
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Versatile entertainer with international appeal',
    status: 'active',
    rating: 4.4,
    total_shows: 140,
    joined_date: '2023-07-12',
    last_active: '2024-10-08',
    country: 'Ecuador',
    languages: ['Spanish', 'English', 'French'],
    categories: ['Dance', 'Art'],
    hourly_rate: 47,
  },
  {
    id: '15',
    full_name: 'Veronica Luna',
    stage_name: 'Vero Moon',
    email: 'veronica@example.com',
    phone: '+1234567804',
    avatar_url:
      'https://images.pexels.com/photos/718978/pexels-photo-718978.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Skilled entertainer with artistic vision',
    status: 'active',
    rating: 4.4,
    total_shows: 145,
    joined_date: '2023-06-20',
    last_active: '2024-10-07',
    country: 'Nicaragua',
    languages: ['Spanish', 'English'],
    categories: ['Music', 'Performance'],
    hourly_rate: 45,
  },
  {
    id: '16',
    full_name: 'Andrea Mendoza',
    stage_name: 'Andy Magic',
    email: 'andrea@example.com',
    phone: '+1234567801',
    avatar_url:
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Dynamic performer with captivating shows',
    status: 'active',
    rating: 4.3,
    total_shows: 125,
    joined_date: '2023-07-30',
    last_active: '2024-10-08',
    country: 'Panama',
    languages: ['Spanish', 'English'],
    categories: ['Performance', 'Art'],
    hourly_rate: 44,
  },
  {
    id: '17',
    full_name: 'Ana Silva',
    stage_name: 'Ana Luz',
    email: 'ana@example.com',
    phone: '+1234567892',
    avatar_url:
      'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Emerging talent with fresh energy',
    status: 'pending',
    rating: 4.2,
    total_shows: 45,
    joined_date: '2024-08-01',
    last_active: '2024-10-08',
    country: 'Argentina',
    languages: ['Spanish'],
    categories: ['Dance'],
    hourly_rate: 35,
  },
  {
    id: '18',
    full_name: 'Jessica Ramirez',
    stage_name: 'Jess Enchant',
    email: 'jessica@example.com',
    phone: '+1234567809',
    avatar_url:
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Professional performer with extensive experience',
    status: 'suspended',
    rating: 4.2,
    total_shows: 160,
    joined_date: '2023-04-15',
    last_active: '2024-08-30',
    country: 'Puerto Rico',
    languages: ['Spanish', 'English'],
    categories: ['Theater', 'Performance'],
    hourly_rate: 43,
  },
  {
    id: '19',
    full_name: 'Gabriela Santos',
    stage_name: 'Gaby Dreams',
    email: 'gabriela@example.com',
    phone: '+1234567898',
    avatar_url:
      'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Energetic performer with charismatic presence',
    status: 'pending',
    rating: 4.1,
    total_shows: 85,
    joined_date: '2024-07-10',
    last_active: '2024-10-08',
    country: 'Brazil',
    languages: ['Portuguese', 'Spanish', 'English'],
    categories: ['Music', 'Dance'],
    hourly_rate: 42,
  },
  {
    id: '20',
    full_name: 'Alejandra Gomez',
    stage_name: 'Ale Passion',
    email: 'alejandra@example.com',
    phone: '+1234567805',
    avatar_url:
      'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=200',
    bio: 'Rising star with promising career ahead',
    status: 'pending',
    rating: 4.0,
    total_shows: 65,
    joined_date: '2024-08-15',
    last_active: '2024-10-07',
    country: 'El Salvador',
    languages: ['Spanish'],
    categories: ['Dance'],
    hourly_rate: 38,
  },
];

export default function Performers() {
  const [performers, setPerformers] = useState<Performer[]>(MOCK_PERFORMERS);
  const [loading, _setLoading] = useState(false);
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
  const [activeModal, setActiveModal] = useState<
    'detail' | 'profile' | 'upload' | 'streaming' | 'approval' | null
  >(null);

  const fetchPerformers = () => {
    setPerformers(MOCK_PERFORMERS);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setPerformers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus as any } : p))
    );
  };

  const handleViewProfile = (performer: Performer) => {
    setSelectedPerformer(performer);
    setActiveModal('profile');
  };

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
                onClick={fetchPerformers}
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
