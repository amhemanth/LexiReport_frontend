import { create } from 'zustand';
import { User } from '@models/user';
import { authService } from '@services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isAuthenticated: boolean;
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
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null, success: null });
      const response = await authService.login(email, password);
      
      // Store both tokens
      await AsyncStorage.setItem(TOKEN_KEY, response.access_token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
      
      set({ 
        user: response.user, 
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
        success: 'Login successful'
      });
    } catch (error) {
      let errorMessage = 'Invalid credentials';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Handle specific error cases
        if (errorMessage.includes('Invalid credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (errorMessage.includes('User not found')) {
          errorMessage = 'No account found with this email';
        }
      }
      set({ 
        error: errorMessage,
        isLoading: false,
        success: null,
        isAuthenticated: false
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
        success: null,
        isAuthenticated: false
      });
      // Then remove the tokens from storage
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      // Finally call the API logout
      await authService.logout();
      // Navigate to login
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, ensure we clear everything
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      set({ 
        user: null, 
        token: null, 
        error: null,
        isLoading: false,
        success: null,
        isAuthenticated: false
      });
      router.replace('/(auth)/login');
    }
  },
  clearMessages: () => {
    set({ error: null, success: null });
  },
  clearSession: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    set({ 
      user: null, 
      token: null, 
      error: null,
      success: null,
      isLoading: false,
      isAuthenticated: false
    });
  },
  setUser: (user: User) => set({ user }),
})); 