import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockDownloadQueue, formatFileSize } from '../../../mock/offline';
import { useRouter } from 'expo-router';

interface DownloadItemProps {
  item: typeof mockDownloadQueue[0];
  onCancel: () => void;
  onRetry: () => void;
}

function DownloadItem({ item, onCancel, onRetry }: DownloadItemProps) {
  const getStatusColor = () => {
    switch (item.status) {
      case 'downloading':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'paused':
        return '#FF9800';
      default:
        return '#666666';
    }
  };

  const getStatusIcon = () => {
    switch (item.status) {
      case 'downloading':
        return 'cloud-download';
      case 'completed':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      case 'paused':
        return 'pause-circle';
      default:
        return 'cloud-download';
    }
  };

  return (
    <View style={styles.downloadItem}>
      <View style={styles.downloadInfo}>
        <View style={styles.titleContainer}>
          <Ionicons
            name={getStatusIcon()}
            size={20}
            color={getStatusColor()}
            style={styles.statusIcon}
          />
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </View>

        <View style={styles.metaContainer}>
          <Text style={styles.fileSize}>{formatFileSize(item.fileSize)}</Text>
          {item.status === 'downloading' && (
            <Text style={styles.progress}>
              {Math.round(item.progress * 100)}%
            </Text>
          )}
        </View>

        {item.status === 'downloading' && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${item.progress * 100}%` }
              ]}
            />
          </View>
        )}

        {item.error && (
          <Text style={styles.errorText} numberOfLines={2}>
            {item.error}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {item.status === 'downloading' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onCancel}
          >
            <Ionicons name="close-circle" size={24} color="#F44336" />
          </TouchableOpacity>
        )}
        {item.status === 'error' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onRetry}
          >
            <Ionicons name="refresh" size={24} color="#2196F3" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function DownloadsScreen() {
  const router = useRouter();
  const [downloads, setDownloads] = useState(mockDownloadQueue);

  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancel Download',
      'Are you sure you want to cancel this download?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setDownloads(
              downloads.map(item =>
                item.id === id
                  ? { ...item, status: 'paused', progress: 0 }
                  : item
              )
            );
          }
        }
      ]
    );
  };

  const handleRetry = (id: string) => {
    setDownloads(
      downloads.map(item =>
        item.id === id
          ? { ...item, status: 'downloading', progress: 0, error: undefined }
          : item
      )
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Downloads</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cloud-download-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyTitle}>No Downloads</Text>
      <Text style={styles.emptyText}>
        Reports you download will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={downloads}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DownloadItem
            item={item}
            onCancel={() => handleCancel(item.id)}
            onRetry={() => handleRetry(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  backButton: {
    marginRight: 16
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  downloadItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  downloadInfo: {
    flex: 1,
    marginRight: 12
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  statusIcon: {
    marginRight: 8
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  fileSize: {
    fontSize: 14,
    color: '#666666',
    marginRight: 12
  },
  progress: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500'
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 2
  },
  errorText: {
    fontSize: 12,
    color: '#F44336'
  },
  actions: {
    justifyContent: 'center'
  },
  actionButton: {
    padding: 4
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