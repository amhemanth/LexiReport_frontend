import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationStore, Notification } from '../store/notificationStore';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'checkmark-circle-outline';
    case 'warning':
      return 'warning-outline';
    case 'error':
      return 'alert-circle-outline';
    default:
      return 'information-circle-outline';
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return '#4CAF50';
    case 'warning':
      return '#FFC107';
    case 'error':
      return '#F44336';
    default:
      return '#2196F3';
  }
};

export default function NotificationList() {
  const { notifications, markAsRead, removeNotification, markAllAsRead } =
    useNotificationStore();

  const renderItem = ({ item }: { item: Notification }) => {
    const iconColor = getNotificationColor(item.type);
    const iconName = getNotificationIcon(item.type);

    return (
      <Animated.View style={styles.notificationItem}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.content}>
          <View style={styles.notificationHeader}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          </View>
          <Text style={styles.message}>{item.message}</Text>
        </View>
        <View style={styles.actions}>
          {!item.read && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => markAsRead(item.id)}
            >
              <Ionicons name="checkmark" size={20} color="#2196F3" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => removeNotification(item.id)}
          >
            <Ionicons name="close" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.clearButtonText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="#9E9E9E" />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  list: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  time: {
    fontSize: 12,
    color: '#666666',
  },
  message: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 8,
  },
}); 