import * as Speech from 'expo-speech';

let isSpeaking = false;

export const speak = async (text: string) => {
  if (isSpeaking) {
    await stop();
  }
  
  isSpeaking = true;
  await Speech.speak(text, {
    language: 'en',
    pitch: 1.0,
    rate: 0.9,
  });
};

export const stop = async () => {
  if (isSpeaking) {
    await Speech.stop();
    isSpeaking = false;
  }
};

export const isCurrentlySpeaking = () => isSpeaking; 