// src/components/common/Button.js

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/**
 * variant: 'primary' | 'secondary' | 'outline' | 'ghost'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) {
  const { colors } = useTheme();

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
    md: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
    lg: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 14 },
  };

  const textSizes = {
    sm: 13,
    md: 15,
    lg: 16,
  };

  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };

  const variantTextColors = {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    outline: colors.primary,
    ghost: colors.primary,
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        s.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && s.fullWidth,
        isDisabled && s.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantTextColors[variant]}
        />
      ) : (
        <View style={s.row}>
          {icon && iconPosition === 'left' && (
            <View style={s.iconLeft}>{icon}</View>
          )}
          <Text
            style={[
              s.text,
              {
                color: variantTextColors[variant],
                fontSize: textSizes[size],
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={s.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Vazir-Medium',
    textAlign: 'center',
  },
  iconLeft: {
    marginLeft: 8,
  },
  iconRight: {
    marginRight: 8,
  },
});
