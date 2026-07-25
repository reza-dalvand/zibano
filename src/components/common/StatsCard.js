// src/components/common/StatsCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Card from './Card';

/**
 * کامپوننت مشترک کارت آماری
 *
 * Props:
 * - icon: نام آیکون MaterialIcons
 * - label: عنوان کارت
 * - value: مقدار اصلی
 * - subtitle: توضیح زیر مقدار (اختیاری)
 * - color: رنگ آیکون و accent
 * - showDivider: نمایش خط جداکننده بین آیتم‌ها (برای حالت چندتایی)
 */
export default function StatsCard({
  icon,
  label,
  value,
  subtitle,
  color = '#2196F3',
  variant = 'default', // 'default' | 'compact' | 'horizontal'
}) {
  const { colors } = useTheme();

  // حالت فشرده - برای استفاده در ردیف‌های چندتایی
  if (variant === 'compact') {
    return (
      <View style={s.compactItem}>
        <View style={[s.compactIconBox, { backgroundColor: color + '18' }]}>
          <Icon name={icon} size={18} color={color} />
        </View>
        <Text style={[s.compactValue, { color: colors.textMain }]}>
          {value}
        </Text>
        <Text style={[s.compactLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      </View>
    );
  }

  // حالت افقی - مثل FinancialStatsCards
  if (variant === 'horizontal') {
    return (
      <Card variant="elevated" padding={12} radius={14} style={s.horizontalCard}>
        <View style={s.horizontalInner}>
          <View style={[s.horizontalIconBox, { backgroundColor: color + '20' }]}>
            <Icon name={icon} size={20} color={color} />
          </View>
          <Text style={[s.horizontalValue, { color: colors.textMain }]}>
            {value}
          </Text>
          <Text style={[s.horizontalLabel, { color: colors.textMain }]}>
            {label}
          </Text>
          {subtitle && (
            <Text style={[s.horizontalHint, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </Card>
    );
  }

  // حالت پیش‌فرض - کارت عمودی کامل
  return (
    <Card variant="elevated" padding={16} radius={16} style={s.defaultCard}>
      <View style={[s.defaultIconWrapper, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={[s.defaultValue, { color: colors.textMain }]}>{value}</Text>
      <Text style={[s.defaultLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      {subtitle && (
        <Text style={[s.defaultSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  // ═══════ Compact ═══════
  compactItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  compactIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  compactValue: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
  },
  compactLabel: {
    fontSize: 10,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },

  // ═══════ Horizontal ═══════
  horizontalCard: {
    width: '48.3%',
  },
  horizontalInner: {
    alignItems: 'flex-start',
    gap: 4,
  },
  horizontalIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  horizontalValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginTop: 2,
  },
  horizontalLabel: {
    fontSize: 11.5,
    fontFamily: 'Vazir-Bold',
    marginTop: 2,
  },
  horizontalHint: {
    fontSize: 9.5,
    fontFamily: 'Vazir',
    marginTop: 1,
  },

  // ═══════ Default ═══════
  defaultCard: {
    alignItems: 'center',
    gap: 8,
  },
  defaultIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  defaultValue: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
  },
  defaultLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  defaultSubtitle: {
    fontSize: 10,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
});