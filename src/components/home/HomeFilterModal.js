// src/components/home/HomeFilterModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import BottomSheet from '../common/BottomSheet';
import Button from '../common/Button';
import Chip from '../common/Chip';
import Dropdown from '../common/Dropdown';
import Divider from '../common/Divider';
import { PROVINCES, CITIES } from '../../constants/exploreFilters';

const PRICE_RANGES = [
  { id: 'all', label: 'همه قیمت‌ها' },
  { id: 'low', label: 'اقتصادی (تا ۵۰۰ هزار)' },
  { id: 'medium', label: 'متوسط (۵۰۰ تا ۱ میلیون)' },
  { id: 'high', label: 'لوکس (بالای ۱ میلیون)' },
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'پیشنهادی', icon: 'star' },
  { id: 'nearest', label: 'نزدیک‌ترین', icon: 'near-me' },
  { id: 'top_rated', label: 'بیشترین امتیاز', icon: 'thumb-up' },
  { id: 'most_discount', label: 'بیشترین تخفیف', icon: 'local-offer' },
];

export default function HomeFilterModal({ visible, onClose, onApply, currentFilters }) {
  const { colors } = useTheme();
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    if (visible && currentFilters) {
      setProvince(currentFilters.province || null);
      setCity(currentFilters.city || null);
      setPriceRange(currentFilters.priceRange || 'all');
      setSortBy(currentFilters.sortBy || 'recommended');
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({ province, city, priceRange, sortBy });
    onClose();
  };

  const handleClear = () => {
    setProvince(null);
    setCity(null);
    setPriceRange('all');
    setSortBy('recommended');
    onApply({});
    onClose();
  };

  const activeCount =
    (province ? 1 : 0) +
    (city ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (sortBy !== 'recommended' ? 1 : 0);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر و مرتب‌سازی"
      snapPoint={0.88}
      footer={
        <View style={s.footerContainer}>
          {/* دکمه حذف همه - بالا سمت راست */}
          <View style={s.topActionsRow}>
            <Button
              title="حذف همه"
              onPress={handleClear}
              variant="outline"
              size="lg"
              style={s.clearBtn}
              icon={<Icon name="delete-outline" size={18} color={colors.primary} />}
              iconPosition="right"
            />
          </View>

          {/* 🎯 دکمه سبز تایید بزرگ و تمام‌عرض */}
          <TouchableOpacity
            onPress={handleApply}
            activeOpacity={0.9}
            style={s.confirmBtn}
          >
            <View style={s.confirmBtnIconCircle}>
              <Icon name="check" size={20} color="#fff" />
            </View>
            <View style={s.confirmBtnTextCol}>
              <Text style={s.confirmBtnTitle}>اعمال فیلتر</Text>
              <Text style={s.confirmBtnSubtitle}>
                {activeCount > 0
                  ? `${activeCount} فیلتر فعال`
                  : 'نمایش همه نتایج'}
              </Text>
            </View>
            <Icon name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* ═══════ موقعیت مکانی ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#2196F318' }]}>
              <Icon name="location-on" size={18} color="#2196F3" />
            </View>
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
              setCity(null);
            }}
          />
          <Dropdown
            label="شهر"
            placeholder={province ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
            value={city}
            options={province ? CITIES[province] || [] : []}
            onSelect={setCity}
          />
        </View>

        <Divider spacing={16} />

        {/* ═══════ بازه قیمت ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#4CAF5018' }]}>
              <Icon name="attach-money" size={18} color="#4CAF50" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              بازه قیمت
            </Text>
          </View>
          <View style={s.chipsGrid}>
            {PRICE_RANGES.map(pr => (
              <Chip
                key={pr.id}
                label={pr.label}
                selected={priceRange === pr.id}
                onPress={() => setPriceRange(pr.id)}
              />
            ))}
          </View>
        </View>

        <Divider spacing={16} />

        {/* ═══════ مرتب‌سازی ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#FF980018' }]}>
              <Icon name="sort" size={18} color="#FF9800" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              مرتب‌سازی بر اساس
            </Text>
          </View>
          <View style={s.chipsGrid}>
            {SORT_OPTIONS.map(opt => (
              <Chip
                key={opt.id}
                label={opt.label}
                selected={sortBy === opt.id}
                icon={
                  <Icon
                    name={opt.icon}
                    size={14}
                    color={sortBy === opt.id ? colors.primary : colors.textSecondary}
                  />
                }
                onPress={() => setSortBy(opt.id)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  content: {
    paddingBottom: 20,
    paddingHorizontal: 4,
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
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  // ═══════ فوتر ═══════
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 10,
  },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  clearBtn: {
    minWidth: 130,
  },
  // 🎯 دکمه سبز تایید
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#43A047',
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmBtnIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnTextCol: {
    flex: 1,
    gap: 2,
  },
  confirmBtnTitle: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  confirmBtnSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontFamily: 'Vazir',
  },
});