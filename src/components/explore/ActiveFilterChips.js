// src/components/explore/ActiveFilterChips.js
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/useThemeStore';
import Chip from '../common/Chip';
import { 
  PROVINCES, 
  CITIES, 
  BUSINESS_TYPES,
  MAIN_CATEGORIES,
  SUB_CATEGORIES,
  SOURCE_FILTERS,
} from '../../constants/exploreFilters';

export default function ActiveFilterChips({ filters, onChange }) {
  const { colors } = useTheme();
  
  const hasActive =
    filters.province ||
    filters.city ||
    filters.businessType ||
    filters.mainCategory !== 'all' ||
    filters.subCategory !== 'all' ||
    filters.source !== 'all';

  if (!hasActive) return null;

  // پیدا کردن label برای source
  const getSourceLabel = (sourceId) => {
    return SOURCE_FILTERS.find(s => s.id === sourceId)?.label;
  };

  // پیدا کردن label برای دسته اصلی
  const getMainCategoryLabel = (categoryId) => {
    return MAIN_CATEGORIES.find(c => c.id === categoryId)?.label;
  };

  // پیدا کردن label برای زیردسته
  const getSubCategoryLabel = (mainCat, subCat) => {
    const subs = SUB_CATEGORIES[mainCat] || [];
    return subs.find(c => c.id === subCat)?.label;
  };

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 🆕 فیلتر منبع */}
        {filters.source !== 'all' && (
          <Chip
            label={getSourceLabel(filters.source)}
            selected
            onRemove={() =>
              onChange({ ...filters, source: 'all' })
            }
          />
        )}

        {/* 🆕 فیلتر دسته‌بندی کلی */}
        {filters.mainCategory !== 'all' && (
          <Chip
            label={getMainCategoryLabel(filters.mainCategory)}
            selected
            onRemove={() =>
              onChange({ 
                ...filters, 
                mainCategory: 'all',
                subCategory: 'all', // ریست زیردسته
              })
            }
          />
        )}

        {/* 🆕 فیلتر زیردسته */}
        {filters.subCategory !== 'all' && filters.mainCategory !== 'all' && (
          <Chip
            label={getSubCategoryLabel(filters.mainCategory, filters.subCategory)}
            selected
            onRemove={() => onChange({ ...filters, subCategory: 'all' })}
          />
        )}

        {/* فیلتر استان */}
        {filters.province && (
          <Chip
            label={PROVINCES.find((p) => p.id === filters.province)?.label}
            selected
            onRemove={() =>
              onChange({ ...filters, province: null, city: null })
            }
          />
        )}

        {/* فیلتر شهر */}
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

        {/* فیلتر نوع کسب‌وکار */}
        {filters.businessType && (
          <Chip
            label={
              BUSINESS_TYPES.find((t) => t.id === filters.businessType)?.label
            }
            selected
            onRemove={() => onChange({ ...filters, businessType: null })}
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