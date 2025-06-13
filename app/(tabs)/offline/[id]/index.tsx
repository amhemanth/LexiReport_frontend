import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getOfflineItemById, formatFileSize } from '../../../../mock/offline';

export default function OfflineItemDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const item = getOfflineItemById(id);

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
        <Text style={styles.errorText}>Item not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = async () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // Simulate deletion
              await new Promise(resolve => setTimeout(resolve, 1000));
              Alert.alert('Success', 'Item deleted successfully');
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleRetry = async () => {
    if (item.status !== 'error') return;

    setLoading(true);
    try {
      // Simulate retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Download started');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to start download');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
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
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>

      {item.thumbnailUrl && (
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="person-outline" size={20} color="#666666" />
              <Text style={styles.detailLabel}>Owner</Text>
              <Text style={styles.detailValue}>{item.owner}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color="#666666" />
              <Text style={styles.detailLabel}>Last Updated</Text>
              <Text style={styles.detailValue}>
                {new Date(item.lastUpdated).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="save-outline" size={20} color="#666666" />
              <Text style={styles.detailLabel}>Size</Text>
              <Text style={styles.detailValue}>{formatFileSize(item.size)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cloud-done-outline" size={20} color="#666666" />
              <Text style={styles.detailLabel}>Status</Text>
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
          </View>
        </View>

        {item.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {item.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {item.status === 'error' && item.error && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Error</Text>
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="#F44336" />
              <Text style={styles.errorText}>{item.error}</Text>
            </View>
          </View>
        )}

        <View style={styles.actions}>
          {item.status === 'error' ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.retryButton]}
              onPress={handleRetry}
              disabled={loading}
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {loading ? 'Retrying...' : 'Retry Download'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {loading ? 'Deleting...' : 'Delete'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
  backButton: {
    marginBottom: 16
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3'
  },
  headerContent: {
    gap: 8
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2196F3'
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5'
  },
  content: {
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    gap: 4
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    alignSelf: 'flex-start'
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2196F3'
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#F44336'
  },
  actions: {
    marginTop: 8
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8
  },
  retryButton: {
    backgroundColor: '#2196F3'
  },
  deleteButton: {
    backgroundColor: '#F44336'
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF'
  }
}); 