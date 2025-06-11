import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Track ongoing requests to prevent duplicates
const pendingRequests = new Map<string, AbortController>();

// Create axios instance with default config
const api: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS || {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Cancel any existing request with the same URL
        const requestKey = `${config.method}-${config.url}`;
        if (pendingRequests.has(requestKey)) {
            pendingRequests.get(requestKey)?.abort();
            pendingRequests.delete(requestKey);
        }

        // Create new AbortController for this request
        const controller = new AbortController();
        config.signal = controller.signal;
        pendingRequests.set(requestKey, controller);

        // Get token from AsyncStorage directly
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }

        // Add development headers
        if (API_CONFIG.DEBUG) {
            config.headers['X-Development'] = 'true';
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Remove the request from pending requests on success
        const requestKey = `${response.config.method}-${response.config.url}`;
        pendingRequests.delete(requestKey);
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Remove the request from pending requests
        const requestKey = `${originalRequest.method}-${originalRequest.url}`;
        pendingRequests.delete(requestKey);

        // Don't retry if the request was cancelled
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        // Handle rate limiting with proper backoff
        if (error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after'];
            const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
            
            // Only retry if we haven't exceeded the retry limit
            const retryCount = (originalRequest as any)._retryCount || 0;
            if (retryCount < (API_CONFIG.RETRY_ATTEMPTS || 3)) {
                (originalRequest as any)._retryCount = retryCount + 1;
                await new Promise(resolve => setTimeout(resolve, delay));
                return api(originalRequest);
            }
        }

        // Handle unauthorized errors
        if (error.response?.status === 401) {
            try {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('refresh_token');
            } catch (error) {
                console.error('Error removing tokens:', error);
            }
        }

        // Log detailed error information in development
        if (API_CONFIG.DEBUG) {
            console.error('API Error:', {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers,
                method: originalRequest.method,
                url: originalRequest.url,
                requestHeaders: originalRequest.headers,
                retryCount: (originalRequest as any)._retryCount
            });
        }

        return Promise.reject(error);
    }
);

export default api; 