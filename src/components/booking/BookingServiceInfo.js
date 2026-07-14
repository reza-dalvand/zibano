// src/components/booking/BookingServiceInfo.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = (num) =>
  `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

export default function BookingServiceInfo({ service }) {
  const { colors } = useTheme();
  const [showDescription, setShowDescription] = useState(false);

  const originalPrice = service.originalPrice || service.price || 0;
  const discountPercent = service.discount || 0;
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const hasDeposit = service.hasDeposit || false;
  const depositPercent = service.depositPercent || 30;
  const depositAmount = hasDeposit
    ? Math.round((finalPrice * depositPercent) / 100)
    : finalPrice;
  const remainingAmount = finalPrice - depositAmount;

  return (
    <View style={s.container}>
      {/* کارت اطلاعات خدمت */}
      <View
        style={[
          s.serviceCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        {/* هدر خدمت */}
        <View style={s.serviceHeader}>
          <View
            style={[s.serviceIconBox, { backgroundColor: colors.primary + '15' }]}
          >
            <Icon name="spa" size={24} color={colors.primary} />
          </View>
          <View style={s.serviceInfo}>
            <Text
              style={[s.serviceName, { color: colors.textMain }]}
              numberOfLines={2}
            >
              {service.name}
            </Text>
            <Text
              style={[s.serviceBusiness, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {service.businessName || 'کسب‌وکار'}
            </Text>
          </View>
        </View>

        {/* ردیف قیمت */}
        <View style={[s.priceSection, { borderTopColor: colors.border }]}>
          {discountPercent > 0 && (
            <View style={s.priceRow}>
              <Text style={[s.priceLabel, { color: colors.textSecondary }]}>
                قیمت اصلی
              </Text>
              <Text
                style={[
                  s.originalPriceText,
                  { color: colors.textSecondary },
                ]}
              >
                {formatPrice(originalPrice)}
              </Text>
            </View>
          )}

          <View style={s.priceRow}>
            <Text style={[s.priceLabel, { color: colors.textMain }]}>
              قیمت نهایی
            </Text>
            <View style={s.finalPriceRow}>
              <Text style={[s.finalPrice, { color: colors.primary }]}>
                {formatPrice(finalPrice)}
              </Text>
              {discountPercent > 0 && (
                <View style={s.discountBadge}>
                  <Icon name="local-offer" size={10} color="#fff" />
                  <Text style={s.discountText}>
                    {toPersianDigit(discountPercent)}٪
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* بخش بیعانه */}
        {hasDeposit && (
          <View style={[s.depositSection, { borderTopColor: colors.border }]}>
            {/* بیعانه قابل پرداخت */}
            <View
              style={[
                s.depositPayBox,
                {
                  backgroundColor: colors.primary + '08',
                  borderColor: colors.primary + '30',
                },
              ]}
            >
              <View style={s.depositPayLeft}>
                <View
                  style={[
                    s.depositIconCircle,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Icon name="account-balance-wallet" size={16} color="#fff" />
                </View>
                <View style={s.depositInfo}>
                  <Text
                    style={[s.depositPayLabel, { color: colors.textSecondary }]}
                  >
                    مبلغ قابل پرداخت (بیعانه)
                  </Text>
                  <Text
                    style={[s.depositPayValue, { color: colors.primary }]}
                  >
                    {formatPrice(depositAmount)}
                  </Text>
                </View>
              </View>
              <Icon name="arrow-back" size={20} color={colors.primary} />
            </View>

            {/* باقیمانده در محل */}
            {remainingAmount > 0 && (
              <View style={s.remainingRow}>
                <Icon name="store" size={14} color="#2196F3" />
                <Text
                  style={[s.remainingLabel, { color: colors.textSecondary }]}
                >
                  باقیمانده در محل:
                </Text>
                <Text style={[s.remainingValue, { color: '#2196F3' }]}>
                  {formatPrice(remainingAmount)}
                </Text>
              </View>
            )}

            {/* نکته توضیحی */}
            <View
              style={[
                s.depositHintBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Icon name="info-outline" size={13} color={colors.textSecondary} />
              <Text
                style={[s.depositHintText, { color: colors.textSecondary }]}
              >
                پس از پرداخت بیعانه، نوبت شما تایید و رزرو می‌شود. باقیمانده
                مبلغ پس از انجام خدمت در سالن پرداخت می‌شود.
              </Text>
            </View>
          </View>
        )}

        {/* توضیحات خدمت */}
        {service.description && (
          <View style={[s.descriptionSection, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => setShowDescription(!showDescription)}
              style={s.descriptionToggle}
              activeOpacity={0.7}
            >
              <Icon name="description" size={16} color={colors.primary} />
              <Text style={[s.descriptionToggleText, { color: colors.primary }]}>
                توضیحات خدمت
              </Text>
              <Icon
                name={showDescription ? 'expand-less' : 'expand-more'}
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>

            {showDescription && (
              <View
                style={[
                  s.descriptionBox,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text
                  style={[s.descriptionText, { color: colors.textSecondary }]}
                >
                  {service.description}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: 12,
  },
  serviceCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  serviceIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: {
    flex: 1,
    gap: 3,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    lineHeight: 22,
  },
  serviceBusiness: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  priceSection: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
  originalPriceText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
  },
  finalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  finalPrice: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  depositSection: {
    padding: 16,
    borderTopWidth: 1,
    gap: 10,
  },
  depositPayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  depositPayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  depositIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositInfo: {
    flex: 1,
    gap: 3,
  },
  depositPayLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  depositPayValue: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  remainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  remainingLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
  remainingValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  depositHintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  depositHintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 18,
  },
  descriptionSection: {
    borderTopWidth: 1,
  },
  descriptionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  descriptionToggleText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  descriptionBox: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  },
  descriptionText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 21,
    textAlign: 'justify',
  },
});