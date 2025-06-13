import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mockOfflineItems, OfflineItem, formatFileSize } from '../../../mock/offline';
import { useOfflineStore } from '../../../store/offlineStore';

type FilterType = 'all' | 'downloaded' | 'downloading' | 'error';

export default function OfflineIndexScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const offlineStore = useOfflineStore();
  const offlineMode = offlineStore.offlineMode;

  const handleToggleOffline = () => {
    offlineStore.setOfflineMode(!offlineMode);
  };

  const filteredItems = selectedFilter === 'all'
    ? mockOfflineItems
    : mockOfflineItems.filter(item => item.status === selectedFilter);

  const renderFilterButton = (filter: FilterType, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonSelected
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextSelected
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: OfflineItem }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/(tabs)/offline/${item.id}`)}
    >
      <View style={styles.itemHeader}>
        <View style={styles.typeContainer}>
          <Ionicons
            name={
              item.type === 'dashboard'
                ? 'grid-outline'
                : item.type === 'report'
                ? 'document-text-outline'
                : 'analytics-outline'
            }
            size={20}
            color="#2196F3"
          />
          <Text style={styles.typeText}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>
        <View style={[
          styles.statusContainer,
          {
            backgroundColor:
              item.status === 'downloaded'
                ? '#E8F5E9'
                : item.status === 'downloading'
                ? '#E3F2FD'
                : item.status === 'error'
                ? '#FFEBEE'
                : '#F5F5F5'
          }
        ]}>
          <View style={[
            styles.statusDot,
            {
              backgroundColor:
                item.status === 'downloaded'
                  ? '#4CAF50'
                  : item.status === 'downloading'
                  ? '#2196F3'
                  : item.status === 'error'
                  ? '#F44336'
                  : '#9E9E9E'
            }
          ]} />
          <Text style={[
            styles.statusText,
            {
              color:
                item.status === 'downloaded'
                  ? '#4CAF50'
                  : item.status === 'downloading'
                  ? '#2196F3'
                  : item.status === 'error'
                  ? '#F44336'
                  : '#9E9E9E'
            }
          ]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.itemFooter}>
        <View style={styles.metadataContainer}>
          <Ionicons name="time-outline" size={16} color="#666666" />
          <Text style={styles.metadataText}>
            {new Date(item.lastUpdated).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.metadataContainer}>
          <Ionicons name="save-outline" size={16} color="#666666" />
          <Text style={styles.metadataText}>
            {formatFileSize(item.size)}
          </Text>
        </View>
      </View>

      {item.status === 'downloading' && item.progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${item.progress}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>{item.progress}%</Text>
        </View>
      )}

      {item.status === 'error' && item.error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={16} color="#F44336" />
          <Text style={styles.errorText}>{item.error}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Offline status banner */}
      <View style={[styles.banner, { backgroundColor: offlineMode ? '#FFEB3B' : '#E3F2FD' }]}> 
        <Ionicons name={offlineMode ? 'cloud-offline-outline' : 'cloud-done-outline'} size={20} color={offlineMode ? '#F44336' : '#2196F3'} />
        <Text style={styles.bannerText}>
          {offlineMode ? 'Offline Mode Enabled' : 'Online'}
        </Text>
        <Switch value={offlineMode} onValueChange={handleToggleOffline} />
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Offline Content</Text>
        <Text style={styles.subtitle}>
          Access your downloaded reports and dashboards
        </Text>
      </View>

      <View style={styles.content}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {renderFilterButton('all', 'All')}
          {renderFilterButton('downloaded', 'Downloaded')}
          {renderFilterButton('downloading', 'Downloading')}
          {renderFilterButton('error', 'Error')}
        </ScrollView>

        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.itemsList}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4
  },
  content: {
    padding: 16
  },
  filterContainer: {
    marginBottom: 16
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8
  },
  filterButtonSelected: {
    backgroundColor: '#2196F3'
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666'
  },
  filterButtonTextSelected: {
    color: '#FFFFFF'
  },
  itemsList: {
    gap: 16
  },
  item: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2196F3'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500'
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12
  },
  itemFooter: {
    flexDirection: 'row',
    gap: 16
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metadataText: {
    fontSize: 12,
    color: '#666666'
  },
  progressContainer: {
    marginTop: 12,
    gap: 4
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 2
  },
  progressText: {
    fontSize: 12,
    color: '#2196F3',
    textAlign: 'right'
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 4
  },
  errorText: {
    fontSize: 12,
    color: '#F44336'
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
    color: '#1A1A1A',
  },
}); 