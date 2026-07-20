// src/components/home/AllLineRentalsCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const COLLAB_META = {
  percent: { label: 'درصدی', icon: 'pie-chart', color: '#9C27B0' },
  fixed: { label: 'اجاره ثابت', icon: 'attach-money', color: '#2196F3' },
  hourly: { label: 'ساعتی', icon: 'schedule', color: '#FF9800' },
};

export default function AllLineRentalsCard({ ad, onPress }) {
  const { colors } = useTheme();
  const meta = COLLAB_META[ad.collabType] || COLLAB_META.percent;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(ad)}
      style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      {/* تصویر */}
      <View style={s.imageContainer}>
        <Image source={{ uri: ad.lineImage }} style={s.image} />
        <View style={s.imageGradient} />

        {/* Badge نوع خدمت */}
        <View
          style={[
            s.serviceBadge,
            { backgroundColor: ad.serviceTypeColor || '#607D8B' },
          ]}
        >
          <Icon name={ad.serviceTypeIcon || 'spa'} size={10} color="#fff" />
          <Text style={s.serviceBadgeText} numberOfLines={1}>
            {ad.serviceTypeName}
          </Text>
        </View>

        {/* Badge نوع همکاری */}
        <View style={[s.collabBadge, { backgroundColor: meta.color }]}>
          <Icon name={meta.icon} size={11} color="#fff" />
          <Text style={s.collabBadgeText}>{meta.label}</Text>
        </View>
      </View>

      {/* محتوا */}
      <View style={s.content}>
        <Text style={[s.title, { color: colors.textMain }]} numberOfLines={2}>
          {ad.title}
        </Text>

        {/* اطلاعات کسب‌وکار */}
        <View style={s.businessRow}>
          <Icon name="store" size={12} color={colors.primary} />
          <Text style={[s.businessName, { color: colors.primary }]} numberOfLines={1}>
            {ad.businessName}
          </Text>
        </View>

        {/* قیمت و شهر */}
        <View style={s.metaRow}>
          <View style={[s.metaItem, { backgroundColor: colors.background }]}>
            <Icon name="location-on" size={12} color="#E53935" />
            <Text style={[s.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
              {ad.city}
            </Text>
          </View>

          <View style={[s.priceItem, { backgroundColor: meta.color + '15' }]}>
            <Icon name={meta.icon} size={12} color={meta.color} />
            <Text style={[s.priceText, { color: meta.color }]} numberOfLines={1}>
              {ad.priceDisplay}
            </Text>
          </View>
        </View>

        {/* دکمه مشاهده جزئیات */}
        <TouchableOpacity
          style={[s.detailsBtn, { backgroundColor: '#667eea' }]}
          activeOpacity={0.85}
          onPress={() => onPress?.(ad)}
        >
          <Icon name="description" size={15} color="#fff" />
          <Text style={s.detailsBtnText}>مشاهده جزیات و تماس</Text>
          <Icon name="arrow-back" size={15} color="#fff" />
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
    height: 180,
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
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  serviceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
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
  serviceBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  collabBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
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
  collabBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
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
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  businessName: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
    flex: 1,
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
  priceItem: {
    flex: 1.2,
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
  priceText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 6,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  detailsBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',
  },
});