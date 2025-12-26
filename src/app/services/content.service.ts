import { ContentItem } from '../../types/content';
import ApiClient from './api/axios/apiClient';

/**
 * API shapes returned by /api/album/performer/{performerProfileId}
 */
export interface AssetDTO {
  id: number;
  assetName: string;
  albumId: number;
  assetType: number; // 1=photo, 2=video (assumption)
  loadDate: string; // ISO
  deactivatedDate: string | null;
  isActive: boolean;
  fileURL: string;
  fileURLThumb: string;
  price: number;
  status: number;
  assetOrder: number;
  totalLike: number;
  totalComment: number;
}

export interface AlbumDTO {
  id: number;
  name: string;
  description?: string;
  folderName?: string;
  creationDate: string;
  performerProfileId: number;
  albumType: number;
  premiumContent: boolean;
  price: number;
  totalLike: number;
  totalComment: number;
  assets: AssetDTO[];
}

/**
 * Response interface containing both album data and mapped content items
 */
export interface AlbumWithContentResponse {
  album: AlbumDTO;
  items: ContentItem[];
}

/**
 * Fetch album by performerProfileId and return album data with mapped ContentItems
 */
export const getContentByPerformerProfileId = async (
  performerProfileId: number | string
): Promise<AlbumWithContentResponse | null> => {
  const pId = performerProfileId;

  if (!pId) return null;

  const resp = await ApiClient.get<AlbumDTO>(`/api/album/performer/${pId}`);
  const album = resp.data;
  if (!album || !album.assets) return null;

  const items = mapAlbumToContentItems(album);

  return {
    album,
    items,
  };
};

/**
 * Map an API AlbumDTO and its assets to the app's ContentItem format.
 * Notes about assumptions / missing data:
 * - assetType: we assume 1 === photo, 2 === video. If backend uses other values, adjust mapping.
 * - API does not return `isLiked` per asset, so we default to false; backend should provide a `likedByCurrentUser` field for correct UX.
 * - API does not return creator username/avatar; we infer creator id from performerProfileId and set a placeholder username. Best to return performer data from backend.
 * - API does not include `duration` for videos; if videos have duration it should be added by backend.
 */
export const mapAlbumToContentItems = (album: AlbumDTO): ContentItem[] => {
  const { assets, price: albumPrice } = album;

  // Warn if any asset has missing price
  assets.forEach((a) => {
    if (a.price == null) {
      console.warn(`Asset ${a.id} has missing price`);
    }
  });

  return assets.map((a) => {
    // assetType mapping
    const type = a.assetType === 2 ? 'video' : 'photo';

    // Robust price parsing: accept number or numeric string, fallback to album price or 0
    let priceForItem = 0;
    if (typeof a.price === 'number' && !Number.isNaN(a.price)) {
      priceForItem = a.price;
    } else if (typeof a.price === 'string') {
      const parsed = parseFloat(a.price);
      priceForItem = Number.isFinite(parsed) ? parsed : albumPrice ?? 0;
    } else {
      priceForItem = albumPrice ?? 0;
    }

    return {
      id: String(a.id),
      type,
      fileURLThumb: a.fileURLThumb,
      fileURL: a.fileURL,
      assetName: a.assetName,
      description: album.description,
      price: priceForItem,
      likes: a.totalLike ?? 0,
      comments: a.totalComment ?? 0,
      isLiked: false, // not provided by API
      creator: {
        id: String(album.performerProfileId),
        username: `performer_${album.performerProfileId}`,
        avatar: '',
      },
      createdAt: new Date(a.loadDate),
      // duration: not present in API
      status: typeof a.status === 'number' ? a.status : undefined,
    } as ContentItem;
  });
};
