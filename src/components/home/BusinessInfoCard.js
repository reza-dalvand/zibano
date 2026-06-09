// src/components/business/BusinessInfoCard.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../common/Card';
import Badge from '../common/Badge';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function BusinessInfoCard({ business }) {
  const { colors } = useTheme();

  return (
    <View style={s.infoWrapper}>
      <View style={s.logoAndBadgeRow}>
        <View style={[s.logoWrapper, { borderColor: colors.background }]}>
          <Image source={{ uri: business.logo }} style={s.logoImage} />
        </View>
        {business.VIP && <Badge label="ویژه" variant="primary" size="md" />}
      </View>

      <Text style={[s.bizName, { color: colors.textMain }]}>
        {business.name}
      </Text>

      <View style={s.categoryRow}>
        <Icon name="spa" size={16} color={colors.primary} />
        <Text style={[s.categoryText, { color: colors.primary }]}>
          {business.category}
        </Text>
        <View style={[s.dot, { backgroundColor: colors.border }]} />
        <Icon name="location-on" size={16} color={colors.textSecondary} />
        <Text style={[s.cityText, { color: colors.textSecondary }]}>
          {business.city}
        </Text>
      </View>

      {/* کارت آماری */}
      <Card variant="elevated" padding={16} radius={20} style={s.statsCard}>
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <View style={[s.statIconBox, { backgroundColor: '#FFC10720' }]}>
              <Icon name="star" size={22} color="#FFC107" />
            </View>
            <Text style={[s.statValue, { color: colors.textMain }]}>
              {toPersianDigit(business.rating)}
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              {toPersianDigit(business.reviewsCount)} نظر
            </Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: colors.border }]} />
          <View style={s.statItem}>
            <View style={[s.statIconBox, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="event-available" size={22} color="#4CAF50" />
            </View>
            <Text style={[s.statValue, { color: colors.textMain }]}>
              {toPersianDigit(business.bookingsCount)}+
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              رزرو موفق
            </Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: colors.border }]} />
          <View style={s.statItem}>
            <View style={[s.statIconBox, { backgroundColor: '#2196F320' }]}>
              <Icon name="verified" size={22} color="#2196F3" />
            </View>
            <Text style={[s.statValue, { color: colors.textMain }]}>
              {toPersianDigit(business.experienceYears)} سال
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              سابقه
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  infoWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  logoAndBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 3,
    overflow: 'hidden',
    marginTop: -60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  bizName: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    lineHeight: 30,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  cityText: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
  statsCard: {
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 50,
  },
});