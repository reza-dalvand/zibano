// src/components/home/AllModelRequestsHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../stores/useThemeStore';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function AllModelRequestsHeader({
  requestsCount = 0,
  onBackPress,
  onFilterPress,
  hasActiveFilter = false,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        s.headerContainer,
        {
          backgroundColor: '#E91E63',
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <View style={s.headerContent}>
        <View style={s.topRow}>
          <TouchableOpacity
            style={s.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Icon name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={s.titleContainer}>
            <View style={s.titleIconBox}>
              <Icon name="face-retouching-natural" size={22} color="#E91E63" />
            </View>
            <View style={s.titleTextCol}>
              <Text style={s.headerLabel}>فرصت‌های مدلینگ</Text>
              <Text style={s.headerTitle} numberOfLines={1}>
                لیست درخواست مدل
              </Text>
            </View>
          </View>

          {/* 🎯 دکمه فیلتر + تعداد فرصت‌ها */}
          <View style={s.rightActions}>
            {/* Badge تعداد فرصت‌ها (هم‌اندازه دکمه فیلتر) */}
            <View style={s.countBox}>
              <Icon name="assignment" size={14} color="#fff" />
              <Text style={s.countNumber}>{toPersianDigit(requestsCount)}</Text>
            </View>

            {/* دکمه فیلتر */}
            <TouchableOpacity
              onPress={onFilterPress}
              style={[
                s.filterBtn,
                hasActiveFilter && { backgroundColor: 'rgba(255,255,255,0.32)' },
              ]}
              activeOpacity={0.7}
            >
              <Icon name="tune" size={20} color="#fff" />
              {hasActiveFilter && <View style={s.filterIndicator} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  headerContainer: {
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  titleTextCol: {
    flex: 1,
    gap: 2,
  },
  headerLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
    color: 'rgba(255,255,255,0.8)',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  // 🎯 اکشن‌های سمت چپ
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // 🎯 Badge تعداد فرصت‌ها (هم‌اندازه دکمه فیلتر: 40x40)
  countBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  countNumber: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  // 🎯 دکمه فیلتر
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  filterIndicator: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FFD700',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.15)',
  },
});