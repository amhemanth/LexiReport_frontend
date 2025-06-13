import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F5F5F5' },
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationDuration: 200
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          animation: 'fade'
        }}
      />
      <Stack.Screen 
        name="login"
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="register"
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="forgot-password"
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="reset-password"
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="verify-email"
        options={{
          animation: 'slide_from_right'
        }}
      />
    </Stack>
  );
} 