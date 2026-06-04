// src/components/common/Badge.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/**
 * variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
 * size: 'sm' | 'md'
 */
export default function Badge({
  label,
  variant = 'primary',
  size = 'md',
  dot = false,
  style,
}) {
  const { colors } = useTheme();

  const variantMap = {
    primary:   { bg: colors.primary + '22',   text: colors.primary },
    secondary: { bg: colors.secondary + '22', text: colors.secondary },
    success:   { bg: '#4CAF5022',             text: '#4CAF50' },
    warning:   { bg: '#FF980022',             text: '#FF9800' },
    error:     { bg: '#E5737322',             text: '#E57373' },
    neutral:   { bg: colors.border,           text: colors.textSecondary },
  };

  const { bg, text } = variantMap[variant] ?? variantMap.primary;

  const sizeStyles = {
    sm: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6 },
    md: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  };

  const textSizes = { sm: 11, md: 12 };

  if (dot) {
    return (
      <View style={[s.dot, { backgroundColor: text }, style]} />
    );
  }

  return (
    <View style={[s.base, sizeStyles[size], { backgroundColor: bg }, style]}>
      <Text
        style={[
          s.label,
          { color: text, fontSize: textSizes[size] },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Vazir-Medium',
    textAlign: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
