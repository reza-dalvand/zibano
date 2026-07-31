// src/screens/home/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { getSubServicesForCategory } from '../../constants/categorySubServices';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import HomeHeader from '../../components/home/HomeHeader';
import AdSlider from '../../components/home/AdSlider';
import CategoryGrid from '../../components/home/CategoryGrid';
import NotificationModal from '../../components/home/NotificationModal';
import HomeFilterModal from '../../components/home/HomeFilterModal';
import ModelRequestsSection from '../../components/home/ModelRequestsSection';
import LineRentalSection from '../../components/home/LineRentalSection';
import SeeAllButton from '../../components/home/SeeAllButton';
import ReviewModal from '../../components/customer/ReviewModal';
import { useAuthStore } from '../../stores/useAuthStore';
import { useReviewStore } from '../../stores/useReviewStore';
import { useAuth } from '../../hooks/useAuth';
import SectionHeader from '../../components/common/SectionHeader';

// 🎯 داده‌های آگهی‌ها با businessId
const MOCK_ADS = [
  {
    id: 1,
    businessId: '1',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    title: 'جشنواره تخفیف‌های بهار کلینیک رُز',
    subtitle: 'تا ۳۰٪ تخفیف خدمات پوست',
    badge: 'پیشنهاد ویژه',
  },
  {
    id: 2,
    businessId: '2',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    title: 'افتتاحیه سالن زیبایی لاویا',
    subtitle: 'نوبت‌دهی آنلاین با بیعانه اقتصادی',
    badge: 'جدید',
  },
  {
    id: 3,
    businessId: '3',
    imageUrl: 'https://picsum.photos/800/400?random=3',
    title: 'لیزر با جدیدترین دستگاه ۲۰۲۴',
    subtitle: 'مرکز رویال - تخفیف ویژه',
    badge: 'پرفروش',
  },
];

// 🎯 داده‌های دسته‌بندی‌ها
const MOCK_CATEGORIES = [
  {
    id: 1,
    name: 'میکاپ',
    icon: 'face',
    color: '#E91E63',
    count: getSubServicesForCategory(1).length,
  },
  {
    id: 2,
    name: 'کاشت ناخن',
    icon: 'brush',
    color: '#9C27B0',
    count: getSubServicesForCategory(2).length,
  },
  {
    id: 3,
    name: 'لیزر مو',
    icon: 'flash-on',
    color: '#2196F3',
    count: getSubServicesForCategory(3).length,
  },
  {
    id: 4,
    name: 'پاکسازی',
    icon: 'spa',
    color: '#4CAF50',
    count: getSubServicesForCategory(4).length,
  },
  {
    id: 5,
    name: 'رنگ مو',
    icon: 'palette',
    color: '#FF9800',
    count: getSubServicesForCategory(5).length,
  },
  {
    id: 6,
    name: 'کراتین',
    icon: 'auto-awesome',
    color: '#00BCD4',
    count: getSubServicesForCategory(6).length,
  },
  {
    id: 7,
    name: 'مژه',
    icon: 'visibility',
    color: '#795548',
    count: getSubServicesForCategory(7).length,
  },
  {
    id: 8,
    name: 'ماساژ',
    icon: 'self-improvement',
    color: '#607D8B',
    count: getSubServicesForCategory(8).length,
  },
];

// 🆕 نوبت‌های انجام‌شده برای نمایش مدال نظردهی
const MOCK_DONE_APPOINTMENTS = [
  {
    id: 'apt_done_1',
    businessName: 'سالن زیبایی نیلارام',
    businessLogo: 'https://picsum.photos/100/100?random=21',
    serviceName: 'فیشیال تخصصی پوست',
    employeeName: 'سارا احمدی',
    date: '۱۴۰۳/۰۴/۱۸',
    time: '۱۰:۳۰',
    status: 'done',
  },
];

