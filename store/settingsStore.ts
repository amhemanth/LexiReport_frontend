import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  // Offline settings
  autoDownload: boolean;
  downloadOnWifiOnly: boolean;
  maxStorageSize: number;
  // Notification settings
  pushNotifications: boolean;
  emailNotifications: boolean;
  // Theme settings
  darkMode: boolean;
  // Actions
  setAutoDownload: (value: boolean) => void;
  setDownloadOnWifiOnly: (value: boolean) => void;
  setMaxStorageSize: (value: number) => void;
  setPushNotifications: (value: boolean) => void;
  setEmailNotifications: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state
      autoDownload: false,
      downloadOnWifiOnly: true,
      maxStorageSize: 1024 * 1024 * 1024, // 1GB default
      pushNotifications: true,
      emailNotifications: false,
      darkMode: false,

      // Actions
      setAutoDownload: (value) => set({ autoDownload: value }),
      setDownloadOnWifiOnly: (value) => set({ downloadOnWifiOnly: value }),
      setMaxStorageSize: (value) => set({ maxStorageSize: value }),
      setPushNotifications: (value) => set({ pushNotifications: value }),
      setEmailNotifications: (value) => set({ emailNotifications: value }),
      setDarkMode: (value) => set({ darkMode: value }),
    }),
    {
      name: 'settings-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
); 