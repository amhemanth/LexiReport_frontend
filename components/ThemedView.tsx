import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface ThemedViewProps extends ViewProps {
  children: React.ReactNode;
}

export function ThemedView({ style, children, ...props }: ThemedViewProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
          flex: 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
} 