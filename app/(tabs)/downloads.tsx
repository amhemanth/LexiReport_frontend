import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ui/ThemedView';
import { Header } from '@components/Header';
import { getOfflineReports, removeOfflineReportAndFile } from '@utils/offline';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function DownloadsScreen() {
  const { colors } = useTheme();
  const [offlineReports, setOfflineReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState(0);

  useEffect(() => {
    loadOffline();
  }, []);

  const loadOffline = async () => {
    setLoading(true);
    const reports = await getOfflineReports();
    setOfflineReports(reports);
    let total = 0;
    for (const r of reports) {
      if (r.fileUri) {
        try {
          const info = await fetch(r.fileUri, { method: 'HEAD' });
          const size = Number(info.headers.get('content-length')) || 0;
          total += size;
        } catch {}
      }
    }
    setStorage(total);
    setLoading(false);
  };

  const handleRemove = async (id: number) => {
    try {
      await removeOfflineReportAndFile(id);
      loadOffline();
      Toast.show({ type: 'success', text1: 'Removed', text2: 'Report removed from offline storage.' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to remove offline report.' });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Downloads" />
      <Text style={{ color: colors.text, margin: 16 }}>
        Storage used: {(storage / 1024 / 1024).toFixed(2)} MB
      </Text>
      <FlatList
        data={offlineReports}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.reportTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.reportDesc, { color: colors.text + '80' }]} numberOfLines={2}>{item.description}</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => {/* open report logic */}}
                accessibilityLabel={`Open report ${item.title}`}
                accessibilityRole="button"
              >
                <Ionicons name="open-outline" size={22} color={colors.background} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.error }]}
                onPress={() => handleRemove(item.id)}
                accessibilityLabel={`Remove report ${item.title} from offline storage`}
                accessibilityRole="button"
              >
                <Ionicons name="trash" size={22} color={colors.background} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 24, gap: 20 }}
        ListEmptyComponent={<Text style={{ color: colors.text, textAlign: 'center', marginTop: 32 }}>No offline reports found.</Text>}
        refreshing={loading}
        onRefresh={loadOffline}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reportCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  reportDesc: {
    fontSize: 14,
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
}); 