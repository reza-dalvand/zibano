// src/components/home/LineRentalFilterModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import BottomSheet from '../common/BottomSheet';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import Chip from '../common/Chip';
import Divider from '../common/Divider';

// 🎯 نوع همکاری
const COLLAB_TYPES = [
  { id: 'all', label: 'همه', icon: 'apps', color: '#607D8B' },
  { id: 'percent', label: 'درصدی', icon: 'pie-chart', color: '#9C27B0' },
  { id: 'fixed', label: 'اجاره ثابت', icon: 'attach-money', color: '#2196F3' },
  { id: 'hourly', label: 'ساعتی', icon: 'schedule', color: '#FF9800' },
];

// 🎯 نوع خدمت
const SERVICE_TYPES = [
  { id: 'all', label: 'همه خدمات' },
  { id: 'facial', label: 'فیشیال و پوست' },
  { id: 'nail', label: 'کاشت ناخن' },
  { id: 'hair_color', label: 'رنگ و لایت مو' },
  { id: 'keratin', label: 'کراتین و احیا' },
  { id: 'laser', label: 'لیزر' },
  { id: 'makeup', label: 'میکاپ و گریم' },
  { id: 'eyelash', label: 'کاشت مژه' },
  { id: 'massage', label: 'ماساژ' },
  { id: 'hair_cut', label: 'کوتاهی مو' },
  { id: 'bridal', label: 'خدمات عروس' },
];

export default function LineRentalFilterModal({
  visible,
  onClose,
  onApply,
  currentFilters,
}) {
  const { colors } = useTheme();
  const [collabType, setCollabType] = useState('all');
  const [serviceType, setServiceType] = useState('all');

  useEffect(() => {
    if (visible && currentFilters) {
      setCollabType(currentFilters.collabType || 'all');
      setServiceType(currentFilters.serviceType || 'all');
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({ collabType, serviceType });
    onClose();
  };

  const handleClear = () => {
    setCollabType('all');
    setServiceType('all');
    onApply({ collabType: 'all', serviceType: 'all' });
    onClose();
  };

  const activeCount =
    (collabType !== 'all' ? 1 : 0) +
    (serviceType !== 'all' ? 1 : 0);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="فیلتر فرصت‌های همکاری"
      snapPoint={0.6}
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
        {/* ═══════ بخش ۱: نوع همکاری ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#667eea18' }]}>
              <Icon name="handshake" size={18} color="#667eea" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              نوع همکاری
            </Text>
          </View>
          <Text style={[s.sectionHint, { color: colors.textSecondary }]}>
            مدل همکاری موردنظر خود را انتخاب کنید
          </Text>
          <View style={s.chipGrid}>
            {COLLAB_TYPES.map((ct) => {
              const isSelected = collabType === ct.id;
              return (
                <Chip
                  key={ct.id}
                  label={ct.label}
                  selected={isSelected}
                  icon={
                    <Icon
                      name={ct.icon}
                      size={14}
                      color={isSelected ? ct.color : colors.textSecondary}
                    />
                  }
                  onPress={() => setCollabType(ct.id)}
                />
              );
            })}
          </View>
        </View>

        <Divider spacing={16} />

        {/* ═══════ بخش ۲: نوع خدمت ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#E91E6318' }]}>
              <Icon name="spa" size={18} color="#E91E63" />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              نوع خدمت لاین
            </Text>
          </View>
          <Dropdown
            label="دسته‌بندی خدمت"
            placeholder="انتخاب نوع خدمت"
            value={serviceType}
            options={SERVICE_TYPES}
            onSelect={setServiceType}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  section: { gap: 12 },
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
  sectionTitle: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  sectionHint: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 18 },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footerRow: { flexDirection: 'row', gap: 10 },
  halfButton: { flex: 1 },
});