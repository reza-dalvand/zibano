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
 * @param {boolean} scrollable - اگر true، محتوا داخل ScrollView قرار می‌گیرد
 * @param {boolean} keyboardAware - اگر true، از KeyboardAvoidingView استفاده می‌کند
 * @param {number} padding - فاصله داخلی از لبه‌ها (پیش‌فرض: 0)
 * @param {number} bottomInset - فاصله اضافی از پایین برای تب‌بار شناور (پیش‌فرض: 100)
 * @param {string[]} edges - لبه‌های SafeArea که باید مدیریت شوند
 * @param {boolean} safeAreaTop - اگر true، لبه بالا هم مدیریت می‌شود (فقط برای صفحات بدون Header)
 * @param {boolean} hasHeader - آیا صفحه Header کامپوننت دارد؟ (پیش‌فرض: true)
 *   اگر true باشد و edges شامل 'top' باشد، 'top' خودکار حذف می‌شود
 *   (چون Header خودش insets.top را مدیریت می‌کند)
 */
export default function ScreenWrapper({
  children,
  scrollable = false,
  keyboardAware = false,
  padding = 0,
  bottomInset = 100,
  edges = null,
  safeAreaTop = false,
  hasHeader = true,
  style,
  contentStyle,
  showsVerticalScrollIndicator = false,
  bounces = true,
}) {
  const { colors } = useTheme();

  // 🎯 محاسبه هوشمند لبه‌های SafeArea
  let computedEdges;
  if (edges) {
    computedEdges = [...edges];
    // 🔧 اگه صفحه Header داره و top در edges هست → حذف top
    // چون Header خودش insets.top رو مدیریت می‌کنه
    if (hasHeader && computedEdges.includes('top')) {
      computedEdges = computedEdges.filter((e) => e !== 'top');
    }
  } else {
    computedEdges = [
      ...(safeAreaTop || !hasHeader ? ['top'] : []),
      'bottom',
      'left',
      'right',
    ];
  }

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