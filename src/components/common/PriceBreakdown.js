// src/components/common/PriceBreakdown.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Card from './Card';
import Divider from './Divider';
import { toPersianDigit, formatPrice } from '../../utils/numberUtils';

/**
 * کامپوننت مشترک نمایش خلاصه قیمت
 *
 * Props:
 * - originalPrice: قیمت اصلی
 * - discountPercent: درصد تخفیف (اختیاری)
 * - finalPrice: قیمت نهایی (اختیاری - محاسبه می‌شود اگر داده نشود)
 * - hasDeposit: آیا بیعانه دارد؟
 * - depositPercent: درصد بیعانه (پیش‌فرض 30)
 * - depositAmount: مبلغ بیعانه (اختیاری - محاسبه می‌شود)
 * - showRemaining: نمایش باقیمانده در سالن
 * - variant: 'card' | 'inline' | 'detailed'
 */
export default function PriceBreakdown({
  originalPrice = 0,
  discountPercent = 0,
  finalPrice,
  hasDeposit = false,
  depositPercent = 30,
  depositAmount,
  showRemaining = true,
  variant = 'card',
}) {
  const { colors } = useTheme();

  // محاسبات
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const calculatedFinal = Math.max(0, originalPrice - discountAmount);
  const actualFinal = finalPrice ?? calculatedFinal;
  const calculatedDeposit = hasDeposit
    ? Math.round((actualFinal * depositPercent) / 100)
    : actualFinal;
  const actualDeposit = depositAmount ?? calculatedDeposit;
  const remaining = actualFinal - actualDeposit;

  // ═══════ حالت inline (فشرده) ═══════
  if (variant === 'inline') {
    return (
      <View style={s.inlineContainer}>
        <View style={s.inlineMain}>
          {discountPercent > 0 && (
            <Text style={[s.inlineOriginal, { color: colors.textSecondary }]}>
              {formatPrice(originalPrice)}
            </Text>
          )}
          <Text style={[s.inlineFinal, { color: colors.primary }]}>
            {formatPrice(actualDeposit)}
          </Text>
          {discountPercent > 0 && (
            <View style={[s.inlineDiscountBadge, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="local-offer" size={10} color="#4CAF50" />
              <Text style={[s.inlineDiscountText, { color: '#4CAF50' }]}>
                {toPersianDigit(discountPercent)}٪
              </Text>
            </View>
          )}
        </View>
        {hasDeposit && showRemaining && remaining > 0 && (
          <Text style={[s.inlineRemaining, { color: colors.textSecondary }]}>
            + {formatPrice(remaining)} در سالن
          </Text>
        )}
      </View>
    );
  }

  // ═══════ حالت detailed (همراه قوانین) ═══════
  if (variant === 'detailed') {
    return (
      <Card variant="default" padding={16} radius={18} style={s.detailedCard}>
        {/* هدر */}
        <View style={s.detailedHeader}>
          <View style={[s.detailedIconBox, { backgroundColor: '#43A04715' }]}>
            <Icon name="account-balance-wallet" size={20} color="#43A047" />
          </View>
          <Text style={[s.detailedTitle, { color: colors.textMain }]}>
            خلاصه پرداخت
          </Text>
        </View>

        {/* قیمت اصلی */}
        <View style={s.detailedRow}>
          <View style={s.detailedLabelRow}>
            <Icon name="receipt-long" size={14} color={colors.textSecondary} />
            <Text style={[s.detailedLabel, { color: colors.textSecondary }]}>
              قیمت اصلی خدمت
            </Text>
          </View>
          <Text style={[s.detailedValue, { color: colors.textMain }]}>
            {formatPrice(originalPrice)}
          </Text>
        </View>

        {/* تخفیف */}
        {discountPercent > 0 && (
          <View style={s.detailedRow}>
            <View style={s.detailedLabelRow}>
              <Icon name="local-offer" size={14} color="#43A047" />
              <Text style={[s.detailedLabel, { color: colors.textSecondary }]}>
                تخفیف ({toPersianDigit(discountPercent)}٪)
              </Text>
            </View>
            <Text style={[s.detailedDiscountValue, { color: '#43A047' }]}>
              - {formatPrice(discountAmount)}
            </Text>
          </View>
        )}

        <Divider spacing={8} />

        {/* قیمت نهایی */}
        <View style={s.detailedRow}>
          <View style={s.detailedLabelRow}>
            <Icon name="calculate" size={14} color={colors.textMain} />
            <Text style={[s.detailedLabelBold, { color: colors.textMain }]}>
              قیمت نهایی خدمت
            </Text>
          </View>
          <Text style={[s.detailedValueBold, { color: colors.textMain }]}>
            {formatPrice(actualFinal)}
          </Text>
        </View>

        {/* بیعانه */}
        {hasDeposit && (
          <View
            style={[
              s.detailedDepositBox,
              {
                backgroundColor: colors.primary + '10',
                borderColor: colors.primary + '35',
              },
            ]}
          >
            <View style={s.detailedDepositLeft}>
              <View style={[s.detailedDepositIcon, { backgroundColor: colors.primary }]}>
                <Icon name="payments" size={14} color="#fff" />
              </View>
              <View>
                <Text style={[s.detailedDepositLabel, { color: colors.textSecondary }]}>
                  مبلغ بیعانه (پرداخت آنلاین)
                </Text>
                <Text style={[s.detailedDepositValue, { color: colors.primary }]}>
                  {formatPrice(actualDeposit)} تومان
                </Text>
              </View>
            </View>
            <Icon name="arrow-back" size={20} color={colors.primary} />
          </View>
        )}

        {/* مابقی مبلغ */}
        {hasDeposit && remaining > 0 && (
          <View
            style={[
              s.detailedRemainingBox,
              { backgroundColor: '#2196F308', borderColor: '#2196F330' },
            ]}
          >
            <View style={s.detailedRemainingLeft}>
              <Icon name="store" size={18} color="#2196F3" />
              <View>
                <Text style={[s.detailedRemainingLabel, { color: colors.textSecondary }]}>
                  مابقی مبلغ (پرداخت در سالن)
                </Text>
                <Text style={[s.detailedRemainingValue, { color: '#2196F3' }]}>
                  {formatPrice(remaining)} تومان
                </Text>
              </View>
            </View>
          </View>
        )}
      </Card>
    );
  }

  // ═══════ حالت card (پیش‌فرض) ═══════
  return (
    <Card variant="elevated" padding={14} radius={16} style={s.cardContainer}>
      {discountPercent > 0 && (
        <View style={s.cardRow}>
          <Text style={[s.cardLabel, { color: colors.textSecondary }]}>
            قیمت اصلی
          </Text>
          <Text style={[s.cardOriginal, { color: colors.textSecondary }]}>
            {formatPrice(originalPrice)}
          </Text>
        </View>
      )}

      <View style={s.cardRow}>
        <Text style={[s.cardLabelBold, { color: colors.textMain }]}>
          {hasDeposit ? 'مبلغ کل خدمت' : 'مبلغ قابل پرداخت'}
        </Text>
        <View style={s.cardFinalRow}>
          <Text style={[s.cardFinal, { color: colors.primary }]}>
            {formatPrice(hasDeposit ? actualFinal : actualDeposit)}
          </Text>
          <Text style={[s.cardCurrency, { color: colors.textSecondary }]}>
            تومان
          </Text>
          {discountPercent > 0 && (
            <View style={[s.cardDiscountBadge, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="local-offer" size={10} color="#4CAF50" />
              <Text style={[s.cardDiscountText, { color: '#4CAF50' }]}>
                {toPersianDigit(discountPercent)}٪
              </Text>
            </View>
          )}
        </View>
      </View>

      {hasDeposit && (
        <>
          <Divider spacing={6} />
          <View style={s.cardRow}>
            <View style={s.cardDepositLabelRow}>
              <Icon name="account-balance-wallet" size={13} color={colors.primary} />
              <Text style={[s.cardDepositLabel, { color: colors.textMain }]}>
                بیعانه رزرو
              </Text>
            </View>
            <Text style={[s.cardDepositValue, { color: colors.primary }]}>
              {formatPrice(actualDeposit)} <Text style={s.cardCurrency}>تومان</Text>
            </Text>
          </View>
          {showRemaining && remaining > 0 && (
            <Text style={[s.cardRemainingHint, { color: colors.textSecondary }]}>
              مابقی ({formatPrice(remaining)} تومان) در محل پرداخت می‌شود
            </Text>
          )}
        </>
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  // ═══════ Inline ═══════
  inlineContainer: {
    gap: 2,
  },
  inlineMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inlineOriginal: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
  },
  inlineFinal: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  inlineDiscountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inlineDiscountText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  inlineRemaining: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },

  // ═══════ Card ═══════
  cardContainer: {
    gap: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  cardLabelBold: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  cardOriginal: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
  },
  cardFinalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardFinal: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
  },
  cardCurrency: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  cardDiscountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 4,
  },
  cardDiscountText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  cardDepositLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardDepositLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  cardDepositValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  cardRemainingHint: {
    fontSize: 10,
    fontFamily: 'Vazir',
    textAlign: 'right',
  },

  // ═══════ Detailed ═══════
  detailedCard: {
    gap: 10,
  },
  detailedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  detailedIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailedTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  detailedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  detailedLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailedLabel: {
    fontSize: 12.5,
    fontFamily: 'Vazir',
  },
  detailedLabelBold: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  detailedValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  detailedValueBold: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  detailedDiscountValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  detailedDepositBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  detailedDepositLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  detailedDepositIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailedDepositLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  detailedDepositValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginTop: 2,
  },
  detailedRemainingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  detailedRemainingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  detailedRemainingLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  detailedRemainingValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginTop: 2,
  },
});