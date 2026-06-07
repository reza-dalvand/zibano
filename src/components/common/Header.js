// src/components/common/Header.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  const bg = variant === 'transparent' ? 'transparent' : colors.background;

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: bg,
          borderBottomColor: variant === 'transparent' ? 'transparent' : colors.border,
          paddingTop: insets.top + 12,
        },
        style,
      ]}
    >
      {/* دکمه بازگشت — به خاطر RTL به صورت خودکار در سمت راست قرار می‌گیرد */}
      <View style={s.side}>
        {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            style={[s.iconBtn, { backgroundColor: colors.cardBackground }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {backIcon ?? (
              <Icon name="chevron-right" size={26} color={colors.textMain} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* وسط — عنوان و زیرعنوان */}
      <View style={s.center}>
        {title && (
          <Text numberOfLines={1} style={[s.title, { color: colors.textMain }]}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text numberOfLines={1} style={[s.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* سمت چپ — اکشن اختیاری یا پلیس‌هولدر برای حفظ تقارن عنوان */}
      <View style={s.side}>
        {rightAction ?? <View style={s.placeholder} />}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row', // سیستم RTL خودش این رو راست‌چین می‌کنه
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  side: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Vazir-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Vazir',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  placeholder: {
    width: 40,
  },
});