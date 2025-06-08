import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ui/ThemedView';
import { Header } from '@components/Header';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function FeedbackScreen() {
  const { colors } = useTheme();
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Toast.show({ type: 'error', text1: 'Feedback required', text2: 'Please enter your feedback.' });
      return;
    }
    setLoading(true);
    // Optionally send to backend here
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFeedback('');
      setEmail('');
      Toast.show({ type: 'success', text1: 'Thank you!', text2: 'Your feedback has been submitted.' });
    }, 1000);
  };

  if (submitted) {
    return (
      <ThemedView style={styles.container}>
        <Header title="Feedback" />
        <View style={styles.centered}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Thank you for your feedback!</Text>
          <Ionicons name="checkmark-circle" size={48} color={colors.primary} style={{ marginBottom: 16 }} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title="Feedback" />
      <View style={styles.form}>
        <Text style={{ color: colors.text, fontWeight: 'bold', marginBottom: 8 }}>Your Feedback</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border, minHeight: 80, fontSize: 18 }]}
          placeholder="Your feedback"
          placeholderTextColor={colors.text + '80'}
          value={feedback}
          onChangeText={setFeedback}
          editable={!loading}
          multiline
          accessibilityLabel="Feedback input"
          accessibilityRole="text"
        />
        <Text style={{ color: colors.text, marginTop: 16, marginBottom: 8 }}>Email (optional)</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border, fontSize: 18 }]}
          placeholder="Your email (optional)"
          placeholderTextColor={colors.text + '80'}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          keyboardType="email-address"
          accessibilityLabel="Email input"
          accessibilityRole="text"
        />
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Submit feedback"
          accessibilityRole="button"
        >
          <Text style={[styles.submitText, { color: colors.background, fontSize: 18, fontWeight: 'bold' }]}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff1',
  },
  submitButton: {
    width: '100%',
    maxWidth: 400,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
}); 