export interface Report {
  id: number;
  title: string;
  description?: string;
  file_path: string;
  report_type: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  insights?: ReportInsight[];
}

export interface ReportInsight {
  id: number;
  report_id: number;
  content: string;
  insight_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
} 