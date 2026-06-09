// src/screens/profile/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStatsCard from '../../components/profile/ProfileStatsCard';
import ProfileMenuList from '../../components/profile/ProfileMenuList';
import ThemeToggleItem from '../../components/profile/ThemeToggleItem';

export default function ProfileScreen({ navigation }) {
  const { colors, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { logout } = useAuth();

  // 🎯 داده‌های موقت (بعداً از API گرفته می‌شود)
  const mockUser = {
    name: 'مریم حسینی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    memberSince: 'از فروردین ۱۴۰۳',
  };

  // 📊 آمار کاربر
  const userStats = [
    { id: 1, label: 'نوبت‌ها', value: 12, icon: 'event-note', color: '#2196F3' },
    { id: 2, label: 'علاقه‌مندی', value: 28, icon: 'favorite', color: '#E91E63' },
    { id: 3, label: 'نظرات', value: 8, icon: 'rate-review', color: '#4CAF50' },
  ];

  // 📋 منوهای دسترسی سریع
  const quickMenuItems = [
    {
      id: 1,
      title: 'نوبت‌های من',
      subtitle: 'نوبت‌های آینده و گذشته',
      icon: 'event-note',
      route: 'Appointments',
      color: '#2196F3',
      badge: 2,
    },
    {
      id: 2,
      title: 'علاقه‌مندی‌های من',
      subtitle: 'سالن‌ها و خدمات ذخیره‌شده',
      icon: 'favorite-border',
      route: 'Favorites',
      color: '#E91E63',
    },
    {
      id: 3,
      title: 'تاریخچه پرداخت‌ها',
      subtitle: 'سوابق مالی و بیعانه‌ها',
      icon: 'payment',
      route: 'PaymentHistory',
      color: '#4CAF50',
    },
    {
      id: 4,
      title: 'نظرات ثبت‌شده',
      subtitle: 'امتیازها و نظرات شما',
      icon: 'chat-bubble-outline',
      route: 'MyReviews',
      color: '#FF9800',
    },
    {
      id: 5,
      title: 'دعوت از دوستان',
      subtitle: 'کسب امتیاز با معرفی زیبانو',
      icon: 'people',
      route: 'InviteFriends',
      color: '#9C27B0',
    },
  ];

  // ⚙️ منوهای تنظیمات
  const settingsMenuItems = [
    {
      id: 'support',
      title: 'پشتیبانی و راهنما',
      subtitle: 'سوالات متداول و تماس با ما',
      icon: 'help-outline',
      route: 'Support',
      color: '#607D8B',
    },
  ];

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');
  const handleLogout = () => logout();
  const handleMenuPress = (item) => navigation.navigate(item.route);

  return (
    <ScreenWrapper scrollable={false} padding={0} edges={['top']}>
      {/* هدر گرادیانی با Avatar */}
      <ProfileHeader user={mockUser} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* کارت آماری */}
        <ProfileStatsCard stats={userStats} />

        {/* منوهای دسترسی سریع */}
        <ProfileMenuList
          title="دسترسی سریع"
          items={quickMenuItems}
          onItemPress={handleMenuPress}
        />

        {/* تنظیمات */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            تنظیمات
          </Text>

          {/* آیتم تغییر تم (با کامپوننت اختصاصی و سوئیچ انیمیشنی) */}
          <View style={{ marginBottom: 10 }}>
            <ThemeToggleItem isDark={isDark} onToggle={toggleTheme} />
          </View>

          {/* منوهای تنظیمات (همان استایل معمولی) */}
          <ProfileMenuList
            title=""
            items={settingsMenuItems}
            onItemPress={handleMenuPress}
          />
        </View>

        {/* دکمه خروج */}
        <View style={s.logoutContainer}>
          <Button
            title="خروج از حساب کاربری"
            onPress={handleLogout}
            variant="outline"
            size="lg"
            fullWidth
            icon={<Icon name="logout" size={20} color="#E53935" />}
            iconPosition="right"
            style={s.logoutButton}
            textStyle={{ color: '#E53935' }}
          />

          <Text style={[s.versionText, { color: colors.textSecondary }]}>
            نسخه ۱.۰.۰ - زیبانو
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    marginBottom: 12,
  },
  logoutContainer: {
    marginTop: 16,
    gap: 12,
  },
  logoutButton: {
    borderColor: '#E53935',
    borderWidth: 1.5,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
});