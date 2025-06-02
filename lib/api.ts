import axios, { AxiosError } from 'axios';
import { API_URL, API_CONFIG } from './config';
import { Report, ReportInsight, User, AuthResponse, LoginRequest, RegisterRequest, Token } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    // Log the full URL being requested
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('Making request to:', fullUrl);
    console.log('Request config:', {
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    const token = AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    if (error instanceof AxiosError) {
      console.error('Response error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
        }
      });
    } else {
      console.error('Unknown error:', error);
    }
    if (error.response?.status === 401) {
      // Handle unauthorized access
      AsyncStorage.removeItem('token');
      console.error('Unauthorized access. Redirecting to login.');
      // Assuming you're using a web environment, you might want to redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
  try {
    console.log('Attempting login with:', loginData);
    const formData = new URLSearchParams();
    formData.append('username', loginData.email);
    formData.append('password', loginData.password);

    const response = await api.post<Token>('/auth/token', 
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
    const userResponse = await api.get<User>('/auth/me', {
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
      // Throw a more specific error message
      throw new Error(error.response?.data?.detail || 'Failed to login');
    }
    throw new Error('Failed to login');
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
    }
    throw new Error('Failed to register');
  }
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
};

// Report endpoints
export const uploadReport = async (file: File, token: string): Promise<Report> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    
    const response = await api.post<Report>('/reports/', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Upload report error:', error.response?.data);
    }
    throw new Error('Failed to upload report');
  }
};

export const getReports = async (token: string): Promise<Report[]> => {
  try {
    const response = await api.get<Report[]>('/reports/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Get reports error:', error.response?.data);
    }
    throw new Error('Failed to fetch reports');
  }
};

export const getReport = async (id: number, token: string): Promise<Report> => {
  try {
    const response = await api.get<Report>(`/reports/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Get report error:', error.response?.data);
    }
    throw new Error('Failed to fetch report');
  }
};

export const getReportInsights = async (id: number): Promise<ReportInsight[]> => {
  try {
    const response = await api.get(`/reports/${id}/insights`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch report insights');
    }
    throw error;
  }
}; 