// src/components/home/CategoryHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../stores/useThemeStore';
import SearchBar from '../common/SearchBar';

export default function CategoryHeader({
  categoryName,
  categoryIcon = 'spa',
  categoryColor = '#E91E63',
  resultCount = 0,
  searchQuery,
  onSearchChange,
  onBackPress,
  onFilterPress,
  hasActiveFilter = false,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const getGradientColors = (icon) => {
    const gradients = {
      face: ['#E91E63', '#C2185B'],
      brush: ['#9C27B0', '#7B1FA2'],
      'flash-on': ['#2196F3', '#1976D2'],
      spa: ['#4CAF50', '#388E3C'],
      palette: ['#FF9800', '#F57C00'],
      'auto-awesome': ['#00BCD4', '#0097A7'],
      visibility: ['#795548', '#5D4037'],
      'self-improvement': ['#607D8B', '#455A64'],
    };
    return gradients[icon] || [colors.primary, colors.secondary];
  };

  const [gradientStart, gradientEnd] = getGradientColors(categoryIcon);

  return (
    <View
      style={[
        s.headerContainer,
        {
          backgroundColor: gradientStart,
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <View style={s.headerContent}>
        <View style={s.topRow}>
          {/* دکمه بازگشت */}
          <TouchableOpacity
            style={s.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Icon name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>

          {/* اطلاعات دسته‌بندی */}
          <View style={s.categoryInfo}>
            <View style={s.categoryIconBox}>
              <Icon name={categoryIcon} size={28} color={gradientStart} />
            </View>
            <View style={s.categoryTextContainer}>
              <Text style={s.categoryLabel}>دسته‌بندی</Text>
              <Text style={s.categoryName} numberOfLines={1}>
                {categoryName}
              </Text>
            </View>
          </View>

          {/* شمارنده نتایج + دکمه فیلتر */}
          <View style={s.rightActions}>
            {/* 🆕 دکمه فیلتر */}
            {onFilterPress && (
              <TouchableOpacity
                onPress={onFilterPress}
                style={[
                  s.filterBtn,
                  hasActiveFilter && {
                    backgroundColor: 'rgba(255,255,255,0.32)',
                  },
                ]}
                activeOpacity={0.7}
              >
                <Icon name="tune" size={20} color="#fff" />
                {/* 🆕 نقطه نشانگر فیلتر فعال */}
                {hasActiveFilter && <View style={s.filterIndicator} />}
              </TouchableOpacity>
            )}

            {/* شمارنده نتایج */}
            <View style={s.resultCounter}>
              <Text style={s.resultNumber}>{resultCount}</Text>
            </View>
          </View>
        </View>

        {/* نوار جستجو */}
        <View style={s.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder={`جستجو در ${categoryName}...`}
          />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  headerContainer: {
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryTextContainer: {
    flex: 1,
    gap: 2,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
    color: 'rgba(255,255,255,0.8)',
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  // 🆕 کانتینر سمت راست (شامل فیلتر + شمارنده)
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // 🆕 دکمه فیلتر
  filterBtn: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  // 🆕 نقطه نشانگر فیلتر فعال (زرد طلایی)
  filterIndicator: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FFD700',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  resultCounter: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: 'center',
    width: 45,
    height: 45,
  },
  resultNumber: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  resultLabel: {
    fontSize: 10,
    fontFamily: 'Vazir',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  searchWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});