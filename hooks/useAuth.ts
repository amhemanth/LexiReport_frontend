import { create } from 'zustand';
import { login as apiLogin, logout as apiLogout } from '@/services/auth';
import { User } from '@models/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearMessages: () => void;
  clearSession: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  success: null,
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null, success: null });
      const response = await apiLogin({ email, password });
      await AsyncStorage.setItem('token', response.access_token);
      set({ 
        user: response.user, 
        token: response.access_token, 
        isLoading: false,
        success: 'Login successful'
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Invalid credentials', 
        isLoading: false,
        success: null
      });
    }
  },
  logout: async () => {
    try {
      set({ isLoading: true, error: null, success: null });
      // First clear the local state
      set({ 
        user: null, 
        token: null, 
        error: null,
        isLoading: false,
        success: null
      });
      // Then remove the token from storage
      await AsyncStorage.removeItem('token');
      // Finally call the API logout
      await apiLogout();
      // Navigate to login
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, ensure we clear everything
      await AsyncStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        error: null,
        isLoading: false,
        success: null
      });
      router.replace('/(auth)/login');
    }
  },
  clearMessages: () => {
    set({ error: null, success: null });
  },
  clearSession: async () => {
    await AsyncStorage.removeItem('token');
    set({ 
      user: null, 
      token: null, 
      error: null,
      success: null,
      isLoading: false
    });
  },
  setUser: (user: User) => set({ user }),
})); 