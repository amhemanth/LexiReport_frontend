import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { mockReports, getReportById } from '@/mock/reports';
import { Report } from '@/mock/reports';

export default function ReportDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<Report | undefined>(getReportById(id as string));

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this report: ${report.title}\n${report.description}`,
        title: report.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share report');
    }
  };

  const handleDownload = () => {
    setIsLoading(true);
    // Simulate download
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Report downloaded successfully');
    }, 2000);
  };

  const getStatusColor = () => {
    switch (report.status) {
      case 'completed':
        return '#4CAF50';
      case 'processing':
        return '#FFA000';
      case 'error':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Ionicons
                name={report.type === 'pdf' ? 'document-text' : report.type === 'excel' ? 'grid' : 'bar-chart'}
                size={24}
                color="#666"
                style={styles.typeIcon}
              />
              <Text style={styles.title}>{report.title}</Text>
            </View>
            <View style={[styles.status, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{report.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.description}>{report.description}</Text>

          <View style={styles.metaSection}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.metaText}>
                Created: {new Date(report.created_at).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={20} color="#666" />
              <Text style={styles.metaText}>
                Updated: {new Date(report.updated_at).toLocaleDateString()}
              </Text>
            </View>
            {report.file_size > 0 && (
              <View style={styles.metaItem}>
                <Ionicons name="save-outline" size={20} color="#666" />
                <Text style={styles.metaText}>
                  Size: {formatFileSize(report.file_size)}
                </Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Ionicons name="analytics-outline" size={20} color="#666" />
              <Text style={styles.metaText}>
                {report.insights_count} insights available
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => router.push(`/reports/${report.id}/insights`)}
            >
              <Ionicons name="analytics" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>View Insights</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleDownload}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#007AFF" />
              ) : (
                <>
                  <Ionicons name="cloud-download" size={20} color="#007AFF" />
                  <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                    Download
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={20} color="#007AFF" />
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                Share
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => router.push(`/reports/${report.id}/collaborators`)}
            >
              <Ionicons name="people-outline" size={20} color="#007AFF" />
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                Collaborators
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => router.push(`/reports/${report.id}/analytics`)}
            >
              <Ionicons name="stats-chart-outline" size={20} color="#007AFF" />
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                Analytics
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    marginTop: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  metaSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
}); 