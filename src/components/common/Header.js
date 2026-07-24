// src/components/common/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../stores/useThemeStore';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Header({
  title,
  options, // 🆕 برای دریافت title از navigator
  navigation, // 🆕 برای goBack خودکار
  route,
  subtitle,
  onBackPress,
  backIcon = null,
  rightAction = null,
  variant = 'default',
  style,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isTransparent = variant === 'transparent';
  
  // 🎯 اولویت: title مستقیم > options.title
  const displayTitle = title || options?.title || route?.name;
  
  // 🎯 اگر onBackPress داده نشده و navigation داریم، به صورت پیش‌فرض goBack کن
  const handleBack = onBackPress || (navigation ? () => navigation.goBack() : null);

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: isTransparent ? 'transparent' : colors.background,
          paddingTop: insets.top,
        },
        !isTransparent && s.shadowEffect,
        !isTransparent && { borderBottomColor: colors.border + '40', shadowColor: colors.textMain },
        style,
      ]}
    >
      {/* سمت راست - دکمه بازگشت */}
      <View style={s.sideSlot}>
        {handleBack && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            style={[
              s.backButton,
              {
                backgroundColor: isTransparent ? 'rgba(255,255,255,0.85)' : colors.cardBackground,
                borderColor: colors.border + '60'
              }
            ]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {backIcon ?? (
              <Icon name="chevron-right" size={24} color={colors.textMain} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* وسط - عنوان */}
      <View style={s.centerSlot}>
        {displayTitle && (
          <Text
            numberOfLines={1}
            style={[s.mainTitle, { color: colors.textMain }]}
          >
            {displayTitle}
          </Text>
        )}
        {subtitle && (
          <Text
            numberOfLines={1}
            style={[s.subTitle, { color: colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* سمت چپ - اکشن سفارشی */}
      <View style={[s.sideSlot, s.leftAlign]}>
        {rightAction ?? <View style={s.emptyPlaceholder} />}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    zIndex: 100,
  },
  shadowEffect: {
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  sideSlot: {
    minWidth: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  leftAlign: {
    alignItems: 'flex-end',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  mainTitle: {
    fontFamily: 'Vazir-Bold',
    fontSize: 17,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: 'Vazir-Medium',
    fontSize: 11,
    marginTop: 3,
    opacity: 0.8,
    textAlign: 'center',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyPlaceholder: {
    width: 42,
    height: 42,
  },
});