// src/screens/profile/ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStatsCard from '../../components/profile/ProfileStatsCard';
import ProfileMenuList from '../../components/profile/ProfileMenuList';
import ThemeToggleItem from '../../components/profile/ThemeToggleItem';
import Toast from '../../components/common/Toast';

export default function ProfileScreen({ navigation }) {
  const { colors, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { logout } = useAuth();

  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  // 🆕 state های منتقل شده از EditProfile
  const [promotionsEnabled, setPromotionsEnabled] = useState(true);

  const mockUser = {
    name: 'مریم حسینی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    memberSince: 'از فروردین ۱۴۰۳',
  };

  const userStats = [
    { id: 1, label: 'نوبت‌ها', value: 12, icon: 'event-note', color: '#2196F3' },
    { id: 2, label: 'علاقه‌مندی', value: 28, icon: 'favorite', color: '#E91E63' },
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
    {
      id: 'invite',
      title: 'دعوت از دوستان',
      subtitle: 'زیبانو را به دوستانتان معرفی کنید',
      icon: 'people',
      route: 'InviteFriends',
      color: '#9C27B0',
    },
  ];

  const settingsMenuItems = [
    {
      id: 'support',
      title: 'پشتیبانی و راهنما',
      subtitle: 'سوالات متداول، چت و تماس با ما',
      icon: 'help-outline',
      route: 'Support',
      color: '#607D8B',
    },
  ];

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

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
      ]
    );
  };

  // 🆕 هندلر حذف حساب کاربری
  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ حذف حساب کاربری',
      'آیا از حذف دائمی حساب کاربری خود مطمئن هستید؟\n\nاین عمل قابل بازگشت نیست و تمامی اطلاعات شما شامل:\n\n• سوابق نوبت‌ها\n• علاقه‌مندی‌ها\n• سوابق پرداخت\n• نظرات و امتیازات\n\nبه طور کامل حذف خواهد شد.',
      [
        { text: 'انصراف', style: 'cancel' },
        {
          text: 'حذف دائمی حساب',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'تایید نهایی',
              'برای تایید نهایی حذف حساب، لطفاً عبارت "حذف" را در کادر زیر وارد کنید.',
              [
                { text: 'انصراف', style: 'cancel' },
                {
                  text: 'ادامه',
                  onPress: () => {
                    setToast({
                      visible: true,
                      message: 'این قابلیت در فاز بعدی فعال می‌شود',
                      type: 'info',
                    });
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  // 🆕 هندلر تغییر وضعیت پیشنهادات
  const handleTogglePromotions = (value) => {
    setPromotionsEnabled(value);
    setToast({
      visible: true,
      message: value
        ? 'دریافت پیشنهادات و تخفیف‌ها فعال شد'
        : 'دریافت پیشنهادات و تخفیف‌ها غیرفعال شد',
      type: 'info',
    });
  };

  const handleMenuPress = (item) => navigation.navigate(item.route);

  return (
    <ScreenWrapper scrollable={false} padding={0} edges={['top']}>
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

          {/* 🆕 دریافت پیشنهادات و تخفیف‌ها */}
          <Card
            variant="default"
            padding={0}
            radius={16}
            style={[s.promotionsCard, { borderColor: colors.border }]}
          >
            <View style={s.promotionsRow}>
              <View style={s.promotionsInfo}>
                <View style={[s.promotionsIconBox, { backgroundColor: '#FF980020' }]}>
                  <Icon name="campaign" size={22} color="#FF9800" />
                </View>
                <View style={s.promotionsText}>
                  <Text style={[s.promotionsTitle, { color: colors.textMain }]}>
                    دریافت پیشنهادات و تخفیف‌ها
                  </Text>
                  <Text style={[s.promotionsSubtitle, { color: colors.textSecondary }]}>
                    از تخفیف‌های ویژه و پیشنهادات اختصاصی از طریق پیامک باخبر شوید
                  </Text>
                </View>
              </View>
              <Switch
                value={promotionsEnabled}
                onValueChange={handleTogglePromotions}
                thumbColor={promotionsEnabled ? colors.primary : '#ccc'}
                trackColor={{ true: colors.primary + '55', false: '#ddd' }}
              />
            </View>
          </Card>

          <View style={{ height: 10 }} />

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

        {/* ═══════════════ ناحیه خطرناک ═══════════════ */}
        <View style={s.section}>
          <Card
            variant="default"
            padding={0}
            radius={16}
            style={[s.dangerCard, { borderColor: '#E5393540', backgroundColor: '#E5393508' }]}
          >
            <View style={s.dangerRow}>
              <View style={s.dangerInfo}>
                <View style={[s.dangerIconBox, { backgroundColor: '#E5393520' }]}>
                  <Icon name="delete-forever" size={22} color="#E53935" />
                </View>
                <View style={s.dangerText}>
                  <Text style={[s.dangerTitle, { color: '#E53935' }]}>
                    حذف حساب کاربری
                  </Text>
                  <Text style={[s.dangerSubtitle, { color: colors.textSecondary }]}>
                    حذف دائمی حساب و تمامی اطلاعات شما. این عمل قابل بازگشت نیست.
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleDeleteAccount}
              style={[s.dangerBtn, { borderColor: '#E53935' }]}
              activeOpacity={0.75}
            >
              <Icon name="delete-forever" size={18} color="#E53935" />
              <Text style={[s.dangerBtnText, { color: '#E53935' }]}>
                حذف حساب کاربری
              </Text>
            </TouchableOpacity>
          </Card>
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
            iconPosition="right"
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

  // ═══════════════ پیشنهادات و تخفیف‌ها ═══════════════
  promotionsCard: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  promotionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 12,
  },
  promotionsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  promotionsIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promotionsText: {
    flex: 1,
    gap: 2,
  },
  promotionsTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  promotionsSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 17,
  },

  // ═══════════════ ناحیه خطرناک ═══════════════
  dangerCard: {
    borderWidth: 1.5,
    overflow: 'hidden',
    padding: 14,
    gap: 12,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dangerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  dangerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerText: {
    flex: 1,
    gap: 3,
  },
  dangerTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  dangerSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 17,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#E5393510',
  },
  dangerBtnText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════════════ خروج ═══════════════
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