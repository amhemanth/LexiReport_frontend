import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import { COLORS, SIZES, FONTS, SHADOWS } from '@/constants/theme';
import { commonStyles } from '@/constants/styles';

const commands = [
  {
    title: 'Open Reports',
    command: 'Open reports',
    icon: 'document-text',
  },
  {
    title: 'Show Analytics',
    command: 'Show analytics',
    icon: 'analytics',
  },
  {
    title: 'Go Offline',
    command: 'Go offline',
    icon: 'cloud-offline',
  },
  {
    title: 'Search Reports',
    command: 'Search for [report name]',
    icon: 'search',
  },
  {
    title: 'Create Report',
    command: 'Create new report',
    icon: 'add-circle',
  },
];

export default function VoiceCommandScreen() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);

  const handleStartListening = () => {
    setIsListening(true);
    // TODO: Implement actual voice recognition
    setTimeout(() => {
      setIsListening(false);
      Alert.alert('Voice Command', 'Command recognized: Open reports');
      router.push('/(tabs)/reports');
    }, 2000);
  };

  return (
    <View style={commonStyles.container}>
      <Header title="Voice Commands" showBack />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Commands</Text>
          <View style={styles.commandsList}>
            {commands.map((cmd, index) => (
              <View key={index} style={styles.commandItem}>
                <View style={styles.commandIcon}>
                  <Ionicons name={cmd.icon as any} size={24} color={COLORS.primary} />
                </View>
                <View style={styles.commandContent}>
                  <Text style={styles.commandTitle}>{cmd.title}</Text>
                  <Text style={styles.commandText}>Say: "{cmd.command}"</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              1. Tap the microphone button below
            </Text>
            <Text style={styles.instructionText}>
              2. Wait for the listening indicator
            </Text>
            <Text style={styles.instructionText}>
              3. Speak your command clearly
            </Text>
            <Text style={styles.instructionText}>
              4. Wait for the command to be processed
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.micButton, isListening && styles.micButtonActive]}
          onPress={handleStartListening}
        >
          <Ionicons
            name={isListening ? 'mic' : 'mic-outline'}
            size={32}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <Text style={styles.micButtonText}>
          {isListening ? 'Listening...' : 'Tap to Start'}
        </Text>
      </View>
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
  commandsList: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.medium,
    ...SHADOWS.small,
  },
  commandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  commandIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.padding.medium,
  },
  commandContent: {
    flex: 1,
  },
  commandTitle: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  commandText: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  instructions: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.medium,
    ...SHADOWS.small,
  },
  instructionText: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SIZES.padding.small,
  },
  footer: {
    padding: SIZES.padding.medium,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding.small,
    ...SHADOWS.medium,
  },
  micButtonActive: {
    backgroundColor: COLORS.error,
  },
  micButtonText: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
}); 