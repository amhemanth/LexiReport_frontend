import { create } from 'zustand';
import { login as apiLogin, logout as apiLogout } from '@lib/api';
import { User } from '@lib/types';

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
      const response = await apiLogin({ email, password });
      set({ 
        user: response.user, 
        token: response.access_token, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Invalid credentials', 
        isLoading: false 
      });
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