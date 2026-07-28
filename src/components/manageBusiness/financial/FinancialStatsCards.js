// src/components/manageBusiness/financial/FinancialStatsCards.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../stores/useThemeStore';
import Card from '../../common/Card';
import StatsCard from '../../common/StatsCard';
import { formatPrice } from './constants';

const STAT_CARDS = [
  {
    id: 'blocked',
    key: 'blockedAmount',
    icon: 'hourglass-top',
    label: 'بیعانه بلوکه',
    hint: 'در انتظار انجام خدمت',
    color: '#FF9800',
  },
  {
    id: 'settling',
    key: 'settlingAmount',
    icon: 'sync',
    label: 'در حال تسویه',
    hint: 'واریز تا ۴۸ ساعت',
    color: '#2196F3',
  },
  {
    id: 'settled',
    key: 'settledAmount',
    icon: 'account-balance',
    label: 'کل درآمد تسویه‌شده',
    hint: 'به حساب شما واریز شده',
    color: '#43A047',
  },
  {
    id: 'total',
    key: 'totalAmount',
    icon: 'trending-up',
    label: 'کل تراکنش‌ها',
    hint: 'از ابتدا تا امروز',
    color: '#9C27B0',
  },
];

export default function FinancialStatsCards({ stats }) {
  const { colors } = useTheme();
  return (
    <View style={s.grid}>
      {STAT_CARDS.map((card) => (
        <StatsCard
          key={card.id}
          icon={card.icon}
          label={card.label}
          value={formatPrice(stats[card.key]).replace(' تومان', '')}
          subtitle={card.hint}
          color={card.color}
          variant="horizontal"
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
});