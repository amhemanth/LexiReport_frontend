import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ThemedView';
import { useAuth } from '@hooks/useAuth';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
          <Ionicons name="person" size={40} color="white" />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user?.full_name || 'User'}</Text>
        <Text style={[styles.email, { color: colors.text }]}>{user?.email || 'user@example.com'}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Settings</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Notifications</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Ionicons name="help-circle-outline" size={24} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.error }]}
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 