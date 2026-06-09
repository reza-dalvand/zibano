// src/screens/createBusiness/ManageBusinessScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import BusinessStatsCard from '../../components/manager/BusinessStatsCard';
import AppointmentManagerCard from '../../components/manager/AppointmentManagerCard';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

// دیتای موقت - بعداً با API جایگزین می‌شود
const MOCK_BUSINESS_INFO = {
  name: 'سالن زیبایی نیلارام',
  logo: 'https://picsum.photos/100/100?random=1',
  rating: 4.9,
  reviewsCount: 142,
};

const MOCK_STATS = {
  bookings: 14,
  rating: 4.8,
  revenue: 12500000,
  customers: 89,
  pendingBookings: 3,
  completedToday: 5,
};

const QUICK_ACCESS_ITEMS = [
  {
    id: 'appointments',
    label: 'نوبت‌ها',
    icon: 'event-note',
    route: 'AllAppointments',
    gradient: ['#667eea', '#764ba2'],
    badge: MOCK_STATS.pendingBookings,
  },
  {
    id: 'services',
    label: 'خدمات',
    icon: 'spa',
    route: 'ManageServices',
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 'team',
    label: 'تیم',
    icon: 'people',
    route: 'ManageTeam',
    gradient: ['#4facfe', '#00f2fe'],
  },
  {
    id: 'schedule',
    label: 'زمان‌بندی',
    icon: 'schedule',
    route: 'ManageSchedule',
    gradient: ['#43e97b', '#38f9d7'],
  },
  {
    id: 'portfolio',
    label: 'نمونه‌کار',
    icon: 'photo-library',
    route: 'ManagePortfolio',
    gradient: ['#fa709a', '#fee140'],
  },
  {
    id: 'reviews',
    label: 'نظرات',
    icon: 'rate-review',
    route: 'Reviews',
    gradient: ['#30cfd0', '#330867'],
  },
];

