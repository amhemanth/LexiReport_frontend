import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ThemedView';
import { Header } from '@components/Header';
import { Ionicons } from '@expo/vector-icons';

export default function UploadScreen() {
  const { colors } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <Header title="Upload" />
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            // TODO: Implement file upload
          }}
        >
          <Ionicons name="cloud-upload" size={32} color={colors.background} />
          <Text style={[styles.uploadText, { color: colors.background }]}>
            Upload Document
          </Text>
        </TouchableOpacity>
        <Text style={[styles.helpText, { color: colors.text }]}>
          Supported formats: PDF, DOCX, TXT
        </Text>
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