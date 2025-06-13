import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import { COLORS, SIZES, FONTS, SHADOWS } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';

const notificationTypes = [
  {
    id: 'reports',
    title: 'Reports',
    description: 'Get notified about new reports and updates',
    icon: 'document-text',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Receive updates about your analytics',
    icon: 'analytics',
  },
  {
    id: 'system',
    title: 'System',
    description: 'Important system notifications and updates',
    icon: 'settings',
  },
  {
    id: 'voice',
    title: 'Voice Commands',
    description: 'Notifications about voice command status',
    icon: 'mic',
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    reports: true,
    analytics: true,
    system: true,
    voice: false,
  });

  const toggleNotification = (id: string) => {
    setNotifications(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
  };

  return (
    <View style={commonStyles.container}>
      <Header title="Notifications" showBack />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <View style={styles.notificationsList}>
            {notificationTypes.map((type) => (
              <View key={type.id} style={styles.notificationItem}>
                <View style={styles.notificationIcon}>
                  <Ionicons name={type.icon as any} size={24} color={COLORS.primary} />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{type.title}</Text>
                  <Text style={styles.notificationDescription}>
                    {type.description}
                  </Text>
                </View>
                <Switch
                  value={notifications[type.id as keyof typeof notifications]}
                  onValueChange={() => toggleNotification(type.id)}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          <View style={styles.recentList}>
            <View style={styles.recentItem}>
              <View style={styles.recentIcon}>
                <Ionicons name="document-text" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>New Report Available</Text>
                <Text style={styles.recentTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.recentItem}>
              <View style={styles.recentIcon}>
                <Ionicons name="analytics" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>Analytics Update</Text>
                <Text style={styles.recentTime}>5 hours ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: SIZES.padding.medium,
  },
  section: {
    marginBottom: SIZES.padding.large,
  },
  sectionTitle: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SIZES.padding.medium,
  },
  notificationsList: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.medium,
    ...SHADOWS.small,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding.medium,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  notificationDescription: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  recentList: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.medium,
    ...SHADOWS.small,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding.medium,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  recentTime: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
}); 