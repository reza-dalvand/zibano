// src/components/home/ModelRequestCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Badge from '../common/Badge';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// 🎯 متادیتای ۳ نوع هزینه
const COST_TYPE_META = {
  paid: {
    label: 'با هزینه',
    icon: 'attach-money',
    color: '#2196F3',
  },
  material_cost: {
    label: 'با هزینه مواد',
    icon: 'science',
    color: '#FF9800',
  },
  free: {
    label: 'رایگان',
    icon: 'redeem',
    color: '#4CAF50',
  },
};

export default function ModelRequestCard({ request, onPress }) {
  const { colors } = useTheme();
  const costMeta = COST_TYPE_META[request.costType] || COST_TYPE_META.material_cost;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(request)}
      style={[
        s.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
    >
      <View style={s.imageContainer}>
        <Image source={{ uri: request.serviceImage }} style={s.image} />
        <View style={s.imageGradient} />

        {/* 🎯 Badge نوع هزینه */}
        <View
          style={[
            s.costBadge,
            { backgroundColor: costMeta.color },
          ]}
        >
          <Icon name={costMeta.icon} size={10} color="#fff" />
          <Text style={s.costBadgeText}>{costMeta.label}</Text>
        </View>

        <View style={s.serviceTypeBox}>
          <Text style={s.serviceTypeText} numberOfLines={1}>
            {request.serviceName}
          </Text>
        </View>
      </View>

      <View style={s.content}>
        <Text style={[s.title, { color: colors.textMain }]} numberOfLines={2}>
          {request.title}
        </Text>
        <View style={s.businessRow}>
          <Icon name="store" size={12} color={colors.primary} />
          <Text
            style={[s.businessName, { color: colors.primary }]}
            numberOfLines={1}
          >
            {request.businessName}
          </Text>
        </View>
        <View style={s.metaRow}>
          <Icon name="location-on" size={12} color={colors.textSecondary} />
          <Text
            style={[s.metaText, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {request.city}
          </Text>
        </View>
        <View style={[s.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[s.detailsBtn, { backgroundColor: colors.primary }]}
            onPress={() => onPress?.(request)}
          >
            <Icon name="description" size={14} color="#fff" />
            <Text style={s.detailsBtnText}>توضیحات و تماس</Text>
            <Icon name="arrow-back" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 140,
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
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  // 🎯 Badge نوع هزینه
  costBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  costBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  serviceTypeBox: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  serviceTypeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  content: {
    padding: 12,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    lineHeight: 20,
    minHeight: 40,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessName: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    fontFamily: 'Vazir',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    marginTop: 4,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  detailsBtnText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});