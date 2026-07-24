// src/components/common/Chip.js

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/useThemeStore';

/**
 * برای فیلترها، دسته‌بندی‌ها، تگ‌های انتخابی
 * selected: آیا انتخاب شده؟
 * onPress: اگر null باشه، غیرقابل کلیک
 */
export default function Chip({
  label,
  selected = false,
  onPress,
  icon,
  onRemove,
  style,
}) {
  const { colors } = useTheme();

  const bg = selected
    ? colors.primary + '22'
    : colors.cardBackground;

  const borderColor = selected ? colors.primary : colors.border;
  const textColor = selected ? colors.primary : colors.textSecondary;

  const content = (
    <View
      style={[
        s.container,
        { backgroundColor: bg, borderColor },
        style,
      ]}
    >
      {icon && <View style={s.icon}>{icon}</View>}
      <Text style={[s.label, { color: textColor }]}>{label}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }} style={s.remove}>
          <Text style={[s.removeText, { color: textColor }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    gap: 6,
  },
  label: {
    fontFamily: 'Vazir-Medium',
    fontSize: 13,
  },
  icon: {
    marginLeft: 2,
  },
  remove: {
    marginRight: 2,
  },
  removeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
