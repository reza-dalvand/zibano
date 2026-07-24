// src/components/home/AllModelRequestsCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const COST_TYPE_META = {
  paid: { label: 'با هزینه', icon: 'attach-money', color: '#2196F3' },
  material_cost: { label: 'با هزینه مواد', icon: 'science', color: '#FF9800' },
  free: { label: 'رایگان', icon: 'redeem', color: '#4CAF50' },
};

export default function AllModelRequestsCard({ request, onPress }) {
  const { colors } = useTheme();
  const costMeta = COST_TYPE_META[request.costType] || COST_TYPE_META.material_cost;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(request)}
      style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      {/* تصویر */}
      <View style={s.imageContainer}>
        <Image source={{ uri: request.serviceImage }} style={s.image} />
        <View style={s.imageGradient} />

        {/* Badge نوع هزینه */}
        <View style={[s.costBadge, { backgroundColor: costMeta.color }]}>
          <Icon name={costMeta.icon} size={11} color="#fff" />
          <Text style={s.costBadgeText}>{costMeta.label}</Text>
        </View>

        {/* ❌ Badge تخفیف حذف شد */}

        {/* Badge فوری */}
        {request.isUrgent && (
          <View style={s.urgentBadge}>
            <Icon name="flash-on" size={10} color="#fff" />
            <Text style={s.urgentText}>فوری</Text>
          </View>
        )}
      </View>

      {/* محتوا */}
      <View style={s.content}>
        <Text style={[s.title, { color: colors.textMain }]} numberOfLines={2}>
          {request.title}
        </Text>

        {/* اطلاعات کسب‌وکار */}
        <View style={s.businessRow}>
          <Icon name="store" size={12} color={colors.primary} />
          <Text style={[s.businessName, { color: colors.primary }]} numberOfLines={1}>
            {request.businessName}
          </Text>
        </View>

        {/* متا */}
        <View style={s.metaRow}>
          <View style={[s.metaItem, { backgroundColor: colors.background }]}>
            <Icon name="location-on" size={12} color="#E53935" />
            <Text style={[s.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
              {request.city}
            </Text>
          </View>

          <View style={[s.metaItem, { backgroundColor: colors.background }]}>
            <Icon name="schedule" size={12} color="#2196F3" />
            <Text style={[s.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
              {request.serviceName}
            </Text>
          </View>
        </View>

        {/* دکمه مشاهده جزئیات */}
        <TouchableOpacity
          style={[s.detailsBtn, { backgroundColor: '#E91E63' }]}
          activeOpacity={0.85}
          onPress={() => onPress?.(request)}
        >
          <Icon name="description" size={15} color="#fff" />
          <Text style={s.detailsBtnText}>مشاهده جزئیات و تماس</Text>
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
  costBadge: {
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
  costBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  // ❌ discountBadge و discountText حذف شدند
  urgentBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,152,0,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  urgentText: {
    color: '#fff',
    fontSize: 10,
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
  metaText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal:16,
    borderRadius: 14,
    marginTop: 6,
    shadowColor: '#E91E63',
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