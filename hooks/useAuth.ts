import { create } from 'zustand';
import { login as apiLogin, logout as apiLogout } from '@lib/api';
import { User } from '@lib/types';
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
      await apiLogout();
      await AsyncStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        error: null,
        isLoading: false,
        success: 'Logged out successfully'
      });
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the state even if the API call fails
      await AsyncStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        error: null,
        isLoading: false,
        success: 'Logged out successfully'
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
  }
})); 