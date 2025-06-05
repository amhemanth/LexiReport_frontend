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
            <View style={[styles.notificationBox, { backgroundColor: item.read ? colors.card : colors.primary + '10' }]}> 
              <Text style={[styles.title, { color: colors.text }]}>{item.title || 'Notification'}</Text>
              <Text style={{ color: colors.text + '80', marginBottom: 8 }}>{item.body || item.message}</Text>
              <Text style={{ color: colors.text + '60', fontSize: 12 }}>{new Date(item.created_at).toLocaleString()}</Text>
              {!item.read && (
                <TouchableOpacity
                  style={[styles.markButton, { backgroundColor: colors.primary }]}
                  onPress={() => markAsRead(item.id)}
                  disabled={marking === item.id}
                >
                  {marking === item.id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="checkmark-done" size={18} color="#fff" />
                  )}
                  <Text style={{ color: '#fff', marginLeft: 6 }}>Mark as Read</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationBox: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  markButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
  },
}); 