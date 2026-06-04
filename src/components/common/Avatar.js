// src/components/common/Avatar.js

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

/**
 * size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
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

  // اول حرف نام برای حالت placeholder
  const initials = name
    ? name.trim().charAt(0).toUpperCase()
    : '?';

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
          style={[
            s.image,
            { width: dim, height: dim, borderRadius: dim / 2 },
          ]}
          resizeMode="cover"
        />
      ) : (
        <Text
          style={[
            s.initials,
            { color: colors.primary, fontSize },
          ]}
        >
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
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
  initials: {
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
});
