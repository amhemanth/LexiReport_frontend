import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getReport, getReportInsights } from '@lib/api';
import { Report, ReportInsight } from '@lib/types';
import { speak, stop, isCurrentlySpeaking } from '@lib/tts';
import { ThemedView } from '@components/ThemedView';
import { ParallaxScrollView } from '@components/ParallaxScrollView';
import { InsightCard } from '@components/InsightCard';
import { useTheme } from '@hooks/useTheme';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [report, setReport] = useState<Report | null>(null);
  const [insights, setInsights] = useState<ReportInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [speakingInsightId, setSpeakingInsightId] = useState<number | null>(null);

  useEffect(() => {
    loadReport();
    return () => {
      stop();
    };
  }, [id]);

  const loadReport = async () => {
    try {
      const [reportData, insightsData] = await Promise.all([
        getReport(Number(id)),
        getReportInsights(Number(id))
      ]);
      setReport(reportData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async (insight: ReportInsight) => {
    if (speakingInsightId === insight.id) {
      await stop();
      setSpeakingInsightId(null);
    } else {
      if (speakingInsightId) {
        await stop();
      }
      await speak(insight.insight_text);
      setSpeakingInsightId(insight.id);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (!report) {
    return (
      <ThemedView style={styles.container}>
        <Text style={[styles.errorText, { color: colors.text }]}>Report not found</Text>
      </ThemedView>
    );
  }

  const headerComponent = (
    <View style={[styles.header, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>{report.title}</Text>
      <Text style={[styles.type, { color: colors.primary }]}>{report.report_type}</Text>
      <Text style={[styles.date, { color: colors.text }]}>
        Created: {new Date(report.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <ParallaxScrollView
      headerComponent={headerComponent}
      headerHeight={200}
    >
      {report.description && (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.text }]}>{report.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Insights</Text>
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onPress={() => handleSpeak(insight)}
            isSpeaking={speakingInsightId === insight.id}
          />
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
  },
}); 