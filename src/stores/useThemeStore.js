// src/stores/useThemeStore.js
import { create } from 'zustand';
import { Appearance } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { lightColors, darkColors } from '../theme/colors';

const THEME_KEY = 'app_theme';

// ✅ lazy — فقط وقتی اول فراخوانی بشه میسازه
let _storage = null;
const getStorage = () => {
  if (!_storage) _storage = new MMKV();
  return _storage;
};

const getInitialTheme = () => {
  try {
    return getStorage().getString(THEME_KEY) ?? 'system';
  } catch {
    return 'system';
  }
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  resolvedTheme:
    getInitialTheme() === 'system'
      ? Appearance.getColorScheme() ?? 'light'
      : getInitialTheme(),
  colors:
    (getInitialTheme() === 'system'
      ? Appearance.getColorScheme() ?? 'light'
      : getInitialTheme()) === 'dark'
      ? darkColors
      : lightColors,

  setTheme: (value) => {
    try {
      getStorage().set(THEME_KEY, value);
    } catch {}
    const resolved =
      value === 'system' ? Appearance.getColorScheme() ?? 'light' : value;
    set({
      theme: value,
      resolvedTheme: resolved,
      colors: resolved === 'dark' ? darkColors : lightColors,
    });
  },

  initSystemListener: () => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      const current = useThemeStore.getState().theme;
      if (current === 'system') {
        const resolved = colorScheme ?? 'light';
        set({
          resolvedTheme: resolved,
          colors: resolved === 'dark' ? darkColors : lightColors,
        });
      }
    });
    return () => sub.remove();
  },
}));

export const useTheme = useThemeStore;