import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Alert, View, ActivityIndicator, useColorScheme } from 'react-native';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLoadingStore } from '../store/loadingStore';
import { colors, commonStyles } from '@/constants/styles';

class LayoutErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const { isAuthenticated, isInitialized, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const colorScheme = useColorScheme();
  const loading = useLoadingStore((state) => state.loading);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initialize();
        setIsReady(true);
      } catch (error) {
        console.error('Initialization error:', error);
        Alert.alert(
          'Error',
          'Failed to initialize the app. Please try again.',
          [{ 
            text: 'OK',
            onPress: () => {
              // Retry initialization
              initializeApp();
            }
          }]
        );
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (!isReady || !isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    
    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main app if authenticated and in auth group
      router.replace('/(tabs)');
    } else if (isAuthenticated && !inTabsGroup && !inAuthGroup) {
      // Handle any other routes when authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isReady, isInitialized]);

  const handleError = (error: Error) => {
    console.error('Layout error:', error);
    Alert.alert(
      'Error',
      'An unexpected error occurred. The app will try to recover.',
      [{ 
        text: 'OK',
        onPress: () => {
          // Attempt to recover by redirecting to a safe route
          router.replace('/(tabs)');
        }
      }]
    );
  };

  if (!isReady || !isInitialized) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <LayoutErrorBoundary onError={handleError}>
      {loading && <LoadingSpinner />}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.secondary },
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal'
        }}
      >
        <Stack.Screen 
          name="(auth)" 
          options={{
            animation: 'fade',
            gestureEnabled: false
          }}
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{
            animation: 'fade',
            gestureEnabled: false
          }}
        />
      </Stack>
    </LayoutErrorBoundary>
  );
}
