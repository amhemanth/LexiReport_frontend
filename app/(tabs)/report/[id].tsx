import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@hooks/useTheme';
import { ThemedView } from '@components/ui/ThemedView';
import { Header } from '@components/Header';
import { getReport, getReportInsights } from '@/services/report';
import { Report } from '@models/report';
import { useAuth } from '@hooks/useAuth';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { saveReportOffline, getOfflineReportById } from '@utils/offline';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

export default function ReportDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const speechUtteranceId = useRef<string | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [addingComment, setAddingComment] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('read');
  const [shareExpiresAt, setShareExpiresAt] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shares, setShares] = useState<any[]>([]);
  const [sharesLoading, setSharesLoading] = useState(true);
  const [tags, setTags] = useState<any[]>([]);
  const [tagText, setTagText] = useState('');
  const [tagsLoading, setTagsLoading] = useState(true);
  const [addingTag, setAddingTag] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOfflineMode(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOfflineMode) {
      loadOfflineReport();
    } else {
      loadReport();
    }
    checkOffline();
    loadComments();
    loadShares();
    loadTags();
    return () => {
      Speech.stop();
    };
  }, [id, isOfflineMode]);

  const loadReport = async () => {
    try {
      if (!token) throw new Error('No authentication token');
      const reportData = await getReport(Number(id), token);
      setReport(reportData);
      const insightsData = await getReportInsights(Number(id), token);
      setInsights(insightsData.map(i => i.content));
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load report' });
    } finally {
      setLoading(false);
    }
  };

  const loadOfflineReport = async () => {
    try {
      const offline = await getOfflineReportById(Number(id));
      if (offline) {
        setReport(offline);
        setInsights(offline.insights || []);
      } else {
        Toast.show({ type: 'info', text1: 'Offline', text2: 'This report is not available offline.' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load offline report.' });
    } finally {
      setLoading(false);
    }
  };

  const checkOffline = async () => {
    const offline = await getOfflineReportById(Number(id));
    setIsOffline(!!offline);
  };

  const handleDownloadOffline = async () => {
    if (!report) return;
    setDownloading(true);
    try {
      // Download file
      const fileName = report.file_path ? report.file_path.split('/').pop() : `report_${report.id}`;
      const fileUri = (FileSystem.documentDirectory || FileSystem.cacheDirectory || '') + fileName;
      const downloadRes = await FileSystem.downloadAsync(report.file_path, fileUri);
      // Save metadata and insights
      await saveReportOffline(report, insights, downloadRes.uri);
      setIsOffline(true);
      Alert.alert('Success', 'Report saved for offline access!');
    } catch (error) {
      Alert.alert('Error', 'Failed to download for offline.');
    } finally {
      setDownloading(false);
    }
  };

  // TTS Handlers
  const handlePlay = (idx: number) => {
    if (playingIndex === idx && isPaused) {
      // Resume
      Speech.resume();
      setIsPaused(false);
      return;
    }
    if (playingIndex !== null) {
      Speech.stop();
    }
    setPlayingIndex(idx);
    setIsPaused(false);
    Speech.speak(insights[idx], {
      rate: playbackSpeed,
      onDone: () => {
        setPlayingIndex(null);
        setIsPaused(false);
      },
      onStopped: () => {
        setPlayingIndex(null);
        setIsPaused(false);
      },
    });
  };

  const handlePause = () => {
    Speech.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    Speech.stop();
    setPlayingIndex(null);
    setIsPaused(false);
  };

  const handleSpeedChange = () => {
    // Cycle through 1.0, 1.25, 1.5
    setPlaybackSpeed((prev) => (prev === 1.0 ? 1.25 : prev === 1.25 ? 1.5 : 1.0));
    // If currently playing, restart with new speed
    if (playingIndex !== null) {
      Speech.stop();
      setTimeout(() => handlePlay(playingIndex), 200);
    }
  };

  // Q&A Handler
  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setQaLoading(true);
    setAnswer('');
    try {
      const response = await api.post(`/reports/${id}/query`, { question }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnswer(response.data.answer || 'No answer received.');
    } catch (error) {
      setAnswer('Failed to get answer.');
    } finally {
      setQaLoading(false);
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      if (!token) throw new Error('No authentication token');
      const response = await api.get(`/comments/report/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(response.data);
    } catch (error) {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setAddingComment(true);
    try {
      await api.post(`/comments/report/${id}`, { content: commentText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommentText('');
      loadComments();
    } catch (error) {
      // Optionally show error
    } finally {
      setAddingComment(false);
    }
  };

  const loadShares = async () => {
    setSharesLoading(true);
    try {
      if (!token) throw new Error('No authentication token');
      const response = await api.get(`/reports/${id}/shares`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShares(response.data);
    } catch (error) {
      setShares([]);
    } finally {
      setSharesLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareEmail.trim()) return;
    setSharing(true);
    try {
      await api.post(`/reports/${id}/share`, {
        shared_with: shareEmail,
        permission: sharePermission,
        expires_at: shareExpiresAt ? shareExpiresAt.toISOString() : undefined,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowShareModal(false);
      setShareEmail('');
      setSharePermission('read');
      setShareExpiresAt(null);
      loadShares();
      Alert.alert('Success', 'Report shared!');
    } catch (error) {
      Alert.alert('Error', 'Failed to share report.');
    } finally {
      setSharing(false);
    }
  };

  const loadTags = async () => {
    setTagsLoading(true);
    try {
      if (!token) throw new Error('No authentication token');
      const response = await api.get('/comments/tags', {
        headers: { Authorization: `Bearer ${token}` },
        params: { report_id: id },
      });
      setTags(response.data);
    } catch (error) {
      setTags([]);
    } finally {
      setTagsLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!tagText.trim()) return;
    setAddingTag(true);
    try {
      await api.post('/comments/tags', {
        report_id: id,
        tag: tagText,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTagText('');
      loadTags();
    } catch (error) {
      // Optionally show error
    } finally {
      setAddingTag(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (!report) {
    return (
      <ThemedView style={styles.centered}>
        <Text style={{ color: colors.text }}>Report not found.</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Header title={report.title || 'Report Detail'} />
      <ScrollView contentContainerStyle={styles.content}>
        {isOfflineMode && (
          <View style={{ backgroundColor: colors.error, padding: 8, alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>Offline Mode: Viewing local data</Text>
          </View>
        )}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Metadata</Text>
        <Text style={{ color: colors.text }}>Type: {report.report_type}</Text>
        <Text style={{ color: colors.text }}>Created: {new Date(report.created_at).toLocaleString()}</Text>
        {/* Add more metadata as needed */}

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>AI Insights</Text>
        {insights.length === 0 ? (
          <Text style={{ color: colors.text + '80' }}>No insights available.</Text>
        ) : (
          insights.map((insight, idx) => (
            <View
              key={idx}
              style={[styles.insightBox, playingIndex === idx && { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primary + '10' }]}
            >
              <Text style={{ color: colors.text }}>{insight}</Text>
              <View style={styles.audioControls}>
                {playingIndex === idx && !isPaused ? (
                  <TouchableOpacity onPress={handlePause} style={styles.audioButton}>
                    <Ionicons name="pause" size={24} color={colors.primary} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => handlePlay(idx)} style={styles.audioButton}>
                    <Ionicons name="play" size={24} color={colors.primary} />
                  </TouchableOpacity>
                )}
                {playingIndex === idx && (
                  <TouchableOpacity onPress={handleStop} style={styles.audioButton}>
                    <Ionicons name="stop" size={24} color={colors.primary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleSpeedChange} style={styles.audioButton}>
                  <Ionicons name="speedometer-outline" size={24} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontSize: 12, marginLeft: 4 }}>{playbackSpeed}x</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 32 }]}>Ask a Question (Q&A)</Text>
        <View style={styles.qaContainer}>
          <TextInput
            style={[styles.qaInput, { color: colors.text, borderColor: colors.border }]}
            placeholder="Type your question about this report..."
            placeholderTextColor={colors.text + '80'}
            value={question}
            onChangeText={setQuestion}
            editable={!qaLoading}
          />
          <TouchableOpacity
            style={[styles.qaButton, { backgroundColor: colors.primary }]}
            onPress={handleAskQuestion}
            disabled={qaLoading || !question.trim()}
          >
            {qaLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        {answer ? (
          <View style={styles.qaAnswerBox}>
            <Text style={{ color: colors.text }}>{answer}</Text>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              padding: 12,
              borderRadius: 8,
              marginRight: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={handleDownloadOffline}
            disabled={downloading || isOffline}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name={isOffline ? 'checkmark-done' : 'download'} size={20} color="#fff" />
            )}
            <Text style={{ color: '#fff', marginLeft: 8 }}>
              {isOffline ? 'Available Offline' : 'Download for Offline'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Share Button */}
        <TouchableOpacity
          style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 }}
          onPress={() => setShowShareModal(true)}
        >
          <Ionicons name="share-social" size={20} color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 8 }}>Share</Text>
        </TouchableOpacity>
        {/* Share Modal */}
        {showShareModal && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 20, padding: 16 }]}> 
            <View style={{ width: '100%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 16, padding: 24 }}>
              <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Share Report</Text>
              <TextInput
                style={[styles.qaInput, { color: colors.text, borderColor: colors.border, marginBottom: 12 }]}
                placeholder="User email"
                placeholderTextColor={colors.text + '80'}
                value={shareEmail}
                onChangeText={setShareEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Text style={{ color: colors.text, marginBottom: 4 }}>Permission</Text>
              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                {['read', 'write', 'admin'].map((perm) => (
                  <TouchableOpacity
                    key={perm}
                    style={{
                      padding: 8,
                      borderRadius: 8,
                      backgroundColor: sharePermission === perm ? colors.primary : colors.border,
                      marginRight: 8,
                    }}
                    onPress={() => setSharePermission(perm)}
                  >
                    <Text style={{ color: sharePermission === perm ? '#fff' : colors.text }}>{perm}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ marginBottom: 12 }}>
                <Text style={{ color: colors.text }}>
                  Expiration: {shareExpiresAt ? shareExpiresAt.toLocaleString() : 'None'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={shareExpiresAt || new Date()}
                  mode="datetime"
                  display="default"
                  onChange={(_, date) => {
                    setShowDatePicker(false);
                    if (date) setShareExpiresAt(date);
                  }}
                />
              )}
              <View style={{ flexDirection: 'row', marginTop: 16 }}>
                <TouchableOpacity
                  style={{ flex: 1, padding: 12, backgroundColor: colors.primary, borderRadius: 8, marginRight: 8, alignItems: 'center' }}
                  onPress={handleShare}
                  disabled={sharing || !shareEmail.trim()}
                >
                  {sharing ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: '#fff' }}>Share</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, padding: 12, backgroundColor: colors.border, borderRadius: 8, alignItems: 'center' }}
                  onPress={() => setShowShareModal(false)}
                >
                  <Text style={{ color: colors.text }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {/* Shares List */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 32 }]}>Shared With</Text>
        <View style={styles.commentsContainer}>
          {sharesLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : shares.length === 0 ? (
            <Text style={{ color: colors.text + '80' }}>Not shared with anyone.</Text>
          ) : (
            shares.map((s, idx) => (
              <View key={s.id || idx} style={styles.commentBox}>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>{s.shared_with || 'User'}</Text>
                <Text style={{ color: colors.text }}>{s.permission}</Text>
                <Text style={{ color: colors.text + '60', fontSize: 12 }}>Expires: {s.expires_at ? new Date(s.expires_at).toLocaleString() : 'Never'}</Text>
              </View>
            ))
          )}
        </View>

        {/* Tags Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 32 }]}>Tags</Text>
        <View style={styles.commentsContainer}>
          {tagsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : tags.length === 0 ? (
            <Text style={{ color: colors.text + '80' }}>No tags yet.</Text>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
              {tags.map((t, idx) => (
                <View key={t.id || idx} style={{ backgroundColor: colors.primary + '20', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4, marginRight: 8, marginBottom: 8 }}>
                  <Text style={{ color: colors.primary }}>{t.tag || t.name}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.addCommentBox}>
            <TextInput
              style={[styles.qaInput, { color: colors.text, borderColor: colors.border }]}
              placeholder="Add a tag..."
              placeholderTextColor={colors.text + '80'}
              value={tagText}
              onChangeText={setTagText}
              editable={!addingTag}
            />
            <TouchableOpacity
              style={[styles.qaButton, { backgroundColor: colors.primary }]}
              onPress={handleAddTag}
              disabled={addingTag || !tagText.trim()}
            >
              {addingTag ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="add" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 32 }]}>Comments</Text>
        <View style={styles.commentsContainer}>
          {commentsLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : comments.length === 0 ? (
            <Text style={{ color: colors.text + '80' }}>No comments yet.</Text>
          ) : (
            comments.map((c, idx) => (
              <View key={c.id || idx} style={styles.commentBox}>
                <Text style={{ color: colors.text, fontWeight: 'bold' }}>{c.user_name || 'User'}</Text>
                <Text style={{ color: colors.text }}>{c.content}</Text>
                <Text style={{ color: colors.text + '60', fontSize: 12 }}>{new Date(c.created_at).toLocaleString()}</Text>
              </View>
            ))
          )}
          <View style={styles.addCommentBox}>
            <TextInput
              style={[styles.qaInput, { color: colors.text, borderColor: colors.border }]}
              placeholder="Add a comment..."
              placeholderTextColor={colors.text + '80'}
              value={commentText}
              onChangeText={setCommentText}
              editable={!addingComment}
            />
            <TouchableOpacity
              style={[styles.qaButton, { backgroundColor: colors.primary }]}
              onPress={handleAddComment}
              disabled={addingComment || !commentText.trim()}
            >
              {addingComment ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  insightBox: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'column',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  audioButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  qaInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  qaButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaAnswerBox: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  commentsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  commentBox: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  addCommentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
}); 