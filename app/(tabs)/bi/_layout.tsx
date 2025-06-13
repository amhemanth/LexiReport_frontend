import React from 'react';
import { Stack } from 'expo-router';

export default function BILayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F5F5F5' }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="connections" />
      <Stack.Screen name="reports" />
    </Stack>
  );
} 