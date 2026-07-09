// src/components/manageBusiness/AppointmentFilters.js
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

// 🎯 حذف cancelled_by_customer - فقط ۳ وضعیت + همه
const FILTERS = [
  { id: 'all', label: 'همه', icon: 'apps', color: '#607D8B' },
  { id: 'reserved', label: 'رزرو شده', icon: 'event-available', color: '#2196F3' },
  { id: 'cancelled', label: 'لغو شده', icon: 'cancel', color: '#E53935' },
  { id: 'done', label: 'انجام شده', icon: 'task-alt', color: '#43A047' },
];

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function AppointmentFilters({ activeFilter, counts, onChange }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        s.container,
        { borderBottomColor: colors.border, backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          const count = counts[f.id] || 0;
          return (
            <TouchableOpacity
              key={f.id}
              activeOpacity={0.8}
              onPress={() => onChange(f.id)}
              style={[
                s.chip,
                {
                  backgroundColor: isActive ? f.color + '20' : colors.cardBackground,
                  borderColor: isActive ? f.color : colors.border,
                },
              ]}
            >
              <Icon
                name={f.icon}
                size={15}
                color={isActive ? f.color : colors.textSecondary}
              />
              <Text
                style={[
                  s.chipText,
                  { color: isActive ? f.color : colors.textMain },
                ]}
              >
                {f.label}
              </Text>
              <View
                style={[
                  s.chipBadge,
                  { backgroundColor: isActive ? f.color : colors.border },
                ]}
              >
                <Text style={s.chipBadgeText}>{toPersianDigit(count)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  chipBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  chipBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
});