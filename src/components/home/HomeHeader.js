// src/components/home/HomeHeader.js
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../stores/useThemeStore';
import SearchBar from '../common/SearchBar';
import Avatar from '../common/Avatar';
import { useNavigation } from '@react-navigation/native';

export default function HomeHeader({
  userName,
  userAvatar,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onFilterPress,
  hasActiveFilter = false,
  isDark = false,
  onThemeToggle,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // 🎯 انیمیشن چرخش آیکون تم
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation(); // ✅ این خط را اضافه کنید

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isDark ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.7, duration: 150, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, bounciness: 12, useNativeDriver: true }),
      ]),
    ]).start();
  }, [isDark]);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

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
          {/* دکمه‌های فیلتر و تم */}
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

            {/* 🎯 آیکون تغییر تم (ماه/خورشید) */}
            <TouchableOpacity
              style={s.actionBtn}
              onPress={onThemeToggle}
              activeOpacity={0.7}
            >
              <Animated.View
                style={{
                  transform: [
                    { scale: scaleAnim },
                  ],
                }}
              >
                <Icon
                  name={isDark ? 'dark-mode' : 'light-mode'}
                  size={22}
                  color={isDark ? "#f4f6f8" : "#f5ca5b"}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* ❌ زنگوله کامنت شد */}
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
          </View>
        </View>
        {/* نوار جستجو */}
        <View style={s.searchWrapper}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('SearchScreen', { query: searchQuery });
            }}
          >
            <View pointerEvents="none">
              <SearchBar
                value={searchQuery}
                onChangeText={onSearchChange}
                placeholder="جستجوی خدمات، سالن‌ها..."
                onSubmit={onSearchSubmit}
              />
            </View>
          </TouchableOpacity>
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
  // ❌ استایل‌های زنگوله کامنت شدند
  // notificationBadge: {
  //   position: 'absolute',
  //   top: 4,
  //   right: 4,
  //   backgroundColor: '#E53935',
  //   minWidth: 18,
  //   height: 18,
  //   borderRadius: 9,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingHorizontal: 4,
  //   borderWidth: 2,
  //   borderColor: '#A88B7D',
  // },
  // notificationBadgeText: {
  //   fontSize: 10,
  //   fontFamily: 'Vazir-Bold',
  //   color: '#fff',
  // },
  searchWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
});