import { create } from 'zustand';
import type { User } from '../types/types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  // මෙන්න මේ පේළිය එක් කරන්න
  setAuth: (user: User, token: string) => void; 
  setUser: (user: User) => void;
  clearError: () => void;
}

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export const useAuthStore = create<AuthState>((set) => {
  const saveAuth = (user: User, accessToken: string, refreshToken?: string) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  };

  return {
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
    error: null,

    setAuth: (user: User, token: string) => {
      saveAuth(user, token);
    },

    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const data = await authService.login(email, password);
        saveAuth(data.user, data.accessToken, data.refreshToken);
        set({ isLoading: false });
      } catch (error: unknown) {
        const err = error as ApiError;
        set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
        throw error;
      }
    },

    register: async (name: string, email: string, password: string, role?: string) => {
      set({ isLoading: true, error: null });
      try {
        const data = await authService.register(name, email, password, role);
        saveAuth(data.user, data.accessToken, data.refreshToken);
        set({ isLoading: false });
      } catch (error: unknown) {
        const err = error as ApiError;
        set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
        throw error;
      }
    },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user: User) => {
    set({ user });
  },

  clearError: () => {
    set({ error: null });
  },
}});