import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get the local IP address for development
const getLocalIpAddress = () => {
    return '192.168.31.20'; // Your local network IP
};

// Get environment variables with defaults
const getEnvVar = (key: string, defaultValue: string): string => {
    const value = Constants.expoConfig?.extra?.apiUrl;
    if (!value) {
        if (process.env.NODE_ENV === 'development') {
            // Use local IP for Android and localhost for iOS in development
            if (Platform.OS === 'android') {
                return `http://${getLocalIpAddress()}:8000/api/v1`;
            }
            return 'http://localhost:8000/api/v1';
        }
        return defaultValue;
    }
    return value;
};

export const API_CONFIG = {
    // Base configuration
    BASE_URL: getEnvVar('API_URL', 'http://localhost:8000/api/v1'),
    TIMEOUT: 10000,
    DEBUG: process.env.NODE_ENV === 'development',
    
    // Headers
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    
    // Development settings
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    
    // Development headers
    ...(process.env.NODE_ENV === 'development' && {
        HEADERS: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Development': 'true'
        }
    })
}; 