// src/stores/useAuthStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,

      login: (phone, token = 'mock_token_' + Date.now()) => {
        const userData = { phone, name: 'کاربر زیبانو', avatar: null };
        set({ isAuthenticated: true, user: userData });
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      updateUser: (updates) =>
        set((state) => {
          const newUser = { ...state.user, ...updates };
          return { user: newUser };
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);