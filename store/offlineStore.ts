import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { OfflineItem } from '../types/offline';

interface OfflineState {
  items: OfflineItem[];
  isSyncing: boolean;
  lastSyncTime: number | null;
  offlineMode: boolean;
  setOfflineMode: (value: boolean) => void;
  // Actions
  addItem: (item: OfflineItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<OfflineItem>) => void;
  startSync: () => Promise<void>;
  cancelSync: () => void;
  // Computed
  getItemById: (id: string) => OfflineItem | undefined;
  getItemsByType: (type: string) => OfflineItem[];
  getTotalStorageUsed: () => number;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,
      lastSyncTime: null,
      offlineMode: false,
      setOfflineMode: (value: boolean) => set({ offlineMode: value }),

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      startSync: async () => {
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          throw new Error('No internet connection');
        }

        set({ isSyncing: true });
        try {
          // Simulate sync process
          await new Promise((resolve) => setTimeout(resolve, 2000));
          set({ lastSyncTime: Date.now() });
        } finally {
          set({ isSyncing: false });
        }
      },

      cancelSync: () => {
        set({ isSyncing: false });
      },

      getItemById: (id) => {
        return get().items.find((item) => item.id === id);
      },

      getItemsByType: (type) => {
        return get().items.filter((item) => item.type === type);
      },

      getTotalStorageUsed: () => {
        return get().items.reduce((total, item) => total + item.size, 0);
      },
    }),
    {
      name: 'offline-storage',
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