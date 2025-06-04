import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ui/ThemedView';
import { Header } from '@components/Header';
import { Ionicons } from '@expo/vector-icons';
import { getUserPermissions, updateUserRole, addUserPermission, removeUserPermission } from '@/services/user';
import { useAuth } from '@hooks/useAuth';
import { User } from '@models/user';

const AVAILABLE_ROLES = ['admin', 'user'];
const AVAILABLE_PERMISSIONS = [
  'api_access',
  'read_users',
  'write_users',
  'manage_users',
];

export default function UserManagementScreen() {
  const { colors } = useTheme();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch all users from the backend (requires endpoint)
    // For now, show a placeholder
    setLoading(false);
    setUsers([]); // Replace with fetched users
  }, []);

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'user') => {
    try {
      await updateUserRole(userId, newRole);
      Alert.alert('Success', 'Role updated');
      // Optionally refresh users
    } catch (err) {
      Alert.alert('Error', 'Failed to update role');
    }
  };

  const handlePermissionToggle = async (userId: number, permission: string, hasPermission: boolean) => {
    try {
      if (hasPermission) {
        await removeUserPermission(userId, permission);
      } else {
        await addUserPermission(userId, permission);
      }
      Alert.alert('Success', 'Permissions updated');
      // Optionally refresh users
    } catch (err) {
      Alert.alert('Error', 'Failed to update permissions');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <ThemedView style={styles.container}>
        <Header title="User Management" />
        <View style={styles.content}>
          <Text style={{ color: colors.text }}>Access denied. Admins only.</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="User Management" />
      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : users.length === 0 ? (
          <Text style={{ color: colors.text }}>No users found.</Text>
        ) : (
          users.map((user) => (
            <View key={user.id} style={[styles.userCard, { borderColor: colors.border }]}> 
              <Text style={[styles.userName, { color: colors.text }]}>{user.full_name || user.email}</Text>
              <Text style={[styles.userEmail, { color: colors.text + '80' }]}>{user.email}</Text>
              <View style={styles.roleRow}>
                <Text style={{ color: colors.text }}>Role:</Text>
                {AVAILABLE_ROLES.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[styles.roleButton, user.role === role && { backgroundColor: colors.primary }]}
                    onPress={() => handleRoleChange(user.id, role as 'admin' | 'user')}
                  >
                    <Text style={{ color: user.role === role ? '#fff' : colors.text }}>{role.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.permissionsRow}>
                <Text style={{ color: colors.text }}>Permissions:</Text>
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <TouchableOpacity
                    key={perm}
                    style={[styles.permissionButton, user.permissions.includes(perm) && { backgroundColor: colors.primary }]}
                    onPress={() => handlePermissionToggle(user.id, perm, user.permissions.includes(perm))}
                  >
                    <Text style={{ color: user.permissions.includes(perm) ? '#fff' : colors.text }}>{perm.replace(/_/g, ' ').toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  roleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
  },
  permissionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  permissionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
    marginTop: 4,
  },
}); 