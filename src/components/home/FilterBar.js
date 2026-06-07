// src/components/home/FilterBar.js

import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const FilterBar = ({ filters = [], selectedId, onSelect }) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container} // لیست به طور خودکار به خاطر RTL از راست شروع می‌شود
    >
      {filters.map(item => {
        const active = item.id === selectedId;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelect?.(item)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.primary : colors.cardBackground,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: active ? '#ffffff' : colors.textMain,
                  fontFamily: active ? 'Vazir-Bold' : 'Vazir',
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // واگذاری چیدمان راست‌چین به موتور سیستم عامل
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24, // استایل کپسولی ملایم و مدرن
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
  },
});

export default FilterBar;