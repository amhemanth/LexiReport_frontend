import { create } from 'zustand';
import { api, logout as apiLogout } from '@lib/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/auth/token', {
        username: email,
        password: password,
      });
      const { access_token, user } = response.data;
      set({ user, token: access_token, isLoading: false });
    } catch (error) {
      set({ error: 'Invalid credentials', isLoading: false });
    }
  },
  logout: async () => {
    try {
      await apiLogout();
      set({ user: null, token: null, error: null });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the state even if the API call fails
      set({ user: null, token: null, error: null });
    }
  },
})); 