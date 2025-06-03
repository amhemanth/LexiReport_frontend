export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  role: 'admin' | 'user';
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface AuthResponse extends Token {
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

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