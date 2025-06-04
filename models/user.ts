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

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
} 