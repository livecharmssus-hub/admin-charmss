import ApiClient from './api/axios/apiClient';
import {
  GetPerformersParams,
  GetPerformersResponse,
  ApiPerformersResponse,
  PerformerDto,
  Performer,
  PerformerStatus,
} from '../types/performers.types';

const BASE = '/api/performers';

const mapStatus = (s?: number | null): PerformerStatus => {
  switch (s) {
    case 0:
      return 'active';
    case 2:
      return 'pending';
    case 3:
      return 'suspended';
    case 1:
      return 'inactive';
    default:
      return 'inactive';
  }
};

const mapDto = (dto: PerformerDto): Performer => {
  const first = dto.firstName ?? '';
  const last = dto.lastName ?? '';
  const fullName = `${first} ${last}`.trim();

  return {
    id: String(dto.id),
    full_name: fullName || dto.email || `User ${dto.id}`,
    stage_name: first || dto.email || `user-${dto.id}`,
    email: dto.email ?? '',
    phone: dto.phone ?? '',
    avatar_url: dto.avatar ?? '',
    bio: '',
    status: mapStatus(dto.status),
    rating: dto.rating ?? 0,
    total_shows: dto.shows ?? 0,
    joined_date: dto.birthDate ?? undefined,
    last_active: undefined,
    country: dto.countryCode ?? undefined,
    languages: [],
    categories: [],
    hourly_rate: undefined,
    studio_id: dto.studioId ?? undefined,
    app_user_id: dto.appUserId ?? undefined,
  };
};

const getPerformers = async (
  params: GetPerformersParams = { page: 1, limit: 10 }
): Promise<GetPerformersResponse> => {
    
  const { page = 1, limit = 10, orderBy, where } = params;

  const query: Record<string, unknown> = {
    page,
    limit,
    where: '{}', // where es obligatorio, enviar objeto vacío por defecto
  };

  // orderBy puede ser string, objeto JSON o array de objetos
  if (orderBy) {
    query.orderBy = typeof orderBy === 'string' ? orderBy : JSON.stringify(orderBy);
  }
  
  // where puede ser string o objeto JSON
  if (where) {
    query.where = typeof where === 'string' ? where : JSON.stringify(where);
  }

  const response = await ApiClient.get(BASE, { params: query });
  const apiData = response.data as ApiPerformersResponse;

  const items = (apiData?.data ?? []).map(mapDto);
  const meta = apiData?.meta ?? { total: items.length, page, limit, totalPages: 1 };

  return {
    items,
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
  } as GetPerformersResponse;
};

export default {
  getPerformers,
};
