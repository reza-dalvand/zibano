// src/screens/profile/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStatsCard from '../../components/profile/ProfileStatsCard';
import ProfileMenuList from '../../components/profile/ProfileMenuList';
import ThemeToggleItem from '../../components/profile/ThemeToggleItem';
import Toast from '../../components/common/Toast';

export default function ProfileScreen({ navigation }) {
  // ═══════════ همه Hook‌ها در ابتدا ═══════════
  const { colors, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { logout } = useAuth();
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info',
  });

  // ═══════════ داده‌های ثابت ═══════════
  const mockUser = {
    name: 'مریم حسینی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    memberSince: 'از فروردین ۱۴۰۳',
  };

  const userStats = [
    {
      id: 1,
      label: 'نوبت‌ها',
      value: 12,
      icon: 'event-note',
      color: '#2196F3',
    },
    {
      id: 2,
      label: 'علاقه‌مندی',
      value: 28,
      icon: 'favorite',
      color: '#E91E63',
    },
  ];

  const quickMenuItems = [
    {
      id: 'appointments',
      title: 'نوبت‌های من',
      subtitle: 'نوبت‌های آینده و گذشته',
      icon: 'event-note',
      route: 'Appointments',
      color: '#2196F3',
      badge: 2,
    },
    {
      id: 'favorites',
      title: 'علاقه‌مندی‌های من',
      subtitle: 'کسب‌وکارها و پست‌های ویترین',
      icon: 'favorite-border',
      route: 'Favorites',
      color: '#E91E63',
    },
    {
      id: 'payments',
      title: 'تاریخچه پرداخت‌ها',
      subtitle: 'سوابق مالی و بیعانه‌ها',
      icon: 'payment',
      route: 'PaymentHistory',
      color: '#4CAF50',
    },
    {
      id: 'edit',
      title: 'ویرایش پروفایل',
      subtitle: 'نام، عکس و شماره موبایل',
      icon: 'edit',
      route: 'EditProfile',
      color: '#FF9800',
    },
  ];

  const settingsMenuItems = [
    {
      id: 'devices',
      title: 'دستگاه‌های فعال',
      subtitle: 'مدیریت نشست‌های فعال و امنیت حساب',
      icon: 'devices',
      route: 'ActiveDevices',
      color: '#2196F3',
      badge: 4,
    },
    {
      id: 'support',
      title: 'پشتیبانی و راهنما',
      subtitle: 'سوالات متداول، چت و تماس با ما',
      icon: 'help-outline',
      route: 'Support',
      color: '#607D8B',
    },
  ];

  // ═══════════ Handlers ═══════════
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const handleMenuPress = item => navigation.navigate(item.route);

  const handleLogout = () => {
    Alert.alert(
      'خروج از حساب کاربری',
      'آیا از خروج از حساب کاربری خود مطمئن هستید؟',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'خروج',
          style: 'destructive',
          onPress: () => {
            logout();
            setToast({
              visible: true,
              message: 'با موفقیت از حساب خارج شدید',
              type: 'success',
            });
          },
        },
      ],
    );
  };


  // ═══════════ Render ═══════════
  return (
    <ScreenWrapper
      scrollable={false}
      padding={0}
      edges={['bottom', 'left', 'right']}
    >
      <ProfileHeader user={mockUser} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        <ProfileStatsCard stats={userStats} />
        <ProfileMenuList
          title="دسترسی سریع"
          items={quickMenuItems}
          onItemPress={handleMenuPress}
        />

        {/* ═══════════════ بخش تنظیمات ═══════════════ */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            تنظیمات
          </Text>

          {/* تم شب/روز */}
          <View style={{ marginBottom: 10 }}>
            <ThemeToggleItem isDark={isDark} onToggle={toggleTheme} />
          </View>

          <ProfileMenuList
            title=""
            items={settingsMenuItems}
            onItemPress={handleMenuPress}
          />
        </View>

        {/* ═══════════════ خروج و نسخه ═══════════════ */}
        <View style={s.logoutContainer}>
          <Button
            title="خروج از حساب کاربری"
            onPress={handleLogout}
            variant="outline"
            size="lg"
            fullWidth
            icon={<Icon name="logout" size={20} color="#E53935" />}
            iconPosition="left"
            style={s.logoutButton}
            textStyle={{ color: '#E53935' }}
          />
          <Text style={[s.versionText, { color: colors.textSecondary }]}>
            نسخه ۱.۰.۰ - زیبانو
          </Text>
        </View>
      </ScrollView>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        position="top"
        onHide={() => setToast({ ...toast, visible: false })}
      />
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
