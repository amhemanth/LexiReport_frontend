import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Slot } from 'expo-router';
import { useTheme } from '@hooks/useTheme';

export default function App() {
  const { colors } = useTheme();
  
  return (
    <PaperProvider theme={{ colors }}>
      <Slot />
    </PaperProvider>
  );
} 