// src/components/manageBusiness/services/ServiceHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';

export default function ServiceHeader({ servicesCount }) {
  const { colors } = useTheme();

  return (
    <View style={s.headerContainer}>
      <View style={s.iconWrapper}>
        <View style={[s.iconCircle, { backgroundColor: colors.primary }]}>
          <Icon name="spa" size={26} color="#fff" />
        </View>
        <View style={[s.iconRing, { borderColor: colors.primary + '40' }]} />
      </View>
      <Text style={[s.title, { color: colors.textMain }]}>
        خدمات سالن شما
      </Text>
      <Text style={[s.subtitle, { color: colors.textSecondary }]}>
        مدیریت، ویرایش و افزودن خدمات جدید
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    gap: 8,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    marginBottom: 4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
});