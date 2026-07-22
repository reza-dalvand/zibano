// src/components/common/Avatar.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

/**
 * size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * defaultIcon: آیکون پیش‌فرض وقتی عکس نیست
 */
export default function Avatar({
  uri,
  name,
  size = 'md',
  showBorder = false,
  style,
  defaultIcon = 'spa',
}) {
  const { colors } = useTheme();

  const sizes = {
    xs: 28,
    sm: 36,
    md: 48,
    lg: 64,
    xl: 88,
  };

  const iconSizes = {
    xs: 14,
    sm: 18,
    md: 24,
    lg: 32,
    xl: 44,
  };

  const fontSizes = {
    xs: 11,
    sm: 13,
    md: 17,
    lg: 22,
    xl: 30,
  };

  const dim = sizes[size] ?? sizes.md;
  const iconSize = iconSizes[size] ?? iconSizes.md;
  const fontSize = fontSizes[size] ?? fontSizes.md;

  // گرفتن حرف اول نام
  const initial = name ? name.trim().charAt(0) : '';

  return (
    <View
      style={[
        s.wrapper,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          borderColor: showBorder ? colors.primary : colors.border,
          borderWidth: showBorder ? 2 : 1,
          backgroundColor: colors.primary + '18',
        },
        style,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={s.image} resizeMode="cover" />
      ) : (
        <View style={s.placeholderContainer}>
          {/* آیکون پیش‌فرض */}
          <Icon name={defaultIcon} size={iconSize} color={colors.primary} />
          {/* حرف اول نام (اگر موجود باشد) */}
          {initial ? (
            <Text
              style={[
                s.initial,
                {
                  color: colors.primary,
                  fontSize: fontSize * 0.55,
                },
              ]}
            >
              {initial}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  initial: {
    position: 'absolute',
    bottom: '8%',
    right: '12%',
    fontFamily: 'Vazir-Bold',
  },
});