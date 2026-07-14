// src/components/home/LineRentalCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

const COLLAB_META = {
  percent: { label: 'درصدی', icon: 'pie-chart', color: '#9C27B0' },
  fixed: { label: 'اجاره ثابت', icon: 'attach-money', color: '#2196F3' },
  hourly: { label: 'ساعتی', icon: 'schedule', color: '#FF9800' },
};

export default function LineRentalCard({ ad, onPress }) {
  const { colors } = useTheme();
  const meta = COLLAB_META[ad.collabType] || COLLAB_META.percent;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(ad)}
      style={[
        s.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
    >
      <View style={s.imageContainer}>
        <Image source={{ uri: ad.lineImage }} style={s.image} />
        <View style={s.imageGradient} />

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
      </View>

      <View style={s.content}>
        <Text style={[s.title, { color: colors.textMain }]} numberOfLines={2}>
          {ad.title}
        </Text>

        <View style={s.businessRow}>
          <Icon name="store" size={12} color={colors.primary} />
          <Text style={[s.businessName, { color: colors.primary }]} numberOfLines={1}>
            {ad.businessName}
          </Text>
        </View>

        <View
          style={[
            s.collabBadge,
            {
              backgroundColor: meta.color + '18',
              borderColor: meta.color + '40',
            },
          ]}
        >
          <Icon name={meta.icon} size={12} color={meta.color} />
          <Text style={[s.collabText, { color: meta.color }]}>
            همکاری {meta.label}
          </Text>
        </View>

        <View style={s.metaRow}>
          <Icon name="location-on" size={12} color={colors.textSecondary} />
          <Text style={[s.metaText, { color: colors.textSecondary }]}>
            {ad.city}
          </Text>
        </View>

        {/* 🎯 دکمه تمام عرض "توضیحات بیشتر و تماس" */}
        <View style={[s.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[s.fullWidthBtn, { backgroundColor: colors.primary }]}
            onPress={() => onPress?.(ad)}
            activeOpacity={0.85}
          >
            <Icon name="description" size={15} color="#fff" />
            <Text style={s.fullWidthBtnText}>توضیحات بیشتر و تماس</Text>
            <Icon name="call" size={15} color="#fff" />
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
    height: 130,
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
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  serviceBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  serviceBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  content: {
    padding: 12,
    gap: 8,
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
  collabBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  collabText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
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
    paddingTop: 10,
    borderTopWidth: 1,
    marginTop: 4,
  },
  // 🎯 دکمه تمام عرض جدید
  fullWidthBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fullWidthBtnText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    letterSpacing: 0.2,
  },
});