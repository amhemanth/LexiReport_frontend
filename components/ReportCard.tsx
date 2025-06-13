import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Report } from '@/mock/reports';
import { colors, spacing, typography, shadows, borderRadius, commonStyles } from '@/constants/styles';

interface ReportCardProps {
  report: Report;
  onPress?: () => void;
}

export default function ReportCard({ report, onPress }: ReportCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/reports/${report.id}`);
    }
  };

  const getStatusColor = () => {
    switch (report.status) {
      case 'completed':
        return colors.success;
      case 'processing':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.text.tertiary;
    }
  };

  const getTypeIcon = () => {
    switch (report.type) {
      case 'pdf':
        return 'document-text';
      case 'excel':
        return 'grid';
      case 'bi':
        return 'bar-chart';
      default:
        return 'document';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, commonStyles.card]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.header, commonStyles.row, commonStyles.spaceBetween]}>
          <View style={[styles.titleContainer, commonStyles.row]}>
            <Ionicons
              name={getTypeIcon()}
              size={24}
              color={colors.text.secondary}
              style={styles.typeIcon}
            />
            <Text style={[commonStyles.title]} numberOfLines={1}>
              {report.title}
            </Text>
          </View>
          <View style={[styles.status, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{report.status}</Text>
          </View>
        </View>

        <Text style={[commonStyles.text, styles.description]} numberOfLines={2}>
          {report.description}
        </Text>

        <View style={[styles.footer, commonStyles.row]}>
          <View style={[styles.metaInfo, commonStyles.row]}>
            <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
            <Text style={[commonStyles.metaText, styles.metaText]}>
              {new Date(report.updated_at).toLocaleDateString()}
            </Text>
          </View>

          <View style={[styles.metaInfo, commonStyles.row]}>
            <Ionicons name="analytics-outline" size={16} color={colors.text.secondary} />
            <Text style={[commonStyles.metaText, styles.metaText]}>
              {report.insights_count} insights
            </Text>
          </View>

          {report.file_size > 0 && (
            <View style={[styles.metaInfo, commonStyles.row]}>
              <Ionicons name="save-outline" size={16} color={colors.text.secondary} />
              <Text style={[commonStyles.metaText, styles.metaText]}>
                {formatFileSize(report.file_size)}
              </Text>
            </View>
          )}
        </View>

        {report.is_offline && (
          <View style={styles.offlineBadge}>
            <Ionicons name="cloud-download" size={14} color={colors.success} />
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  typeIcon: {
    marginRight: spacing.sm,
  },
  status: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  statusText: {
    color: colors.background.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    textTransform: 'capitalize',
  },
  description: {
    marginBottom: spacing.md,
    lineHeight: typography.sizes.md * 1.5,
  },
  footer: {
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metaInfo: {
    marginRight: spacing.md,
  },
  metaText: {
    marginLeft: spacing.xs,
  },
  offlineBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.success,
  },
  offlineText: {
    fontSize: typography.sizes.xs,
    color: colors.success,
    marginLeft: spacing.xs,
    fontWeight: typography.weights.medium,
  },
}); 