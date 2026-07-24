// src/components/home/CategoryFilterModal.js
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import BottomSheet from '../common/BottomSheet';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import Chip from '../common/Chip';
import Divider from '../common/Divider';
import { getSubServicesForCategory } from '../../constants/categorySubServices';

// ✅ گزینه‌های مرتب‌سازی با اضافه شدن «همه»
const SORT_OPTIONS = [
  { id: 'all', label: 'همه', icon: 'apps' },
  { id: 'top_rated', label: 'بیشترین امتیاز', icon: 'star' },
  { id: 'most_booked', label: 'بیشترین رزرو', icon: 'trending-up' },
  { id: 'highest_discount', label: 'بیشترین تخفیف', icon: 'local-offer' },
];

export default function CategoryFilterModal({
  visible,
  onClose,
  onApply,
  currentFilters,
  categoryId,
}) {
  const { colors } = useTheme();
  const [serviceType, setServiceType] = useState(null);
  const [sortBy, setSortBy] = useState('all'); // ✅ پیش‌فرض تغییر کرد

  // 🎯 دریافت زیرخدمات مربوط به این دسته‌بندی
  const subServices = useMemo(() => {
    if (!categoryId) return [];
    const subs = getSubServicesForCategory(categoryId);
    return [{ id: 'all', label: 'همه خدمات' }, ...subs];
  }, [categoryId]);

  useEffect(() => {
    if (visible && currentFilters) {
      setServiceType(currentFilters.serviceType || null);
      setSortBy(currentFilters.sortBy || 'all');
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({ serviceType, sortBy });
    onClose();
  };

  const handleClear = () => {
    setServiceType(null);
    setSortBy('all');
    onApply({ serviceType: null, sortBy: 'all' });
    onClose();
  };

  const activeFiltersCount =
    (serviceType && serviceType !== 'all' ? 1 : 0) +
    (sortBy !== 'all' ? 1 : 0);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر و مرتب‌سازی"
      snapPoint={0.75}
      footer={
        <View style={s.footerRow}>
          <Button
            title="حذف همه"
            onPress={handleClear}
            variant="outline"
            size="lg"
            style={s.halfButton}
            icon={<Icon name="delete-outline" size={20} color={colors.primary} />}
            iconPosition="left"
          />
          <Button
            title={`اعمال فیلتر`}
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
        {/* ═══════ بخش ۱: نوع خدمت (Dropdown) ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#FF980018' }]}>
              <Icon name="category" size={18} color="#FF9800" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              نوع خدمت
            </Text>
          </View>
          <Text style={[s.sectionHint, { color: colors.textSecondary }]}>
            خدمت موردنظر خود را از این دسته‌بندی انتخاب کنید
          </Text>
          <Dropdown
            label="نوع خدمت"
            placeholder="انتخاب نوع خدمت"
            value={serviceType}
            options={subServices}
            onSelect={setServiceType}
          />
        </View>

        <Divider spacing={16} />

        {/* ═══════ بخش ۲: مرتب‌سازی ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#2196F318' }]}>
              <Icon name="sort" size={18} color="#2196F3" />
            </View>
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
                  icon={
                    <Icon
                      name={option.icon}
                      size={14}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                  }
                  onPress={() => setSortBy(option.id)}
                />
              );
            })}
          </View>
        </View>

        <View style={{ height: 20 }} />
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
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  sectionHint: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },
  sortGrid: {
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