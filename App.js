import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const OPTIONS = [
  { value: 'light', label: '☀️  روشن' },
  { value: 'dark', label: '🌙  تاریک' },
  { value: 'system', label: '📱  سیستم' },
];

function TestScreen() {
  const { theme, resolvedTheme, colors, setTheme } = useTheme();

  return (
    <SafeAreaView style={[s.root, { backgroundColor: colors.background }]}>
      {/* کارت نمونه */}
      <View
        style={[
          s.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[s.title, { color: colors.textMain }]}>سلام دنیا 👋</Text>
        <Text style={[s.sub, { color: colors.textSecondary }]}>
          تم انتخابی: <Text style={{ color: colors.primary }}>{theme}</Text>
          {'  '}|{'  '}
          تم فعال:{' '}
          <Text style={{ color: colors.secondary }}>{resolvedTheme}</Text>
        </Text>
      </View>

      {/* دکمه‌های انتخاب تم */}
      <View style={s.row}>
        {OPTIONS.map(opt => {
          const active = theme === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setTheme(opt.value)}
              style={[
                s.btn,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.cardBackground,
                },
                active && {
                  borderColor: colors.primary,
                  backgroundColor: colors.primary + '22',
                },
              ]}
            >
              <Text
                style={[
                  s.btnText,
                  { color: active ? colors.primary : colors.textSecondary },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from "react-native-bootsplash";

export default function App() {
  useEffect(() => {
    const init = async () => {
      // در اینجا می‌توانید تنظیمات اولیه، لود کردن دیتابیس یا API را انجام دهید
    };

    init().finally(async () => {
      // مخفی کردن اسپلش با انیمیشن
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TestScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 6 },
  sub: { fontSize: 14, lineHeight: 22 },
  row: { flexDirection: 'row', gap: 10 },
  btn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'center',
  },
  btnText: { fontSize: 13, fontWeight: '500' },
});
