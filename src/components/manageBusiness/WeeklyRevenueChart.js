// src/components/manager/WeeklyRevenueChart.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../common/Card';

const formatNumber = (num) => num.toLocaleString('fa-IR');

export default function WeeklyRevenueChart({
  data,
  onSeeAllPress,
}) {
  const { colors } = useTheme();

  const maxAmount = Math.max(...data.map((d) => d.amount));
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <Text style={[s.sectionTitle, { color: colors.textMain, marginBottom: 0 }]}>
          درآمد هفتگی
        </Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={[s.seeAllText, { color: colors.primary }]}>
            گزارش کامل
          </Text>
        </TouchableOpacity>
      </View>

      <Card variant="elevated" padding={16} radius={16}>
        <View style={s.chartContainer}>
          {data.map((item, index) => {
            const height = (item.amount / maxAmount) * 100;
            return (
              <View key={index} style={s.chartBarContainer}>
                <View
                  style={[
                    s.chartBar,
                    {
                      height: `${height}%`,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
                <Text style={[s.chartLabel, { color: colors.textSecondary }]}>
                  {item.day.substring(0, 2)}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={[s.chartSummary, { borderTopColor: colors.border }]}>
          <View style={s.summaryItem}>
            <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>
              مجموع هفتگی
            </Text>
            <Text style={[s.summaryValue, { color: colors.textMain }]}>
              {formatNumber(total)} تومان
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBar: {
    width: '60%',
    borderRadius: 8,
    minHeight: 20,
  },
  chartLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  chartSummary: {
    paddingTop: 12,
    borderTopWidth: 1,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
  summaryValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
});