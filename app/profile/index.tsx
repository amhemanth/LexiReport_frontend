import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { COLORS, SIZES, FONTS, SHADOWS } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';

const profileSections = [
  {
    title: 'Personal Information',
    items: [
      {
        id: 'name',
        title: 'Full Name',
        value: 'John Doe',
        icon: 'person',
      },
      {
        id: 'email',
        title: 'Email',
        value: 'john.doe@example.com',
        icon: 'mail',
      },
      {
        id: 'phone',
        title: 'Phone',
        value: '+1 234 567 890',
        icon: 'call',
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        id: 'language',
        title: 'Language',
        value: 'English',
        icon: 'language',
      },
      {
        id: 'timezone',
        title: 'Timezone',
        value: 'UTC-5',
        icon: 'time',
      },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  return (
    <View style={commonStyles.container}>
      <Header title="Profile" showBack />
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.role}>Field Inspector</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="pencil" size={20} color={COLORS.white} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {profileSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.infoList}>
              {section.items.map((item) => (
                <View key={item.id} style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>{item.title}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Activity Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>128</Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Inspections</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Projects</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: SIZES.padding.large,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.padding.medium,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.background,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  name: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: SIZES.padding.small,
  },
  role: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding.medium,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding.medium,
    paddingVertical: SIZES.padding.small,
    borderRadius: SIZES.radius.medium,
    ...SHADOWS.small,
  },
  editButtonText: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.white,
    marginLeft: SIZES.padding.small,
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
  infoList: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.medium,
    ...SHADOWS.small,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding.medium,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  infoValue: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsSection: {
    marginBottom: SIZES.padding.large,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.medium,
    ...SHADOWS.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
}); 