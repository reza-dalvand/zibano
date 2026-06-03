// src/components/common/Header.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';

/**
 * variant: 'default' | 'transparent'
 */
export default function Header({
  title,
  subtitle,
  onBackPress,
  backIcon = null,
  rightAction = null,
  variant = 'default',
  style,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const bg =
    variant === 'transparent' ? 'transparent' : colors.background;

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: bg,
          borderBottomColor: variant === 'transparent' ? 'transparent' : colors.border,
          paddingTop: insets.top + 8,
        },
        style,
      ]}
    >
      {/* سمت چپ — دکمه بازگشت */}
      <View style={s.side}>
        {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            style={[s.iconBtn, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {backIcon ?? (
              <Text style={[s.backArrow, { color: colors.textMain }]}>‹</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* وسط — عنوان */}
      <View style={s.center}>
        {title && (
          <Text
            numberOfLines={1}
            style={[s.title, { color: colors.textMain }]}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            numberOfLines={1}
            style={[s.subtitle, { color: colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* سمت راست — اکشن اختیاری */}
      <View style={s.side}>
        {rightAction ?? <View style={s.placeholder} />}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  side: {
    width: 44,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Vazir-Bold',
    fontSize: 17,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Vazir',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '300',
  },
  placeholder: {
    width: 36,
  },
});
