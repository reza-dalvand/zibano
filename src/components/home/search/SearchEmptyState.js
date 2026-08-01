// src/components/home/search/SearchEmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';

export default function SearchEmptyState({ query, activeTab }) {
  const { colors } = useTheme();

  const getTabMessage = () => {
    switch (activeTab) {
      case 'businesses':
        return { icon: 'store', title: 'کسب‌وکاری یافت نشد' };
      case 'services':
        return { icon: 'spa', title: 'خدمتی یافت نشد' };
      case 'posts':
        return { icon: 'collections', title: 'پستی یافت نشد' };
      case 'modelRequests':
        return { icon: 'face-retouching-natural', title: 'فرصت مدلینگی یافت نشد' };
      case 'lineRentals':
        return { icon: 'storefront', title: 'آگهی لاینی یافت نشد' };
      default:
        return { icon: 'search-off', title: 'نتیجه‌ای یافت نشد' };
    }
  };

  const { icon, title } = getTabMessage();

  return (
    <View style={s.container}>
      <View style={[s.iconBox, { backgroundColor: colors.primary + '15' }]}>
        <Icon name={icon} size={48} color={colors.primary} />
      </View>
      <Text style={[s.title, { color: colors.textMain }]}>{title}</Text>
      <Text style={[s.subtitle, { color: colors.textSecondary }]}>
        عبارت «{query}» در این دسته نتیجه‌ای نداشت
      </Text>
      <View style={[s.tipsCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <Text style={[s.tipsTitle, { color: colors.textMain }]}>
          💡 پیشنهاد‌ها:
        </Text>
        <View style={s.tipItem}>
          <Icon name="check" size={14} color={colors.primary} />
          <Text style={[s.tipText, { color: colors.textSecondary }]}>
            املای کلمه را بررسی کنید
          </Text>
        </View>
        <View style={s.tipItem}>
          <Icon name="check" size={14} color={colors.primary} />
          <Text style={[s.tipText, { color: colors.textSecondary }]}>
            از کلمات کلیدی ساده‌تر استفاده کنید
          </Text>
        </View>
        <View style={s.tipItem}>
          <Icon name="check" size={14} color={colors.primary} />
          <Text style={[s.tipText, { color: colors.textSecondary }]}>
            تب‌های دیگر را بررسی کنید
          </Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 12,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 21,
  },
  tipsCard: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    marginBottom: 4,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
});