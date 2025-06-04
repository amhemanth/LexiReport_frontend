import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput, Switch } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ui/ThemedView';
import { Header } from '@components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { router } from 'expo-router';
import { useState } from 'react';
import { ChangePasswordModal } from '@components/ChangePasswordModal';
import { api } from '@/services/api';

export default function ProfileScreen() {
  const { colors, theme, setTheme } = useTheme();
  const { logout, user, setUser } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await api.put('/users/me', { full_name: fullName, email });
      setUser(response.data);
      Alert.alert('Success', 'Profile updated!');
      setShowEditProfile(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  // Prefill form when opening Edit Profile
  const openEditProfile = () => {
    setFullName(user?.full_name || '');
    setEmail(user?.email || '');
    setShowEditProfile(true);
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Profile" />
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
            </Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.full_name || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.text + '80' }]}>
            {user?.email}
          </Text>
          <View style={styles.roleContainer}>
            <Text style={[styles.roleText, { color: colors.text + '80' }]}>
              Role: {user?.role?.toUpperCase() || 'USER'}
            </Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account
          </Text>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={openEditProfile}
          >
            <Ionicons name="person-outline" size={24} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => setShowSettings(true)}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Settings</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Permissions Section - Only show for admin users */}
        {user?.role === 'admin' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Permissions</Text>
            {user?.permissions?.map((permission, index) => (
              <View key={index} style={[styles.permissionItem, { borderBottomColor: colors.border }]}> 
                <Ionicons name="shield-checkmark-outline" size={24} color={colors.text} />
                <Text style={[styles.permissionText, { color: colors.text }]}> {permission.replace(/_/g, ' ').toUpperCase()} </Text>
              </View>
            ))}
          </View>
        )}

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Security
          </Text>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => setShowChangePassword(true)}
          >
            <Ionicons name="lock-closed-outline" size={24} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Change Password
            </Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Support
          </Text>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => setShowHelp(true)}
          >
            <Ionicons name="help-circle-outline" size={24} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.error, marginTop: 24, marginBottom: 24 }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10, padding: 16 }]}> 
          <View style={[{ width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 16, padding: 24 }]}> 
            <Text style={[{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: colors.text }]}>Edit Profile</Text>
            <TextInput
              style={[{ borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, color: colors.text, borderColor: colors.border }]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              placeholderTextColor={colors.text + '80'}
            />
            <TextInput
              style={[{ borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16, color: colors.text, borderColor: colors.border }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.text + '80'}
              keyboardType="email-address"
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity style={[{ flex: 1, padding: 16, backgroundColor: colors.primary, borderRadius: 8 }]} onPress={handleSaveProfile}>
                <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[{ flex: 1, padding: 16, backgroundColor: colors.border, borderRadius: 8 }]} onPress={() => setShowEditProfile(false)}>
                <Text style={{ color: colors.text, fontSize: 16, textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10, padding: 16 }]}> 
          <View style={[{ width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 16, padding: 24 }]}> 
            <Text style={[{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: colors.text }]}>Settings</Text>
            <Text style={{ color: colors.text, marginBottom: 24 }}>Theme</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <TouchableOpacity style={{ flex: 1, padding: 12, backgroundColor: theme === 'light' ? colors.primary : '#eee', borderRadius: 8, marginRight: 8 }} onPress={() => setTheme('light')}>
                <Text style={{ color: theme === 'light' ? '#fff' : colors.text, textAlign: 'center' }}>Light</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, padding: 12, backgroundColor: theme === 'dark' ? colors.primary : '#eee', borderRadius: 8, marginRight: 8 }} onPress={() => setTheme('dark')}>
                <Text style={{ color: theme === 'dark' ? '#fff' : colors.text, textAlign: 'center' }}>Dark</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, padding: 12, backgroundColor: theme === 'system' ? colors.primary : '#eee', borderRadius: 8 }} onPress={() => setTheme('system')}>
                <Text style={{ color: theme === 'system' ? '#fff' : colors.text, textAlign: 'center' }}>System</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[{ padding: 16, backgroundColor: colors.border, borderRadius: 8 }]} onPress={() => setShowSettings(false)}>
              <Text style={{ fontSize: 16, color: colors.text, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Help Modal */}
      {showHelp && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10, padding: 16 }]}> 
          <View style={[{ width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 16, padding: 24, maxHeight: '80%' }]}> 
            <ScrollView>
              <Text style={[{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: colors.text }]}>Help & Support</Text>
              <Text style={{ color: colors.text, marginBottom: 16 }}>
                - For account issues, contact support@example.com
                {'\n'}- FAQ:{'\n'}1. How do I reset my password?{'\n'}2. How do I update my profile?
              </Text>
              {/* Add more help content as needed */}
            </ScrollView>
            <TouchableOpacity style={[{ padding: 16, backgroundColor: colors.border, borderRadius: 8, marginTop: 16 }]} onPress={() => setShowHelp(false)}>
              <Text style={{ fontSize: 16, color: colors.text, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ChangePasswordModal
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleContainer: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  permissionText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 16,
  },
}); 