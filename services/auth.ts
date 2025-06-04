import { AxiosError } from 'axios';
import { api } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, Token } from '@models/auth';
import { User } from '@models/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
  try {
    console.log('Attempting login with:', loginData);
    const formData = new URLSearchParams();
    formData.append('username', loginData.email);
    formData.append('password', loginData.password);

    const response = await api.post<Token>('/auth/login', 
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }
    );
    const { access_token, token_type } = response.data;
    await AsyncStorage.setItem('token', access_token);

    // Get user info
    const userResponse = await api.get<User>('/users/me', {
      headers: { 
        Authorization: `Bearer ${access_token}`,
        'Accept': 'application/json',
      }
    });

    return { 
      access_token, 
      token_type, 
      user: userResponse.data 
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Login error details:', {
        config: error.config,
        data: error.response?.data,
        headers: error.response?.headers,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (error.response?.status === 422) {
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          // Handle validation errors
          const messages = detail.map(err => err.msg).join('\n');
          throw new Error(messages);
        }
        throw new Error(detail || 'Invalid input data');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again later.');
      }
      
      // Generic error message
      throw new Error(error.response?.data?.detail || 'Failed to login. Please try again.');
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

export const register = async (registerData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<User>('/auth/register', registerData);
    // After successful registration, log the user in
    const loginResponse = await login({
      email: registerData.email,
      password: registerData.password
    });
    return loginResponse;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Registration error:', error.response?.data);
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        if (error.response.data?.detail?.includes('email')) {
          throw new Error('Email is already registered');
        }
        if (error.response.data?.detail?.includes('password')) {
          throw new Error('Password does not meet requirements. Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.');
        }
      }
      if (error.response?.status === 422) {
        const detail = error.response.data?.detail;
        if (Array.isArray(detail)) {
          // Handle validation errors
          const messages = detail.map(err => err.msg).join('\n');
          throw new Error(messages);
        }
        throw new Error(detail || 'Invalid input data');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many registration attempts. Please try again later.');
      }
      
      // Generic error message
      throw new Error(error.response?.data?.detail || 'Failed to register. Please try again.');
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
}; 