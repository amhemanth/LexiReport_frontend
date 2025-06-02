import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { getReports } from '@lib/api';
import { Report } from '@lib/types';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ThemedView';
import { Header } from '@components/Header';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsScreen() {
  const { colors } = useTheme();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const renderReportItem = ({ item }: { item: Report }) => (
    <TouchableOpacity
      style={[styles.reportItem, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/(app)/report/${item.id}`)}
    >
      <View style={styles.reportHeader}>
        <View style={styles.reportIconContainer}>
          <Ionicons name="document-text" size={24} color={colors.primary} />
        </View>
        <View style={styles.reportInfo}>
          <Text style={[styles.reportTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.reportType, { color: colors.text + '80' }]}>
            {item.report_type}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.text + '60'} />
      </View>
      <View style={[styles.reportFooter, { borderTopColor: colors.border }]}>
        <Text style={[styles.reportDate, { color: colors.text + '60' }]}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Header title="Reports" />
      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={() => (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
            <Ionicons name="document-text" size={48} color={colors.text + '40'} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              {loading ? 'Loading reports...' : 'No reports found'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text + '80' }]}>
              Upload your first report to get started
            </Text>
          </View>
        )}
      />
      
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(app)/upload')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 12,
    marginTop: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  reportItem: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  reportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reportType: {
    fontSize: 14,
  },
  reportFooter: {
    padding: 12,
    borderTopWidth: 1,
  },
  reportDate: {
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 