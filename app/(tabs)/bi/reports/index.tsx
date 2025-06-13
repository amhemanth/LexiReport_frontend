import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockBIReports } from '../../../../mock/bi';
import { useRouter } from 'expo-router';

type ReportType = 'dashboard' | 'report' | 'dataset';

export default function BIReportsScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>('all');
  const [reports] = useState(mockBIReports);

  const filteredReports = selectedType === 'all'
    ? reports
    : reports.filter(report => report.type === selectedType);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>BI Reports</Text>
        <Text style={styles.subtitle}>
          Access and manage your BI platform reports
        </Text>
      </View>
    </View>
  );

  const renderFilter = () => (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === 'all' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedType('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedType === 'all' && styles.filterButtonTextActive
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === 'dashboard' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedType('dashboard')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedType === 'dashboard' && styles.filterButtonTextActive
            ]}
          >
            Dashboards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === 'report' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedType('report')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedType === 'report' && styles.filterButtonTextActive
            ]}
          >
            Reports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === 'dataset' && styles.filterButtonActive
          ]}
          onPress={() => setSelectedType('dataset')}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedType === 'dataset' && styles.filterButtonTextActive
            ]}
          >
            Datasets
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderReportItem = ({ item }: { item: typeof reports[0] }) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => router.push(`/bi/reports/${item.id}`)}
    >
      {item.thumbnailUrl ? (
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.thumbnail}
        />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Ionicons
            name={item.type === 'dashboard' ? 'grid' : 'document-text'}
            size={24}
            color="#CCCCCC"
          />
        </View>
      )}

      <View style={styles.reportContent}>
        <Text style={styles.reportTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.reportDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.reportMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={14} color="#666666" />
            <Text style={styles.metaText}>{item.owner}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="#666666" />
            <Text style={styles.metaText}>
              {new Date(item.lastUpdated).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.tags}>
          {item.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyTitle}>No Reports Found</Text>
      <Text style={styles.emptyText}>
        {selectedType === 'all'
          ? 'Connect to a BI platform to access reports'
          : `No ${selectedType}s available`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredReports}
        keyExtractor={item => item.id}
        renderItem={renderReportItem}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderFilter()}
          </>
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  listContent: {
    padding: 16,
    flexGrow: 1
  },
  header: {
    marginBottom: 16
  },
  headerContent: {
    marginBottom: 4
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#666666'
  },
  filterContainer: {
    marginBottom: 16
  },
  filterContent: {
    paddingRight: 16
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3'
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666666'
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '500'
  },
  reportItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12
  },
  thumbnailPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  reportContent: {
    flex: 1,
    padding: 12
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4
  },
  reportDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8
  },
  reportMeta: {
    flexDirection: 'row',
    marginBottom: 8
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12
  },
  metaText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4
  },
  tagText: {
    fontSize: 12,
    color: '#2196F3'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center'
  }
}); 