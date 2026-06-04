// src/components/common/StarRating.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/**
 * interactive: اگر true باشه کاربر می‌تونه امتیاز بده
 * size: 'sm' | 'md' | 'lg'
 */
export default function StarRating({
  value = 0,
  maxStars = 5,
  onRate,
  interactive = false,
  showLabel = false,
  size = 'md',
  style,
}) {
  const { colors } = useTheme();

  const starSizes = { sm: 14, md: 18, lg: 24 };
  const starSize = starSizes[size] ?? starSizes.md;

  const filled = '★';
  const empty = '☆';

  return (
    <View style={[s.row, style]}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const isFilled = i < Math.round(value);
        const star = (
          <Text
            key={i}
            style={[
              s.star,
              {
                fontSize: starSize,
                color: isFilled ? colors.primary : colors.border,
              },
            ]}
          >
            {isFilled ? filled : empty}
          </Text>
        );

        if (interactive && onRate) {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onRate(i + 1)}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              {star}
            </TouchableOpacity>
          );
        }

        return star;
      })}

      {showLabel && (
        <Text style={[s.label, { color: colors.textSecondary }]}>
          {value > 0 ? value.toFixed(1) : '—'}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    lineHeight: undefined,
  },
  label: {
    fontFamily: 'Vazir',
    fontSize: 13,
    marginRight: 6,
  },
});