export default function HomeScreen({ navigation }) {
  const { colors, resolvedTheme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const pendingReviews = useReviewStore((s) => s.pendingReviews);
  const addPendingReview = useReviewStore((s) => s.addPendingReview);
  const { isAuthenticated, requireAuth } = useAuth();
  const isDark = resolvedTheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({});
  
  // 🆕 state های مدال نظردهی
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [currentReviewAppointment, setCurrentReviewAppointment] = useState(null);

  const hasActiveFilter = Object.values(filters).some(
    (v) => v && v !== 'all' && v !== 'recommended' && (!Array.isArray(v) || v.length > 0),
  );
  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  const notificationCount = 3;

  // 🆕 اضافه کردن نوبت‌های انجام‌شده به لیست pendingReviews (شبیه‌سازی)
  useEffect(() => {
    MOCK_DONE_APPOINTMENTS.forEach((apt) => {
      addPendingReview(apt);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🆕 نمایش خودکار مدال نظردهی وقتی نوبت در انتظار وجود دارد
  useEffect(() => {
    if (pendingReviews.length > 0 && !reviewModalVisible) {
      const timer = setTimeout(() => {
        setCurrentReviewAppointment(pendingReviews[0]);
        setReviewModalVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pendingReviews, reviewModalVisible]);

  // 🆕 هندلر بستن مدال نظردهی
  const handleReviewClose = () => {
    setReviewModalVisible(false);
    setCurrentReviewAppointment(null);
  };

  // 🎯 هندلر کلیک روی آگهی اسلایدر
  const handleAdPress = (ad) => {
    if (ad.businessId) {
      navigation.navigate('BusinessDetails', { businessId: ad.businessId });
    }
  };

  return (
    <ScreenWrapper scrollable padding={0} edges={['bottom', 'left', 'right']}>
      <HomeHeader
        userName={user?.name}
        userAvatar={user?.avatar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() =>
          navigation?.navigate('SearchFilter', { query: searchQuery })
        }
        // ❌ کامنت شد
        // onNotificationPress={() => setNotificationModalVisible(true)}
        // notificationCount={notificationCount}
        onFilterPress={() => setFilterModalVisible(true)}
        hasActiveFilter={hasActiveFilter}
        // 🎯 props جدید تم
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
      />

      {/* 🆕 بنر دعوت به ثبت‌نام - فقط برای کاربران لاگین نشده */}
      {!isAuthenticated && (
        <View style={[s.authBanner, {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        }]}>
          {/* نقطه‌های تزئینی */}
          <View style={[s.authBannerDot1, { backgroundColor: colors.primary + '18' }]} />
          <View style={[s.authBannerDot2, { backgroundColor: '#FFC10720' }]} />
          
          <View style={s.authBannerContent}>
            <View style={s.authBannerLeft}>
              <View style={[s.authBannerIconBox, { 
                backgroundColor: colors.primary + '15',
                borderColor: colors.primary + '30',
              }]}>
                <Icon name="auto-awesome" size={22} color={colors.primary} />
              </View>
              <View style={s.authBannerTextCol}>
                <Text style={[s.authBannerTitle, { color: colors.textMain }]}>
                  امکانات بیشتری می‌خوای؟ ✨
                </Text>
                <Text style={[s.authBannerSubtitle, { color: colors.textSecondary }]}>
                  رزرو آنلاین، ساخت آگهی، ذخیره و اشتراک پست‌ها و ... 
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => requireAuth()} 
              activeOpacity={0.85}
              style={[s.authBannerBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={s.authBannerBtnText}>ورود</Text>
              <Icon name="arrow-back" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={s.bodyContainer}>
        {/* ۱. اسلایدر تبلیغات */}
        <View style={s.section}>
          <AdSlider ads={MOCK_ADS} onPress={handleAdPress} />
        </View>

        {/* ۲. دسته‌بندی خدمات */}
        <View style={s.section}>
          <SectionHeader
            icon="category"
            iconColor="#FF9800"
            title="دسته‌بندی خدمات"
          />
          <CategoryGrid
            categories={MOCK_CATEGORIES}
            selectedId={selectedCategory}
            onSelect={(item) => {
              setSelectedCategory(item.id);
              navigation.navigate('CategoryBusinesses', {
                categoryId: item.id,
                categoryName: item.name,
              });
            }}
          />
        </View>

        {/* ۳. فرصت‌های مدلینگ */}
        <ModelRequestsSection />

        {/* ۴. فرصت‌های همکاری / اجاره لاین */}
        <LineRentalSection />
      </View>

      {/* مدال اعلان‌ها */}
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
      />

      {/* مدال فیلتر خانه */}
      <HomeFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />

      {/* 🆕 مدال نظردهی پس از انجام نوبت */}
      <ReviewModal
        visible={reviewModalVisible}
        appointment={currentReviewAppointment}
        onClose={handleReviewClose}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  bodyContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  // 🆕 استایل‌های بنر دعوت به ثبت‌نام
  authBanner: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  authBannerDot1: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  authBannerDot2: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  authBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  authBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  authBannerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  authBannerTextCol: {
    flex: 1,
    gap: 2,
  },
  authBannerTitle: {
    fontSize: 13.5,
    fontFamily: 'Vazir-Bold',
    lineHeight: 19,
  },
  authBannerSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 16,
  },
  authBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  authBannerBtnText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});