// src/components/profile/paymentHistory/PaymentStatsCard.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../stores/useThemeStore';
import Card from '../../common/Card';
import StatsCard from '../../common/StatsCard';
import { toPersianDigit, formatPrice } from '../../../utils/numberUtils';

export default function PaymentStatsCard({ stats }) {
  const { colors } = useTheme();
  if (!stats) return null;

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <Card variant="elevated" padding={14} radius={18} style={s.card}>
        <View style={s.row}>
          <StatsCard
            icon="account-balance-wallet"
            label="مجموع پرداختی"
            value={formatPrice(stats.totalPaid).replace(' تومان', '')}
            color="#43A047"
            variant="compact"
          />
          <View style={[s.divider, { backgroundColor: colors.border }]} />
          <StatsCard
            icon="local-offer"
            label="مجموع تخفیف‌ها"
            value={formatPrice(stats.totalDiscount).replace(' تومان', '')}
            color="#FF9800"
            variant="compact"
          />
          <View style={[s.divider, { backgroundColor: colors.border }]} />
          <StatsCard
            icon="check-circle"
            label="تراکنش موفق"
            value={toPersianDigit(stats.successCount)}
            color={colors.primary}
            variant="compact"
          />
        </View>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  card: { marginBottom: 0 },
  row: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: 40 },
});