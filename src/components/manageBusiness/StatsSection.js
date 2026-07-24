// src/components/manager/StatsSection.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Card from '../common/Card';

const formatNumber = (num) => num.toLocaleString('fa-IR');

export default function StatsSection({ stats }) {
  const { colors } = useTheme();

  return (
    <View style={s.statsSection}>
      {/* ردیف بالا: دو کارت */}
      <View style={s.statsGrid}>
        {/* نوبت‌های انجام شده */}
        <Card variant="elevated" padding={16} radius={16} style={s.statCard}>
          <View style={[s.statIconWrapper, { backgroundColor: '#667eea20' }]}>
            <Icon name="event-available" size={24} color="#667eea" />
          </View>
          <Text style={[s.statValue, { color: colors.textMain }]}>
            {formatNumber(stats.completedToday)}
          </Text>
          <Text style={[s.statLabel, { color: colors.textSecondary }]}>
            انجام شده امروز
          </Text>
        </Card>

        {/* درآمد ماهانه */}
        <Card variant="elevated" padding={16} radius={16} style={s.statCard}>
          <View style={[s.statIconWrapper, { backgroundColor: '#43e97b20' }]}>
            <Icon name="trending-up" size={24} color="#43e97b" />
          </View>
          <Text style={[s.statValue, { color: colors.textMain }]}>
            {(stats.revenue / 1000000).toFixed(1)}M
          </Text>
          <Text style={[s.statLabel, { color: colors.textSecondary }]}>
            درآمد ماهانه
          </Text>
        </Card>
      </View>

      {/* کارت آمار کلی */}
      <Card variant="elevated" padding={16} radius={16} style={s.overallStatsCard}>
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={[s.statItemValue, { color: colors.primary }]}>
              {formatNumber(stats.bookings)}
            </Text>
            <Text style={[s.statItemLabel, { color: colors.textSecondary }]}>
              رزرو این ماه
            </Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: colors.border }]} />
          <View style={s.statItem}>
            <Text style={[s.statItemValue, { color: colors.primary }]}>
              {formatNumber(stats.customers)}
            </Text>
            <Text style={[s.statItemLabel, { color: colors.textSecondary }]}>
              مشتری فعال
            </Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: colors.border }]} />
          <View style={s.statItem}>
            <View style={s.ratingContainer}>
              <Icon name="star" size={18} color="#FFD700" />
              <Text style={[s.statItemValue, { color: colors.primary }]}>
                {stats.rating}
              </Text>
            </View>
            <Text style={[s.statItemLabel, { color: colors.textSecondary }]}>
              امتیاز کل
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  overallStatsCard: {},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statItemValue: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
  },
  statItemLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});