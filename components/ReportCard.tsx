import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Report } from '../lib/types';
import { useTheme } from '../hooks/useTheme';

interface ReportCardProps {
  report: Report;
  onPress: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{report.title}</Text>
        <Ionicons name="chevron-forward" size={24} color={colors.text} />
      </View>
      <Text style={[styles.description, { color: colors.text }]} numberOfLines={2}>
        {report.description}
      </Text>
      <View style={styles.footer}>
        <Text style={[styles.type, { color: colors.primary }]}>{report.report_type}</Text>
        <Text style={[styles.date, { color: colors.text }]}>
          {new Date(report.created_at).toLocaleDateString()}
        </Text>
      </View>
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
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
}); 