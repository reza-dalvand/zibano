// src/components/manageBusiness/services/ServiceStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = (num) => {
  if (num >= 1000000) return `${toPersianDigit((num / 1000000).toFixed(1))}M`;
  if (num >= 1000) return `${toPersianDigit((num / 1000).toFixed(0))}K`;
  return toPersianDigit(num);
};

const STATS = [
  { key: 'total',     icon: 'apps',              color: '#667eea', label: 'کل خدمات' },
  { key: 'active',    icon: 'check-circle',      color: '#43A047', label: 'فعال' },
  // { key: 'avgPrice',  icon: 'trending-up',       color: '#FF9800', label: 'میانگین قیمت' },
];

export default function ServiceStats({ services }) {
  const { colors } = useTheme();

  const total = services.length;
  const active = services.filter((s) => s.isActive !== false).length;
  const avgPrice = total > 0
    ? Math.round(services.reduce((sum, s) => sum + (s.finalPrice || s.originalPrice || 0), 0) / total)
    : 0;

  const values = {
    total: toPersianDigit(total),
    active: toPersianDigit(active),
    avgPrice: formatPrice(avgPrice),
  };

  return (
    <View style={s.statsContainer}>
      {STATS.map((stat, index) => (
        <React.Fragment key={stat.key}>
          <View style={s.statItem}>
            <View style={[s.statIconBox, { backgroundColor: stat.color + '18' }]}>
              <Icon name={stat.icon} size={18} color={stat.color} />
            </View>
            <Text style={[s.statValue, { color: colors.textMain }]}>
              {values[stat.key]}
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              {stat.label}
            </Text>
          </View>
          {index < STATS.length - 1 && (
            <View style={[s.divider, { backgroundColor: colors.border }]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
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
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 4,
  },
});