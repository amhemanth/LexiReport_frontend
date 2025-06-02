import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@hooks/useTheme';
import { router } from 'expo-router';
import { ThemedView } from '@components/ThemedView';

export default function HomeScreen() {
  const { colors } = useTheme();

  const QuickAction = ({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.quickAction, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={24} color={colors.primary} />
      <Text style={[styles.quickActionText, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome to LexiReport</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Your AI-powered document analysis assistant
          </Text>
        </View>

        <View style={styles.quickActions}>
          <QuickAction
            title="Upload Report"
            icon="cloud-upload"
            onPress={() => router.push('upload')}
          />
          <QuickAction
            title="View Reports"
            icon="document-text"
            onPress={() => router.push('reports')}
          />
          <QuickAction
            title="Profile"
            icon="person"
            onPress={() => router.push('profile')}
          />
        </View>

        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.statsTitle, { color: colors.text }]}>Your Stats</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Reports</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>Insights</Text>
            </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    width: '30%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  statsContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
}); 