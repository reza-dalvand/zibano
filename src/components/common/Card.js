// src/components/common/Card.js

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/**
 * variant: 'default' | 'flat' | 'elevated'
 */
export default function Card({
  children,
  onPress,
  variant = 'default',
  padding = 16,
  radius = 16,
  style,
}) {
  const { colors } = useTheme();

  const variantStyles = {
    default: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    flat: {
      backgroundColor: colors.cardBackground,
      borderWidth: 0,
    },
    elevated: {
      backgroundColor: colors.cardBackground,
      borderWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
  };

  const containerStyle = [
    s.base,
    variantStyles[variant],
    { padding, borderRadius: radius },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={containerStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const s = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
