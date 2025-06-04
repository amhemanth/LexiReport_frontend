import axios, { AxiosError } from 'axios';
import { API_URL, API_CONFIG } from '@config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      AsyncStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
); 