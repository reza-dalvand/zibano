// src/components/home/ActiveFiltersBar.js
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Chip from '../common/Chip';
import { PROVINCES, CITIES, MIN_RATINGS } from '../../constants/exploreFilters';

const SORT_LABELS = {
  top_rated: 'بیشترین امتیاز',
  most_booked: 'بیشترین رزرو',
  highest_discount: 'بیشترین تخفیف',
  nearest: 'نزدیک‌ترین',
};

export default function ActiveFiltersBar({ filters, onChange, onClearAll }) {
  const { colors } = useTheme();

  const hasActive =
    filters.province ||
    filters.city ||
    filters.minRating !== '0' ||
    (filters.sortBy && filters.sortBy !== 'top_rated');

  if (!hasActive) return null;

  return (
    <View style={[s.container, { borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {filters.province && (
          <Chip
            label={PROVINCES.find((p) => p.id === filters.province)?.label}
            selected
            icon={<Icon name="location-on" size={14} color={colors.primary} />}
            onRemove={() =>
              onChange({ ...filters, province: null, city: null })
            }
          />
        )}
        {filters.city && (
          <Chip
            label={CITIES[filters.province]?.find((c) => c.id === filters.city)?.label}
            selected
            onRemove={() => onChange({ ...filters, city: null })}
          />
        )}
        {filters.minRating !== '0' && (
          <Chip
            label={`⭐ ${MIN_RATINGS.find((r) => r.id === filters.minRating)?.label}`}
            selected
            onRemove={() => onChange({ ...filters, minRating: '0' })}
          />
        )}
        {filters.sortBy && filters.sortBy !== 'top_rated' && (
          <Chip
            label={SORT_LABELS[filters.sortBy]}
            selected
            icon={<Icon name="sort" size={14} color={colors.primary} />}
            onRemove={() => onChange({ ...filters, sortBy: 'top_rated' })}
          />
        )}

        {/* دکمه حذف همه */}
        <TouchableOpacity
          style={s.clearAllBtn}
          onPress={onClearAll}
          activeOpacity={0.7}
        >
          <Icon name="close" size={14} color="#E57373" />
          <Text style={[s.clearAllText, { color: '#E57373' }]}>حذف همه</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E5737315',
    borderWidth: 1,
    borderColor: '#E5737340',
  },
  clearAllText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});