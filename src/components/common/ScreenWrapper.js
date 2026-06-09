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
import { useTheme } from '../../theme/ThemeContext';

/**
 * کامپوننت wrapper استاندارد برای تمام صفحات اپلیکیشن
 *
 * ⚠️ نکته مهم:
 * این کامپوننت به طور پیش‌فرض فقط لبه‌های پایین و چپ/راست را مدیریت می‌کند.
 * لبه بالا (top) توسط Header کامپوننت مدیریت می‌شود تا تداخل ایجاد نشود.
 *
 * @param {boolean} scrollable - اگر true، محتوا داخل ScrollView قرار می‌گیرد
 * @param {boolean} keyboardAware - اگر true، از KeyboardAvoidingView استفاده می‌کند
 * @param {number} padding - فاصله داخلی از لبه‌ها (پیش‌فرض: 20)
 * @param {number} bottomInset - فاصله اضافی از پایین برای تب‌بار شناور (پیش‌فرض: 100)
 * @param {string[]} edges - لبه‌های SafeArea که باید مدیریت شوند
 * @param {boolean} safeAreaTop - اگر true، لبه بالا هم مدیریت می‌شود (فقط برای صفحات بدون Header)
 */
export default function ScreenWrapper({
  children,
  scrollable = false,
  keyboardAware = false,
  padding = 20,
  bottomInset = 100,
  edges = null, // ⚠️ تغییر: پیش‌فرض null است و پایین محاسبه می‌شود
  safeAreaTop = false, // 🆕 برای صفحات بدون Header مثل Login
  style,
  contentStyle,
  showsVerticalScrollIndicator = false,
  bounces = true,
}) {
  const { colors } = useTheme();

  // 🎯 محاسبه هوشمند لبه‌های SafeArea
  // اگر edges مستقیماً پاس داده نشده، بر اساس safeAreaTop تصمیم می‌گیریم
  const computedEdges = edges ?? [
    ...(safeAreaTop ? ['top'] : []), // فقط وقتی safeAreaTop=true باشد top اضافه می‌شود
    'bottom',
    'left',
    'right',
  ];

  // 📦 محتوای داخلی (ScrollView یا View ساده)
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

  // ⌨️ پیچیدن در KeyboardAvoidingView در صورت نیاز
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
      edges={computedEdges}
      style={[s.root, { backgroundColor: colors.background }, style]}
    >
      {wrapped}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  flat: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});