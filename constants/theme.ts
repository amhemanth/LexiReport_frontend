import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Primary colors
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryLight: '#BBDEFB',
  
  // Secondary colors
  secondary: '#FF4081',
  secondaryDark: '#C51162',
  secondaryLight: '#F8BBD0',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#757575',
  lightGray: '#F5F5F5',
  darkGray: '#424242',
  
  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  
  // Background colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',
  
  // Text colors
  text: '#212121',
  textSecondary: '#757575',
  textDisabled: '#9E9E9E',
  
  // Border colors
  border: '#E0E0E0',
  divider: '#BDBDBD',
};

export const SIZES = {
  // Global sizes
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  
  // Screen dimensions
  width,
  height,
  
  // Font sizes
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  body1: 16,
  body2: 14,
  caption: 12,
  
  // Spacing
  padding: {
    small: 8,
    medium: 16,
    large: 24,
    extraLarge: 32,
  },
  margin: {
    small: 8,
    medium: 16,
    large: 24,
    extraLarge: 32,
  },
  radius: {
    small: 4,
    medium: 8,
    large: 12,
    extraLarge: 24,
  },
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as const,
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700' as const,
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300' as const,
  },
  thin: {
    fontFamily: 'System',
    fontWeight: '100' as const,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
};

export default { COLORS, SIZES, FONTS, SHADOWS }; 