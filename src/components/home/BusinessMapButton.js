// src/components/home/BusinessMapButton.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function BusinessMapButton({ business, onPress }) {
  const { colors } = useTheme();
  const hasLocation = business?.location?.latitude && business?.location?.longitude;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        s.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
      ]}
    >
      {/* آیکون نقشه */}
      <View style={[s.iconBox, { backgroundColor: '#E5393518' }]}>
        <Icon name="map" size={26} color="#E53935" />
      </View>

      {/* متن‌ها */}
      <View style={s.textCol}>
        <Text style={[s.title, { color: colors.textMain }]}>
          آدرس روی نقشه
        </Text>
        <Text style={[s.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
          {business?.address || 'مشاهده موقعیت کسب‌وکار'}
        </Text>
      </View>

      {/* دکمه سمت چپ */}
      <View style={[s.actionBox, { backgroundColor: colors.primary }]}>
        <Icon name="directions" size={16} color="#fff" />
        <Text style={s.actionText}>مسیریابی</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
});