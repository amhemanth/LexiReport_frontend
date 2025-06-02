declare module 'expo-speech' {
  export interface SpeechOptions {
    language?: string;
    pitch?: number;
    rate?: number;
    onStart?: () => void;
    onDone?: () => void;
    onError?: (error: Error) => void;
    onStopped?: () => void;
  }

  export function speak(text: string, options?: SpeechOptions): Promise<void>;
  export function stop(): Promise<void>;
  export function isSpeaking(): Promise<boolean>;
  export function isAvailable(): Promise<boolean>;
} 