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
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 🆕

// ============ دیتای موقت کسب‌وکار ============
const MOCK_BUSINESS_INFO = {
  name: 'سالن زیبایی نیلارام',
  logo: 'https://picsum.photos/100/100?random=1',
  rating: 4.9,
  category: 'کلینیک پوست و مو',
  city: 'تهران، سعادت‌آباد',
  VIP: true,
};

const toPersianDigit = str =>
  String(str).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

// ============ نقش‌ها و متن‌ها ============
const ROLE_LABELS = {
  manager: 'مدیر',
  employee: 'کارمند',
};

const ROLE_ICONS = {
  manager: 'verified-user',
  employee: 'badge',
};

export default function ManageBusinessScreen({
  navigation,
  userRole = 'manager',
}) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { businessData } = useBusiness();
  const insets = useSafeAreaInsets(); // 🆕

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

    const activeAppointments = appointments.filter(
      apt => apt.status === 'pending' || apt.status === 'confirmed',
    ).length;

    const teamCount = businessData?.team?.length || 0;
    const rating = businessData?.rating || MOCK_BUSINESS_INFO.rating;
    const bookings = appointments.length || 0;

    return {
      activeAppointments,
      teamCount,
      rating,
      bookings,
    };
  }, [businessData]);

  // ============ کارت‌های آماری ============
  const STATS_CARDS = [
    {
      id: 'active',
      label: 'نوبت فعال',
      value: toPersianDigit(stats.activeAppointments),
      icon: 'event-available',
      color: '#667eea',
      bg: '#667eea15',
    },
    {
      id: 'bookings',
      label: 'کل رزروها',
      value: toPersianDigit(stats.bookings),
      icon: 'event-note',
      color: '#f093fb',
      bg: '#f093fb15',
    },
    {
      id: 'team',
      label: 'اعضای تیم',
      value: toPersianDigit(stats.teamCount),
      icon: 'people-alt',
      color: '#4facfe',
      bg: '#4facfe15',
    },
    {
      id: 'rating',
      label: 'امتیاز',
      value: toPersianDigit(stats.rating.toFixed(1)),
      icon: 'star',
      color: '#FFC107',
      bg: '#FFC10715',
    },
  ];

  // ============ اقدامات سریع (۵ آیتم اصلی) ============
  const QUICK_ACTIONS = [
    {
      id: 'appointments',
      label: 'نوبت‌ها',
      subtitle: 'مدیریت و مشاهده نوبت‌های سالن',
      icon: 'event-note',
      route: 'AllAppointments',
      gradient: ['#667eea', '#764ba2'],
      badge: stats.activeAppointments,
    },
    {
      id: 'services',
      label: 'خدمات',
      subtitle: 'افزودن و ویرایش خدمات سالن',
      icon: 'spa',
      route: 'ManageServices',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      id: 'team',
      label: 'تیم',
      subtitle: 'مدیریت کارمندان و تخصص‌ها',
      icon: 'people',
      route: 'ManageTeam',
      gradient: ['#4facfe', '#00f2fe'],
      badge: stats.teamCount,
    },
    {
      id: 'schedule',
      label: 'زمان‌بندی',
      subtitle: 'تنظیم شیفت و برنامه کارمندان',
      icon: 'schedule',
      route: 'ManageSchedule',
      gradient: ['#43e97b', '#38f9d7'],
    },
    {
      id: 'portfolio',
      label: 'نمونه‌کار',
      subtitle: 'آپلود و مدیریت گالری کارها',
      icon: 'photo-library',
      route: 'ManagePortfolio',
      gradient: ['#fa709a', '#fee140'],
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
              paddingTop: insets.top + 8, // 🎯 insets.top
              backgroundColor: colors.primary,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            },
          ]}
        >
          <View
            style={[s.decorCircle1, { borderColor: 'rgba(255,255,255,0.15)' }]}
          />
          <View
            style={[s.decorCircle2, { borderColor: 'rgba(255,255,255,0.08)' }]}
          />

          <View style={s.headerContent}>
            <View style={s.welcomeRow}>
              <View style={s.welcomeTextCol}>
                <Text style={s.greetingText}>
                  {greetingEmoji} {currentGreeting}
                </Text>
                <Text style={s.userName} numberOfLines={1}>
                  {user?.name || 'کاربر زیبانو'}
                </Text>
              </View>

              <View
                style={[
                  s.roleBadge,
                  { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                ]}
              >
                <Icon
                  name={ROLE_ICONS[userRole] || 'person'}
                  size={14}
                  color="#fff"
                />
                <Text style={s.roleBadgeText}>
                  {ROLE_LABELS[userRole] || 'کاربر'}
                </Text>
              </View>
            </View>

            <View
              style={[
                s.businessInfoRow,
                { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
              ]}
            >
              <Avatar
                uri={MOCK_BUSINESS_INFO.logo}
                name={MOCK_BUSINESS_INFO.name}
                size="lg"
                showBorder
                style={s.businessAvatar}
              />
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

              <TouchableOpacity
                style={s.editButton}
                onPress={() => navigation.navigate('BusinessSettings')}
                activeOpacity={0.7}
              >
                <Icon name="settings" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ═══════════ بخش آمار ═══════════ */}
        <View style={s.statsSection}>
          <View style={s.sectionHeaderRow}>
            <View
              style={[
                s.sectionIcon,
                { backgroundColor: colors.primary + '15' },
              ]}
            >
              <Icon name="insights" size={18} color={colors.primary} />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              خلاصه عملکرد
            </Text>
          </View>

          <View style={s.statsGrid}>
            {STATS_CARDS.map(stat => (
              <Card
                key={stat.id}
                variant="elevated"
                padding={0}
                radius={18}
                style={s.statCard}
              >
                <View style={s.statCardInner}>
                  <View style={[s.statIconBox, { backgroundColor: stat.bg }]}>
                    <Icon name={stat.icon} size={22} color={stat.color} />
                  </View>
                  <Text style={[s.statValue, { color: colors.textMain }]}>
                    {stat.value}
                  </Text>
                  <Text style={[s.statLabel, { color: colors.textSecondary }]}>
                    {stat.label}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* ═══════════ اقدامات سریع ═══════════ */}
        <View style={[s.section, s.lastSection]}>
          <View style={s.sectionHeaderRow}>
            <View
              style={[
                s.sectionIcon,
                { backgroundColor: colors.primary + '15' },
              ]}
            >
              <Icon name="bolt" size={18} color={colors.primary} />
            </View>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              اقدامات سریع
            </Text>
          </View>

          <View style={s.quickActionsList}>
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
                <View
                  style={[
                    s.quickActionIconBox,
                    { backgroundColor: item.gradient[0] + '15' },
                  ]}
                >
                  <Icon name={item.icon} size={22} color={item.gradient[0]} />

                  {item.badge && item.badge > 0 && (
                    <View style={s.actionBadge}>
                      <Text style={s.actionBadgeText}>
                        {item.badge > 9 ? '۹+' : toPersianDigit(item.badge)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={s.quickActionInfo}>
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
                  >
                    {item.subtitle}
                  </Text>
                </View>

                <Icon
                  name="chevron-left"
                  size={22}
                  color={colors.textSecondary}
                />
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
    paddingBottom: 30,
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
    gap: 18,
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
    fontSize: 24,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  roleBadgeText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
  },
  businessInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
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
    fontSize: 16,
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
    fontSize: 12,
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
    fontSize: 11,
    fontFamily: 'Vazir',
    color: '#ffffffbb',
    flexShrink: 1,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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

  // ═══════════ آمار ═══════════
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    marginBottom: 0,
    minHeight: 140,
  },
  statCardInner: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flex: 1,
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Vazir-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },

  // ═══════════ اقدامات سریع ═══════════
  quickActionsList: {
    gap: 10,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickActionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  quickActionInfo: {
    flex: 1,
    gap: 2,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  quickActionSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 16,
  },
  actionBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E53935',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
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
