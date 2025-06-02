import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { ParallaxScrollView } from '@components/ParallaxScrollView';
import { ThemedText } from '@components/ThemedText';
import { ThemedView } from '@components/ThemedView';
import { useTheme } from '@hooks/useTheme';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ParallaxScrollView
      headerComponent={
        <Image
          source={require('../../assets/images/header.png')}
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Welcome to DocuInsight</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your AI-powered document analysis assistant
        </ThemedText>
        <ThemedText style={styles.description}>
          Upload your documents and get instant insights, summaries, and key points
          extracted using advanced AI technology.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 20,
  },
  description: {
    lineHeight: 24,
  },
});
