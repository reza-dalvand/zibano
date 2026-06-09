// src/components/explore/FilterModal.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
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
  MIN_RATINGS,
} from '../../constants/exploreFilters';

export default function FilterModal({
  visible,
  onClose,
  onApply,
  currentFilters,
}) {
  // state موقت برای تغییرات قبل از Apply
  const [province, setProvince] = useState(null);
  const [city, setCity] = useState(null);
  const [businessType, setBusinessType] = useState(null);
  const [minRating, setMinRating] = useState('0');

  // وقتی مدال باز میشه، مقادیر فعلی رو داخل state موقت کپی کن
  useEffect(() => {
    if (visible && currentFilters) {
      setProvince(currentFilters.province);
      setCity(currentFilters.city);
      setBusinessType(currentFilters.businessType);
      setMinRating(currentFilters.minRating);
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({ province, city, businessType, minRating });
    onClose();
  };

  const handleClear = () => {
    setProvince(null);
    setCity(null);
    setBusinessType(null);
    setMinRating('0');
    onApply({ province: null, city: null, businessType: null, minRating: '0' });
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

        <Dropdown
          label="نوع کسب‌وکار"
          placeholder="انتخاب نوع کسب‌وکار"
          value={businessType}
          options={BUSINESS_TYPES}
          onSelect={setBusinessType}
        />

        <Divider label="حداقل امتیاز" spacing={20} />

        <View style={styles.ratingsRow}>
          {MIN_RATINGS.map((r) => (
            <Chip
              key={r.id}
              label={r.label}
              selected={minRating === r.id}
              onPress={() => setMinRating(r.id)}
            />
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  ratingsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
});