// src/components/home/AllLineRentalsEmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

export default function AllLineRentalsEmptyState() {
  const { colors } = useTheme();

  return (
    <View style={s.container}>
      <View style={[s.iconWrapper, { backgroundColor: '#667eea15' }]}>
        <View style={[s.iconCircle, { backgroundColor: '#667eea' }]}>
          <Icon name="storefront" size={44} color="#fff" />
        </View>
        <View style={[s.iconRing, { borderColor: '#667eea40' }]} />
      </View>
      <Text style={[s.title, { color: colors.textMain }]}>
        فعلاً آگهی لی وجود ندارد
      </Text>
      <Text style={[s.description, { color: colors.textSecondary }]}>
        به زودی فرصت‌های جدید اجاره لاین از بهترین سالن‌های شهر شما اضافه می‌شود
      </Text>
      <View style={s.tipsContainer}>
        <View style={s.tipItem}>
          <Icon name="notifications-active" size={14} color="#FF9800" />
          <Text style={[s.tipText, { color: colors.textSecondary }]}>
            اعلان‌های زیبانو را فعال کنید
          </Text>
        </View>
        <View style={s.tipItem}>
          <Icon name="schedule" size={14} color="#667eea" />
          <Text style={[s.tipText, { color: colors.textSecondary }]}>
            هر روز آگهی‌های جدید اضافه می‌شود
          </Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,
    minHeight: 400,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    zIndex: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 22,
  },
  tipsContainer: {
    marginTop: 16,
    gap: 10,
    width: '100%',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
});