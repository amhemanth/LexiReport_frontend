import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReportInsight } from '../lib/types';
import { useTheme } from '../hooks/useTheme';

interface InsightCardProps {
  insight: ReportInsight;
  onPress: () => void;
  isSpeaking: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onPress, isSpeaking }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Ionicons
          name={isSpeaking ? 'volume-high' : 'volume-medium'}
          size={24}
          color={colors.primary}
        />
        <Text style={[styles.date, { color: colors.text }]}>
          {new Date(insight.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={[styles.insight, { color: colors.text }]}>{insight.insight_text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  insight: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 