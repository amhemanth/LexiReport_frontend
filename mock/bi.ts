export interface BIConnection {
  id: string;
  platform: 'powerbi' | 'tableau' | 'looker' | 'qlik';
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  workspace?: string;
  workspaceId?: string;
  projectId?: string;
  error?: string;
  reports: BIReport[];
}

export interface BIReport {
  id: string;
  connectionId: string;
  name: string;
  description: string;
  type: 'dashboard' | 'report' | 'dataset';
  url: string;
  thumbnailUrl?: string;
  lastUpdated: string;
  owner: string;
  tags: string[];
  isFavorite?: boolean;
  views: number;
  downloads: number;
}

export const mockBIConnections: BIConnection[] = [
  {
    id: '1',
    platform: 'powerbi',
    name: 'Corporate Power BI',
    description: 'Main Power BI workspace for corporate reports',
    status: 'connected',
    lastSync: '2024-03-15T10:30:00Z',
    workspace: 'Corporate',
    workspaceId: 'corp-workspace-123',
    reports: []
  },
  {
    id: '2',
    platform: 'tableau',
    name: 'Sales Analytics',
    description: 'Tableau server for sales team analytics',
    status: 'connected',
    lastSync: '2024-03-15T09:15:00Z',
    projectId: 'sales-project-456',
    reports: []
  },
  {
    id: '3',
    platform: 'looker',
    name: 'Marketing Insights',
    description: 'Looker instance for marketing data',
    status: 'error',
    lastSync: '2024-03-14T16:45:00Z',
    error: 'Authentication failed',
    reports: []
  }
];

export const mockBIReports: BIReport[] = [
  {
    id: '1',
    connectionId: '1',
    name: 'Q4 2023 Financial Overview',
    description: 'Comprehensive financial analysis for Q4 2023',
    type: 'dashboard',
    url: 'https://app.powerbi.com/reports/1',
    thumbnailUrl: 'https://example.com/thumbnails/financial-overview.png',
    lastUpdated: '2024-03-15T10:30:00Z',
    owner: 'John Smith',
    tags: ['finance', 'quarterly', 'overview'],
    views: 245,
    downloads: 89
  },
  {
    id: '2',
    connectionId: '1',
    name: 'Sales Performance Metrics',
    description: 'Key performance indicators for sales team',
    type: 'report',
    url: 'https://app.powerbi.com/reports/2',
    lastUpdated: '2024-03-15T09:15:00Z',
    owner: 'Sarah Johnson',
    tags: ['sales', 'metrics', 'performance'],
    views: 189,
    downloads: 45
  },
  {
    id: '3',
    connectionId: '2',
    name: 'Regional Sales Analysis',
    description: 'Detailed analysis of sales by region',
    type: 'dashboard',
    url: 'https://tableau.example.com/views/1',
    thumbnailUrl: 'https://example.com/thumbnails/regional-sales.png',
    lastUpdated: '2024-03-14T16:45:00Z',
    owner: 'Mike Wilson',
    tags: ['sales', 'regional', 'analysis'],
    views: 156,
    downloads: 32
  }
];

export function getBIConnectionById(id: string): BIConnection | undefined {
  return mockBIConnections.find(connection => connection.id === id);
}

export function getBIReportsByConnection(connectionId: string): BIReport[] {
  return mockBIReports.filter(report => report.connectionId === connectionId);
}

export function getBIReportsByType(type: BIReport['type']): BIReport[] {
  return mockBIReports.filter(report => report.type === type);
}

export function getBIReportsByTag(tag: string): BIReport[] {
  return mockBIReports.filter(report => report.tags.includes(tag));
} 