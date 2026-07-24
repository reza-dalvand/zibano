// src/components/common/ScreenWrapper.js
import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../stores/useThemeStore';

/**
 * کامپوننت Wrapper استاندارد برای تمام صفحات
 * 
 * 📌 قانون استفاده از edges:
 * - صفحات با هدر ساده (کامپوننت Header): edges={['bottom', 'left', 'right']}
 *   (چون Header خودش insets.top رو مدیریت می‌کنه)
 * - صفحات با هدر رنگی/سفارشی (پروفایل، خانه، ویترین و...): edges={['top', 'bottom', 'left', 'right']}
 *   یا کلاً prop edges رو ننویسید تا پیش‌فرض اعمال بشه
 */
export default function ScreenWrapper({
  children,
  scrollable = false,
  keyboardAware = false,
  padding = 0,
  bottomInset = 100,
  edges = ['top', 'bottom', 'left', 'right'], // ✅ پیش‌فرض: مدیریت کامل SafeArea
  style,
  contentStyle,
  showsVerticalScrollIndicator = false,
  bounces = true,
}) {
  const { colors } = useTheme();

  const inner = scrollable ? (
    <ScrollView
      contentContainerStyle={[
        s.scrollContent,
        {
          padding,
          paddingBottom: padding + bottomInset,
        },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      bounces={bounces}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[s.flat, { padding }, contentStyle]}>{children}</View>
  );

  const wrapped = keyboardAware ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.flex}
      keyboardVerticalOffset={0}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[s.root, { backgroundColor: colors.background }, style]}
    >
      {wrapped}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  flat: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});