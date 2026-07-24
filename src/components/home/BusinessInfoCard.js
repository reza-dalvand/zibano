// src/components/home/BusinessInfoCard.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Card from '../common/Card';
import Badge from '../common/Badge';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function BusinessInfoCard({ business }) {
  const { colors } = useTheme();

  // محاسبه مدت عضویت
  const memberSince = business.memberSince || '۲ سال';

  return (
    <View style={s.infoWrapper}>
      <View style={s.logoAndBadgeRow}>
        {/* 🎯 لوگوی بزرگتر (از 72 به 92) */}
        <View style={[s.logoWrapper, { borderColor: colors.background }]}>
          <Image source={{ uri: business.logo }} style={s.logoImage} />
        </View>
      </View>

      <Text style={[s.bizName, { color: colors.textMain }]}>
        {business.name}
      </Text>

      {/* 🆕 صاحب کسب‌وکار */}
      {business.ownerName && (
        <View style={s.ownerRow}>
          <View style={[s.ownerIconBox, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="person" size={14} color={colors.primary} />
          </View>
          <Text style={[s.ownerLabel, { color: colors.textSecondary }]}>
            مدیریت:
          </Text>
          <Text style={[s.ownerName, { color: colors.textMain }]}>
            {business.ownerName}
          </Text>
          {business.ownerVerified && (
            <View style={[s.verifiedBadge, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="verified" size={10} color="#4CAF50" />
              <Text style={[s.verifiedText, { color: '#4CAF50' }]}>
                تایید شده
              </Text>
            </View>
          )}
        </View>
      )}

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
          {/* ⭐ امتیاز */}
          <View style={s.statItem}>
            <View style={[s.statIconBox, { backgroundColor: '#FFC10720' }]}>
              <Icon name="star" size={22} color="#FFC107" />
            </View>
            <Text style={[s.statValue, { color: colors.textMain }]}>
              {toPersianDigit(business.rating)}
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              امتیاز
            </Text>
            <Text style={[s.statSubLabel, { color: colors.textSecondary }]}>
              {toPersianDigit(business.reviewsCount)} نظر
            </Text>
          </View>

          <View style={[s.statDivider, { backgroundColor: colors.border }]} />

          {/* 💆 تعداد خدمات */}
          <View style={s.statItem}>
            <View style={[s.statIconBox, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="spa" size={22} color="#4CAF50" />
            </View>
            <Text style={[s.statValue, { color: colors.textMain }]}>
              {toPersianDigit(business.servicesCount || 0)}
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              خدمات
            </Text>
            <Text style={[s.statSubLabel, { color: colors.textSecondary }]}>
              فعال
            </Text>
          </View>

          <View style={[s.statDivider, { backgroundColor: colors.border }]} />

          {/* 🎂 مدت عضویت */}
          <View style={s.statItem}>
            <View style={[s.statIconBox, { backgroundColor: '#2196F320' }]}>
              <Icon name="workspace-premium" size={22} color="#2196F3" />
            </View>
            <Text style={[s.statValue, { color: colors.textMain }]}>
              {memberSince}
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              عضویت
            </Text>
            <Text style={[s.statSubLabel, { color: colors.textSecondary }]}>
              در زیبانو
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
  // 🎯 لوگوی بزرگتر - از 72 به 92 پیکسل
  logoWrapper: {
    width: 92,          // ✅ بزرگتر شد (قبلاً 72)
    height: 92,         // ✅ بزرگتر شد (قبلاً 72)
    borderRadius: 26,   // ✅ متناسب با اندازه جدید
    borderWidth: 4,     // ✅ border ضخیم‌تر
    overflow: 'hidden',
    marginTop: -70,     // ✅ overlap بیشتر با کاور (قبلاً -60)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
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
    marginTop:'4%',
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ownerIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  ownerName: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 9,
    fontFamily: 'Vazir-Bold',
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
    gap: 4,
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
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 10,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 50,
  },
});