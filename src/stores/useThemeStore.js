// src/stores/useThemeStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { lightColors, darkColors } from '../theme/colors';

const getResolvedTheme = (theme) => {
  if (theme === 'system') {
    return Appearance.getColorScheme() ?? 'light';
  }
  return theme;
};

const getColors = (resolved) => {
  return resolved === 'dark' ? darkColors : lightColors;
};

// مقدار اولیه (قبل از hydrate شدن از AsyncStorage)
const initialTheme = 'system';
const initialResolved = getResolvedTheme(initialTheme);
const initialColors = getColors(initialResolved);

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: initialTheme,
      resolvedTheme: initialResolved,
      colors: initialColors,
      _hydrated: false,

      // 🎯 این تابع رو در App.js فراخوانی می‌کنیم
      setHydrated: () => set({ _hydrated: true }),

      setTheme: (value) => {
        console.log('🎨 setTheme called:', value);
        const resolved = getResolvedTheme(value);
        set({
          theme: value,
          resolvedTheme: resolved,
          colors: getColors(resolved),
        });
        console.log('✅ Theme saved to AsyncStorage:', value);
      },

      initSystemListener: () => {
        const sub = Appearance.addChangeListener(({ colorScheme }) => {
          const current = get().theme;
          if (current === 'system') {
            const resolved = colorScheme ?? 'light';
            set({
              resolvedTheme: resolved,
              colors: getColors(resolved),
            });
          }
        });
        return () => sub.remove();
      },
    }),
    {
      name: 'app-theme-storage', // کلید ذخیره‌سازی
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        resolvedTheme: state.resolvedTheme,
        colors: state.colors,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          console.log('✅ Theme rehydrated from AsyncStorage:', state?.theme);
          if (state) {
            state.setHydrated();
          }
        };
      },
    }
  )
);

export const useTheme = useThemeStore;