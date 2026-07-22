// src/components/common/Avatar.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

  const iconSizes = {
    xs: 16,
    sm: 20,
    md: 28,
    lg: 36,
    xl: 50,
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

  const initials = name ? name.trim().charAt(0).toUpperCase() : null;

  return (
    <View
      style={[
        s.wrapper,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: colors.primary + '20',
          borderColor: showBorder ? colors.primary : colors.border,
          borderWidth: showBorder ? 2 : 1,
        },
        style,
      ]}
    >
      {uri ? (
        // overflow hidden فقط روی image wrapper گذاشته میشه نه کل View
        <View style={[s.imageWrapper, { borderRadius: dim / 2 }]}>
          <Image
            source={{ uri }}
            style={s.image}
            resizeMode="cover"
          />
        </View>
      ) : initials ? (
        <Text
          style={[
            s.initialsText,
            { color: colors.primary, fontSize },
          ]}
        >
          {initials}
        </Text>
      ) : (
        <Icon name="person" size={iconSize} color={colors.primary} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // overflow: 'hidden' اینجا نیست — آیکون clip نمیشه
  },
  imageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden', // فقط برای image
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialsText: {
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
    includeFontPadding: false,
  },
});