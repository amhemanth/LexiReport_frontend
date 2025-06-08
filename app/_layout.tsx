import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@hooks/useTheme';
import Toast from 'react-native-toast-message';
import { View } from 'react-native';

export default function RootLayout() {
  const { colors } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen 
            name="(tabs)" 
            options={{
              headerShown: false,
              header: () => null,
            }}
          />
        ) : (
          <Stack.Screen 
            name="(auth)" 
            options={{ headerShown: false }}
          />
        )}
      </Stack>
      <Toast />
    </View>
  );
}
