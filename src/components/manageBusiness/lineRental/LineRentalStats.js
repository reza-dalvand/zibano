// src/components/manageBusiness/lineRental/LineRentalStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Card from '../../common/Card';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function LineRentalStats({ ads }) {
  const { colors } = useTheme();

  const stats = {
    total: ads.length,
    active: ads.filter((a) => a.status === 'active').length,
  };

  const STAT_ITEMS = [
    { icon: 'storefront', label: 'کل آگهی‌ها', value: toPersianDigit(stats.total), color: '#667eea' },
    { icon: 'check-circle', label: 'فعال', value: toPersianDigit(stats.active), color: '#4CAF50' },
  ];

  return (
    <Card
      variant="elevated"
      padding={14}
      radius={18}
      style={[s.container, { borderColor: colors.border }]}
    >
      {STAT_ITEMS.map((item, index) => (
        <React.Fragment key={item.label}>
          <View style={s.statItem}>
            <View style={[s.iconBox, { backgroundColor: item.color + '20' }]}>
              <Icon name={item.icon} size={18} color={item.color} />
            </View>
            <Text style={[s.value, { color: colors.textMain }]}>{item.value}</Text>
            <Text style={[s.label, { color: colors.textSecondary }]}>{item.label}</Text>
          </View>
          {index < STAT_ITEMS.length - 1 && (
            <View style={[s.divider, { backgroundColor: colors.border }]} />
          )}
        </React.Fragment>
      ))}
    </Card>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
  },
  label: {
    fontSize: 10,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
  },
});