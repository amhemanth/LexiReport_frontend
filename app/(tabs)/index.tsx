import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { colors, spacing, typography, shadows, borderRadius, commonStyles } from '@/constants/styles';

const HomeCard = ({ title, description, icon, onPress }: {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={[styles.card, commonStyles.card]} onPress={onPress}>
    <View style={styles.cardIcon}>
      <Ionicons name={icon as any} size={24} color={colors.primary} />
    </View>
    <View style={styles.cardContent}>
      <Text style={[commonStyles.title, styles.cardTitle]}>{title}</Text>
      <Text style={[commonStyles.text, styles.cardDescription]}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();

  const features = [
    {
      title: 'Reports',
      description: 'View and manage your reports',
      icon: 'document-text',
      route: '/(tabs)/reports'
    },
    {
      title: 'Business Intelligence',
      description: 'Access analytics and insights',
      icon: 'analytics',
      route: '/(tabs)/bi'
    },
    {
      title: 'Offline Mode',
      description: 'Work without internet connection',
      icon: 'cloud-offline',
      route: '/(tabs)/offline'
    },
    {
      title: 'Voice Commands',
      description: 'Control the app with your voice',
      icon: 'mic',
      route: '/(tabs)/voice'
    }
  ];

  return (
    <View style={[commonStyles.container]}>
      <Header />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.subtitle}>What would you like to do today?</Text>
        </View>

        <View style={styles.section}>
          <Text style={[commonStyles.title, styles.sectionTitle]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {features.map((feature, index) => (
              <HomeCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                onPress={() => router.push(feature.route)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[commonStyles.title, styles.sectionTitle]}>Recent Activity</Text>
          <View style={[styles.activityCard, commonStyles.card]}>
            <Text style={[commonStyles.text, styles.activityText]}>No recent activity</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: spacing.xxl,
  },
  welcomeSection: {
    padding: spacing.xl,
    backgroundColor: colors.primary,
    marginBottom: spacing.lg,
  },
  welcomeText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.background.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.background.primary,
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  quickActions: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: spacing.xs,
  },
  cardDescription: {
    color: colors.text.secondary,
  },
  activityCard: {
    padding: spacing.lg,
  },
  activityText: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 