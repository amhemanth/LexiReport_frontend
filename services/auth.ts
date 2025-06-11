import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/config';

// Constants for token storage
export const TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

// Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  username: string;
  is_active: boolean;
  is_superuser: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  full_name: string;
}

export interface RegisterResponse {
  message: string;
  user_id: string;
  email: string;
  username: string;
  verification_required: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
  session_id: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface EmailVerificationResponse {
  message: string;
  verified: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  confirm_password: string;
}

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          throw new Error('Session expired. Please log in again.');
        }

        // Try to refresh token
        const response = await api.post<TokenResponse>('/auth/refresh-token', {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;

        // Store new token
        await AsyncStorage.setItem(TOKEN_KEY, access_token);

        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and throw error
        await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
        throw new Error('Session expired. Please log in again.');
      }
    }

    // Handle specific error cases
    if (error.response?.status === 429) {
      throw new Error('Too many attempts. Please try again later.');
    }

    if (error.response?.status === 403) {
      throw new Error('Your account has been locked. Please contact support.');
    }

    // Handle validation errors
    if (error.response?.status === 400) {
      const detail = error.response.data.detail;
      if (typeof detail === 'object' && detail.type === 'validation_error') {
        throw new Error(detail.message || 'Validation error occurred');
      }
    }

    // If there's a server error message, include it
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }

    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  // Register
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  // Login
  async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      // Use URLSearchParams to properly format the form data
      const params = new URLSearchParams();
      params.append('username', identifier);
      params.append('password', password);

      const response = await api.post<LoginResponse>('/auth/login', params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, refresh_token, user } = response.data;

      // Store tokens
      await AsyncStorage.multiSet([
        [TOKEN_KEY, access_token],
        [REFRESH_TOKEN_KEY, refresh_token],
      ]);

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      // Get the current token before making the request
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        // If no token exists, just clear storage
        await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
        return;
      }

      // Make the logout request with the token
      await api.post('/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Clear tokens from storage
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error: any) {
      // Even if the request fails, we should clear the local storage
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
      
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Logout failed. Please try again.');
    }
  },

  // Forgot Password
  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to send password reset email. Please try again.');
    }
  },

  // Reset Password
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to reset password. Please try again.');
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<{ user: User }>('/auth/me');
      return response.data.user;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to get user information. Please try again.');
    }
  },

  // Verify email
  async verifyEmail(token: string): Promise<EmailVerificationResponse> {
    try {
      const response = await api.post<EmailVerificationResponse>('/auth/verify-email', { token });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to verify email. Please try again.');
    }
  }
};

export const refreshToken = async (refreshToken: string): Promise<TokenResponse> => {
  try {
    const response = await api.post<TokenResponse>('/auth/refresh-token', { refresh_token: refreshToken });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(error.response?.data?.detail || 'Token refresh failed');
    }
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
}; 