// src/components/explore/ActiveFilterChips.js
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Chip from '../common/Chip';
import { PROVINCES, CITIES, BUSINESS_TYPES, MIN_RATINGS } from '../../constants/exploreFilters';

export default function ActiveFilterChips({ filters, onChange }) {
  const { colors } = useTheme();

  const hasActive =
    filters.province ||
    filters.city ||
    filters.businessType ||
    filters.minRating !== '0';

  if (!hasActive) return null;

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.province && (
          <Chip
            label={PROVINCES.find((p) => p.id === filters.province)?.label}
            selected
            onRemove={() =>
              onChange({ ...filters, province: null, city: null })
            }
          />
        )}
        {filters.city && (
          <Chip
            label={
              CITIES[filters.province]?.find((c) => c.id === filters.city)
                ?.label
            }
            selected
            onRemove={() => onChange({ ...filters, city: null })}
          />
        )}
        {filters.businessType && (
          <Chip
            label={
              BUSINESS_TYPES.find((t) => t.id === filters.businessType)?.label
            }
            selected
            onRemove={() => onChange({ ...filters, businessType: null })}
          />
        )}
        {filters.minRating !== '0' && (
          <Chip
            label={`⭐ ${
              MIN_RATINGS.find((r) => r.id === filters.minRating)?.label
            }`}
            selected
            onRemove={() => onChange({ ...filters, minRating: '0' })}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 16,
  },
});