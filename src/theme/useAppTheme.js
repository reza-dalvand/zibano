// src/theme/useAppTheme.js
import { useColorScheme } from 'react-native';
import { MMKV, useMMKVString } from 'react-native-mmkv';
import { lightColors, darkColors } from './colors';

// ساخت یک اینستنس از دیتابیس mmkv
export const storage = new MMKV();

export const useAppTheme = () => {
  const systemColorScheme = useColorScheme(); 
  
  // حتماً باید storage ساخته شده را به هوک پاس بدهید
  const [themeMode, setThemeMode] = useMMKVString('app.theme', storage);
  const activeMode = themeMode || 'system';

  const isDark = activeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : activeMode === 'dark';

  const colors = isDark ? darkColors : lightColors;

  return {
    colors,
    themeMode: activeMode,
    isDark,
    setThemeMode,
  };
};