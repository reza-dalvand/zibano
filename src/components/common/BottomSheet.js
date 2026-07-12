// src/components/common/BottomSheet.js
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';

export default function BottomSheet({
  visible,
  onClose,
  title,
  children,
  footer,
  snapPoint = 0.8,
  style,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const topOffset = windowHeight * (1 - snapPoint);
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // 🎯 کنترل رندر: فقط وقتی لازمه
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      // ✅ باز کردن: اول render کن، بعد انیمیشن
      setShouldRender(true);
      // یه تاخیر کوتاه تا View mount بشه
      requestAnimationFrame(() => {
        Animated.parallel([
          // ✅ فقط bounciness + speed (بدون tension!)
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
            speed: 16,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else if (shouldRender) {
      // ✅ بستن: انیمیشن، بعد unmount
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: windowHeight,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
        translateY.setValue(windowHeight);
        backdropOpacity.setValue(0);
      });
    }
  }, [visible, windowHeight, translateY, backdropOpacity, shouldRender]);

  const handleClose = () => {
    onClose?.();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > windowHeight * 0.2 || gs.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 6,
            speed: 16,
          }).start();
        }
      },
    })
  ).current;

  // 🎯 اگر نباید رندر بشه، هیچی برنگردون
  if (!shouldRender) return null;

  return (
    <View
      style={[StyleSheet.absoluteFillObject, { zIndex: 9999 }]}
      pointerEvents={visible ? 'auto' : 'box-none'}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={[s.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View
        style={[
          s.sheet,
          {
            top: topOffset,
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            paddingBottom: insets.bottom + 90,
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        <View {...panResponder.panHandlers} style={s.handleArea}>
          <View style={[s.handle, { backgroundColor: colors.border }]} />
        </View>
        {title && (
          <Text
            style={[
              s.title,
              { color: colors.textMain, borderBottomColor: colors.border },
            ]}
          >
            {title}
          </Text>
        )}
        <View style={s.content}>{children}</View>
        {footer && (
          <View
            style={[
              s.footer,
              {
                backgroundColor: colors.cardBackground,
                borderTopColor: colors.border,
              },
            ]}
          >
            {footer}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  title: {
    fontFamily: 'Vazir-Bold',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
});