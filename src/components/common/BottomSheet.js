// src/components/common/BottomSheet.js
import React, { useEffect, useRef } from 'react';
import {
  Animated, Modal, TouchableWithoutFeedback, View, Text, StyleSheet,
  PanResponder, useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';

export default function BottomSheet({
  visible, onClose, title, children, footer, snapPoint = 0.8, style,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  
  // ✅ محاسبه دقیق: از ۲۰٪ بالای صفحه شروع می‌شود (اگر snapPoint=0.8 باشد)
  const topOffset = windowHeight * (1 - snapPoint);
  
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const open = () => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 4 }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: windowHeight, duration: 250, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => onClose?.());
  };

  useEffect(() => { if (visible) open(); }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => { if (gs.dy > 0) translateY.setValue(gs.dy); },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > windowHeight * 0.2) close();
        else Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={close} animationType="none" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={close}>
        <Animated.View style={[s.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>
      
      <Animated.View
        style={[
          s.sheet,
          {
            top: topOffset, // ✅ شروع از ۲۰٪ بالای صفحه
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateY }],
          },
          style,
        ]}
      >
        <View {...panResponder.panHandlers} style={s.handleArea}>
          <View style={[s.handle, { backgroundColor: colors.border }]} />
        </View>
        
        {title && (
          <Text style={[s.title, { color: colors.textMain, borderBottomColor: colors.border }]}>
            {title}
          </Text>
        )}
        
        <View style={s.content}>{children}</View>
        
        {footer && (
          <View style={[s.footer, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
            {footer}
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    overflow: 'hidden',
  },
  handleArea: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  title: {
    fontFamily: 'Vazir-Bold', fontSize: 16, textAlign: 'center',
    paddingVertical: 12, borderBottomWidth: 1, marginHorizontal: 20,
  },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  footer: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderTopWidth: 1,
  },
});