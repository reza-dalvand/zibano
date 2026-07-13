// src/screens/profile/paymentHistory/PaymentStatsCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Card from '../../../components/common/Card';
import { toPersianDigit, formatPrice } from './helpers';

export default function PaymentStatsCard({ stats }) {
  const { colors } = useTheme();

  if (!stats) return null;

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <Card variant="elevated" padding={14} radius={18} style={s.card}>
        <View style={s.row}>
          <View style={s.item}>
            <View style={[s.iconBox, { backgroundColor: '#43A04720' }]}>
              <Icon name="account-balance-wallet" size={18} color="#43A047" />
            </View>
            <Text style={[s.value, { color: colors.textMain }]}>
              {formatPrice(stats.totalPaid).replace(' تومان', '')}
            </Text>
            <Text style={[s.label, { color: colors.textSecondary }]}>
              مجموع پرداختی
            </Text>
          </View>

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          <View style={s.item}>
            <View style={[s.iconBox, { backgroundColor: '#FF980020' }]}>
              <Icon name="local-offer" size={18} color="#FF9800" />
            </View>
            <Text style={[s.value, { color: colors.textMain }]}>
              {formatPrice(stats.totalDiscount).replace(' تومان', '')}
            </Text>
            <Text style={[s.label, { color: colors.textSecondary }]}>
              مجموع تخفیف‌ها
            </Text>
          </View>

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          <View style={s.item}>
            <View style={[s.iconBox, { backgroundColor: colors.primary + '20' }]}>
              <Icon name="check-circle" size={18} color={colors.primary} />
            </View>
            <Text style={[s.value, { color: colors.textMain }]}>
              {toPersianDigit(stats.successCount)}
            </Text>
            <Text style={[s.label, { color: colors.textSecondary }]}>
              تراکنش موفق
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  card: { marginBottom: 0 },
  row: { flexDirection: 'row', alignItems: 'center' },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  iconBox: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  value: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  label: { fontSize: 10, fontFamily: 'Vazir', textAlign: 'center' },
  divider: { width: 1, height: 40 },
});