import { create } from 'zustand';
import type { User } from '@/types/api';
import { apiClient } from '@/services/api-client';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('auth_token');
    if (token) {
      set({ token, isAuthenticated: true });
      get().fetchUser();
    } else {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('auth_token', data.token);
    set({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/admin';
    }
  },

  fetchUser: async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('auth_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user: User) => set({ user }),
}));
