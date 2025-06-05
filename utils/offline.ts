import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_REPORTS_KEY = 'offline_reports';

export async function saveReportOffline(report: any, insights: any, fileUri: string) {
  // Save metadata and insights
  let offlineReports = await getOfflineReports();
  offlineReports = offlineReports.filter((r: any) => r.id !== report.id);
  offlineReports.push({ ...report, insights, fileUri });
  await AsyncStorage.setItem(OFFLINE_REPORTS_KEY, JSON.stringify(offlineReports));
}

export async function getOfflineReports() {
  const data = await AsyncStorage.getItem(OFFLINE_REPORTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getOfflineReportById(id: number) {
  const reports = await getOfflineReports();
  return reports.find((r: any) => r.id === id);
}

export async function removeOfflineReport(id: number) {
  let reports = await getOfflineReports();
  reports = reports.filter((r: any) => r.id !== id);
  await AsyncStorage.setItem(OFFLINE_REPORTS_KEY, JSON.stringify(reports));
}

export async function removeOfflineReportAndFile(id: number) {
  const report = await getOfflineReportById(id);
  if (report && report.fileUri) {
    try {
      await FileSystem.deleteAsync(report.fileUri, { idempotent: true });
    } catch {}
  }
  await removeOfflineReport(id);
} 