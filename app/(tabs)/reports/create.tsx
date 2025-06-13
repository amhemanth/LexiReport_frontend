import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FormField } from '../../../components/FormField';
import { ReportTemplate, getTemplateById } from '../../../mock/templates';

interface FormData {
  [key: string]: any;
}

export default function CreateReportScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value
    }));
    // Clear error when field is modified
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    if (!selectedTemplate) {
      Alert.alert('Error', 'Please select a template');
      return false;
    }

    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    selectedTemplate.fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = 'This field is required';
        isValid = false;
      }

      if (field.type === 'number' && field.validation) {
        const value = formData[field.id];
        if (value !== undefined) {
          if (field.validation.min !== undefined && value < field.validation.min) {
            newErrors[field.id] = `Minimum value is ${field.validation.min}`;
            isValid = false;
          }
          if (field.validation.max !== undefined && value > field.validation.max) {
            newErrors[field.id] = `Maximum value is ${field.validation.max}`;
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Implement report creation API call
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      Alert.alert(
        'Success',
        'Report created successfully',
        [
          {
            text: 'View Report',
            onPress: () => {
              // TODO: Navigate to the new report
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setSelectedTemplate(template);
      // Reset form data when template changes
      setFormData({});
      setErrors({});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Report</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Template</Text>
          <View style={styles.templateGrid}>
            {['1', '2', '3'].map((templateId) => {
              const template = getTemplateById(templateId);
              if (!template) return null;

              return (
                <TouchableOpacity
                  key={templateId}
                  style={[
                    styles.templateCard,
                    selectedTemplate?.id === templateId && styles.templateCardSelected
                  ]}
                  onPress={() => handleTemplateSelect(templateId)}
                >
                  <View style={styles.templateIcon}>
                    <Ionicons
                      name={
                        template.type === 'pdf'
                          ? 'document-text'
                          : template.type === 'excel'
                          ? 'grid'
                          : 'bar-chart'
                      }
                      size={32}
                      color="#4A90E2"
                    />
                  </View>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDescription} numberOfLines={2}>
                    {template.description}
                  </Text>
                  {template.is_premium && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumText}>Premium</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selectedTemplate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report Details</Text>
            {selectedTemplate.fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                value={formData[field.id]}
                onChange={(value) => handleFieldChange(field.id, value)}
                error={errors[field.id]}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Create Report</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  headerRight: {
    width: 24
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A'
  },
  backButton: {
    padding: 8
  },
  content: {
    flex: 1
  },
  contentContainer: {
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
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8
  },
  templateCard: {
    width: '50%',
    padding: 8
  },
  templateCardSelected: {
    backgroundColor: '#F0F7FF',
    borderRadius: 8
  },
  templateIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#F5F5F5',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4
  },
  templateDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F5A623',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  premiumText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500'
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE'
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitButtonDisabled: {
    opacity: 0.7
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF'
  }
}); 