const MOCK_TODAY_APPOINTMENTS = [
  {
    id: '1',
    customerName: 'سارا احمدی',
    serviceName: 'فیشیال تخصصی پوست',
    date: 'امروز',
    time: '۱۰:۳۰',
    status: 'pending',
    customerAvatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    customerName: 'مریم رضایی',
    serviceName: 'لیزر فول بادی',
    date: 'امروز',
    time: '۱۲:۰۰',
    status: 'confirmed',
    customerAvatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    customerName: 'الناز کریمی',
    serviceName: 'کاشت ناخن',
    date: 'امروز',
    time: '۱۵:۴۵',
    status: 'done',
    customerAvatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const REVENUE_DATA = [
  { day: 'شنبه', amount: 2500000 },
  { day: 'یک‌شنبه', amount: 1800000 },
  { day: 'دوشنبه', amount: 3200000 },
  { day: 'سه‌شنبه', amount: 2100000 },
  { day: 'چهارشنبه', amount: 2800000 },
  { day: 'پنج‌شنبه', amount: 3500000 },
  { day: 'جمعه', amount: 1200000 },
];

export default function ManageBusinessScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(MOCK_TODAY_APPOINTMENTS);
  const [currentGreeting, setCurrentGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setCurrentGreeting('صبح بخیر');
    else if (hour < 17) setCurrentGreeting('ظهر بخیر');
    else setCurrentGreeting('عصر بخیر');
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setAppointments((current) =>
      current.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const formatNumber = (num) => {
    return num.toLocaleString('fa-IR');
  };

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    return '🌆';
  };

  return (
    <ScreenWrapper scrollable padding={0} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* هدر با گرادیان و اطلاعات کسب‌وکار */}
        <View
          style={[
            styles.headerGradient,
            {
              backgroundColor: colors.primary,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
            },
          ]}
        >
          <View style={styles.headerContent}>
            {/* بخش خوشامدگویی */}
            <View style={styles.welcomeSection}>
              <Text style={styles.greetingText}>
                {getGreetingEmoji()} {currentGreeting}
              </Text>
              <Text style={styles.userName}>
                {user?.name || 'مدیر سالن'}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                امروز {MOCK_STATS.pendingBookings} نوبت در انتظار تایید دارید
              </Text>
            </View>

            {/* لوگو و اطلاعات سالن */}
            <View style={styles.businessInfoRow}>
              <Image source={{ uri: MOCK_BUSINESS_INFO.logo }} style={styles.businessLogo} />
              <View style={styles.businessInfo}>
                <Text style={styles.businessName} numberOfLines={1}>
                  {MOCK_BUSINESS_INFO.name}
                </Text>
                <View style={styles.ratingRow}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{MOCK_BUSINESS_INFO.rating}</Text>
                  <Text style={styles.reviewsText}>
                    ({MOCK_BUSINESS_INFO.reviewsCount} نظر)
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('BusinessSettings')}
              >
                <Icon name="edit" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* کارت‌های آماری */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {/* نوبت‌های امروز */}
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <View style={[styles.statIconWrapper, { backgroundColor: '#667eea20' }]}>
                <Icon name="event-available" size={24} color="#667eea" />
              </View>
              <Text style={[styles.statValue, { color: colors.textMain }]}>
                {formatNumber(MOCK_STATS.completedToday)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                انجام شده امروز
              </Text>
            </View>

            {/* درآمد */}
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <View style={[styles.statIconWrapper, { backgroundColor: '#43e97b20' }]}>
                <Icon name="trending-up" size={24} color="#43e97b" />
              </View>
              <Text style={[styles.statValue, { color: colors.textMain }]}>
                {(MOCK_STATS.revenue / 1000000).toFixed(1)}M
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                درآمد ماهانه
              </Text>
            </View>
          </View>

          {/* کارت آمار کلی */}
          <View style={styles.overallStatsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statItemValue, { color: colors.primary }]}>
                  {formatNumber(MOCK_STATS.bookings)}
                </Text>
                <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
                  رزرو این ماه
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statItemValue, { color: colors.primary }]}>
                  {formatNumber(MOCK_STATS.customers)}
                </Text>
                <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
                  مشتری فعال
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={18} color="#FFD700" />
                  <Text style={[styles.statItemValue, { color: colors.primary }]}>
                    {MOCK_STATS.rating}
                  </Text>
                </View>
                <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
                  امتیاز کل
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* دسترسی سریع */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMain }]}>
            دسترسی سریع
          </Text>
          <View style={styles.quickAccessGrid}>
            {QUICK_ACCESS_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickAccessItem}
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.quickAccessIcon,
                    {
                      backgroundColor: item.gradient[0] + '20',
                      borderColor: item.gradient[0],
                    },
                  ]}
                >
                  <Icon name={item.icon} size={28} color={item.gradient[0]} />
                  {item.badge && item.badge > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.quickAccessLabel, { color: colors.textMain }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* نمودار درآمد هفتگی */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textMain, marginBottom: 0 }]}>
              درآمد هفتگی
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                گزارش کامل
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.chartCard,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            <View style={styles.chartContainer}>
              {REVENUE_DATA.map((item, index) => {
                const maxAmount = Math.max(...REVENUE_DATA.map((d) => d.amount));
                const height = (item.amount / maxAmount) * 100;
                return (
                  <View key={index} style={styles.chartBarContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${height}%`,
                          backgroundColor: colors.primary,
                        },
                      ]}
                    />
                    <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>
                      {item.day.substring(0, 2)}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.chartSummary}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  مجموع هفتگی
                </Text>
                <Text style={[styles.summaryValue, { color: colors.textMain }]}>
                  {formatNumber(REVENUE_DATA.reduce((sum, item) => sum + item.amount, 0))} تومان
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* نوبت‌های امروز */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textMain, marginBottom: 0 }]}>
              نوبت‌های امروز
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllAppointments')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                مشاهده همه
              </Text>
            </TouchableOpacity>
          </View>

          {appointments.length > 0 ? (
            <View style={styles.appointmentsList}>
              {appointments.map((item) => (
                <AppointmentManagerCard
                  key={item.id}
                  appointment={item}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="event-available" size={64} color={colors.textSecondary + '50'} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                برای امروز نوبتی ثبت نشده است
              </Text>
              <TouchableOpacity
                style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('AllAppointments')}
              >
                <Text style={styles.emptyButtonText}>مشاهده تقویم</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    gap: 20,
  },
  welcomeSection: {
    gap: 4,
  },
  greetingText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    color: '#ffffff',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    color: '#ffffff90',
  },
  businessInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  businessLogo: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  businessInfo: {
    flex: 1,
    gap: 4,
  },
  businessName: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
  },
  reviewsText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    color: '#ffffff90',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  overallStatsCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  statItemValue: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
  },
  statItemLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAccessItem: {
    width: '31%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickAccessIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  quickAccessLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E53935',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  chartCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBar: {
    width: '60%',
    borderRadius: 8,
    minHeight: 20,
  },
  chartLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  chartSummary: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
  summaryValue: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  lastSection: {
    marginBottom: 100,
  },
  appointmentsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
});