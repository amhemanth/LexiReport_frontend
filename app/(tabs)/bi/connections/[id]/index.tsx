import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getBIConnectionById, getBIReportsByConnection } from '../../../../../mock/bi';

export default function BIConnectionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const connection = getBIConnectionById(id as string);
  const reports = connection ? getBIReportsByConnection(connection.id) : [];

  if (!connection) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Connection Not Found</Text>
        <Text style={styles.errorText}>
          The connection you're looking for doesn't exist or has been removed.
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

  const handleSync = async () => {
    setLoading(true);
    try {
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Connection synchronized successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to synchronize connection');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Connection',
      'Are you sure you want to disconnect this connection?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            // Handle disconnect
            Alert.alert('Success', 'Connection disconnected successfully');
            router.back();
          }
        }
      ]
    );
  };

  const getStatusColor = () => {
    switch (connection.status) {
      case 'connected':
        return '#4CAF50';
      case 'disconnected':
        return '#FFA000';
      case 'error':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getPlatformIcon = () => {
    switch (connection.platform) {
      case 'powerbi':
        return 'logo-microsoft';
      case 'tableau':
        return 'bar-chart';
      case 'looker':
        return 'analytics';
      case 'qlik':
        return 'pie-chart';
      default:
        return 'apps';
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
          <View style={styles.platformContainer}>
            <Ionicons name={getPlatformIcon()} size={20} color="#2196F3" />
            <Text style={styles.platformText}>
              {connection.platform.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.title}>{connection.name}</Text>
          <Text style={styles.description}>{connection.description}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={20} color="#666666" />
              <Text style={styles.detailLabel}>Last Sync</Text>
              <Text style={styles.detailValue}>
                {new Date(connection.lastSync).toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color={getStatusColor()} />
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, { color: getStatusColor() }]}>
                {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
              </Text>
            </View>
            {connection.workspace && (
              <View style={styles.detailItem}>
                <Ionicons name="business-outline" size={20} color="#666666" />
                <Text style={styles.detailLabel}>Workspace</Text>
                <Text style={styles.detailValue}>{connection.workspace}</Text>
              </View>
            )}
            {connection.projectId && (
              <View style={styles.detailItem}>
                <Ionicons name="folder-outline" size={20} color="#666666" />
                <Text style={styles.detailLabel}>Project ID</Text>
                <Text style={styles.detailValue}>{connection.projectId}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports</Text>
          <Text style={styles.reportCount}>
            {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
          </Text>
          {reports.map(report => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportItem}
              onPress={() => router.push(`/bi/reports/${report.id}`)}
            >
              <View style={styles.reportContent}>
                <Text style={styles.reportTitle}>{report.name}</Text>
                <Text style={styles.reportDescription} numberOfLines={2}>
                  {report.description}
                </Text>
                <View style={styles.reportMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="person-outline" size={14} color="#666666" />
                    <Text style={styles.metaText}>{report.owner}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#666666" />
                    <Text style={styles.metaText}>
                      {new Date(report.lastUpdated).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleSync}
            disabled={loading}
          >
            <Ionicons name="sync-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>
              {loading ? 'Syncing...' : 'Sync Now'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDisconnect}
          >
            <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Disconnect</Text>
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
  platformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  platformText: {
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
  reportCount: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8
  },
  reportContent: {
    flex: 1
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '500',
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
    gap: 12
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    fontSize: 12,
    color: '#666666'
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
  dangerButton: {
    backgroundColor: '#F44336'
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF'
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