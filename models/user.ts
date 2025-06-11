export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  role: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
} 