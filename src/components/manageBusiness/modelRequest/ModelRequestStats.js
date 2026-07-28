// src/components/manageBusiness/modelRequest/ModelRequestStats.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../stores/useThemeStore';
import Card from '../../common/Card';
import StatsCard from '../../common/StatsCard';
import { toPersianDigit } from '../../../utils/numberUtils';

export default function ModelRequestStats({ requests }) {
  const { colors } = useTheme();

  const stats = {
    total: requests.length,
    active: requests.filter(r => r.status === 'active').length,
    inactive: requests.filter(r => r.status === 'inactive').length,
  };

  return (
    <Card variant="elevated" padding={14} radius={18}>
      <View style={s.row}>
        <StatsCard
          icon="assignment"
          label="کل درخواست‌ها"
          value={toPersianDigit(stats.total)}
          color="#667eea"
          variant="compact"
        />
        <View style={[s.divider, { backgroundColor: colors.border }]} />
        <StatsCard
          icon="radio-button-checked"
          label="فعال"
          value={toPersianDigit(stats.active)}
          color="#4CAF50"
          variant="compact"
        />
        <View style={[s.divider, { backgroundColor: colors.border }]} />
        <StatsCard
          icon="visibility-off"
          label="غیرفعال"
          value={toPersianDigit(stats.inactive)}
          color="#E53935"
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