import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// ایمپورت‌های هماهنگ با ساختار پروژه شما
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Avatar from '../../components/common/Avatar';
import Divider from '../../components/common/Divider';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  // استفاده از کانتکست تم پروژه شما
  const { colors, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { user, logout } = useAuth();

  // داده‌های تستی (Mock) کاربر
  const user1 = {
    name: 'مریم حسینی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  };

  // لیست منوها
  const menuItems = [
    { id: 1, title: 'نوبت‌های من', icon: 'event-note', route: 'Appointments' },
    { id: 2, title: 'علاقه‌مندی‌های من', icon: 'favorite-border', route: 'Favorites' },
    { id: 3, title: 'تاریخچه پرداخت‌ها', icon: 'payment', route: 'PaymentHistory' },
    { id: 4, title: 'نظرات ثبت‌شده', icon: 'chat-bubble-outline', route: 'MyReviews' },
  ];

  // هندلر تغییر حالت شب و روز
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };


  // جایگزین هندلر logout فعلی شود
  const handleLogout = () => {
    logout();
    // پس از logout چون isAuthenticated false می‌شود،
    // اپلیکیشن به طور خودکار به LoginScreen برمی‌گردد
  };

  // رندر کردن هر آیتم منو
  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={() => navigation.navigate(item.route)}
    >
      <View style={styles.menuItemLeft}>
        <Icon name={item.icon} size={24} color={colors.primary} />
        <Text style={[styles.menuTitle, { color: colors.textMain }]}>{item.title}</Text>
      </View>
      <Icon name="chevron-left" size={24} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper scrollable={false}>
      {/* هدر */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: colors.textMain }]}>پروفایل من</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* بخش اطلاعات کاربر */}
        <View style={styles.userInfoContainer}>
          <Avatar
            source={{ uri: user1.avatarUrl }}
            size={80}
          />
          <Text style={[styles.userName, { color: colors.textMain }]}>{user1.name}</Text>
          <Text style={[styles.userPhone, { color: colors.textSecondary }]}>{user1.phone}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* بخش منوهای هدایت‌شونده */}
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>

        <Divider style={styles.divider} />

        {/* بخش تنظیمات اپلیکیشن (تم) */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>تنظیمات</Text>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={toggleTheme}
          >
            <View style={styles.menuItemLeft}>
              <Icon name={isDark ? 'light-mode' : 'dark-mode'} size={24} color={colors.primary} />
              <Text style={[styles.menuTitle, { color: colors.textMain }]}>حالت شب / روز</Text>
            </View>
            <Text style={[styles.themeText, { color: colors.primary }]}>
              {isDark ? 'تاریک' : 'روشن'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* دکمه خروج */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: '#E1306C' }]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>خروج از حساب کاربری</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold'
  },
  scrollContent: {
    paddingBottom: 40,
  },
  userInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
    marginTop: 12,
  },
  userPhone: {
    fontSize: 14,
    fontFamily: 'Vazir',
    marginTop: 4,
  },
  divider: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 15,
    fontFamily: 'Vazir',
    marginLeft: 12,
  },
  themeText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  logoutContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  logoutButton: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutButtonText: {
    color: '#E1306C',
    fontSize: 16,
    fontFamily: 'Vazir-Bold'
  },
});
