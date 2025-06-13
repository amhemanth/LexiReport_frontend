import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mockBIReports, BIReport } from '../../../../../mock/bi';

export default function BIReportDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const report = mockBIReports.find((r: BIReport) => r.id === id);

  if (!report) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Report Not Found</Text>
        <Text style={styles.errorText}>
          The report you're looking for doesn't exist or has been removed.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${report.type}: ${report.name}\n${report.description}`,
        title: report.name
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share report');
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Report downloaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = () => {
    switch (report.type) {
      case 'dashboard':
        return 'grid';
      case 'dataset':
        return 'bar-chart';
      default:
        return 'document-text';
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
            <Ionicons name={getTypeIcon()} size={16} color="#2196F3" />
            <Text style={styles.typeText}>
              {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
            </Text>
          </View>
          <Text style={styles.title}>{report.name}</Text>
          <Text style={styles.description}>{report.description}</Text>
        </View>
      </View>

      {report.thumbnailUrl && (
        <Image
          source={{ uri: report.thumbnailUrl }}
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
              <Text style={styles.detailValue}>{report.owner}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color="#666666" />
              <Text style={styles.detailLabel}>Last Updated</Text>
              <Text style={styles.detailValue}>
                {new Date(report.lastUpdated).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="eye-outline" size={20} color="#666666" />
              <Text style={styles.detailLabel}>Views</Text>
              <Text style={styles.detailValue}>{report.views}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="download-outline" size={20} color="#666666" />
              <Text style={styles.detailLabel}>Downloads</Text>
              <Text style={styles.detailValue}>{report.downloads}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tags}>
            {report.tags.map((tag: string) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleDownload}
            disabled={loading}
          >
            <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>
              {loading ? 'Downloading...' : 'Download'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color="#2196F3" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Share
            </Text>
          </TouchableOpacity>
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
    color: '#2196F3',
    fontWeight: '500'
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
    height: 200
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
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    marginBottom: 2
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  tags: {
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
    fontSize: 14,
    color: '#2196F3'
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8
  },
  primaryButton: {
    backgroundColor: '#2196F3'
  },
  secondaryButton: {
    backgroundColor: '#E3F2FD'
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF'
  },
  secondaryButtonText: {
    color: '#2196F3'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF'
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24
  },
  buttonText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '500'
  }
}); 