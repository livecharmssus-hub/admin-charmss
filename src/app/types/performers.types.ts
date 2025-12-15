export type PerformerStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'suspended'
  | 'online'
  | 'offline';

export interface Performer {
  id: string;
  full_name: string;
  stage_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  status: PerformerStatus;
  rating?: number;
  total_shows?: number;
  joined_date?: string;
  last_active?: string;
  country?: string;
  languages?: string[];
  categories?: string[];
  hourly_rate?: number;
  studio_id?: number;
  app_user_id?: string;
}

// DTO returned by backend
export interface PerformerDto {
  id: number | string;
  documentId?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  gender?: number | null;
  birthDate?: string | null;
  countryCode?: string | null;
  address?: string | null;
  bankId?: number | null;
  bankAccount?: string | null;
  email?: string | null;
  phone?: string | null;
  studioId?: number | null;
  status?: number | null; // numeric status from backend
  enableWhatsAppNotifications?: boolean | null;
  telegram?: string | null;
  commissionRate?: number | null;
  appUserId?: string | null;
  avatar?: string | null;
  rating?: number | null;
  shows?: number | null;
}

export interface ApiPerformersResponse {
  data: PerformerDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetPerformersParams {
  page?: number; // 1..n
  limit?: number; // items per page
  order?: 'asc' | 'desc';
  orderBy?: string; // columna para ordenamiento
  where?: string; // texto para filtrado
  status?: string; // filtro por estado opcional
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number; // número total de elementos
  page: number;
  limit: number;
}

export type GetPerformersResponse = PaginatedResponse<Performer>;

export default Performer;
