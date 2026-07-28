// src/components/home/BusinessInfoCard.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Card from '../common/Card';
import StatsCard from '../common/StatsCard';
import { toPersianDigit } from '../../utils/numberUtils';

export default function BusinessInfoCard({ business }) {
  const { colors } = useTheme();
  const memberSince = business.memberSince || '۲ سال';

  return (
    <View style={s.infoWrapper}>
      <View style={s.logoAndBadgeRow}>
        <View style={[s.logoWrapper, { borderColor: colors.background }]}>
          <Image source={{ uri: business.logo }} style={s.logoImage} />
        </View>
      </View>

      <Text style={[s.bizName, { color: colors.textMain }]}>{business.name}</Text>

      {business.ownerName && (
        <View style={s.ownerRow}>
          <View style={[s.ownerIconBox, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="person" size={14} color={colors.primary} />
          </View>
          <Text style={[s.ownerLabel, { color: colors.textSecondary }]}>مدیریت:</Text>
          <Text style={[s.ownerName, { color: colors.textMain }]}>{business.ownerName}</Text>
          {business.ownerVerified && (
            <View style={[s.verifiedBadge, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="verified" size={10} color="#4CAF50" />
              <Text style={[s.verifiedText, { color: '#4CAF50' }]}>تایید شده</Text>
            </View>
          )}
        </View>
      )}

      <View style={s.categoryRow}>
        <Icon name="spa" size={16} color={colors.primary} />
        <Text style={[s.categoryText, { color: colors.primary }]}>{business.category}</Text>
        <View style={[s.dot, { backgroundColor: colors.border }]} />
        <Icon name="location-on" size={16} color={colors.textSecondary} />
        <Text style={[s.cityText, { color: colors.textSecondary }]}>{business.city}</Text>
      </View>

      {/* 🎯 استفاده از StatsCard مشترک */}
      <Card variant="elevated" padding={16} radius={20} style={s.statsCard}>
        <View style={s.statsRow}>
          <StatsCard
            icon="star"
            label="امتیاز"
            value={toPersianDigit(business.rating)}
            subtitle={`${toPersianDigit(business.reviewsCount)} نظر`}
            color="#FFC107"
            variant="compact"
          />
          <View style={[s.statDivider, { backgroundColor: colors.border }]} />
          <StatsCard
            icon="spa"
            label="خدمات"
            value={toPersianDigit(business.servicesCount || 0)}
            subtitle="فعال"
            color="#4CAF50"
            variant="compact"
          />
          <View style={[s.statDivider, { backgroundColor: colors.border }]} />
          <StatsCard
            icon="workspace-premium"
            label="عضویت"
            value={memberSince}
            subtitle="در زیبانو"
            color="#2196F3"
            variant="compact"
          />
        </View>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  infoWrapper: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  logoAndBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  logoWrapper: {
    width: 92, height: 92, borderRadius: 26, borderWidth: 4, overflow: 'hidden',
    marginTop: -70,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 8,
  },
  logoImage: { width: '100%', height: '100%' },
  bizName: { fontSize: 22, fontFamily: 'Vazir-Bold', lineHeight: 30, marginBottom: 8, marginTop: '4%' },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  ownerIconBox: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  ownerLabel: { fontSize: 12, fontFamily: 'Vazir' },
  ownerName: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  verifiedText: { fontSize: 9, fontFamily: 'Vazir-Bold' },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  categoryText: { fontSize: 13, fontFamily: 'Vazir-Medium' },
  dot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 2 },
  cityText: { fontSize: 13, fontFamily: 'Vazir' },
  statsCard: { marginTop: 8 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statDivider: { width: 1, height: 50 },
});