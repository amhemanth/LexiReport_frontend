import { api } from './api';

export const getBIConnections = async (token: string) => {
  const response = await api.get('/bi/connections', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const connectBI = async (provider: string, authData: any, token: string) => {
  // authData may include OAuth code, etc.
  const response = await api.post('/bi/connect', { provider, ...authData }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getBIDashboards = async (token: string) => {
  const response = await api.get('/bi/dashboards', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getBIReports = async (token: string) => {
  const response = await api.get('/bi/reports', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}; 