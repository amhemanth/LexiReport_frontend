import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { COLORS, SIZES, FONTS, SHADOWS } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';

const settingsSections = [
  {
    title: 'App Settings',
    items: [
      {
        id: 'darkMode',
        title: 'Dark Mode',
        icon: 'moon',
        type: 'switch',
      },
      {
        id: 'notifications',
        title: 'Notifications',
        icon: 'notifications',
        type: 'link',
        route: '/notifications',
      },
      {
        id: 'language',
        title: 'Language',
        icon: 'language',
        type: 'link',
        route: '/language',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        id: 'profile',
        title: 'Profile',
        icon: 'person',
        type: 'link',
        route: '/profile',
      },
      {
        id: 'security',
        title: 'Security',
        icon: 'shield-checkmark',
        type: 'link',
        route: '/security',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        id: 'help',
        title: 'Help Center',
        icon: 'help-circle',
        type: 'link',
        route: '/help',
      },
      {
        id: 'about',
        title: 'About',
        icon: 'information-circle',
        type: 'link',
        route: '/about',
      },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout logic
            router.replace('/');
          },
        },
      ],
    );
  };

  const handleSettingPress = (item: any) => {
    if (item.type === 'link' && item.route) {
      router.push(item.route);
    }
  };

  return (
    <View style={commonStyles.container}>
      <Header title="Settings" showBack />
      
      <ScrollView style={styles.content}>
        {settingsSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsList}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.settingItem}
                  onPress={() => handleSettingPress(item)}
                >
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                  </View>
                  {item.type === 'switch' ? (
                    <Switch
                      value={darkMode}
                      onValueChange={setDarkMode}
                      trackColor={{ false: COLORS.border, true: COLORS.primary }}
                      thumbColor={COLORS.white}
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  settingsList: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.medium,
    ...SHADOWS.small,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding.medium,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding.medium,
    borderRadius: SIZES.radius.medium,
    marginTop: SIZES.padding.medium,
    ...SHADOWS.small,
  },
  logoutText: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.error,
    marginLeft: SIZES.padding.small,
  },
}); 