// src/components/common/StatusBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * کامپوننت مشترک Badge وضعیت
 *
 * پشتیبانی از متادیتاهای مختلف:
 * - STATUS_META (success, failed, pending, refunded)
 * - APPOINTMENT_STATUS_META (reserved, upcoming, done, cancelled)
 * - یا متادیتای سفارشی
 *
 * Props:
 * - meta: آبجکت متادیتا { label, color, icon, bg }
 * - size: 'sm' | 'md' | 'lg'
 * - showIcon: نمایش آیکون (پیش‌فرض true)
 */
export default function StatusBadge({ meta, size = 'md', showIcon = true }) {
  if (!meta) return null;

  const sizes = {
    sm: {
      container: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 3 },
      icon: 10,
      text: { fontSize: 9 },
    },
    md: {
      container: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, gap: 4 },
      icon: 12,
      text: { fontSize: 11 },
    },
    lg: {
      container: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, gap: 6 },
      icon: 14,
      text: { fontSize: 13 },
    },
  };

  const currentSize = sizes[size];
  const bgColor = meta.bg || (meta.color + '20');

  return (
    <View
      style={[
        s.container,
        currentSize.container,
        { backgroundColor: bgColor },
      ]}
    >
      {showIcon && meta.icon && (
        <Icon name={meta.icon} size={currentSize.icon} color={meta.color} />
      )}
      <Text
        style={[
          s.text,
          currentSize.text,
          { color: meta.color },
        ]}
      >
        {meta.label}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Vazir-Bold',
  },
});