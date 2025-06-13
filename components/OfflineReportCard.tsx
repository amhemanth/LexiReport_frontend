import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OfflineReport, formatFileSize } from '../mock/offline';

interface OfflineReportCardProps {
  report: OfflineReport;
  onPress?: () => void;
  onDelete?: () => void;
}

export function OfflineReportCard({
  report,
  onPress,
  onDelete
}: OfflineReportCardProps) {
  const getTypeIcon = () => {
    switch (report.type) {
      case 'pdf':
        return 'document-text';
      case 'excel':
        return 'grid';
      case 'bi':
        return 'analytics';
      default:
        return 'document';
    }
  };

  const getPlatformIcon = () => {
    if (report.type !== 'bi' || !report.biPlatform) return null;

    switch (report.biPlatform) {
      case 'powerbi':
        return 'logo-windows';
      case 'tableau':
        return 'bar-chart';
      case 'looker':
        return 'eye';
      case 'qlik':
        return 'analytics';
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {report.thumbnailUrl ? (
        <Image
          source={{ uri: report.thumbnailUrl }}
          style={styles.thumbnail}
        />
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Ionicons name={getTypeIcon()} size={24} color="#CCCCCC" />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {report.title}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {report.description}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color="#666666" />
            <Text style={styles.metaText}>
              Downloaded {formatDate(report.downloadDate)}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="save-outline" size={16} color="#666666" />
            <Text style={styles.metaText}>
              {formatFileSize(report.fileSize)}
            </Text>
          </View>

          {report.biPlatform && (
            <View style={styles.metaItem}>
              <Ionicons
                name={getPlatformIcon() as any}
                size={16}
                color="#666666"
              />
              <Text style={styles.metaText}>
                {report.biPlatform.charAt(0).toUpperCase() +
                  report.biPlatform.slice(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  content: {
    flex: 1,
    padding: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8
  },
  deleteButton: {
    padding: 4
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4
  },
  metaText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4
  }
}); 