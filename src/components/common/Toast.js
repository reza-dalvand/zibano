// src/components/common/Toast.js

import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';

/**
 * type: 'success' | 'error' | 'warning' | 'info'
 * position: 'top' | 'bottom'
 */
export default function Toast({
  visible,
  message,
  type = 'info',
  position = 'bottom',
  duration = 3000,
  onHide,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const typeMap = {
    success: { bg: '#4CAF50', icon: '✓' },
    error:   { bg: '#E57373', icon: '✕' },
    warning: { bg: '#FF9800', icon: '⚠' },
    info:    { bg: colors.primary, icon: 'ℹ' },
  };

  const { bg, icon } = typeMap[type] ?? typeMap.info;

  useEffect(() => {
    if (!visible) return;

    const dir = position === 'top' ? -20 : 20;
    translateY.setValue(dir);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => onHide?.());
    }, duration);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        s.container,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: bg,
          [position === 'top' ? 'top' : 'bottom']:
            (position === 'top' ? insets.top : insets.bottom) + 16,
        },
      ]}
    >
      <Text style={s.icon}>{icon}</Text>
      <Text style={s.message}>{message}</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  icon: {
    color: '#fff',
    fontSize: 16,
  },
  message: {
    color: '#fff',
    fontFamily: 'Vazir',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
});
