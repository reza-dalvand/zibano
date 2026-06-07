// src/components/common/ScreenWrapper.js

import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';

/**
 * scrollable: اگر true، محتوا داخل ScrollView قرار میگیره
 * keyboardAware: اگر true، از KeyboardAvoidingView استفاده میکنه
 */
export default function ScreenWrapper({
  children,
  scrollable = false,
  keyboardAware = false,
  padding = 20,
  bottomInset = 100,
  edges = ['top', 'bottom'],
  style,
  contentStyle,
}) {
  const { colors } = useTheme();

  const inner = scrollable ? (
    <ScrollView
      contentContainerStyle={[
        s.scrollContent,
        {
          padding,
          paddingBottom: padding + bottomInset,
        },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[s.flat, { padding }, contentStyle]}>{children}</View>
  );

  const wrapped = keyboardAware ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.flex}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[s.root, { backgroundColor: colors.background }, style]}
    >
      {wrapped}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  flat: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
