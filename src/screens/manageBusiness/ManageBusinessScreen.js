// src/screens/manageBusiness/ManageBusinessScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import StarRating from '../../components/common/StarRating';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============ دیتای موقت کسب‌وکار ============
const MOCK_BUSINESS_INFO = {
  name: 'سالن زیبایی نیلارام',
  logo: 'https://picsum.photos/100/100?random=1',
  rating: 4.9,
  reviewsCount: 142,
  category: 'کلینیک پوست و مو',
  city: 'تهران، سعادت‌آباد',
  VIP: true,
};

const toPersianDigit = str =>
  String(str).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function ManageBusinessScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { businessData } = useBusiness();
  const insets = useSafeAreaInsets();

  const [currentGreeting, setCurrentGreeting] = useState('');
  const [greetingEmoji, setGreetingEmoji] = useState('👋');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setCurrentGreeting('صبح بخیر');
      setGreetingEmoji('🌅');
    } else if (hour < 17) {
      setCurrentGreeting('ظهر بخیر');
      setGreetingEmoji('☀️');
    } else {
      setCurrentGreeting('عصر بخیر');
      setGreetingEmoji('🌆');
    }
  }, []);

  // ============ محاسبه آمار از Context ============
  const stats = useMemo(() => {
    const appointments = businessData?.appointments || [];
    const todayJalaali = { jy: 1403, jm: 4, jd: 20 }; // موقت

    const activeAppointments = appointments.filter(
      apt => apt.status === 'pending' || apt.status === 'confirmed',
    ).length;

    const todayAppointments = appointments.filter(apt => {
      const d = apt.date;
      return (
        d &&
        d.jy === todayJalaali.jy &&
        d.jm === todayJalaali.jm &&
        d.jd === todayJalaali.jd
      );
    }).length;

    const totalBookings = appointments.length;
    const rating = businessData?.rating || MOCK_BUSINESS_INFO.rating;

    return {
      activeAppointments,
      todayAppointments,
      totalBookings,
      rating,
    };
  }, [businessData]);

  // ============ کارت‌های آماری (۳ کارت) ============
  const STATS_CARDS = [
    {
      id: 'active',
      label: 'نوبت فعال',
      value: toPersianDigit(stats.activeAppointments),
      icon: 'event-available',
      color: '#667eea',
      bg: '#667eea15',
      subtitle: 'در انتظار انجام',
    },
    {
      id: 'today',
      label: 'نوبت امروز',
      value: toPersianDigit(stats.todayAppointments),
      icon: 'today',
      color: '#f093fb',
      bg: '#f093fb15',
      subtitle: 'برنامه امروز',
    },
    {
      id: 'bookings',
      label: 'کل رزروها',
      value: toPersianDigit(stats.totalBookings),
      icon: 'event-note',
      color: '#4facfe',
      bg: '#4facfe15',
      subtitle: 'از ابتدا تاکنون',
    },
  ];

