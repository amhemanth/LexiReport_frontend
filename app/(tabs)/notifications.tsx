import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ui/ThemedView';
import { Header } from '@components/Header';
import { useAuth } from '@hooks/useAuth';
import { api } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function NotificationCenter() {
  const { colors } = useTheme();
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<number | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error('No authentication token');
      const response = await api.get('/notifications/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load notifications' });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    setMarking(id);
    try {
      await api.post(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to mark as read' });
    } finally {
      setMarking(null);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Notifications" />
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : notifications.length === 0 ? (
        <Text style={{ color: colors.text + '80', marginTop: 32, textAlign: 'center' }}>No notifications found.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.notificationCard, { backgroundColor: item.read ? colors.card : colors.primary + '10', borderColor: colors.border }]}> 
              <Text style={[styles.notificationTitle, { color: colors.text, fontWeight: item.read ? 'normal' : 'bold' }]}>{item.title}</Text>
              <Text style={[styles.notificationBody, { color: colors.text + 'B0' }]}>{item.body}</Text>
              <View style={styles.cardActions}>
                {!item.read && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => markAsRead(item.id)}
                    accessibilityLabel={`Mark notification ${item.title} as read`}
                    accessibilityRole="button"
                  >
                    <Ionicons name="checkmark-done" size={20} color={colors.background} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 24, gap: 20 }}
          ListEmptyComponent={<Text style={{ color: colors.text, textAlign: 'center', marginTop: 32 }}>No notifications found.</Text>}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  notificationBody: {
    fontSize: 14,
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  actionButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
}); 