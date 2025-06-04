import { User } from './user';

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