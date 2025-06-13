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
import { BIConnectionCard } from '../../../components/BIConnectionCard';
import { mockBIConnections } from '../../../mock/bi';
import { useRouter } from 'expo-router';

export default function BIConnectionsScreen() {
  const router = useRouter();
  const [connections, setConnections] = useState(mockBIConnections);

  const handleDisconnect = (id: string) => {
    setConnections(
      connections.map(connection =>
        connection.id === id
          ? { ...connection, status: 'disconnected' }
          : connection
      )
    );
  };

  const handleReconnect = (id: string) => {
    setConnections(
      connections.map(connection =>
        connection.id === id
          ? { ...connection, status: 'connected', error: undefined }
          : connection
      )
    );
  };

  const handleAddConnection = () => {
    router.push('/bi/connections/add');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>BI Connections</Text>
        <Text style={styles.subtitle}>
          Connect and manage your BI platform integrations
        </Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddConnection}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="analytics-outline" size={64} color="#CCCCCC" />
      <Text style={styles.emptyTitle}>No BI Connections</Text>
      <Text style={styles.emptyText}>
        Connect to your BI platforms to access reports and dashboards
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={handleAddConnection}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Add Connection</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={connections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BIConnectionCard
            connection={item}
            onPress={() => router.push(`/bi/connections/${item.id}`)}
            onDisconnect={() => handleDisconnect(item.id)}
            onReconnect={() => handleReconnect(item.id)}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  headerContent: {
    flex: 1,
    marginRight: 16
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
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
    textAlign: 'center',
    marginBottom: 24
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8
  }
}); 