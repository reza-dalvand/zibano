// نمایش کارت‌های آماری بالای صفحه
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Card from '../../common/Card';
import { useTheme } from '../../../theme/ThemeContext';
import { toPersianDigit, formatPrice } from './constants';

const STAT_CARDS = [
  {
    id: 'blocked',
    key: 'blockedAmount',
    icon: 'hourglass-top',
    label: 'بیعانه بلوکه',
    hint: 'در انتظار انجام خدمت',
    iconBg: '#FF980020',
    iconColor: '#FF9800',
  },
  {
    id: 'settling',
    key: 'settlingAmount',
    icon: 'sync',
    label: 'در حال تسویه',
    hint: 'واریز تا ۴۸ ساعت',
    iconBg: '#2196F320',
    iconColor: '#2196F3',
  },
  {
    id: 'settled',
    key: 'settledAmount',
    icon: 'account-balance',
    label: 'کل درآمد تسویه‌شده',
    hint: 'به حساب شما واریز شده',
    iconBg: '#43A04720',
    iconColor: '#43A047',
  },
  {
    id: 'total',
    key: 'totalAmount',
    icon: 'trending-up',
    label: 'کل تراکنش‌ها',
    hint: 'از ابتدا تا امروز',
    iconBg: '#9C27B020',
    iconColor: '#9C27B0',
  },
];

export default function FinancialStatsCards({ stats }) {
  const { colors } = useTheme();

  return (
    <View style={s.grid}>
      {STAT_CARDS.map((card, idx) => (
        <Card
          key={card.id}
          variant="elevated"
          padding={12}
          radius={14}
          style={s.statCard}
        >
          <View style={s.cardInner}>
            <View style={[s.iconBox, { backgroundColor: card.iconBg }]}>
              <Icon name={card.icon} size={20} color={card.iconColor} />
            </View>
            <Text style={[s.value, { color: colors.textMain }]}>
              {formatPrice(stats[card.key]).replace(' تومان', '')}
            </Text>
            <Text style={[s.label, { color: colors.textMain }]}>
              {card.label}
            </Text>
            <Text style={[s.hint, { color: colors.textSecondary }]}>
              {card.hint}
            </Text>
          </View>
        </Card>
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
  statCard: {
    width: '48.3%',
  },
  cardInner: {
    alignItems: 'flex-start',
    gap: 4,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginTop: 2,
  },
  label: {
    fontSize: 11.5,
    fontFamily: 'Vazir-Bold',
    marginTop: 2,
  },
  hint: {
    fontSize: 9.5,
    fontFamily: 'Vazir',
    marginTop: 1,
  },
});