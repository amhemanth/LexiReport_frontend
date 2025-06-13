import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BIConnection } from '../mock/bi';

interface BIConnectionCardProps {
  connection: BIConnection;
  onPress?: () => void;
  onDisconnect?: () => void;
  onReconnect?: () => void;
}

export function BIConnectionCard({
  connection,
  onPress,
  onDisconnect,
  onReconnect
}: BIConnectionCardProps) {
  const getPlatformIcon = () => {
    switch (connection.platform) {
      case 'powerbi':
        return 'logo-windows';
      case 'tableau':
        return 'bar-chart';
      case 'looker':
        return 'eye';
      case 'qlik':
        return 'analytics';
      default:
        return 'analytics';
    }
  };

  const getStatusColor = () => {
    switch (connection.status) {
      case 'connected':
        return '#4CAF50';
      case 'disconnected':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return '#666666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect',
      `Are you sure you want to disconnect from ${connection.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: onDisconnect
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.platformInfo}>
          <Ionicons
            name={getPlatformIcon()}
            size={24}
            color="#1A1A1A"
            style={styles.platformIcon}
          />
          <View>
            <Text style={styles.name}>{connection.name}</Text>
            <Text style={styles.platform}>
              {connection.platform.charAt(0).toUpperCase() +
                connection.platform.slice(1)}
            </Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
          <Text style={styles.status}>
            {connection.status.charAt(0).toUpperCase() +
              connection.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{connection.description}</Text>

      {connection.workspace && (
        <View style={styles.metaItem}>
          <Ionicons name="business" size={16} color="#666666" />
          <Text style={styles.metaText}>{connection.workspace}</Text>
        </View>
      )}

      <View style={styles.metaItem}>
        <Ionicons name="time-outline" size={16} color="#666666" />
        <Text style={styles.metaText}>
          Last synced {formatDate(connection.lastSync)}
        </Text>
      </View>

      {connection.error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#F44336" />
          <Text style={styles.errorText}>{connection.error}</Text>
        </View>
      )}

      <View style={styles.actions}>
        {connection.status === 'connected' ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.disconnectButton]}
            onPress={handleDisconnect}
          >
            <Ionicons name="link" size={20} color="#F44336" />
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.reconnectButton]}
            onPress={onReconnect}
          >
            <Ionicons name="refresh" size={20} color="#2196F3" />
            <Text style={styles.reconnectButtonText}>Reconnect</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  platformIcon: {
    marginRight: 12
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2
  },
  platform: {
    fontSize: 14,
    color: '#666666'
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  status: {
    fontSize: 12,
    color: '#666666'
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  metaText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginLeft: 6,
    flex: 1
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6
  },
  disconnectButton: {
    backgroundColor: '#FFEBEE'
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F44336',
    marginLeft: 4
  },
  reconnectButton: {
    backgroundColor: '#E3F2FD'
  },
  reconnectButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2196F3',
    marginLeft: 4
  }
}); 