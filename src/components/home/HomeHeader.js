// src/components/home/HomeHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../stores/useThemeStore';
import SearchBar from '../common/SearchBar';
import Avatar from '../common/Avatar';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function HomeHeader({
  userName,
  userAvatar,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onNotificationPress,
  notificationCount = 0,
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
          paddingTop: insets.top + 8,
          backgroundColor: colors.primary,
        },
      ]}
    >
      {/* دایره‌های تزئینی پس‌زمینه */}
      <View style={[s.decorCircle1, { borderColor: 'rgba(255,255,255,0.12)' }]} />
      <View style={[s.decorCircle2, { borderColor: 'rgba(255,255,255,0.08)' }]} />

      <View style={s.headerContent}>
        {/* ردیف بالا: آواتار + خوشامدگویی + اکشن‌ها */}
        <View style={s.topRow}>
          <View style={s.welcomeSection}>
            <Avatar
              uri={userAvatar}
              name={userName}
              size="md"
              showBorder
              style={s.avatar}
            />
            <View style={s.welcomeTextContainer}>
              <Text style={s.greetingText}>سلام، وقت بخیر 👋</Text>
              <Text style={s.userName} numberOfLines={1}>
                {userName || 'کاربر زیبانو'}
              </Text>
            </View>
          </View>

          {/* دکمه‌های فیلتر و زنگوله */}
          <View style={s.actionsRow}>
            {/* فیلتر */}
            <TouchableOpacity
              style={[
                s.actionBtn,
                hasActiveFilter && { backgroundColor: 'rgba(255,255,255,0.32)' },
              ]}
              onPress={onFilterPress}
              activeOpacity={0.7}
            >
              <Icon name="tune" size={22} color="#fff" />
              {hasActiveFilter && (
                <View style={s.filterIndicator} />
              )}
            </TouchableOpacity>

            {/* زنگوله با Badge */}
            <TouchableOpacity
              style={s.actionBtn}
              onPress={onNotificationPress}
              activeOpacity={0.7}
            >
              <Icon name="notifications" size={22} color="#fff" />
              {notificationCount > 0 && (
                <View style={s.notificationBadge}>
                  <Text style={s.notificationBadgeText}>
                    {notificationCount > 9 ? '۹+' : toPersianDigit(notificationCount)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* نوار جستجو */}
        <View style={s.searchWrapper}>
          <SearchBar
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="جستجوی خدمات، سالن‌ها..."
            onSubmit={onSearchSubmit}
          />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  headerContainer: {
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    position: 'relative',
    // overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  headerContent: {
    paddingHorizontal: 20,
    gap: 16,
    position: 'relative',
    zIndex: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.59)',
  },
  welcomeTextContainer: {
    flex: 1,
    gap: 2,
  },
  greetingText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    color: 'rgba(255,255,255,0.85)',
  },
  userName: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    borderWidth: 1.5,
    borderColor: '#A88B7D',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E53935',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#A88B7D',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  searchWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
});