import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Get the local IP address for development
const getLocalIpAddress = () => {
    // Use 10.0.2.2 for Android emulator (localhost)
    if (Platform.OS === 'android') {
        return '10.0.2.2';
    }
    // Use localhost for iOS simulator
    return 'localhost';
};

// Get environment variables with defaults
const getEnvVar = (key: string, defaultValue: string): string => {
    const value = Constants.expoConfig?.extra?.apiUrl;
    if (!value) {
        if (process.env.NODE_ENV === 'development') {
            return `http://${getLocalIpAddress()}:8000/api/v1`;
        }
        return defaultValue;
    }
    return value;
};

export const API_CONFIG = {
    // Base configuration
    BASE_URL: getEnvVar('API_URL', 'http://localhost:8000/api/v1'),
    TIMEOUT: 15000, // Increased timeout
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