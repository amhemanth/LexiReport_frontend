import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ThemedView';
import { Header } from '@components/Header';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Profile" />
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account
          </Text>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => {
              // TODO: Implement settings
            }}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Settings
            </Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Logout
            </Text>
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
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
  section: {
    marginBottom: 24,
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
}); 