// src/components/home/HomeHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 🆕
import { useTheme } from '../../theme/ThemeContext';
import SearchBar from '../common/SearchBar';
import Avatar from '../common/Avatar';

export default function HomeHeader({
  userName,
  userAvatar,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onNotificationPress,
  notificationCount = 0,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // 🆕

  return (
    <View style={[s.headerContainer, {
      backgroundColor: colors.primary,
      paddingTop: insets.top + 8, // 🎯 insets.top + فاصله اضافی
    }]}>
      <View style={s.headerContent}>
        {/* ردیف بالا: آواتار + خوشامدگویی + نوتیفیکیشن */}
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
          <TouchableOpacity
            style={s.notificationBtn}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Icon name="notifications" size={24} color="#fff" />
            {notificationCount > 0 && (
              <View style={s.notificationBadge}>
                <Text style={s.notificationBadgeText}>
                  {notificationCount > 9 ? '۹+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
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
    // paddingTop حذف شد - الان داینامیک هست
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  // بقیه استایل‌ها بدون تغییر...
  headerContent: {
    paddingHorizontal: 20,
    gap: 20,
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
    borderColor: 'rgba(255,255,255,0.3)',
  },
  welcomeTextContainer: {
    flex: 1,
    gap: 2,
  },
  greetingText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    color: '#ffffff90',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});