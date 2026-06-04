// src/components/common/Divider.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/**
 * orientation: 'horizontal' | 'vertical'
 */
export default function Divider({
  label,
  orientation = 'horizontal',
  thickness = 1,
  spacing = 16,
  style,
}) {
  const { colors } = useTheme();

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          s.vertical,
          {
            width: thickness,
            marginHorizontal: spacing,
            backgroundColor: colors.border,
          },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View style={[s.row, { marginVertical: spacing }, style]}>
        <View style={[s.line, { backgroundColor: colors.border, height: thickness }]} />
        <Text style={[s.label, { color: colors.textSecondary }]}>{label}</Text>
        <View style={[s.line, { backgroundColor: colors.border, height: thickness }]} />
      </View>
    );
  }

  return (
    <View
      style={[
        s.horizontal,
        {
          height: thickness,
          marginVertical: spacing,
          backgroundColor: colors.border,
        },
        style,
      ]}
    />
  );
}

const s = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
  },
  label: {
    fontFamily: 'Vazir',
    fontSize: 12,
    marginHorizontal: 12,
  },
});
