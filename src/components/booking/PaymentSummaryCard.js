// src/components/booking/PaymentSummaryCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const parsePrice = (val) => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const eng = val
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    const cleaned = eng.replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
  }
  return 0;
};

export default function PaymentSummaryCard({ service, colors }) {
  const originalPrice = parsePrice(service.originalPrice ?? service.price);
  const discountPercent = parsePrice(service.discount);
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const hasDeposit = service.hasDeposit || false;
  const depositPercent = parsePrice(service.depositPercent) || 30;
  const depositAmount = hasDeposit
    ? Math.round((finalPrice * depositPercent) / 100)
    : finalPrice;
  const remainingAmount = finalPrice - depositAmount;

  const formatP = (num) => toPersianDigit(num.toLocaleString('en-US'));

  return (
    <View style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      {/* هدر */}
      <View style={s.header}>
        <View style={[s.iconBox, { backgroundColor: '#43A04715' }]}>
          <Icon name="account-balance-wallet" size={20} color="#43A047" />
        </View>
        <Text style={[s.title, { color: colors.textMain }]}>
          خلاصه پرداخت
        </Text>
      </View>

      {/* قیمت اصلی */}
      <View style={s.row}>
        <View style={s.labelRow}>
          <Icon name="receipt-long" size={14} color={colors.textSecondary} />
          <Text style={[s.label, { color: colors.textSecondary }]}>
            قیمت اصلی خدمت
          </Text>
        </View>
        <Text style={[s.value, { color: colors.textMain }]}>
          {formatP(originalPrice)}
        </Text>
      </View>

      {/* تخفیف */}
      {discountPercent > 0 && (
        <View style={s.row}>
          <View style={s.labelRow}>
            <Icon name="local-offer" size={14} color="#43A047" />
            <Text style={[s.label, { color: colors.textSecondary }]}>
              تخفیف ({toPersianDigit(discountPercent)}٪)
            </Text>
          </View>
          <Text style={[s.discountValue, { color: '#43A047' }]}>
            - {formatP(discountAmount)}
          </Text>
        </View>
      )}

      {/* خط جداکننده */}
      <View style={[s.divider, { backgroundColor: colors.border }]} />

      {/* قیمت نهایی */}
      <View style={s.row}>
        <View style={s.labelRow}>
          <Icon name="calculate" size={14} color={colors.textMain} />
          <Text style={[s.labelBold, { color: colors.textMain }]}>
            قیمت نهایی خدمت
          </Text>
        </View>
        <Text style={[s.valueBold, { color: colors.textMain }]}>
          {formatP(finalPrice)}
        </Text>
      </View>

      {/* متن قوانین زیر قیمت نهایی */}
      <View style={[s.rulesHint, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
        <Icon name="gavel" size={14} color={colors.primary} />
        <Text style={[s.rulesHintText, { color: colors.primary }]}>
          قوانین پایین صفحه را مطالعه فرمایید
        </Text>
        <Icon name="arrow-downward" size={14} color={colors.primary} />
      </View>

      {/* بیعانه */}
      <View
        style={[
          s.depositBox,
          {
            backgroundColor: colors.primary + '10',
            borderColor: colors.primary + '35',
          },
        ]}
      >
        <View style={s.depositLeft}>
          <View style={[s.depositIcon, { backgroundColor: colors.primary }]}>
            <Icon name="payments" size={14} color="#fff" />
          </View>
          <View>
            <Text style={[s.depositLabel, { color: colors.textSecondary }]}>
              مبلغ بیعانه (پرداخت آنلاین)
            </Text>
            <Text style={[s.depositValue, { color: colors.primary }]}>
              {formatP(depositAmount)} تومان
            </Text>
          </View>
        </View>
        <Icon name="arrow-back" size={20} color={colors.primary} />
      </View>

      {/* مابقی مبلغ */}
      {remainingAmount > 0 && (
        <View style={[s.remainingBox, { backgroundColor: '#2196F308', borderColor: '#2196F330' }]}>
          <View style={s.remainingLeft}>
            <Icon name="store" size={18} color="#2196F3" />
            <View>
              <Text style={[s.remainingLabel, { color: colors.textSecondary }]}>
                مابقی مبلغ (پرداخت در سالن)
              </Text>
              <Text style={[s.remainingValue, { color: '#2196F3' }]}>
                {formatP(remainingAmount)} تومان
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 12.5,
    fontFamily: 'Vazir',
  },
  labelBold: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  value: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  valueBold: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  discountValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  // استایل‌های متن قوانین
  rulesHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  rulesHintText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',
  },
  depositBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  depositLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  depositIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  depositValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginTop: 2,
  },
  remainingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  remainingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  remainingLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  remainingValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginTop: 2,
  },
});