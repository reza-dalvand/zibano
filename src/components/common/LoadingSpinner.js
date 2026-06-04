// src/components/common/LoadingSpinner.js

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/**
 * overlay: اگر true باشه روی کل صفحه نمایش داده میشه
 * size: 'small' | 'large'
 */
export default function LoadingSpinner({
  label,
  size = 'large',
  overlay = false,
  style,
}) {
  const { colors } = useTheme();

  const content = (
    <View style={[s.inner, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {label && (
        <Text style={[s.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View style={[s.overlay, { backgroundColor: colors.background + 'CC' }]}>
        {content}
      </View>
    );
  }

  return content;
}

const s = StyleSheet.create({
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  label: {
    fontFamily: 'Vazir',
    fontSize: 14,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
