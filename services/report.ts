import { AxiosError } from 'axios';
import { api } from './api';
import { Report, ReportInsight, PaginatedResponse } from '@models/report';

export interface ReportUploadMetadata {
  title: string;
  description?: string;
  report_type_id?: string;
}

export const uploadReport = async (
  file: File,
  metadata: ReportUploadMetadata,
  token: string
): Promise<Report> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('report_in', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    const response = await api.post<Report>('/reports/', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Upload report error:', error.response?.data);
    }
    throw new Error('Failed to upload report');
  }
};

export const getReports = async (token: string, page: number = 1, size: number = 10): Promise<PaginatedResponse<Report>> => {
  try {
    const response = await api.get('/reports/', {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Get reports error:', error.response?.data);
    }
    throw new Error('Failed to fetch reports');
  }
};

export const getReport = async (id: number, token: string): Promise<Report> => {
  try {
    const response = await api.get<Report>(`/reports/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Get report error:', error.response?.data);
    }
    throw new Error('Failed to fetch report');
  }
};

export const getReportInsights = async (id: number, token: string): Promise<ReportInsight[]> => {
  try {
    const response = await api.get(`/reports/${id}/insights`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Get report insights error:', error.response?.data);
    }
    throw new Error('Failed to fetch report insights');
  }
}; 