// src/components/home/CategoryFilterModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import BottomSheet from '../common/BottomSheet';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import Chip from '../common/Chip';
import Divider from '../common/Divider';
import { PROVINCES, CITIES, MIN_RATINGS } from '../../constants/exploreFilters';

// گزینه‌های مرتب‌سازی
const SORT_OPTIONS = [
  { id: 'top_rated', label: 'بیشترین امتیاز', icon: 'star' },
  { id: 'most_booked', label: 'بیشترین رزرو', icon: 'trending-up' },
  { id: 'highest_discount', label: 'بیشترین تخفیف', icon: 'local-offer' },
];

export default function CategoryFilterModal({
  visible,
  onClose,
  onApply,
  currentFilters,
}) {
  const { colors } = useTheme();

  // state موقت برای تغییرات قبل از Apply
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('top_rated');

  // وقتی مدال باز می‌شود، مقادیر فعلی را کپی کن
  useEffect(() => {
    if (visible && currentFilters) {
      setProvince(currentFilters.province);
      setCity(currentFilters.city);
      setMinRating(currentFilters.minRating || '0');
      setSortBy(currentFilters.sortBy || 'top_rated');
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({ province, city, minRating, sortBy });
    onClose();
  };

  const handleClear = () => {
    setProvince(null);
    setCity(null);
    setMinRating('0');
    setSortBy('top_rated');
    onApply({ province: null, city: null, minRating: '0', sortBy: 'top_rated' });
    onClose();
  };

  // محاسبه تعداد فیلترهای فعال
  const activeFiltersCount =
    (province ? 1 : 0) +
    (city ? 1 : 0) +
    (minRating !== '0' ? 1 : 0) +
    (sortBy !== 'top_rated' ? 1 : 0);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر و مرتب‌سازی"
      snapPoint={0.85}
      footer={
        <View style={s.footerRow}>
          <Button
            title="حذف همه"
            onPress={handleClear}
            variant="outline"
            size="lg"
            style={s.halfButton}
            icon={<Icon name="delete-outline" size={20} color={colors.primary} />}
            iconPosition="right"
          />
          <Button
            title={`اعمال فیلتر (${activeFiltersCount})`}
            onPress={handleApply}
            variant="primary"
            size="lg"
            style={s.halfButton}
            icon={<Icon name="check" size={20} color="#fff" />}
            iconPosition="right"
          />
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* بخش ۱: موقعیت مکانی */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Icon name="location-on" size={20} color={colors.primary} />
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              موقعیت مکانی
            </Text>
          </View>

          <Dropdown
            label="استان"
            placeholder="انتخاب استان"
            value={province}
            options={PROVINCES}
            onSelect={(val) => {
              setProvince(val);
              setCity(null); // با تغییر استان، شهر ریست شود
            }}
          />

          <Dropdown
            label="شهر"
            placeholder={province ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
            value={city}
            options={CITIES[province] || []}
            onSelect={setCity}
          />
        </View>

        <Divider spacing={16} />

        {/* بخش ۲: مرتب‌سازی */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Icon name="sort" size={20} color={colors.primary} />
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              مرتب‌سازی بر اساس
            </Text>
          </View>

          <View style={s.sortGrid}>
            {SORT_OPTIONS.map((option) => {
              const isSelected = option.id === sortBy;
              return (
                <Chip
                  key={option.id}
                  label={option.label}
                  selected={isSelected}
                  icon={<Icon name={option.icon} size={14} color={isSelected ? colors.primary : colors.textSecondary} />}
                  onPress={() => setSortBy(option.id)}
                />
              );
            })}
          </View>
        </View>

        <Divider spacing={16} />

        {/* بخش ۳: حداقل امتیاز */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Icon name="star" size={20} color={colors.primary} />
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              حداقل امتیاز
            </Text>
          </View>

          <View style={s.ratingsRow}>
            {MIN_RATINGS.map((r) => (
              <Chip
                key={r.id}
                label={r.label}
                selected={minRating === r.id}
                onPress={() => setMinRating(r.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  sortGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfButton: {
    flex: 1,
  },
});