// ═══════════ اقدامات سریع (۶ آیتم) ═══════════
  const QUICK_ACTIONS = [
    {
      id: 'appointments',
      label: 'نوبت‌ها',
      subtitle: 'مدیریت نوبت‌های سالن',
      icon: 'event-note',
      route: 'AllAppointments',
      gradient: ['#667eea', '#764ba2'],
      badge: stats.activeAppointments,
    },
    {
      id: 'services',
      label: 'خدمات',
      subtitle: 'افزودن و ویرایش خدمات',
      icon: 'spa',
      route: 'ManageServices',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      id: 'schedule',
      label: 'زمان‌بندی',
      subtitle: 'تنظیم ساعات کاری',
      icon: 'schedule',
      route: 'ManageSchedule',
      gradient: ['#43e97b', '#38f9d7'],
    },
    {
      id: 'portfolio',
      label: 'نمونه‌کار',
      subtitle: 'گالری کارهای شما',
      icon: 'photo-library',
      route: 'ManagePortfolio',
      gradient: ['#fa709a', '#fee140'],
    },
    // 🆕 لینک اختصاصی رزرو
    {
      id: 'bookingLink',
      label: 'لینک رزرو',
      subtitle: 'لینک اختصاصی برای شبکه‌های اجتماعی',
      icon: 'link',
      route: 'BookingLink',
      gradient: ['#0088cc', '#006699'],
    },
    // 🆕 درخواست مدل
    {
      id: 'modelRequests',
      label: 'درخواست مدل',
      subtitle: 'جذب مدل برای نمونه‌کار',
      icon: 'face-retouching-natural',
      route: 'ModelRequests',
      gradient: ['#FF9800', '#F57C00'],
    },
  ];

  return (
    <ScreenWrapper scrollable padding={0} edges={['bottom', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* ═══════════ هدر با گرادیان ═══════════ */}
        <View
          style={[
            s.headerGradient,
            {
              paddingTop: insets.top + 8,
              backgroundColor: colors.primary,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            },
          ]}
        >
          {/* دایره‌های تزئینی */}
          <View
            style={[s.decorCircle1, { borderColor: 'rgba(255,255,255,0.15)' }]}
          />
          <View
            style={[s.decorCircle2, { borderColor: 'rgba(255,255,255,0.08)' }]}
          />

          <View style={s.headerContent}>
            {/* ردیف بالا: خوشامدگویی */}
            <View style={s.welcomeRow}>
              <View style={s.welcomeTextCol}>
                <Text style={s.greetingText}>
                  {greetingEmoji} {currentGreeting}
                </Text>
                <Text style={s.userName} numberOfLines={1}>
                  {user?.name || 'کاربر زیبانو'}
                </Text>
              </View>
            </View>

            {/* کارت کسب‌وکار با امتیاز */}
            <View
              style={[
                s.businessInfoRow,
                { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
              ]}
            >
              {/* لوگو */}
              <Avatar
                uri={MOCK_BUSINESS_INFO.logo}
                name={MOCK_BUSINESS_INFO.name}
                size="lg"
                showBorder
                style={s.businessAvatar}
              />

              {/* اطلاعات کسب‌وکار */}
              <View style={s.businessInfo}>
                <View style={s.bizNameRow}>
                  <Text style={s.businessName} numberOfLines={1}>
                    {MOCK_BUSINESS_INFO.name}
                  </Text>
                  {MOCK_BUSINESS_INFO.VIP && (
                    <View style={s.vipBadge}>
                      <Icon
                        name="workspace-premium"
                        size={12}
                        color="#FFD700"
                      />
                    </View>
                  )}
                </View>
                <Text style={s.bizCategory} numberOfLines={1}>
                  {MOCK_BUSINESS_INFO.category}
                </Text>
                <View style={s.bizLocationRow}>
                  <Icon name="location-on" size={12} color="#ffffffcc" />
                  <Text style={s.bizLocation} numberOfLines={1}>
                    {MOCK_BUSINESS_INFO.city}
                  </Text>
                </View>
              </View>

              {/* ═══════ 🌟 بخش امتیاز - جدید ═══════ */}
              <View style={s.ratingBox}>
                <Text style={s.ratingNumber}>
                  {toPersianDigit(stats.rating.toFixed(1))}
                </Text>
                <View style={s.ratingStarsRow}>
                  <Icon name="star" size={14} color="#FFD700" />
                  <Icon name="star" size={14} color="#FFD700" />
                  <Icon name="star" size={14} color="#FFD700" />
                  <Icon name="star" size={14} color="#FFD700" />
                  <Icon name="star-half" size={14} color="#FFD700" />
                </View>
                <Text style={s.ratingCount}>
                  ({toPersianDigit(MOCK_BUSINESS_INFO.reviewsCount)})
                </Text>
              </View>
            </View>

            {/* ردیف دکمه‌ها: کیف پول + تنظیمات */}
            <View style={s.headerActionsRow}>
              <TouchableOpacity
                style={s.walletButton}
                onPress={() => navigation.navigate('FinancialManagement')}
                activeOpacity={0.75}
              >
                <Icon name="account-balance-wallet" size={18} color="#fff" />
                <Text style={s.walletBtnText}>کیف پول</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.editButton}
                onPress={() => navigation.navigate('BusinessSettings')}
                activeOpacity={0.7}
              >
                <Icon name="settings" size={18} color="#fff" />
                <Text style={s.walletBtnText}>تنظیمات</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ═══════════ اقدامات سریع (۴ آیتم) ═══════════ */}
        <View style={[s.section, s.lastSection]}>
          <View style={s.sectionHeaderRow}>
            <View
              style={[s.sectionIcon, { backgroundColor: colors.primary + '15' }]}
            >
              <Icon name="bolt" size={18} color={colors.primary} />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              اقدامات سریع
            </Text>
          </View>

          <View style={s.quickActionsGrid}>
            {QUICK_ACTIONS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[
                  s.quickActionCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.8}
              >
                {/* آیکون با گرادیان */}
                <View
                  style={[
                    s.quickActionIconBox,
                    { backgroundColor: item.gradient[0] + '15' },
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={28}
                    color={item.gradient[0]}
                  />
                  {item.badge && item.badge > 0 && (
                    <View style={s.actionBadge}>
                      <Text style={s.actionBadgeText}>
                        {item.badge > 9 ? '۹+' : toPersianDigit(item.badge)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* متن */}
                <Text
                  style={[s.quickActionTitle, { color: colors.textMain }]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    s.quickActionSubtitle,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },

  // ═══════════ هدر ═══════════
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  headerContent: {
    gap: 16,
    position: 'relative',
    zIndex: 2,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeTextCol: {
    flex: 1,
    gap: 4,
  },
  greetingText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    color: '#ffffffcc',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
  },

  // ═══════════ کارت کسب‌وکار ═══════════
  businessInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    gap: 12,
  },
  businessAvatar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  businessInfo: {
    flex: 1,
    gap: 3,
  },
  bizNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  businessName: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
    flexShrink: 1,
  },
  vipBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,215,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bizCategory: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    color: '#ffffffdd',
  },
  bizLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  bizLocation: {
    fontSize: 10,
    fontFamily: 'Vazir',
    color: '#ffffffbb',
    flexShrink: 1,
  },

  // ═══════════ 🌟 بخش امتیاز ═══════════
  ratingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 72,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  ratingNumber: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
    lineHeight: 26,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    marginVertical: 2,
  },
  ratingCount: {
    fontSize: 9,
    fontFamily: 'Vazir',
    color: '#ffffffcc',
  },

  // ═══════════ دکمه‌های هدر ═══════════
  headerActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  walletButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  walletBtnText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
  },

  // ═══════════ بخش‌ها ═══════════
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════════ آمار (۳ کارت) ═══════════
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    marginBottom: 0,
    minHeight: 140,
  },
  statCardInner: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 9,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },

  // ═══════════ اقدامات سریع (Grid 2x2) ═══════════
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    minHeight: 150,
    justifyContent: 'center',
  },
  quickActionIconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  quickActionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 16,
    textAlign: 'center',
  },
  actionBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E53935',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBadgeText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
});