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
  page?: number; // Page number (1-indexed)
  limit?: number; // Items per page
  orderBy?: string | object | object[]; // Sort order: JSON like {"stage_name": "desc"} or array [{"stage_name": "desc"}, {"id": "asc"}], or short string like "stage_name:desc"
  where?: string | object; // Filter conditions (prefer JSON encoded). Examples: {"status": 1} or combined: {"OR": [{"firstName": {"contains": "john"}}, {"lastName": {"contains": "john"}}]}
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number; // número total de elementos
  page: number;
  limit: number;
}

export type GetPerformersResponse = PaginatedResponse<Performer>;

// Tipo para el perfil del performer según el JSON del endpoint
export interface PerformerProfile {
  id: number;
  countryId: number;
  performerId: number;
  languages: string;
  headLines: string;
  showDescription: string;
  turnOns: string;
  expertise: string;
  nickName: string;
  age: number;
  ethnicity: number;
  sexualPreference: number;
  zodiac: number;
  height: number;
  weight: number;
  hairColor: number;
  eyeColor: number;
  pubicHair: number;
  waist: number;
  build: number;
  bust: number;
  bustName: number;
  hips: number;
  countryCode: string;
  coverAssetId: number;
  profileAssetId: number;
  homeAssetId: number;
  homeSliderOrder: number;
  streamName: string;
  streamId: string;
  appStatus: number;
  chatPhrases: string;
  roomTopic: string;
  blockCountryOrigin: boolean;
  mac: string;
  mobilePhone: string;
  videoAssetId: number;
  videoAlbumId: number;
  faceBookLink: string;
  twitterLink: string;
  instagramLink: string;
  whatsAppNumber: string;
  enableWhatsAppNotifications: boolean;
  favoriteColor: string;
  favoriteCandies: string;
  favoriteBeverages: string;
  favoriteFood: string;
  favoriteMusic: string;
  favoritePerfumes: string;
  favoriteFashion: string;
  favoriteJewells: string;
  favoritePlaces: string;
  hobbies: string;
  whatToDoMillion: string;
  favoriteMovies: string;
  favoriteBooks: string;
  isStreamingEnabled: boolean;
  followerCount: number;
}

export default Performer;
