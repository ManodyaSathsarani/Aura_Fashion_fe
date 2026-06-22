import api from './api';
import type { AuthResponse, User } from '../types/types';

const normalizeRoles = (roles: unknown): string[] => {
  if (Array.isArray(roles)) {
    return roles.filter((role): role is string => typeof role === 'string');
  }

  if (typeof roles === 'string') {
    return [roles];
  }

  return [];
};

const normalizeUser = (user: any): User => ({
  id: user?.id || user?._id || '',
  name: user?.name || user?.fullName || user?.username || '',
  email: user?.email || user?.userEmail || '',
  roles: normalizeRoles(user?.roles || user?.role),
});

const normalizeAuthResponse = (data: any): AuthResponse => ({
  accessToken: data?.accessToken || data?.token || data?.access_token || '',
  refreshToken: data?.refreshToken || data?.refresh_token || '',
  user: normalizeUser(data?.user ?? data?.data ?? data),
  message: data?.message || '',
});

export const authService = {
  async register(name: string, email: string, password: string, role?: string): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { name, email, password, role });
    return normalizeAuthResponse(response.data);
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    return normalizeAuthResponse(response.data);
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? normalizeUser(JSON.parse(userStr)) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  isSeller(): boolean {
    const user = this.getCurrentUser();
    return user?.roles.includes('seller') || false;
  },
};