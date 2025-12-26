export interface ContentItem {
  id: string;
  type: 'photo' | 'video';
  fileURLThumb: string;
  fileURL?: string;
  assetName?: string;
  description?: string;
  price: number; // 0 for free content
  likes: number;
  comments: number;
  isLiked: boolean;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  createdAt: Date;
  duration?: number; // for videos in seconds
  /**
   * Asset status:
   * 1 = subida (grey), 2 = aprobada (green), 3 = rechazada (red), 4 = inactiva (blue)
   */
  status?: number;
}

export interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTokens?: number;
  items?: ContentItem[]; // Optional override for items (useful for testing or preloaded content)
  onPurchase?: (item: ContentItem) => void;
  onLike?: (itemId: string) => void;
  onComment?: (itemId: string, comment: string) => void;
  onRefresh?: () => Promise<void>;
}
