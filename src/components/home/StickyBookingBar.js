// src/components/business/StickyBookingBar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../common/Button';

const formatPrice = (num) => `${num.toLocaleString('fa-IR')} تومان`;

export default function StickyBookingBar({ minPrice, onBookPress }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // 🎯 محاسبه دقیق: فاصله از پایین = insets.bottom + ارتفاع Navbar شناور (حدود ۷۰)
  // این عدد باید دقیقاً با ارتفاع tab bar در AppNavigator هماهنگ باشد
  const NAVBAR_HEIGHT = 80; // ارتفاع تقریبی Navbar شناور
  const bottomOffset = Math.max(insets.bottom, 12) + NAVBAR_HEIGHT;

  return (
    <View
      style={[
        s.bottomBar,
        {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
          bottom: bottomOffset, // 🎯 کلید حل مشکل: فاصله از پایین کافی است
          paddingBottom: 12,
        },
      ]}
    >
      <View style={s.bottomBarInner}>
        <View style={s.bottomBarPrice}>
          <Text style={[s.bottomBarFrom, { color: colors.textSecondary }]}>
            شروع از
          </Text>
          <Text style={[s.bottomBarPriceValue, { color: colors.primary }]}>
            {formatPrice(minPrice)}
          </Text>
        </View>
        <Button
          title="رزرو نوبت"
          onPress={onBookPress}
          variant="primary"
          size="lg"
          icon={<Icon name="event-available" size={20} color="#fff" />}
          iconPosition="right"
          style={s.bottomBarBtn}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingTop: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  bottomBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  bottomBarPrice: {
    flex: 1,
    gap: 2,
  },
  bottomBarFrom: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  bottomBarPriceValue: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  bottomBarBtn: {
    paddingHorizontal: 28,
  },
});