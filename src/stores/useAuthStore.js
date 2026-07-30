// src/stores/useAuthStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      pendingAction: null, // 🎯 NEW: ذخیره اکشن در انتظار

      login: (phone, name = 'کاربر زیبانو', token = 'mock_token_' + Date.now()) => {
        const userData = { phone, name, avatar: null };
        set({ isAuthenticated: true, user: userData });
      },

      logout: () => {
        set({ isAuthenticated: false, user: null, pendingAction: null });
      },

      updateUser: (updates) =>
        set((state) => {
          const newUser = { ...state.user, ...updates };
          return { user: newUser };
        }),

      // 🎯 NEW: ذخیره اکشن در انتظار قبل از لاگین
      setPendingAction: (action) => {
        set({ pendingAction: action });
      },

      // 🎯 NEW: اجرای اکشن ذخیره شده و پاک کردن آن
      executePendingAction: () => {
        const { pendingAction } = get();
        if (pendingAction) {
          // اجرای اکشن با تاخیر کوتاه برای اطمینان از تکمیل لاگین
          setTimeout(() => {
            pendingAction();
            set({ pendingAction: null });
          }, 100);
        }
      },

      // 🎯 NEW: پاک کردن اکشن ذخیره شده
      clearPendingAction: () => {
        set({ pendingAction: null });
      },
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