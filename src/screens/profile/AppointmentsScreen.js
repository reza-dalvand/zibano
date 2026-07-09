// src/screens/profile/AppointmentsScreen.js
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = (num) =>
  `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

// ⏱️ زمان بین دریافت مجدد کد (۵ دقیقه = ۳۰۰ ثانیه)
const REGENERATE_INTERVAL = 300;

// تولید کد تایید ۶ رقمی
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// MOCK داده‌های نوبت‌ها با ساختار جدید
const MOCK_APPOINTMENTS = [
  {
    id: 'apt_1',
    businessName: 'سالن زیبایی نیلارام',
    businessLogo: 'https://picsum.photos/100/100?random=21',
    serviceName: 'فیشیال تخصصی پوست',
    employeeName: 'سارا احمدی',
    date: '۱۴۰۳/۰۴/۱۵',
    time: '۱۰:۳۰',
    status: 'reserved',
    originalPrice: 750000,
    totalPrice: 675000,
    depositPaid: 200000,
    discountPercent: 10,
    hasDeposit: true,
    isUpcoming: true,
    verificationCode: '۷۴۵۸۹۲',
    lastRegeneratedAt: Date.now() - 120000, // 2 دقیقه پیش
  },
  {
    id: 'apt_2',
    businessName: 'مرکز لیزر رویال',
    businessLogo: 'https://picsum.photos/100/100?random=25',
    serviceName: 'لیزر فول بادی',
    employeeName: 'دکتر رضایی',
    date: '۱۴۰۳/۰۴/۲۰',
    time: '۱۶:۰۰',
    status: 'reserved',
    originalPrice: 2500000,
    totalPrice: 2125000,
    depositPaid: 500000,
    discountPercent: 15,
    hasDeposit: true,
    isUpcoming: true,
    verificationCode: '۳۸۲۵۷۱',
    lastRegeneratedAt: Date.now() - 240000, // 4 دقیقه پیش
  },
  {
    id: 'apt_3',
    businessName: 'ناخن گالری پریا',
    businessLogo: 'https://picsum.photos/100/100?random=26',
    serviceName: 'کاشت ناخن ژلیش',
    employeeName: 'مریم',
    date: '۱۴۰۳/۰۳/۱۰',
    time: '۱۴:۰۰',
    status: 'done',
    originalPrice: 450000,
    totalPrice: 450000,
    depositPaid: 0,
    discountPercent: 0,
    hasDeposit: false,
    isUpcoming: false,
    verificationCode: '۹۱۷۴۵۶',
  },
  {
    id: 'apt_4',
    businessName: 'سالن زیبایی افرا',
    businessLogo: 'https://picsum.photos/100/100?random=24',
    serviceName: 'رنگ و لایت مو',
    employeeName: 'الناز',
    date: '۱۴۰۳/۰۳/۰۵',
    time: '۱۱:۰۰',
    status: 'cancelled_by_salon',
    originalPrice: 1200000,
    totalPrice: 960000,
    depositPaid: 300000,
    discountPercent: 20,
    hasDeposit: true,
    isUpcoming: false,
    cancellationReason: 'سالن در تاریخ موردنظر تعطیل بود',
    refundAmount: 225000,
    verificationCode: '—',
  },
];

// 🎨 سیستم تگ‌های جدید
const STATUS_META = {
  reserved: {
    label: 'رزرو',
    color: '#2196F3',
    icon: 'event-available',
    gradient: ['#2196F3', '#1976D2'],
  },
  done: {
    label: 'انجام شده',
    color: '#43A047',
    icon: 'task-alt',
    gradient: ['#43A047', '#2E7D32'],
  },
  cancelled_by_salon: {
    label: 'لغو توسط سالن',
    color: '#E53935',
    icon: 'cancel',
    gradient: ['#E53935', '#C62828'],
  },
};

// ⏲️ کامپوننت تایمر و کد تایید نوبت
function VerificationCodeCard({ appointment, colors, onToast }) {
  const [code, setCode] = useState(appointment.verificationCode);
  const [lastRegenAt, setLastRegenAt] = useState(
    appointment.lastRegeneratedAt || Date.now()
  );
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastRegenAt) / 1000);
      const remaining = Math.max(0, REGENERATE_INTERVAL - elapsed);
      setRemainingSeconds(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastRegenAt]);

  const canRegenerate = remainingSeconds === 0;

  const handleRegenerate = () => {
    // انیمیشن تغییر کد
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, bounciness: 10, useNativeDriver: true }),
      ]),
    ]).start();

    const newCode = generateVerificationCode();
    setCode(toPersianDigit(newCode));
    setLastRegenAt(Date.now());
    onToast({
      visible: true,
      message: 'کد جدید با موفقیت تولید شد',
      type: 'success',
    });
  };

  const handleCopyCode = () => {
    Clipboard.setString(code.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
    onToast({
      visible: true,
      message: 'کد تایید کپی شد',
      type: 'success',
    });
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${toPersianDigit(m.toString().padStart(2, '0'))}:${toPersianDigit(
      s.toString().padStart(2, '0')
    )}`;
  };

  return (
    <Card
      variant="default"
      padding={0}
      radius={18}
      style={[s.verificationCard, { borderColor: colors.primary + '40' }]}
    >
      {/* هدر کارت کد تایید */}
      <View style={[s.verificationHeader, { backgroundColor: colors.primary + '15' }]}>
        <View style={[s.verificationIconBox, { backgroundColor: colors.primary }]}>
          <Icon name="verified-user" size={18} color="#fff" />
        </View>
        <View style={s.verificationHeaderInfo}>
          <Text style={[s.verificationTitle, { color: colors.textMain }]}>
            کد تایید نوبت
          </Text>
          <Text style={[s.verificationSubtitle, { color: colors.textSecondary }]}>
            این کد را پس از انجام خدمت به سالن‌دار ارائه دهید
          </Text>
        </View>
      </View>

      {/* نمایش کد تایید */}
      <View style={s.verificationCodeArea}>
        <Animated.View
          style={[
            s.codeBox,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              borderColor: colors.primary,
              backgroundColor: colors.background,
            },
          ]}
        >
          {code.split('').map((digit, idx) => (
            <View
              key={idx}
              style={[
                s.codeDigitBox,
                {
                  borderColor: colors.primary + '50',
                  backgroundColor: colors.cardBackground,
                },
              ]}
            >
              <Text style={[s.codeDigit, { color: colors.primary }]}>{digit}</Text>
            </View>
          ))}
        </Animated.View>

        {/* دکمه کپی */}
        <TouchableOpacity
          style={[s.copyCodeBtn, { backgroundColor: colors.primary }]}
          onPress={handleCopyCode}
          activeOpacity={0.8}
        >
          <Icon name="content-copy" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* بخش دریافت مجدد کد */}
      <View
        style={[
          s.regenFooter,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        {canRegenerate ? (
          <TouchableOpacity
            style={[s.regenBtn, { backgroundColor: colors.primary }]}
            onPress={handleRegenerate}
            activeOpacity={0.85}
          >
            <Icon name="refresh" size={16} color="#fff" />
            <Text style={[s.regenBtnText, { color: '#fff' }]}>
              دریافت کد جدید
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={s.regenTimerRow}>
            <Icon name="schedule" size={16} color={colors.textSecondary} />
            <Text style={[s.regenTimerText, { color: colors.textSecondary }]}>
              دریافت مجدد کد تا{' '}
              <Text style={{ fontFamily: 'Vazir-Bold', color: colors.primary }}>
                {formatTime(remainingSeconds)}
              </Text>{' '}
              دیگر
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

export default function AppointmentsScreen({ navigation }) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const filteredAppointments = useMemo(() => {
    if (activeTab === 'upcoming') {
      return appointments.filter((a) => a.isUpcoming);
    }
    return appointments.filter((a) => !a.isUpcoming);
  }, [appointments, activeTab]);

  const stats = useMemo(
    () => ({
      upcoming: appointments.filter((a) => a.isUpcoming).length,
      past: appointments.filter((a) => !a.isUpcoming).length,
    }),
    [appointments]
  );

  const renderAppointment = (apt) => {
    const meta = STATUS_META[apt.status] || STATUS_META.reserved;
    const showVerificationCard =
      apt.isUpcoming && apt.status === 'reserved' && apt.verificationCode;

    return (
      <View key={apt.id} style={s.aptWrapper}>
        <Card variant="elevated" padding={16} radius={18} style={s.aptCard}>
          {/* هدر: کسب‌وکار + تگ وضعیت */}
          <View style={s.aptHeader}>
            <View style={s.aptBusiness}>
              <Avatar uri={apt.businessLogo} name={apt.businessName} size="md" />
              <View style={s.aptBusinessInfo}>
                <Text
                  style={[s.aptBusinessName, { color: colors.textMain }]}
                  numberOfLines={1}
                >
                  {apt.businessName}
                </Text>
                <Text
                  style={[s.aptServiceName, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {apt.serviceName}
                </Text>
              </View>
            </View>
            <View style={[s.statusBadge, { backgroundColor: meta.color + '20' }]}>
              <Icon name={meta.icon} size={12} color={meta.color} />
              <Text style={[s.statusBadgeText, { color: meta.color }]}>
                {meta.label}
              </Text>
            </View>
          </View>

          {/* دیوایدر */}
          <View style={[s.divider, { backgroundColor: colors.border }]} />

          {/* جزئیات: کارمند، تاریخ، ساعت */}
          <View style={s.aptDetails}>
            <View style={s.detailItem}>
              <Icon name="person" size={14} color={colors.textSecondary} />
              <Text style={[s.detailText, { color: colors.textMain }]}>
                {apt.employeeName}
              </Text>
            </View>
            <View style={s.detailItem}>
              <Icon name="event" size={14} color={colors.textSecondary} />
              <Text style={[s.detailText, { color: colors.textMain }]}>
                {apt.date}
              </Text>
            </View>
            <View style={s.detailItem}>
              <Icon name="schedule" size={14} color={colors.textSecondary} />
              <Text style={[s.detailText, { color: colors.textMain }]}>
                {apt.time}
              </Text>
            </View>
          </View>

          {/* کارت مالی: مبلغ کل، بیعانه، تخفیف */}
          <View
            style={[
              s.priceBox,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            {/* ردیف مبلغ کل */}
            <View style={s.priceRow}>
              <View style={s.priceLabelRow}>
                <Icon name="payments" size={14} color={colors.textSecondary} />
                <Text style={[s.priceLabel, { color: colors.textSecondary }]}>
                  مبلغ کل خدمت
                </Text>
              </View>
              <View style={s.priceValueRow}>
                {apt.discountPercent > 0 && (
                  <Text
                    style={[
                      s.originalPriceText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {formatPrice(apt.originalPrice)}
                  </Text>
                )}
                <Text style={[s.priceValue, { color: colors.textMain }]}>
                  {formatPrice(apt.totalPrice)}
                </Text>
              </View>
            </View>

            {/* ردیف تخفیف */}
            {apt.discountPercent > 0 && (
              <View style={s.priceRow}>
                <View style={s.priceLabelRow}>
                  <Icon name="local-offer" size={14} color="#43A047" />
                  <Text style={[s.priceLabel, { color: colors.textSecondary }]}>
                    تخفیف اعمال‌شده
                  </Text>
                </View>
                <View style={s.priceValueRow}>
                  <View
                    style={[
                      s.discountBadge,
                      { backgroundColor: '#43A04720' },
                    ]}
                  >
                    <Text style={[s.discountBadgeText, { color: '#43A047' }]}>
                      {toPersianDigit(apt.discountPercent)}٪
                    </Text>
                  </View>
                  <Text style={[s.discountValue, { color: '#43A047' }]}>
                    - {formatPrice(apt.originalPrice - apt.totalPrice)}
                  </Text>
                </View>
              </View>
            )}

            {/* ردیف بیعانه */}
            {apt.hasDeposit && (
              <View style={s.priceRow}>
                <View style={s.priceLabelRow}>
                  <Icon
                    name="account-balance-wallet"
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={[s.priceLabel, { color: colors.textSecondary }]}>
                    بیعانه پرداختی
                  </Text>
                </View>
                <Text style={[s.priceValue, { color: colors.primary }]}>
                  {formatPrice(apt.depositPaid)}
                </Text>
              </View>
            )}

            {/* ردیف مسترد شده (فقط در صورت لغو توسط سالن) */}
            {apt.status === 'cancelled_by_salon' && apt.refundAmount !== undefined && (
              <View style={[s.priceRow, { marginTop: 4 }]}>
                <View style={s.priceLabelRow}>
                  <Icon name="undo" size={14} color="#43A047" />
                  <Text style={[s.priceLabel, { color: colors.textSecondary }]}>
                    مبلغ مسترد شده
                  </Text>
                </View>
                <Text style={[s.priceValue, { color: '#43A047' }]}>
                  {formatPrice(apt.refundAmount)}
                </Text>
              </View>
            )}
          </View>

          {/* پیام لغو توسط سالن */}
          {apt.status === 'cancelled_by_salon' && apt.cancellationReason && (
            <View
              style={[
                s.cancelReasonBox,
                {
                  backgroundColor: '#E5393515',
                  borderColor: '#E5393540',
                },
              ]}
            >
              <Icon name="info-outline" size={16} color="#E53935" />
              <Text style={[s.cancelReasonText, { color: '#E53935' }]}>
                {apt.cancellationReason}
              </Text>
            </View>
          )}
        </Card>

        {/* کارت کد تایید (فقط برای نوبت‌های آینده و رزرو شده) */}
        {showVerificationCard && (
          <VerificationCodeCard
            appointment={apt}
            colors={colors}
            onToast={setToast}
          />
        )}
      </View>
    );
  };

  const renderTabButton = (tabId, label, iconName) => {
    const isActive = activeTab === tabId;
    const count = tabId === 'upcoming' ? stats.upcoming : stats.past;
    return (
      <TouchableOpacity
        style={[s.tabButton, isActive && { backgroundColor: colors.primary }]}
        onPress={() => setActiveTab(tabId)}
      >
        <Icon
          name={iconName}
          size={16}
          color={isActive ? '#fff' : colors.textSecondary}
        />
        <Text style={[s.tabText, { color: isActive ? '#fff' : colors.textMain }]}>
          {label}
        </Text>
        <View
          style={[
            s.tabBadge,
            { backgroundColor: isActive ? '#fff' : colors.primary + '20' },
          ]}
        >
          <Text
            style={[
              s.tabBadgeText,
              { color: isActive ? colors.primary : colors.primary },
            ]}
          >
            {toPersianDigit(count)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom']}>
      <View style={[s.tabsWrapper, { backgroundColor: colors.background }]}>
        <View
          style={[
            s.tabsContainer,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          {renderTabButton('upcoming', 'آینده', 'event-available')}
          {renderTabButton('past', 'گذشته', 'history')}
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContainer}
      >
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(renderAppointment)
        ) : (
          <EmptyState
            icon={activeTab === 'upcoming' ? '📅' : '📜'}
            title={
              activeTab === 'upcoming'
                ? 'نوبت آینده‌ای ندارید'
                : 'سابقه‌ای ثبت نشده'
            }
            description={
              activeTab === 'upcoming'
                ? 'با رزرو نوبت از کسب‌وکارهای زیبانو، نوبت‌های آینده شما اینجا نمایش داده می‌شود'
                : 'پس از انجام اولین نوبت، سوابق شما اینجا نمایش داده خواهد شد'
            }
            actionLabel={activeTab === 'upcoming' ? 'رزرو نوبت جدید' : 'بازگشت به خانه'}
            onAction={() => navigation.navigate('Home')}
          />
        )}
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
  tabsWrapper: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  tabsContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabText: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  tabBadge: {
    minWidth: 22,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  listContainer: { padding: 16, paddingBottom: 100, gap: 16 },
  aptWrapper: { gap: 12 },
  aptCard: { marginBottom: 0 },
  aptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  aptBusiness: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  aptBusinessInfo: { flex: 1, gap: 2 },
  aptBusinessName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  aptServiceName: { fontSize: 12, fontFamily: 'Vazir' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusBadgeText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  divider: { height: 1, marginVertical: 10 },
  aptDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12, fontFamily: 'Vazir' },
  priceBox: { padding: 12, borderRadius: 14, borderWidth: 1, gap: 8 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceLabel: { fontSize: 12, fontFamily: 'Vazir' },
  priceValue: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  originalPriceText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountBadgeText: { fontSize: 10, fontFamily: 'Vazir-Bold' },
  discountValue: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  cancelReasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  cancelReasonText: { fontSize: 12, fontFamily: 'Vazir', flex: 1, lineHeight: 20 },

  // ========== کد تایید ==========
  verificationCard: {
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  verificationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationHeaderInfo: { flex: 1, gap: 2 },
  verificationTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  verificationSubtitle: { fontSize: 11, fontFamily: 'Vazir' },
  verificationCodeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  codeBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  codeDigitBox: {
    width: 36,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeDigit: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
  },
  copyCodeBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  regenFooter: {
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  regenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  regenBtnText: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  regenTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  regenTimerText: { fontSize: 12, fontFamily: 'Vazir' },
});