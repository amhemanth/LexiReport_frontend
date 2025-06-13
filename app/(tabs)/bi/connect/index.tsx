import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Platform = 'powerbi' | 'tableau' | 'looker' | 'qlik';
type IconName = keyof typeof Ionicons.glyphMap;

interface PlatformOption {
  id: Platform;
  name: string;
  description: string;
  icon: IconName;
}

const platforms: PlatformOption[] = [
  {
    id: 'powerbi',
    name: 'Power BI',
    description: 'Connect to Microsoft Power BI workspace',
    icon: 'logo-windows'
  },
  {
    id: 'tableau',
    name: 'Tableau',
    description: 'Connect to Tableau server or cloud',
    icon: 'stats-chart'
  },
  {
    id: 'looker',
    name: 'Looker',
    description: 'Connect to Looker instance',
    icon: 'analytics'
  },
  {
    id: 'qlik',
    name: 'Qlik',
    description: 'Connect to Qlik Sense or QlikView',
    icon: 'pie-chart'
  }
];

export default function BIConnectScreen() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workspace: '',
    projectId: '',
    apiKey: ''
  });

  const handleConnect = async () => {
    if (!selectedPlatform) {
      Alert.alert('Error', 'Please select a platform');
      return;
    }

    if (!formData.name) {
      Alert.alert('Error', 'Please enter a connection name');
      return;
    }

    setLoading(true);
    try {
      // Simulate connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Connection established successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to establish connection');
    } finally {
      setLoading(false);
    }
  };

  const renderPlatformOptions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Platform</Text>
      <View style={styles.platformGrid}>
        {platforms.map(platform => (
          <TouchableOpacity
            key={platform.id}
            style={[
              styles.platformOption,
              selectedPlatform === platform.id && styles.platformOptionSelected
            ]}
            onPress={() => setSelectedPlatform(platform.id)}
          >
            <Ionicons
              name={platform.icon}
              size={32}
              color={selectedPlatform === platform.id ? '#FFFFFF' : '#2196F3'}
            />
            <Text
              style={[
                styles.platformName,
                selectedPlatform === platform.id && styles.platformNameSelected
              ]}
            >
              {platform.name}
            </Text>
            <Text
              style={[
                styles.platformDescription,
                selectedPlatform === platform.id && styles.platformDescriptionSelected
              ]}
            >
              {platform.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderConnectionForm = () => {
    if (!selectedPlatform) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Details</Text>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Connection Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={text => setFormData({ ...formData, name: text })}
              placeholder="Enter a name for this connection"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={text => setFormData({ ...formData, description: text })}
              placeholder="Enter a description"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={3}
            />
          </View>

          {selectedPlatform === 'powerbi' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Workspace</Text>
              <TextInput
                style={styles.input}
                value={formData.workspace}
                onChangeText={text => setFormData({ ...formData, workspace: text })}
                placeholder="Enter workspace name"
                placeholderTextColor="#999999"
              />
            </View>
          )}

          {selectedPlatform === 'tableau' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Project ID</Text>
              <TextInput
                style={styles.input}
                value={formData.projectId}
                onChangeText={text => setFormData({ ...formData, projectId: text })}
                placeholder="Enter project ID"
                placeholderTextColor="#999999"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>API Key</Text>
            <TextInput
              style={styles.input}
              value={formData.apiKey}
              onChangeText={text => setFormData({ ...formData, apiKey: text })}
              placeholder="Enter API key"
              placeholderTextColor="#999999"
              secureTextEntry
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Connect BI Platform</Text>
          <Text style={styles.subtitle}>
            Connect to your business intelligence platform to access reports and dashboards
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {renderPlatformOptions()}
        {renderConnectionForm()}

        <TouchableOpacity
          style={[styles.connectButton, loading && styles.connectButtonDisabled]}
          onPress={handleConnect}
          disabled={loading}
        >
          <Ionicons name="link" size={20} color="#FFFFFF" />
          <Text style={styles.connectButtonText}>
            {loading ? 'Connecting...' : 'Connect Platform'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  backButton: {
    marginBottom: 16
  },
  headerContent: {
    gap: 8
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24
  },
  content: {
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  platformOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  platformOptionSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3'
  },
  platformName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 4
  },
  platformNameSelected: {
    color: '#FFFFFF'
  },
  platformDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center'
  },
  platformDescriptionSelected: {
    color: '#FFFFFF'
  },
  form: {
    gap: 16
  },
  inputGroup: {
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A'
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#1A1A1A'
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 8
  },
  connectButtonDisabled: {
    opacity: 0.7
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF'
  }
}); 