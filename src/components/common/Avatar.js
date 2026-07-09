// src/components/common/Avatar.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/**
 * size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * ✅ اصلاح: تصویر حالا کاملاً دایره را پر می‌کند
 */
export default function Avatar({
  uri,
  name,
  size = 'md',
  showBorder = false,
  style,
}) {
  const { colors } = useTheme();
  const sizes = {
    xs: 28,
    sm: 36,
    md: 48,
    lg: 64,
    xl: 88,
  };
  const fontSizes = {
    xs: 11,
    sm: 13,
    md: 17,
    lg: 22,
    xl: 30,
  };
  const dim = sizes[size] ?? sizes.md;
  const fontSize = fontSizes[size] ?? fontSizes.md;

  const initials = name ? name.trim().charAt(0).toUpperCase() : '?';

  return (
    <View
      style={[
        s.wrapper,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: colors.cardBackground,
          borderColor: showBorder ? colors.primary : colors.border,
          borderWidth: showBorder ? 2 : 1,
        },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={s.image}
          resizeMode="cover"
        />
      ) : (
        <Text style={[s.initials, { color: colors.primary, fontSize }]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // ✅ کلید حل مشکل: تصویر را clip می‌کند
  },
  image: {
    // ✅ اصلاح اصلی: استفاده از position absolute با top/left/right/bottom = 0
    // این باعث می‌شود تصویر کاملاً wrapper را پر کند
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // borderRadius روی wrapper اعمال می‌شود و overflow:hidden خودش clip می‌کند
  },
  initials: {
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
});