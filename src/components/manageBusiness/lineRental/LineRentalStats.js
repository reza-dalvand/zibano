// src/components/manageBusiness/lineRental/LineRentalStats.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../stores/useThemeStore';
import Card from '../../common/Card';
import StatsCard from '../../common/StatsCard';
import { toPersianDigit } from '../../../utils/numberUtils';

export default function LineRentalStats({ ads }) {
  const { colors } = useTheme();

  const stats = {
    total: ads.length,
    active: ads.filter(a => a.status === 'active').length,
  };

  return (
    <Card variant="elevated" padding={14} radius={18}>
      <View style={s.row}>
        <StatsCard
          icon="storefront"
          label="کل آگهی‌ها"
          value={toPersianDigit(stats.total)}
          color="#667eea"
          variant="compact"
        />
        <View style={[s.divider, { backgroundColor: colors.border }]} />
        <StatsCard
          icon="check-circle"
          label="فعال"
          value={toPersianDigit(stats.active)}
          color="#4CAF50"
          variant="compact"
        />
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
});