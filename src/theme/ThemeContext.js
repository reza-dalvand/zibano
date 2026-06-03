// src/theme/ThemeContext.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { lightColors, darkColors } from './colors';

// ✅ داخل تابع ساخته میشه، نه module level
let storage = null;
function getStorage() {
  if (!storage) storage = new MMKV();
  return storage;
}

const THEME_KEY = 'app_theme';
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return getStorage().getString(THEME_KEY) ?? 'system';
    } catch {
      return 'system';
    }
  });

  const systemScheme = Appearance.getColorScheme();
  const resolvedTheme = theme === 'system' ? (systemScheme ?? 'light') : theme;
  const colors = resolvedTheme === 'dark' ? darkColors : lightColors;

  function setTheme(value) {
    try {
      getStorage().set(THEME_KEY, value);
    } catch {}
    setThemeState(value);
  }

  useEffect(() => {
    const sub = Appearance.addChangeListener(() => {
      setThemeState(prev => prev);
    });
    return () => sub.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);