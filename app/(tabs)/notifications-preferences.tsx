import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ui/ThemedView';
import { Header } from '@components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_PREFS_KEY = 'notification_preferences';
const DEFAULT_PREFS = {
  reportReady: true,
  comments: true,
  shares: true,
};

export default function NotificationPreferencesScreen() {
  const { colors } = useTheme();
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_PREFS_KEY).then(val => {
      if (val) setPrefs(JSON.parse(val));
    });
  }, []);

  const handleToggle = async (key: keyof typeof DEFAULT_PREFS) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    await AsyncStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(newPrefs));
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Notification Preferences" />
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Report Ready</Text>
        <Switch
          value={prefs.reportReady}
          onValueChange={() => handleToggle('reportReady')}
          accessibilityLabel="Toggle report ready notifications"
          accessibilityRole="switch"
        />
      </View>
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Comments</Text>
        <Switch
          value={prefs.comments}
          onValueChange={() => handleToggle('comments')}
          accessibilityLabel="Toggle comment notifications"
          accessibilityRole="switch"
        />
      </View>
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Shares</Text>
        <Switch
          value={prefs.shares}
          onValueChange={() => handleToggle('shares')}
          accessibilityLabel="Toggle share notifications"
          accessibilityRole="switch"
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 