import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@hooks/useTheme';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'defaultSemiBold' | 'default';
}

export const ThemedText: React.FC<ThemedTextProps> = ({ type = 'default', style, ...props }) => {
  const { colors } = useTheme();

  const getTextStyle = () => {
    switch (type) {
      case 'title':
        return [styles.title, { color: colors.text }];
      case 'subtitle':
        return [styles.subtitle, { color: colors.text }];
      case 'defaultSemiBold':
        return [styles.defaultSemiBold, { color: colors.text }];
      default:
        return [styles.default, { color: colors.text }];
    }
  };

  return <Text style={[getTextStyle(), style]} {...props} />;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: '600',
  },
  default: {
    fontSize: 16,
  },
}); 