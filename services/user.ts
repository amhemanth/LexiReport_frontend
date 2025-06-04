import { AxiosError } from 'axios';
import { api } from './api';
import { User, ChangePasswordRequest } from '@models/user';

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  try {
    await api.put('/users/me/password', data);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Change password error:', error.response?.data);
    }
    throw new Error('Failed to change password');
  }
};

export const updateUserRole = async (userId: string, role: 'admin' | 'user'): Promise<User> => {
  try {
    const response = await api.post<User>(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Update user role error:', error.response?.data);
    }
    throw new Error('Failed to update user role');
  }
};

export const addUserPermission = async (userId: string, permission: string): Promise<void> => {
  try {
    await api.post(`/users/${userId}/permissions`, { permissions: [permission] });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Add user permission error:', error.response?.data);
    }
    throw new Error('Failed to add user permission');
  }
};

// To remove a permission, send the full new list of permissions
export const setUserPermissions = async (userId: string, permissions: string[]): Promise<void> => {
  try {
    await api.post(`/users/${userId}/permissions`, { permissions });
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Set user permissions error:', error.response?.data);
    }
    throw new Error('Failed to set user permissions');
  }
};

export const getUser = async (userId: string): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Get user error:', error.response?.data);
    }
    throw new Error('Failed to fetch user');
  }
}; 