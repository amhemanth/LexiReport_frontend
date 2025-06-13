export type OfflineItemType = 'dashboard' | 'report' | 'insight';

export type OfflineItemStatus = 'downloading' | 'downloaded' | 'error' | 'pending';

export interface OfflineItem {
  id: string;
  name: string;
  type: OfflineItemType;
  description: string;
  owner: string;
  size: number;
  status: OfflineItemStatus;
  lastUpdated: number;
  tags: string[];
  thumbnailUrl?: string;
  error?: string;
  downloadProgress?: number;
  localPath?: string;
}

export interface OfflineSyncStatus {
  isSyncing: boolean;
  lastSyncTime: number | null;
  error?: string;
}

export interface OfflineStorageInfo {
  totalSize: number;
  usedSize: number;
  availableSize: number;
  itemsCount: number;
} 