import Constants from 'expo-constants';

// API Configuration
export const API_URL = Constants.expoConfig?.extra?.apiUrl?.trim() || 'http://192.168.123.82:8000/api/v1';

export const API_CONFIG = {
  // Use your computer's local IP address when testing on a physical device
  // Use localhost when testing on an emulator
  BASE_URL: Constants.expoConfig?.extra?.apiBaseUrl?.trim() || 'http://192.168.123.82:8000',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}; 