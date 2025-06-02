import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ThemedView';
import { Header } from '@components/Header';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <Header title="Home" />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome to LexiReport
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Your AI-powered document analysis assistant
          </Text>
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
});
