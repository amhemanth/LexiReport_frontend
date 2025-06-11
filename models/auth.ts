import { User } from './user';

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginResponse extends Token {
  user: User;
  session_id: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  username?: string;
  confirm_password: string;
}

export interface RegisterResponse {
  message: string;
  user_id: string;
  email: string;
  username: string;
  verification_required: boolean;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface EmailVerificationResponse {
  message: string;
  verified: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  reset_token: string;
  new_password: string;
  confirm_password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse extends Token {
  user: User;
} 