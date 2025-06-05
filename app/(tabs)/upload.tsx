import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ui/ThemedView';
import { Header } from '@components/Header';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { uploadReport, ReportUploadMetadata } from '@/services/report';
import { useAuth } from '@hooks/useAuth';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function UploadScreen() {
  const { colors } = useTheme();
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handlePickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets || result.assets.length === 0) return;
      const fileAsset = result.assets[0];
      if (!token) throw new Error('No authentication token');
      if (!title.trim()) throw new Error('Title is required');
      setUploading(true);
      // Convert to File object for uploadReport
      const file = {
        uri: fileAsset.uri,
        name: fileAsset.name,
        type: fileAsset.mimeType || 'application/octet-stream',
      } as any;
      const metadata: ReportUploadMetadata = {
        title: title.trim(),
        description: description.trim() || undefined,
      };
      await uploadReport(file, metadata, token);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Report uploaded successfully!' });
      router.replace('/(tabs)/reports'); // Go back to reports list
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: (error as Error).message || 'Failed to upload report' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Header title="Upload" />
      <View style={styles.content}>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder="Report Title"
          placeholderTextColor={colors.text + '80'}
          value={title}
          onChangeText={setTitle}
          editable={!uploading}
        />
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder="Description (optional)"
          placeholderTextColor={colors.text + '80'}
          value={description}
          onChangeText={setDescription}
          editable={!uploading}
        />
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.primary }]}
          onPress={handlePickAndUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="large" color={colors.background} />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={32} color={colors.background} />
              <Text style={[styles.uploadText, { color: colors.background }]}>Upload Document</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={[styles.helpText, { color: colors.text }]}>Supported formats: PDF, DOCX, TXT</Text>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  uploadButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  helpText: {
    fontSize: 14,
    opacity: 0.8,
  },
}); 