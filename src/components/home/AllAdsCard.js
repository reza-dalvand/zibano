// src/components/home/AllAdsCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function AllAdsCard({ ad, onPress }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(ad)}
      style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      {/* تصویر */}
      <View style={s.imageContainer}>
        <Image source={{ uri: ad.imageUrl }} style={s.image} />
        <View style={s.imageGradient} />

        {/* Badge بالای تصویر */}
        {ad.badge && (
          <View style={[s.badge, { backgroundColor: '#E53935' }]}>
            <Icon name="local-fire-department" size={11} color="#fff" />
            <Text style={s.badgeText}>{ad.badge}</Text>
          </View>
        )}

        {/* دکمه ذخیره */}
        <TouchableOpacity style={s.saveBtn} activeOpacity={0.7}>
          <Icon name="bookmark-border" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* محتوا */}
      <View style={s.content}>
        <Text style={[s.title, { color: colors.textMain }]} numberOfLines={2}>
          {ad.title}
        </Text>

        {ad.subtitle && (
          <Text style={[s.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {ad.subtitle}
          </Text>
        )}

        {/* اطلاعات تکمیلی */}
        <View style={s.metaRow}>
          <View style={[s.metaItem, { backgroundColor: colors.background }]}>
            <Icon name="store" size={13} color={colors.primary} />
            <Text style={[s.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
              {ad.businessName || 'سالن زیبایی'}
            </Text>
          </View>

          <View style={[s.metaItem, { backgroundColor: colors.background }]}>
            <Icon name="location-on" size={13} color="#E53935" />
            <Text style={[s.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
              {ad.city || 'تهران'}
            </Text>
          </View>
        </View>

        {/* دکمه رزرو */}
        <TouchableOpacity
          style={[s.bookBtn, { backgroundColor: '#43A047' }]}
          activeOpacity={0.85}
          onPress={() => onPress?.(ad)}
        >
          <Icon name="event-available" size={16} color="#fff" />
          <Text style={s.bookBtnText}>رزرو نوبت با تخفیف ویژه</Text>
          <Icon name="arrow-back" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  badge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  saveBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    lineHeight: 23,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  metaText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 6,
    paddingHorizontal: 16, // ✅ اضافه شد: فاصله از طرفین برای جلوگیری از چسبیدن آیکون‌ها
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  bookBtnText: {
    textAlign: 'justify',
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',
  },
});