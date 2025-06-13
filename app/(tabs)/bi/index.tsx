import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mockBIConnections, mockBIReports, BIConnection, BIReport } from '../../../mock/bi';

export default function BIIndexScreen() {
  const router = useRouter();

  const renderConnectionItem = ({ item }: { item: BIConnection }) => (
    <TouchableOpacity
      style={styles.connectionItem}
      onPress={() => router.push(`/(tabs)/bi/connections/${item.id}`)}
    >
      <View style={styles.connectionHeader}>
        <View style={styles.platformContainer}>
          <Ionicons name="logo-windows" size={24} color="#2196F3" />
          <Text style={styles.platformName}>{item.platform}</Text>
        </View>
        <View style={[
          styles.statusContainer,
          { backgroundColor: item.status === 'connected' ? '#E8F5E9' : '#FFF3E0' }
        ]}>
          <View style={[
            styles.statusDot,
            { backgroundColor: item.status === 'connected' ? '#4CAF50' : '#FF9800' }
          ]} />
          <Text style={[
            styles.statusText,
            { color: item.status === 'connected' ? '#4CAF50' : '#FF9800' }
          ]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.connectionName}>{item.name}</Text>
      <Text style={styles.connectionDescription}>{item.description}</Text>

      <View style={styles.connectionFooter}>
        <View style={styles.metadataContainer}>
          <Ionicons name="time-outline" size={16} color="#666666" />
          <Text style={styles.metadataText}>
            Last sync: {new Date(item.lastSync).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.metadataContainer}>
          <Ionicons name="document-text-outline" size={16} color="#666666" />
          <Text style={styles.metadataText}>
            {item.reports.length} reports
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReportItem = ({ item }: { item: BIReport }) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => router.push(`/(tabs)/bi/reports/${item.id}`)}
    >
      <View style={styles.reportHeader}>
        <View style={styles.reportTypeContainer}>
          <Ionicons
            name={item.type === 'dashboard' ? 'grid-outline' : 'document-text-outline'}
            size={16}
            color="#2196F3"
          />
          <Text style={styles.reportType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>
        <Text style={styles.reportDate}>
          {new Date(item.lastUpdated).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.reportName}>{item.name}</Text>
      <Text style={styles.reportDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.reportFooter}>
        <View style={styles.metadataContainer}>
          <Ionicons name="person-outline" size={16} color="#666666" />
          <Text style={styles.metadataText}>{item.owner}</Text>
        </View>
        <View style={styles.metadataContainer}>
          <Ionicons name="eye-outline" size={16} color="#666666" />
          <Text style={styles.metadataText}>{item.views} views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Business Intelligence</Text>
        <Text style={styles.subtitle}>
          Connect to BI platforms and access your reports
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Connections</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/(tabs)/bi/connect')}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Connection</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockBIConnections}
            renderItem={renderConnectionItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.connectionsList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/bi/reports')}
            >
              <Text style={styles.viewAllButtonText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#2196F3" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockBIReports.slice(0, 3)}
            renderItem={renderReportItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.reportsList}
          />
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
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF'
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2196F3'
  },
  connectionsList: {
    gap: 16
  },
  connectionItem: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  platformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  platformName: {
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
  connectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4
  },
  connectionDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12
  },
  connectionFooter: {
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
  reportsList: {
    gap: 16
  },
  reportItem: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  reportTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  reportType: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2196F3'
  },
  reportDate: {
    fontSize: 12,
    color: '#666666'
  },
  reportName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4
  },
  reportDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12
  },
  reportFooter: {
    flexDirection: 'row',
    gap: 16
  }
}); 