import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { InsightCard } from '../../../../components/InsightCard';
import { getInsightsByReportId, getInsightsByType, Insight } from '../../../../mock/insights';
import { getReportById } from '../../../../mock/reports';

const InsightTypeFilter: React.FC<{
  selectedType: Insight['type'] | 'all';
  onSelectType: (type: Insight['type'] | 'all') => void;
}> = ({ selectedType, onSelectType }) => {
  const types: Array<Insight['type'] | 'all'> = [
    'all',
    'summary',
    'key_points',
    'recommendations',
    'trends',
    'anomalies'
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {types.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.filterButton,
            selectedType === type && styles.filterButtonActive
          ]}
          onPress={() => onSelectType(type)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedType === type && styles.filterButtonTextActive
            ]}
          >
            {type === 'all'
              ? 'All'
              : type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default function ReportInsightsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<Insight['type'] | 'all'>('all');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [report, setReport] = useState(getReportById(id));

  useEffect(() => {
    loadInsights();
  }, [id, selectedType]);

  const loadInsights = () => {
    setLoading(true);
    const allInsights = getInsightsByReportId(id);
    const filteredInsights =
      selectedType === 'all'
        ? allInsights
        : getInsightsByType(id, selectedType);
    setInsights(filteredInsights);
    setLoading(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadInsights();
    setRefreshing(false);
  };

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#D0021B" />
        <Text style={styles.errorText}>Report not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Report Insights</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.reportInfo}>
        <Text style={styles.reportTitle}>{report.title}</Text>
        <Text style={styles.reportType}>{report.type.toUpperCase()}</Text>
      </View>

      <InsightTypeFilter
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <ScrollView
          style={styles.insightsList}
          contentContainerStyle={styles.insightsContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {insights.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>No insights available</Text>
              <Text style={styles.emptySubtext}>
                {selectedType === 'all'
                  ? 'This report has no insights yet'
                  : `No ${selectedType.replace('_', ' ')} insights available`}
              </Text>
            </View>
          ) : (
            insights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onPress={() => {
                  // TODO: Implement insight detail view
                  console.log('View insight details:', insight.id);
                }}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  headerRight: {
    width: 24
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  backButton: {
    padding: 8
  },
  reportInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4
  },
  reportType: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase'
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  filterContent: {
    padding: 12
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8
  },
  filterButtonActive: {
    backgroundColor: '#4A90E2'
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666'
  },
  filterButtonTextActive: {
    color: '#FFFFFF'
  },
  insightsList: {
    flex: 1
  },
  insightsContent: {
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D0021B',
    marginTop: 16,
    marginBottom: 24
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500'
  }
}); 