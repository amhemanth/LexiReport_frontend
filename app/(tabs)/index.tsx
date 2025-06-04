import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ui/ThemedView';
import { Header } from '@components/Header';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@hooks/useAuth';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <Header title="Home" />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to LexiReport
          </Text>
          <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
            Your AI-powered document analysis assistant
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push('/(app)/upload')}
            >
              <Ionicons name="cloud-upload" size={32} color={colors.primary} />
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                Upload Document
              </Text>
              <Text style={[styles.actionSubtitle, { color: colors.text + '80' }]}>
                Analyze new documents
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => router.push('/(app)/reports')}
            >
              <Ionicons name="document-text" size={32} color={colors.primary} />
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                View Reports
              </Text>
              <Text style={[styles.actionSubtitle, { color: colors.text + '80' }]}>
                Access your analysis history
              </Text>
            </TouchableOpacity>

            {user?.role === 'admin' && (
              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: colors.card }]}
                onPress={() => router.push('/(tabs)/user-management')}
              >
                <Ionicons name="people" size={32} color={colors.primary} />
                <Text style={[styles.actionTitle, { color: colors.text }]}>Manage Users</Text>
                <Text style={[styles.actionSubtitle, { color: colors.text + '80' }]}>Admin: manage roles & permissions</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </Text>
          <View style={[styles.activityCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyText, { color: colors.text + '80' }]}>
              No recent activity
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text + '60' }]}>
              Upload your first document to get started
            </Text>
          </View>
        </View>
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
  },
  contentContainer: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  activityCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
