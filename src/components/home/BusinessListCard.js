// src/components/home/BusinessListCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function BusinessListCard({ business, categoryIcon, onPress }) {
  const { colors } = useTheme();
  const hasDiscount = business.discount > 0;

  return (
    <TouchableOpacity
      style={[
        s.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* 🎯 ردیف بالا: آیکون یکسان + اطلاعات + امتیاز */}
      <View style={s.header}>
        {/* 🎨 آیکون یکسان برای همه کارت‌ها */}
        <View style={[s.iconBox, { backgroundColor: colors.primary + '15' }]}>
          <Icon name={categoryIcon || 'spa'} size={28} color={colors.primary} />
        </View>

        <View style={s.info}>
          {/* عنوان اصلی: نوع خدمت */}
          <Text
            style={[s.serviceType, { color: colors.textMain }]}
            numberOfLines={1}
          >
            {business.serviceType}
          </Text>
          {/* زیرعنوان: نام کسب‌وکار - ✅ رنگ یکسان */}
          <View style={s.businessRow}>
            <Icon name="store" size={11} color={colors.textSecondary} />
            <Text
              style={[s.name, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {business.name}
            </Text>
          </View>
          <Text
            style={[s.category, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {business.category}
          </Text>
        </View>

        {/* ⭐ امتیاز در بالا-چپ */}
        <View style={[s.ratingBox, { backgroundColor: '#FFC10715' }]}>
          <Icon name="star" size={14} color="#FFC107" />
          <Text style={[s.ratingText, { color: colors.textMain }]}>
            {business.rating}
          </Text>
        </View>
      </View>

      {/* 🏷️ تگ تخفیف + آدرس */}
      <View style={s.metaSection}>
        {hasDiscount && (
          <View style={s.discountBadge}>
            <Icon name="local-offer" size={10} color="#fff" />
            <Text style={s.discountText}>
              {toPersianDigit(business.discount)}٪
            </Text>
          </View>
        )}
        <View style={s.addressRow}>
          <Icon name="location-on" size={14} color={colors.textSecondary} />
          <Text
            style={[s.address, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {business.address}
          </Text>
        </View>
      </View>

      {/* 🎯 دکمه سبز تمام‌عرض */}
      <View style={[s.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={s.bookBtn}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Icon name="event-available" size={16} color="#fff" />
          <Text style={s.bookBtnText}>رزرو و دیدن نمونه‌کارها</Text>
          <Icon name="arrow-back" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  // 🎨 آیکون یکسان
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  serviceType: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    lineHeight: 21,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  category: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  // ⭐ امتیاز بالا
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  // متا
  metaSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  address: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
  // فوتر
  footer: {
    paddingTop: 10,
    borderTopWidth: 1,
  },
  // 🎯 دکمه سبز تمام‌عرض
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#43A047',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
});