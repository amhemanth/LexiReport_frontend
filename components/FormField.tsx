import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TemplateField } from '../mock/templates';

interface FormFieldProps {
  field: TemplateField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={value}
            onChangeText={onChange}
            placeholder={field.placeholder}
            placeholderTextColor="#999999"
          />
        );
      case 'number':
        return (
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={value?.toString()}
            onChangeText={(text) => {
              const num = parseInt(text);
              if (!isNaN(num)) {
                onChange(num);
              }
            }}
            keyboardType="numeric"
            placeholder={field.placeholder}
            placeholderTextColor="#999999"
          />
        );
      case 'date':
        return (
          <TouchableOpacity
            style={[styles.input, error && styles.inputError]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={value ? styles.dateText : styles.placeholderText}>
              {value
                ? new Date(value).toLocaleDateString()
                : field.placeholder || 'Select date'}
            </Text>
          </TouchableOpacity>
        );
      case 'select':
        return (
          <TouchableOpacity
            style={[styles.input, error && styles.inputError]}
            onPress={() => setShowOptions(true)}
          >
            <Text style={value ? styles.selectText : styles.placeholderText}>
              {value || field.placeholder || 'Select option'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666666" />
          </TouchableOpacity>
        );
      case 'multiselect':
        return (
          <TouchableOpacity
            style={[styles.input, error && styles.inputError]}
            onPress={() => setShowOptions(true)}
          >
            <Text style={value?.length ? styles.selectText : styles.placeholderText}>
              {value?.length
                ? `${value.length} selected`
                : field.placeholder || 'Select options'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666666" />
          </TouchableOpacity>
        );
      case 'file':
        return (
          <TouchableOpacity
            style={[styles.fileInput, error && styles.inputError]}
            onPress={() => {
              // TODO: Implement file picker
              console.log('Open file picker');
            }}
          >
            <Ionicons name="cloud-upload" size={24} color="#4A90E2" />
            <Text style={styles.fileInputText}>
              {value ? 'Change file' : 'Choose file'}
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const renderOptions = () => {
    if (!showOptions || !field.options) return null;

    return (
      <View style={styles.optionsContainer}>
        <ScrollView style={styles.optionsList}>
          {field.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.option}
              onPress={() => {
                if (field.type === 'multiselect') {
                  const currentValue = value || [];
                  const newValue = currentValue.includes(option)
                    ? currentValue.filter((v: string) => v !== option)
                    : [...currentValue, option];
                  onChange(newValue);
                } else {
                  onChange(option);
                  setShowOptions(false);
                }
              }}
            >
              <View style={styles.optionCheckbox}>
                {field.type === 'multiselect' ? (
                  <Ionicons
                    name={
                      value?.includes(option)
                        ? 'checkbox'
                        : 'square-outline'
                    }
                    size={24}
                    color="#4A90E2"
                  />
                ) : (
                  <Ionicons
                    name={value === option ? 'radio-button-on' : 'radio-button-off'}
                    size={24}
                    color="#4A90E2"
                  />
                )}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {field.type === 'multiselect' && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setShowOptions(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {field.name}
        {field.required && <Text style={styles.required}> *</Text>}
      </Text>
      {renderField()}
      {error && <Text style={styles.error}>{error}</Text>}
      {showDatePicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              onChange(selectedDate.toISOString());
            }
          }}
        />
      )}
      {renderOptions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8
  },
  required: {
    color: '#D0021B'
  },
  input: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inputError: {
    borderColor: '#D0021B'
  },
  dateText: {
    fontSize: 16,
    color: '#1A1A1A'
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999'
  },
  selectText: {
    fontSize: 16,
    color: '#1A1A1A'
  },
  fileInput: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fileInputText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 8
  },
  error: {
    fontSize: 14,
    color: '#D0021B',
    marginTop: 4
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    zIndex: 1000,
    maxHeight: 300
  },
  optionsList: {
    maxHeight: 250
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  optionCheckbox: {
    marginRight: 12
  },
  optionText: {
    fontSize: 16,
    color: '#1A1A1A'
  },
  doneButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    alignItems: 'center'
  },
  doneButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500'
  }
}); 