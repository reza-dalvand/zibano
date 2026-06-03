// src/theme/useAppTheme.js
import { useColorScheme } from 'react-native';
import { MMKV, useMMKVString } from 'react-native-mmkv';
import { lightColors, darkColors } from './colors';

// ساخت یک اینستنس از دیتابیس mmkv
export const storage = new MMKV();

export const useAppTheme = () => {
  // گرفتن تم سیستم‌عامل
  const systemColorScheme = useColorScheme(); 
  
  // خواندن تم انتخابی کاربر، مقدار پیش‌فرض سیستم است
  const [themeMode, setThemeMode] = useMMKVString('app.theme');
  const activeMode = themeMode || 'system';

  // بررسی اینکه آیا تم نهایی باید دارک باشد یا خیر
  const isDark = activeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : activeMode === 'dark';

  // اختصاص رنگ‌های مناسب بر اساس پالت شما
  const colors = isDark ? darkColors : lightColors;

  return {
    colors,
    themeMode: activeMode,
    isDark,
    setThemeMode,
  };
};