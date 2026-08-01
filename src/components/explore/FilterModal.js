// src/components/explore/FilterModal.js
import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheet from '../common/BottomSheet';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import Chip from '../common/Chip';
import Divider from '../common/Divider';
import {
  PROVINCES,
  CITIES,
  BUSINESS_TYPES,
  MAIN_CATEGORIES,
  SUB_CATEGORIES,
  SOURCE_FILTERS,
} from '../../constants/exploreFilters';

export default function FilterModal({
  visible,
  onClose,
  onApply,
  currentFilters,
}) {
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [businessType, setBusinessType] = useState(null);
  // 🆕 state های جدید
  const [mainCategory, setMainCategory] = useState('all');
  const [subCategory, setSubCategory] = useState('all');
  const [source, setSource] = useState('all');

  useEffect(() => {
    if (visible && currentFilters) {
      setProvince(currentFilters.province);
      setCity(currentFilters.city);
      setBusinessType(currentFilters.businessType);
      setMainCategory(currentFilters.mainCategory || 'all');
      setSubCategory(currentFilters.subCategory || 'all');
      setSource(currentFilters.source || 'all');
    }
  }, [visible, currentFilters]);

  // 🆕 محاسبه زیردسته‌ها بر اساس دسته اصلی انتخاب شده
  const availableSubCategories = useMemo(() => {
    if (mainCategory === 'all') return [];
    return SUB_CATEGORIES[mainCategory] || [];
  }, [mainCategory]);

  // 🆕 وقتی دسته اصلی تغییر می‌کند، زیردسته را ریست کن
  const handleMainCategoryChange = (value) => {
    setMainCategory(value);
    setSubCategory('all'); // ریست زیردسته
  };

  const handleApply = () => {
    onApply({ 
      province, 
      city, 
      businessType,
      mainCategory,
      subCategory,
      source,
    });
    onClose();
  };

  const handleClear = () => {
    setProvince(null);
    setCity(null);
    setBusinessType(null);
    setMainCategory('all');
    setSubCategory('all');
    setSource('all');
    onApply({ 
      province: null, 
      city: null, 
      businessType: null,
      mainCategory: 'all',
      subCategory: 'all',
      source: 'all',
    });
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر ویترین"
      snapPoint={0.8}
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            title="حذف همه"
            onPress={handleClear}
            variant="outline"
            size="lg"
            style={{ flex: 1 }}
          />
          <Button
            title="اعمال فیلتر"
            onPress={handleApply}
            variant="primary"
            size="lg"
            style={{ flex: 1 }}
            icon={<Icon name="check" size={20} color="#fff" />}
            iconPosition="right"
          />
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* ═══════ بخش ۱: منبع پست ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#9C27B018' }]}>
              <Icon name="filter-list" size={18} color="#9C27B0" />
            </View>
            <Text style={[s.sectionTitle, { color: '#333' }]}>
              نوع محتوا
            </Text>
          </View>
          <View style={s.chipGrid}>
            {SOURCE_FILTERS.map((sf) => {
              const isSelected = source === sf.id;
              return (
                <Chip
                  key={sf.id}
                  label={sf.label}
                  selected={isSelected}
                  icon={
                    <Icon
                      name={sf.icon}
                      size={14}
                      color={isSelected ? '#fff' : '#9C27B0'}
                    />
                  }
                  onPress={() => setSource(sf.id)}
                />
              );
            })}
          </View>
        </View>

        <Divider spacing={16} />

        {/* ═══════ بخش ۲: دسته‌بندی خدمات ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#FF980018' }]}>
              <Icon name="category" size={18} color="#FF9800" />
            </View>
            <Text style={[s.sectionTitle, { color: '#333' }]}>
              دسته‌بندی خدمات
            </Text>
          </View>
          
          <Dropdown
            label="دسته‌بندی کلی"
            placeholder="انتخاب دسته‌بندی"
            value={mainCategory}
            options={MAIN_CATEGORIES.map(c => ({ id: c.id, label: c.label }))}
            onSelect={handleMainCategoryChange}
          />

          {/* 🆕 Dropdown زیردسته - فقط اگر دسته اصلی انتخاب شده باشد */}
          {mainCategory !== 'all' && availableSubCategories.length > 0 && (
            <Dropdown
              label="نوع خدمت"
              placeholder="همه"
              value={subCategory}
              options={availableSubCategories.map(c => ({ id: c.id, label: c.label }))}
              onSelect={setSubCategory}
            />
          )}
        </View>

        <Divider spacing={16} />

        {/* ═══════ بخش ۳: موقعیت مکانی ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#2196F318' }]}>
              <Icon name="location-on" size={18} color="#2196F3" />
            </View>
            <Text style={[s.sectionTitle, { color: '#333' }]}>
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
              setCity(null);
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
      </ScrollView>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});