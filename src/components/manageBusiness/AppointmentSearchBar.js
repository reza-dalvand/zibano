// src/components/manageBusiness/AppointmentSearchBar.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function AppointmentSearchBar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onSearchChange?.('');
  };

  const getDateFilterLabel = () => {
    if (!dateFilter) return 'همه تاریخ‌ها';
    const labels = {
      today: 'امروز',
      week: 'این هفته',
      month: 'این ماه',
      custom: 'تاریخ سفارشی',
    };
    return labels[dateFilter] || 'همه تاریخ‌ها';
  };

  return (
    <View style={s.container}>
      {/* باکس جستجو */}
      <View
        style={[
          s.searchBox,
          {
            backgroundColor: colors.cardBackground,
            borderColor: focused ? colors.primary : colors.border,
          },
        ]}
      >
        <Icon
          name="search"
          size={20}
          color={focused ? colors.primary : colors.textSecondary}
        />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="جستجوی نام مشتری یا خدمت..."
          placeholderTextColor={colors.textSecondary + '80'}
          style={[s.input, { color: colors.textMain }]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {searchQuery?.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={s.clearBtn}
          >
            <Icon name="close" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ✅ اصلاح شده: استفاده از Text به جای span */}
      <TouchableOpacity
        style={[
          s.dateFilterBtn,
          {
            backgroundColor: dateFilter ? colors.primary + '15' : colors.cardBackground,
            borderColor: dateFilter ? colors.primary : colors.border,
          },
        ]}
        onPress={() => {
          const filters = [null, 'today', 'week', 'month'];
          const currentIndex = filters.indexOf(dateFilter);
          const nextIndex = (currentIndex + 1) % filters.length;
          onDateFilterChange?.(filters[nextIndex]);
        }}
        activeOpacity={0.7}
      >
        <Icon
          name="event"
          size={18}
          color={dateFilter ? colors.primary : colors.textMain}
        />
        {/* ✅ Text کامپوننت صحیح React Native */}
        <Text
          style={[
            s.dateFilterLabel,
            { color: dateFilter ? colors.primary : colors.textMain },
          ]}
          numberOfLines={1}
        >
          {getDateFilterLabel()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Vazir',
    paddingVertical: 0,
    textAlign: 'right',
  },
  clearBtn: {
    padding: 4,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  dateFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    minWidth: 120,
  },
  dateFilterLabel: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});