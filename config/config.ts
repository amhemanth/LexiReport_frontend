import Constants from 'expo-constants';

// API Configuration
const getEnvVar = (key: string): string => {
  const value = Constants.expoConfig?.extra?.[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const API_URL = getEnvVar('apiUrl');
export const API_CONFIG = {
  // Use your computer's local IP address when testing on a physical device
  // Use localhost when testing on an emulator
  BASE_URL: API_URL,
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}; 