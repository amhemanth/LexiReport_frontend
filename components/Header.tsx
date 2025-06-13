import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, borderRadius, commonStyles } from '@/constants/styles';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showProfile?: boolean;
}

export default function Header({ title = 'LexiReports', showBack, onBackPress, showProfile = true }: HeaderProps) {
  const router = useRouter();

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleProfilePress = () => {
    router.push('/profile');
  };

  return (
    <View style={styles.headerContainer}>
      {showBack ? (
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.background.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={handleNotificationPress} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.background.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSettingsPress} style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color={colors.background.primary} />
        </TouchableOpacity>
        {showProfile ? (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
          >
            <Image
              source={{ uri: 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 0,
    elevation: 4,
    shadowColor: colors.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    color: colors.background.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    marginRight: spacing.sm,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  profileButton: {
    marginLeft: spacing.sm,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.background.primary,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  spacer: {
    width: 40,
    height: 40,
  },
}); 