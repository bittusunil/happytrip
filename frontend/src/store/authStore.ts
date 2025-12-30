import { create } from 'zustand';
import { User } from '@/types';
import { apiService } from '@/services/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
  loadUserFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login(email, password);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.register(email, password, firstName, lastName);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    apiService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  loadUserFromStorage: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');

      if (userStr && accessToken) {
        try {
          const user = JSON.parse(userStr);
          set({
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Failed to parse user from storage:', error);
        }
      }
    }
  },
}));
