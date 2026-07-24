// src/components/booking/BookingSummaryBar.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../stores/useThemeStore';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = (num) => {
  const n = typeof num === 'number' ? num : parseInt(String(num).replace(/[^0-9]/g, ''), 10) || 0;
  return toPersianDigit(n.toLocaleString('en-US'));
};

export default function BookingSummaryBar({
  originalPrice,
  finalPrice,
  depositAmount,
  discountPercent,
  hasDeposit,
  canConfirm,
  onConfirm,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 12) + 10,
        },
      ]}
    >
      {/* خلاصه قیمت */}
      <View style={s.summaryBox}>
        {discountPercent > 0 && (
          <View style={s.priceRow}>
            <Text style={[s.priceLabel, { color: colors.textSecondary }]}>
              قیمت اصلی
            </Text>
            <Text style={[s.originalPrice, { color: colors.textSecondary }]}>
              {formatPrice(originalPrice)}
            </Text>
          </View>
        )}

        <View style={s.priceRow}>
          <Text style={[s.priceLabel, { color: colors.textMain }]}>
            {hasDeposit ? 'مبلغ کل خدمت' : 'مبلغ قابل پرداخت'}
          </Text>
          <View style={s.finalPriceRow}>
            <Text style={[s.finalPrice, { color: colors.primary }]}>
              {formatPrice(hasDeposit ? finalPrice : depositAmount)}
            </Text>
            <Text style={[s.currencyText, { color: colors.textSecondary }]}>
              تومان
            </Text>
            {discountPercent > 0 && (
              <View style={[s.discountBadge, { backgroundColor: '#4CAF5020' }]}>
                <Icon name="local-offer" size={10} color="#4CAF50" />
                <Text style={[s.discountText, { color: '#4CAF50' }]}>
                  {toPersianDigit(discountPercent)}٪
                </Text>
              </View>
            )}
          </View>
        </View>

        {hasDeposit && (
          <>
            <View style={[s.divider, { backgroundColor: colors.border }]} />
            <View style={s.priceRow}>
              <View style={s.depositLabelRow}>
                <Icon name="account-balance-wallet" size={13} color={colors.primary} />
                <Text style={[s.depositLabel, { color: colors.textMain }]}>
                  بیعانه رزرو
                </Text>
              </View>
              <Text style={[s.depositValue, { color: colors.primary }]}>
                {formatPrice(depositAmount)} <Text style={s.depositCurrency}>تومان</Text>
              </Text>
            </View>
            <Text style={[s.depositHint, { color: colors.textSecondary }]}>
              مابقی مبلغ ({formatPrice(finalPrice - depositAmount)} تومان) در محل پرداخت می‌شود
            </Text>
          </>
        )}
      </View>

      {/* دکمه پرداخت */}
      <TouchableOpacity
        style={[
          s.payBtn,
          {
            backgroundColor: canConfirm ? colors.primary : colors.border,
          },
        ]}
        disabled={!canConfirm}
        activeOpacity={0.85}
        onPress={onConfirm}
      >
        <Icon name="lock" size={16} color="#fff" />
        <Text style={s.payBtnText}>
          {hasDeposit ? 'پرداخت بیعانه و ثبت نوبت' : 'پرداخت و ثبت نوبت'}
        </Text>
        <Icon name="arrow-back" size={18} color="#fff" />
      </TouchableOpacity>

      <View style={s.trustRow}>
        <Icon name="verified-user" size={12} color={colors.textSecondary} />
        <Text style={[s.trustText, { color: colors.textSecondary }]}>
          پرداخت امن · امکان لغو تا ۲ ساعت قبل از نوبت
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
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
  },
  summaryBox: {
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
  },
  finalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  finalPrice: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
  },
  currencyText: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 4,
  },
  discountText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  depositLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  depositLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  depositValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  depositCurrency: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  depositHint: {
    fontSize: 10,
    fontFamily: 'Vazir',
    textAlign: 'right',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  trustText: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
});