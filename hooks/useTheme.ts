import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const { theme } = useThemeStore();
  const effectiveScheme = theme === 'system' ? colorScheme : theme;
  const isDark = effectiveScheme === 'dark';

  return {
    colors: {
      primary: '#007AFF',
      background: isDark ? '#000000' : '#FFFFFF',
      card: isDark ? '#1C1C1E' : '#F2F2F7',
      text: isDark ? '#FFFFFF' : '#000000',
      textSecondary: isDark ? '#AEAEB2' : '#6C6C70',
      textTertiary: isDark ? '#8E8E93' : '#8E8E93',
      border: isDark ? '#38383A' : '#C6C6C8',
      notification: '#FF3B30',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
    },
    isDark,
    theme,
    setTheme: useThemeStore().setTheme,
  };
}; 