import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import { VoiceCommand, findMatchingCommand, getResponseByCommandId } from '../mock/voice';

interface VoiceCommandButtonProps {
  onCommandRecognized?: (command: VoiceCommand) => void;
  onResponseReceived?: (response: string) => void;
  onError?: (error: string) => void;
}

export const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({
  onCommandRecognized,
  onResponseReceived,
  onError
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const pulseAnim = new Animated.Value(1);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        onError?.('Permission to access microphone was denied');
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch (error) {
      onError?.('Failed to start recording');
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setProcessing(true);
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      // TODO: Implement actual voice recognition
      // For now, we'll simulate it with a timeout
      setTimeout(() => {
        const mockCommand = findMatchingCommand('Create a new financial report');
        if (mockCommand) {
          onCommandRecognized?.(mockCommand);
          const response = getResponseByCommandId(mockCommand.id);
          if (response) {
            onResponseReceived?.(response.text);
          }
        } else {
          onError?.('Command not recognized');
        }
        setProcessing(false);
      }, 2000);
    } catch (error) {
      setProcessing(false);
      onError?.('Failed to process recording');
      console.error('Failed to stop recording:', error);
    }
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulse,
          {
            transform: [{ scale: pulseAnim }]
          }
        ]}
      />
      <TouchableOpacity
        style={[
          styles.button,
          isRecording && styles.buttonRecording,
          processing && styles.buttonProcessing
        ]}
        onPress={handlePress}
        disabled={processing}
      >
        <Ionicons
          name={isRecording ? 'mic' : 'mic-outline'}
          size={32}
          color="#FFFFFF"
        />
      </TouchableOpacity>
      <Text style={styles.status}>
        {processing
          ? 'Processing...'
          : isRecording
          ? 'Listening...'
          : 'Tap to speak'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonRecording: {
    backgroundColor: '#D0021B'
  },
  buttonProcessing: {
    backgroundColor: '#F5A623'
  },
  pulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(74, 144, 226, 0.2)'
  },
  status: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666'
  }
}); 