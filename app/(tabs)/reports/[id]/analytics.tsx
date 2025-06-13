import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock analytics data
const mockAnalytics = {
  views: 1234,
  shares: 56,
  downloads: 78,
  chartData: [10, 20, 30, 25, 40, 35, 50],
};

export default function ReportAnalyticsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Analytics</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="eye-outline" size={32} color="#2196F3" />
          <Text style={styles.statValue}>{mockAnalytics.views}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="share-social-outline" size={32} color="#4CAF50" />
          <Text style={styles.statValue}>{mockAnalytics.shares}</Text>
          <Text style={styles.statLabel}>Shares</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cloud-download-outline" size={32} color="#FFA000" />
          <Text style={styles.statValue}>{mockAnalytics.downloads}</Text>
          <Text style={styles.statLabel}>Downloads</Text>
        </View>
      </View>
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Views Over Time</Text>
        <View style={styles.chartContainer}>
          {/* Simple bar chart mockup */}
          <View style={styles.barChart}>
            {mockAnalytics.chartData.map((value, idx) => (
              <View key={idx} style={[styles.bar, { height: value * 2 }]} />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  backButton: { padding: 8 },
  title: { flex: 1, fontSize: 20, fontWeight: '600', color: '#1A1A1A', textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 24 },
  statCard: { alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16, width: 100 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#222', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#888', marginTop: 4 },
  chartSection: { marginTop: 32, paddingHorizontal: 16 },
  chartTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 },
  chartContainer: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 100 },
  bar: { width: 16, backgroundColor: '#2196F3', marginHorizontal: 4, borderRadius: 4 },
}); 