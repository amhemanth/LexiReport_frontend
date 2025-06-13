import * as React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface ThemedViewProps extends ViewProps {
  style?: ViewStyle;
}

export const ThemedView: React.FC<ThemedViewProps> = ({ style, ...props }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
        },
        style,
      ]}
      {...props}
    />
  );
}; 