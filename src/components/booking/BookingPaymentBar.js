// src/components/booking/BookingPaymentBar.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = (num) =>
  `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

export default function BookingPaymentBar({
  service,
  canConfirm,
  onConfirm,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const originalPrice = service.originalPrice || service.price || 0;
  const discountPercent = service.discount || 0;
  const finalPrice = Math.max(
    0,
    originalPrice - Math.round((originalPrice * discountPercent) / 100)
  );
  const hasDeposit = service.hasDeposit || false;
  const depositPercent = service.depositPercent || 30;
  const depositAmount = hasDeposit
    ? Math.round((finalPrice * depositPercent) / 100)
    : finalPrice;

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 12) + 8,
        },
      ]}
    >
      {/* خلاصه قیمت */}
      <View style={s.summaryRow}>
        <View style={s.summaryLeft}>
          <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>
            {hasDeposit ? 'بیعانه رزرو' : 'مبلغ قابل پرداخت'}
          </Text>
          {discountPercent > 0 && (
            <Text style={[s.originalPrice, { color: colors.textSecondary }]}>
              {formatPrice(originalPrice)}
            </Text>
          )}
        </View>
        <View style={s.summaryRight}>
          <Text style={[s.finalPrice, { color: colors.primary }]}>
            {formatPrice(depositAmount)}
          </Text>
          {discountPercent > 0 && (
            <View style={[s.discountBadge, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="local-offer" size={9} color="#4CAF50" />
              <Text style={[s.discountText, { color: '#4CAF50' }]}>
                {toPersianDigit(discountPercent)}٪
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* دکمه پرداخت */}
      <TouchableOpacity
        onPress={onConfirm}
        disabled={!canConfirm}
        activeOpacity={0.85}
        style={[
          s.payBtn,
          {
            backgroundColor: canConfirm ? '#43A047' : colors.border,
          },
        ]}
      >
        <Icon name="lock" size={16} color="#fff" />
        <Text style={[s.payBtnText, { color: canConfirm ? '#fff' : colors.textSecondary }]}>
          {hasDeposit ? 'پرداخت بیعانه و ثبت نوبت' : 'پرداخت و ثبت نوبت'}
        </Text>
        <Icon name="arrow-back" size={16} color={canConfirm ? '#fff' : colors.textSecondary} />
      </TouchableOpacity>

      {/* خط اعتماد */}
      <View style={s.trustRow}>
        <Icon name="verified-user" size={11} color={colors.textSecondary} />
        <Text style={[s.trustText, { color: colors.textSecondary }]}>
          پرداخت امن · امکان لغو نوبت در صورت رزرو وجود ندارد
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  summaryLeft: {
    gap: 2,
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  originalPrice: {
    fontSize: 10,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
  },
  summaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  finalPrice: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  discountText: {
    fontSize: 9,
    fontFamily: 'Vazir-Bold',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  payBtnText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  trustText: {
    fontSize: 9,
    fontFamily: 'Vazir',
  },
});