import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@services/auth';
import { ThemedView } from '@components/ui/ThemedView';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.length < 2 || fullName.length > 100) {
      newErrors.fullName = 'Full name must be between 2 and 100 characters';
    } else if (!/^[a-zA-Z\s\-\.']+$/.test(fullName)) {
      newErrors.fullName = 'Full name can only contain letters, spaces, hyphens, periods, and apostrophes';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Username validation
    if (username) {
      if (username.length < 3 || username.length > 50) {
        newErrors.username = 'Username must be between 3 and 50 characters';
      } else if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        newErrors.username = 'Username can only contain letters, numbers, dots, underscores, and hyphens';
      }
    }

    // Password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await authService.register({
        email,
        password,
        full_name: fullName,
        username: username || email.split('@')[0], // Use email prefix as username if not provided
        confirm_password: confirmPassword
      });

      // Show success message and navigate to login
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please log in to continue.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error instanceof Error) {
        // Handle validation errors
        if (error.message.includes('validation error')) {
          const errorData = JSON.parse(error.message);
          if (Array.isArray(errorData)) {
            errorMessage = errorData.map(err => err.msg).join('\n');
          }
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
            Sign up to get started
          </Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <View style={[
                styles.inputWrapper,
                { borderColor: errors.fullName ? colors.error : colors.border }
              ]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) {
                      setErrors(prev => ({ ...prev, fullName: undefined }));
                    }
                  }}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.text + '80'}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
              {errors.fullName && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.fullName}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <View style={[
                styles.inputWrapper,
                { borderColor: errors.email ? colors.error : colors.border }
              ]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.text + '80'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.email}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Username (Optional)</Text>
              <View style={[
                styles.inputWrapper,
                { borderColor: errors.username ? colors.error : colors.border }
              ]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (errors.username) {
                      setErrors(prev => ({ ...prev, username: undefined }));
                    }
                  }}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.text + '80'}
                  autoCapitalize="none"
                  autoComplete="username"
                />
              </View>
              {errors.username && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.username}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={[
                styles.inputWrapper,
                { borderColor: errors.password ? colors.error : colors.border }
              ]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    const error = validatePassword(text);
                    setErrors(prev => ({ ...prev, password: error }));
                    // Clear confirm password error if passwords match
                    if (text === confirmPassword && errors.confirmPassword) {
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.text + '80'}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.password}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
              <View style={[
                styles.inputWrapper,
                { borderColor: errors.confirmPassword ? colors.error : colors.border }
              ]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (text !== password) {
                      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
                    } else {
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }
                  }}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.text + '80'}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.text}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.registerButton,
                { backgroundColor: colors.primary },
                loading && styles.buttonDisabled
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginLink}>
              <View style={styles.loginLinkContent}>
                <Text style={[styles.loginLinkText, { color: colors.text }]}>
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                  <Text style={[styles.signInText, { color: colors.primary }]}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    marginTop: 48,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 24,
  },
  form: {
    gap: 16,
    paddingBottom: 24,
  },
  inputContainer: {
    gap: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 8,
    marginRight: -8,
  },
  errorText: {
    fontSize: 13,
    marginTop: 2,
    marginLeft: 4,
  },
  registerButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 4,
  },
  loginLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loginLinkText: {
    fontSize: 15,
    lineHeight: 24,
  },
  signInText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
  },
}); 