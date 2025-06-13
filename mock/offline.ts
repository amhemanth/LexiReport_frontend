export interface OfflineReport {
  id: string;
  reportId: string;
  title: string;
  description: string;
  type: 'pdf' | 'excel' | 'bi';
  fileSize: number;
  downloadDate: string;
  lastAccessed: string;
  status: 'downloaded' | 'downloading' | 'error';
  progress?: number;
  error?: string;
  thumbnailUrl?: string;
  biPlatform?: 'powerbi' | 'tableau' | 'looker' | 'qlik';
}

export interface DownloadQueue {
  id: string;
  reportId: string;
  title: string;
  type: 'pdf' | 'excel' | 'bi';
  fileSize: number;
  addedDate: string;
  status: 'queued' | 'downloading' | 'paused' | 'error' | 'completed';
  progress: number;
  error?: string;
}

export interface OfflineItem {
  id: string;
  type: 'report' | 'dashboard' | 'dataset';
  name: string;
  description: string;
  size: number;
  lastUpdated: string;
  status: 'downloaded' | 'downloading' | 'pending' | 'error';
  progress?: number;
  error?: string;
  url: string;
  thumbnailUrl?: string;
  owner: string;
  tags: string[];
}

export const mockOfflineReports: OfflineReport[] = [
  {
    id: '1',
    reportId: 'report-1',
    title: 'Q4 2023 Financial Report',
    description: 'Quarterly financial analysis and projections',
    type: 'pdf',
    fileSize: 2500000, // 2.5 MB
    downloadDate: '2024-03-15T10:30:00Z',
    lastAccessed: '2024-03-16T14:20:00Z',
    status: 'downloaded',
    thumbnailUrl: 'https://example.com/thumbnails/q4-financial.png'
  },
  {
    id: '2',
    reportId: 'report-2',
    title: 'Sales Dashboard 2024',
    description: 'Real-time sales metrics and KPIs',
    type: 'bi',
    fileSize: 1500000, // 1.5 MB
    downloadDate: '2024-03-14T15:45:00Z',
    lastAccessed: '2024-03-15T09:30:00Z',
    status: 'downloaded',
    biPlatform: 'powerbi',
    thumbnailUrl: 'https://example.com/thumbnails/sales-dashboard.png'
  },
  {
    id: '3',
    reportId: 'report-3',
    title: 'Marketing Analytics',
    description: 'Campaign performance and ROI analysis',
    type: 'excel',
    fileSize: 3500000, // 3.5 MB
    downloadDate: '2024-03-13T11:20:00Z',
    lastAccessed: '2024-03-14T16:15:00Z',
    status: 'downloaded',
    thumbnailUrl: 'https://example.com/thumbnails/marketing-analytics.png'
  }
];

export const mockDownloadQueue: DownloadQueue[] = [
  {
    id: '1',
    reportId: 'report-4',
    title: 'Annual Report 2023',
    type: 'pdf',
    fileSize: 5000000, // 5 MB
    addedDate: '2024-03-16T09:00:00Z',
    status: 'downloading',
    progress: 45
  },
  {
    id: '2',
    reportId: 'report-5',
    title: 'Customer Insights Dashboard',
    type: 'bi',
    fileSize: 2000000, // 2 MB
    addedDate: '2024-03-16T09:15:00Z',
    status: 'queued',
    progress: 0
  }
];

export const mockOfflineItems: OfflineItem[] = [
  {
    id: '1',
    type: 'report',
    name: 'Q4 2023 Financial Overview',
    description: 'Comprehensive financial analysis for Q4 2023',
    size: 2.5 * 1024 * 1024, // 2.5 MB
    lastUpdated: '2024-03-15T10:30:00Z',
    status: 'downloaded',
    url: 'https://app.powerbi.com/reports/1',
    thumbnailUrl: 'https://example.com/thumbnails/financial-overview.png',
    owner: 'John Smith',
    tags: ['finance', 'quarterly', 'overview']
  },
  {
    id: '2',
    type: 'dashboard',
    name: 'Sales Performance Metrics',
    description: 'Key performance indicators for sales team',
    size: 1.8 * 1024 * 1024, // 1.8 MB
    lastUpdated: '2024-03-15T09:15:00Z',
    status: 'downloading',
    progress: 65,
    url: 'https://app.powerbi.com/reports/2',
    owner: 'Sarah Johnson',
    tags: ['sales', 'metrics', 'performance']
  },
  {
    id: '3',
    type: 'dataset',
    name: 'Regional Sales Data',
    description: 'Raw sales data by region for analysis',
    size: 4.2 * 1024 * 1024, // 4.2 MB
    lastUpdated: '2024-03-14T16:45:00Z',
    status: 'error',
    error: 'Network connection lost',
    url: 'https://app.powerbi.com/datasets/1',
    owner: 'Mike Wilson',
    tags: ['sales', 'data', 'regional']
  }
];

export const getOfflineReportById = (id: string): OfflineReport | undefined => {
  return mockOfflineReports.find(report => report.id === id);
};

export const getDownloadQueueItemById = (id: string): DownloadQueue | undefined => {
  return mockDownloadQueue.find(item => item.id === id);
};

export const getTotalOfflineStorage = (): number => {
  return mockOfflineReports.reduce((total, report) => total + report.fileSize, 0);
};

export const getDownloadQueueSize = (): number => {
  return mockDownloadQueue.reduce((total, item) => total + item.fileSize, 0);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export function getOfflineItemById(id: string): OfflineItem | undefined {
  return mockOfflineItems.find(item => item.id === id);
}

export function getOfflineItemsByType(type: OfflineItem['type']): OfflineItem[] {
  return mockOfflineItems.filter(item => item.type === type);
}

export function getOfflineItemsByStatus(status: OfflineItem['status']): OfflineItem[] {
  return mockOfflineItems.filter(item => item.status === status);
}

export function getOfflineItemsByTag(tag: string): OfflineItem[] {
  return mockOfflineItems.filter(item => item.tags.includes(tag));
} 