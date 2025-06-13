export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'excel' | 'bi';
  status: 'processing' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
  file_size: number;
  file_type: string;
  thumbnail_url?: string;
  insights_count: number;
  is_offline: boolean;
  bi_platform?: 'powerbi' | 'tableau' | 'gds';
  owner: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Q4 2023 Financial Report',
    description: 'Quarterly financial analysis and performance metrics',
    type: 'pdf',
    status: 'completed',
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:30:00Z',
    file_size: 2500000,
    file_type: 'application/pdf',
    thumbnail_url: 'https://picsum.photos/200/300',
    insights_count: 5,
    is_offline: true,
    owner: {
      id: '1',
      name: 'John Doe',
      avatar_url: 'https://i.pravatar.cc/150?img=1'
    }
  },
  {
    id: '2',
    title: 'Sales Dashboard 2024',
    description: 'Interactive sales metrics and KPIs',
    type: 'bi',
    status: 'completed',
    created_at: '2024-02-14T15:00:00Z',
    updated_at: '2024-02-14T15:00:00Z',
    file_size: 0,
    file_type: 'application/json',
    insights_count: 8,
    is_offline: false,
    bi_platform: 'powerbi',
    owner: {
      id: '1',
      name: 'John Doe',
      avatar_url: 'https://i.pravatar.cc/150?img=1'
    }
  },
  {
    id: '3',
    title: 'Marketing Analytics',
    description: 'Campaign performance and ROI analysis',
    type: 'excel',
    status: 'processing',
    created_at: '2024-02-16T09:00:00Z',
    updated_at: '2024-02-16T09:00:00Z',
    file_size: 1500000,
    file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    insights_count: 0,
    is_offline: false,
    owner: {
      id: '1',
      name: 'John Doe',
      avatar_url: 'https://i.pravatar.cc/150?img=1'
    }
  },
  {
    id: '4',
    title: 'Customer Insights Dashboard',
    description: 'Customer behavior and segmentation analysis',
    type: 'bi',
    status: 'completed',
    created_at: '2024-02-13T11:00:00Z',
    updated_at: '2024-02-13T11:30:00Z',
    file_size: 0,
    file_type: 'application/json',
    insights_count: 12,
    is_offline: true,
    bi_platform: 'tableau',
    owner: {
      id: '1',
      name: 'John Doe',
      avatar_url: 'https://i.pravatar.cc/150?img=1'
    }
  },
  {
    id: '5',
    title: 'Annual Report 2023',
    description: 'Comprehensive annual business review',
    type: 'pdf',
    status: 'error',
    created_at: '2024-02-16T14:00:00Z',
    updated_at: '2024-02-16T14:05:00Z',
    file_size: 5000000,
    file_type: 'application/pdf',
    insights_count: 0,
    is_offline: false,
    owner: {
      id: '1',
      name: 'John Doe',
      avatar_url: 'https://i.pravatar.cc/150?img=1'
    }
  }
];

export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(report => report.id === id);
};

export const getReportsByType = (type: Report['type']): Report[] => {
  return mockReports.filter(report => report.type === type);
};

export const getOfflineReports = (): Report[] => {
  return mockReports.filter(report => report.is_offline);
};

export const getProcessingReports = (): Report[] => {
  return mockReports.filter(report => report.status === 'processing');
}; 