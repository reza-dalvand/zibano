// src/components/manageBusiness/modelRequest/ModelRequestStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function ModelRequestStats({ requests }) {
  const { colors } = useTheme();

  const stats = {
    total: requests.length,
    active: requests.filter((r) => r.status === 'active').length,
    inactive: requests.filter((r) => r.status === 'inactive').length,
  };

  // ✅ تغییرات:
  // 1. حذف "کل متقاضیان"
  // 2. تغییر "تکمیل شده" به "غیرفعال" با آیکون جدید
  const STAT_ITEMS = [
    {
      icon: 'assignment',
      label: 'کل درخواست‌ها',
      value: toPersianDigit(stats.total),
      color: '#667eea',
    },
    {
      icon: 'radio-button-checked',
      label: 'فعال',
      value: toPersianDigit(stats.active),
      color: '#4CAF50',
    },
    {
      icon: 'visibility-off', // ✅ آیکون جدید برای غیرفعال
      label: 'غیرفعال',        // ✅ تغییر عنوان
      value: toPersianDigit(stats.inactive),
      color: '#E53935',        // ✅ رنگ قرمز برای غیرفعال
    },
  ];

  return (
    <View style={[s.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      {STAT_ITEMS.map((item, index) => (
        <React.Fragment key={item.label}>
          <View style={s.statItem}>
            <View style={[s.iconBox, { backgroundColor: item.color + '20' }]}>
              <Icon name={item.icon} size={20} color={item.color} />
            </View>
            <Text style={[s.value, { color: colors.textMain }]}>{item.value}</Text>
            <Text style={[s.label, { color: colors.textSecondary }]}>{item.label}</Text>
          </View>
          {index < STAT_ITEMS.length - 1 && (
            <View style={[s.divider, { backgroundColor: colors.border }]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
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