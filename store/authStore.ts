import { create } from 'zustand';
import { authService } from '@/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (identifier: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login(identifier, password);
      set({ 
        user: response.user,
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred during login',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Attempt to logout from the server
      await authService.logout();
      
      // Clear all auth-related data from storage
      await AsyncStorage.multiRemove([
        'access_token',
        'refresh_token',
        'user_data'
      ]);
      
      // Reset the auth state
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      // Even if the server logout fails, clear local data
      await AsyncStorage.multiRemove([
        'access_token',
        'refresh_token',
        'user_data'
      ]);
      
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred during logout'
      });
      
      // Don't throw the error since we want to proceed with local logout
      console.error('Logout error:', error);
    }
  },

  clearError: () => set({ error: null }),
})); 