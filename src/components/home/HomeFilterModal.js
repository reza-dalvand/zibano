// src/components/home/HomeFilterModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import BottomSheet from '../common/BottomSheet';
import Dropdown from '../common/Dropdown';
import { PROVINCES, CITIES } from '../../constants/exploreFilters';
import { toPersianDigit } from '../../constants/exploreFilters';

export default function HomeFilterModal({ visible, onClose, onApply, currentFilters }) {
  const { colors } = useTheme();
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    if (visible && currentFilters) {
      setProvince(currentFilters.province || null);
      setCity(currentFilters.city || null);
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({ province, city });
    onClose();
  };

  const handleClear = () => {
    setProvince(null);
    setCity(null);
    onApply({});
    onClose();
  };

  const activeCount = (province ? 1 : 0) + (city ? 1 : 0);
  const hasActiveFilter = activeCount > 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر موقعیت مکانی"
      snapPoint={0.7}
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

          {/* کارت راهنما */}
          <View
            style={[
              s.hintCard,
              {
                backgroundColor: '#2196F30A',
                borderColor: '#2196F325',
              },
            ]}
          >
            <Icon name="info-outline" size={16} color="#2196F3" />
            <Text style={[s.hintText, { color: colors.textSecondary }]}>
              استان و شهر موردنظر خود را انتخاب کنید تا فقط کسب‌وکارهای آن منطقه نمایش داده شود
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

        {/* 🎯 دکمه‌های اکشن - دقیقا زیر Dropdown شهر */}
        <View style={s.actionsSection}>
          {/* دکمه حذف فیلترها */}
          {hasActiveFilter && (
            <TouchableOpacity
              onPress={handleClear}
              activeOpacity={0.75}
              style={s.clearBtn}
            >
              <Icon name="delete-outline" size={16} color="#E53935" />
              <Text style={[s.clearBtnText, { color: '#E53935' }]}>
                حذف فیلترها
              </Text>
            </TouchableOpacity>
          )}

          {/* 🎯 دکمه سبز تایید */}
          <TouchableOpacity
            onPress={handleApply}
            activeOpacity={0.9}
            style={[s.confirmBtn, { backgroundColor: '#43A047' }]}
          >
            <View style={s.confirmBtnIconCircle}>
              <Icon name="check" size={20} color="#fff" />
            </View>
            <View style={s.confirmBtnTextCol}>
              <Text style={s.confirmBtnTitle}>تایید و اعمال فیلتر</Text>
              <Text style={s.confirmBtnSubtitle}>
                {hasActiveFilter
                  ? `${toPersianDigit(activeCount)} فیلتر فعال`
                  : 'نمایش همه نتایج'}
              </Text>
            </View>
            <Icon name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* خلاصه انتخاب‌ها */}
        {hasActiveFilter && (
          <View
            style={[
              s.summaryCard,
              {
                backgroundColor: colors.primary + '0A',
                borderColor: colors.primary + '30',
              },
            ]}
          >
            <View style={s.summaryHeader}>
              <Icon name="filter-list" size={18} color={colors.primary} />
              <Text style={[s.summaryTitle, { color: colors.textMain }]}>
                خلاصه فیلترهای شما
              </Text>
            </View>

            {province && (
              <View style={s.summaryRow}>
                <Icon name="place" size={14} color={colors.textSecondary} />
                <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>
                  استان:
                </Text>
                <Text style={[s.summaryValue, { color: colors.textMain }]}>
                  {PROVINCES.find((p) => p.id === province)?.label}
                </Text>
              </View>
            )}

            {city && (
              <View style={s.summaryRow}>
                <Icon name="location-city" size={14} color={colors.textSecondary} />
                <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>
                  شهر:
                </Text>
                <Text style={[s.summaryValue, { color: colors.textMain }]}>
                  {CITIES[province]?.find((c) => c.id === city)?.label}
                </Text>
              </View>
            )}
          </View>
        )}

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
  hintCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 19,
  },
  actionsSection: {
    marginTop: 8,
    gap: 10,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#E5393510',
    borderWidth: 1,
    borderColor: '#E5393530',
  },
  clearBtnText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
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
  summaryCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
    minWidth: 50,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
});