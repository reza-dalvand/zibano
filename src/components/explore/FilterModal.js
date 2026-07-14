// src/components/explore/FilterModal.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheet from '../common/BottomSheet';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import Divider from '../common/Divider';
import {
  PROVINCES,
  CITIES,
  BUSINESS_TYPES,
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

  useEffect(() => {
    if (visible && currentFilters) {
      setProvince(currentFilters.province);
      setCity(currentFilters.city);
      setBusinessType(currentFilters.businessType);
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({ province, city, businessType });
    onClose();
  };

  const handleClear = () => {
    setProvince(null);
    setCity(null);
    setBusinessType(null);
    onApply({ province: null, city: null, businessType: null });
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
        <Dropdown
          label="نوع کسب‌وکار"
          placeholder="انتخاب نوع کسب‌وکار"
          value={businessType}
          options={BUSINESS_TYPES}
          onSelect={setBusinessType}
        />
        <Divider spacing={20} />
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({});