// src/screens/home/BookingScreen.js
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import BottomSheet from '../../components/common/BottomSheet';
import Button from '../../components/common/Button';
import BookingDateSelector from '../../components/booking/BookingDateSelector';
import BookingTimeSelector from '../../components/booking/BookingTimeSelector';
import BookingStepIndicator from '../../components/booking/BookingStepIndicator';
import PaymentSummaryCard from '../../components/booking/PaymentSummaryCard';
import RulesCard from '../../components/booking/RulesCard';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
  'مرداد', 'شهریور', 'مهر', 'آبان',
  'آذر', 'دی', 'بهمن', 'اسفند',
];

// 🎯 فقط ۳ مرحله (مرحله تایید حذف شد)
const STEPS = [
  { id: 1, label: 'بررسی', icon: 'info-outline' },
  { id: 2, label: 'تاریخ', icon: 'calendar-today' },
  { id: 3, label: 'ساعت', icon: 'schedule' },
];

const MOCK_TIME_SLOTS = [
  { id: 't1', time: '۰۹:۰۰', isAvailable: true },
  { id: 't2', time: '۰۹:۳۰', isAvailable: true },
  { id: 't3', time: '۱۰:۰۰', isAvailable: false },
  { id: 't4', time: '۱۰:۳۰', isAvailable: true },
  { id: 't5', time: '۱۱:۰۰', isAvailable: true },
  { id: 't6', time: '۱۱:۳۰', isAvailable: false },
  { id: 't7', time: '۱۲:۰۰', isAvailable: true },
  { id: 't8', time: '۱۴:۰۰', isAvailable: true },
  { id: 't9', time: '۱۴:۳۰', isAvailable: true },
  { id: 't10', time: '۱۵:۰۰', isAvailable: false },
  { id: 't11', time: '۱۵:۳۰', isAvailable: true },
  { id: 't12', time: '۱۶:۰۰', isAvailable: true },
];

const MOCK_SERVICE = {
  id: 's1',
  name: 'فیشیال تخصصی پوست VIP',
  businessName: 'سالن زیبایی نیلارام',
  originalPrice: 850000,
  price: 850000,
  discount: 12,
  hasDeposit: true,
  depositPercent: 30,
  duration: 60,
};

const parsePrice = (val) => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const eng = val
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    const cleaned = eng.replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
  }
  return 0;
};

export default function BookingModal({
  visible,
  onClose,
  service,
  businessName,
  businessLogo,
  onConfirm,
}) {
  const { colors } = useTheme();
  const currentService = service || MOCK_SERVICE;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // محاسبه depositAmount
  const originalPrice = parsePrice(currentService.originalPrice ?? currentService.price);
  const discountPercent = parsePrice(currentService.discount);
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const hasDeposit = currentService.hasDeposit || false;
  const depositPercent = parsePrice(currentService.depositPercent) || 30;
  const depositAmount = hasDeposit
    ? Math.round((finalPrice * depositPercent) / 100)
    : finalPrice;

  // انیمیشن‌ها
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkRotate = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.3)).current;
  const ringOpacity = useRef(new Animated.Value(1)).current;
  const sparkles = useRef(
    Array.from({ length: 8 }, () => ({
      translate: { x: new Animated.Value(0), y: new Animated.Value(0) },
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.3),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setShowSuccess(false);
    }
  }, [visible]);

  useEffect(() => {
    if (showSuccess) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            bounciness: 12,
            speed: 10,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(checkScale, {
            toValue: 1,
            bounciness: 15,
            speed: 12,
            useNativeDriver: true,
          }),
          Animated.timing(checkRotate, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 2.5,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      sparkles.forEach((spark, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 60 + Math.random() * 30;
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(spark.translate.x, {
              toValue: Math.cos(angle) * distance,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(spark.translate.y, {
              toValue: Math.sin(angle) * distance,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(spark.opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(spark.opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(spark.scale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(spark.scale, {
                toValue: 0.3,
                duration: 300,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
        }, 300 + i * 80);
      });
    } else {
      scaleAnim.setValue(0.6);
      opacityAnim.setValue(0);
      checkScale.setValue(0);
      checkRotate.setValue(0);
      ringScale.setValue(0.3);
      ringOpacity.setValue(1);
      sparkles.forEach((spark) => {
        spark.translate.x.setValue(0);
        spark.translate.y.setValue(0);
        spark.opacity.setValue(0);
        spark.scale.setValue(0.3);
      });
    }
  }, [showSuccess]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // 🎯 پرداخت مستقیم - بدون رفتن به مرحله بعد
  const handleConfirm = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onConfirm?.({
        service: currentService,
        date: selectedDate,
        time: selectedTime,
      });
    }, 3000);
  };

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return !!selectedDate;
      case 3:
        return !!selectedTime;
      default:
        return false;
    }
  }, [currentStep, selectedDate, selectedTime]);

  const availableCount = MOCK_TIME_SLOTS.filter((s) => s.isAvailable).length;

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setShowSuccess(false);
    onClose?.();
  };

  // 🎯 فوتر داینامیک (فقط ۳ مرحله)
  const renderFooter = () => {
    // مرحله ۱: فقط دکمه ادامه
    if (currentStep === 1) {
      return (
        <View style={s.footerInner}>
          <View style={s.nextBtnWrapper}>
            <Button
              title="ادامه"
              onPress={handleNext}
              disabled={!canProceed}
              icon={<Icon name="arrow-back" size={18} color="#fff" />}
              fullWidth
            />
          </View>
        </View>
      );
    }

    // مرحله ۲: دکمه بازگشت + ادامه
    if (currentStep === 2) {
      return (
        <View style={s.footerInner}>
          <TouchableOpacity
            onPress={handlePrev}
            style={[s.prevBtn, { borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Icon name="arrow-forward" size={18} color={colors.textMain} />
            <Text style={[s.prevBtnText, { color: colors.textMain }]}>
              بازگشت
            </Text>
          </TouchableOpacity>
          <View style={s.nextBtnWrapper}>
            <Button
              title="ادامه"
              onPress={handleNext}
              disabled={!canProceed}
              icon={<Icon name="arrow-back" size={18} color="#fff" />}
              fullWidth
            />
          </View>
        </View>
      );
    }

    // 🎯 مرحله ۳: دکمه بازگشت + دکمه پرداخت سبز (پرداخت مستقیم)
    if (currentStep === 3) {
      return (
        <View style={s.footerInner}>
          <TouchableOpacity
            onPress={handlePrev}
            style={[s.prevBtn, { borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Icon name="arrow-forward" size={18} color={colors.textMain} />
            <Text style={[s.prevBtnText, { color: colors.textMain }]}>
              بازگشت
            </Text>
          </TouchableOpacity>
          <View style={s.nextBtnWrapper}>
            <Button
              title={`پرداخت ${toPersianDigit(depositAmount.toLocaleString('en-US'))} تومان`}
              onPress={handleConfirm}
              disabled={!canProceed}
              icon={<Icon name="lock" size={18} color="#fff" />}
              fullWidth
              style={{
                backgroundColor: canProceed ? '#43A047' : colors.border,
              }}
            />
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      snapPoint={0.92}
      footer={
        !showSuccess ? (
          <View
            style={[
              s.footerContainer,
              {
                backgroundColor: colors.cardBackground,
                borderTopColor: colors.border,
              },
            ]}
          >
            {renderFooter()}
          </View>
        ) : null
      }
    >
      {/* هدر مدال */}
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <View
          style={[s.headerIconBox, { backgroundColor: colors.primary + '15' }]}
        >
          <Icon name="event-available" size={22} color={colors.primary} />
        </View>
        <View style={s.headerInfo}>
          <Text
            style={[s.headerTitle, { color: colors.textMain }]}
            numberOfLines={1}
          >
            رزرو نوبت
          </Text>
          <Text
            style={[s.headerSubtitle, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {currentService?.name || 'خدمت'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleClose}
          style={[s.closeBtn, { backgroundColor: colors.background }]}
          activeOpacity={0.7}
        >
          <Icon name="close" size={20} color={colors.textMain} />
        </TouchableOpacity>
      </View>

      {/* Step Indicator */}
      {!showSuccess && (
        <View style={s.stepIndicatorWrapper}>
          <BookingStepIndicator steps={STEPS} currentStep={currentStep} />
        </View>
      )}

      {/* محتوای اسکرولی */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ═══════ مرحله ۱: اطلاعات خدمت + قوانین ═══════ */}
        {currentStep === 1 && !showSuccess && (
          <View style={s.stepContent}>
            {/* بخش ۱: جزئیات پرداخت */}
            <View style={s.sectionHeader}>
              <View style={[s.sectionIconBox, { backgroundColor: '#43A04715' }]}>
                <Icon name="account-balance-wallet" size={18} color="#43A047" />
              </View>
              <View style={s.sectionHeaderText}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                  جزئیات پرداخت
                </Text>
                <Text
                  style={[s.sectionSubtitle, { color: colors.textSecondary }]}
                >
                  بیعانه آنلاین + مابقی در سالن
                </Text>
              </View>
            </View>
            {currentService && (
              <PaymentSummaryCard service={currentService} colors={colors} />
            )}

            {/* بخش ۲: قوانین رزرو */}
            <View style={[s.sectionHeader, { marginTop: 12 }]}>
              <View style={[s.sectionIconBox, { backgroundColor: '#9C27B015' }]}>
                <Icon name="gavel" size={18} color="#9C27B0" />
              </View>
              <View style={s.sectionHeaderText}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                  قوانین رزرو نوبت
                </Text>
                <Text
                  style={[s.sectionSubtitle, { color: colors.textSecondary }]}
                >
                  لطفاً قبل از پرداخت مطالعه فرمایید
                </Text>
              </View>
            </View>
            <RulesCard colors={colors} />
          </View>
        )}

        {/* ═══════ مرحله ۲: انتخاب تاریخ ═══════ */}
        {currentStep === 2 && !showSuccess && (
          <View style={s.stepContent}>
            <View style={s.sectionHeader}>
              <View style={[s.sectionIconBox, { backgroundColor: '#2196F315' }]}>
                <Icon name="calendar-today" size={18} color="#2196F3" />
              </View>
              <View style={s.sectionHeaderText}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                  انتخاب تاریخ
                </Text>
                <Text
                  style={[s.sectionSubtitle, { color: colors.textSecondary }]}
                >
                  روز مورد نظر خود را انتخاب کنید
                </Text>
              </View>
            </View>
            <BookingDateSelector
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </View>
        )}

        {/* ═══════ مرحله ۳: انتخاب ساعت ═══════ */}
        {currentStep === 3 && !showSuccess && (
          <View style={s.stepContent}>
            {/* Chip تاریخ انتخاب شده */}
            {selectedDate && (
              <TouchableOpacity
                onPress={handlePrev}
                style={[
                  s.selectedDateChip,
                  {
                    backgroundColor: colors.primary + '10',
                    borderColor: colors.primary + '40',
                  },
                ]}
                activeOpacity={0.7}
              >
                <Icon name="event" size={16} color={colors.primary} />
                <Text style={[s.selectedDateText, { color: colors.primary }]}>
                  {toPersianDigit(selectedDate.jd)}{' '}
                  {PERSIAN_MONTHS[selectedDate.jm - 1]}{' '}
                  {toPersianDigit(selectedDate.jy)}
                </Text>
                <Icon name="edit" size={14} color={colors.primary} />
              </TouchableOpacity>
            )}

            {/* هدر ساعت */}
            <View style={s.timeSectionHeader}>
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                انتخاب ساعت
              </Text>
              <View style={s.availableBadge}>
                <View style={[s.availableDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={[s.availableText, { color: '#4CAF50' }]}>
                  {toPersianDigit(availableCount)} ساعت آزاد
                </Text>
              </View>
            </View>

            {/* یادآوری: با انتخاب ساعت، پرداخت انجام می‌شود */}
            <View
              style={[
                s.paymentHint,
                {
                  backgroundColor: '#43A04710',
                  borderColor: '#43A04735',
                },
              ]}
            >
              <Icon name="info-outline" size={16} color="#43A047" />
              <Text style={[s.paymentHintText, { color: colors.textSecondary }]}>
                با انتخاب ساعت و تپ روی دکمه پرداخت، بیعانه پرداخت و نوبت شما ثبت می‌شود
              </Text>
            </View>

            <BookingTimeSelector
              slots={MOCK_TIME_SLOTS}
              selectedId={selectedTime?.id}
              onSelect={(slot) => setSelectedTime(slot)}
            />
          </View>
        )}

        {/* ═══════ مرحله موفقیت ═══════ */}
        {showSuccess && (
          <View style={s.successContainer}>
            <Animated.View
              style={[
                s.successCircle,
                {
                  backgroundColor: '#43A047',
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                },
              ]}
            >
              <Animated.View
                style={[
                  s.successRing,
                  {
                    borderColor: '#43A047',
                    transform: [{ scale: ringScale }],
                    opacity: ringOpacity,
                  },
                ]}
              />
              <Animated.View
                style={{
                  transform: [
                    { scale: checkScale },
                    {
                      rotate: checkRotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-90deg', '0deg'],
                      }),
                    },
                  ],
                }}
              >
                <Icon name="check" size={48} color="#fff" />
              </Animated.View>
              {sparkles.map((spark, i) => (
                <Animated.View
                  key={i}
                  style={[
                    s.sparkle,
                    {
                      backgroundColor: [
                        '#FFD700', '#FF9800', '#43A047', '#2196F3',
                        '#9C27B0', '#E91E63', '#00BCD4', '#FFC107',
                      ][i],
                      transform: [
                        { translateX: spark.translate.x },
                        { translateY: spark.translate.y },
                        { scale: spark.scale },
                      ],
                      opacity: spark.opacity,
                    },
                  ]}
                />
              ))}
            </Animated.View>

            <Text style={[s.successTitle, { color: colors.textMain }]}>
              رزرو با موفقیت ثبت شد!
            </Text>
            <Text
              style={[s.successSubtitle, { color: colors.textSecondary }]}
            >
              کد تایید ۴ رقمی به شماره شما ارسال خواهد شد
            </Text>

            <View
              style={[
                s.successSummary,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={s.successSummaryRow}>
                <Icon name="spa" size={16} color={colors.textSecondary} />
                <Text
                  style={[
                    s.successSummaryLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  خدمت:
                </Text>
                <Text
                  style={[
                    s.successSummaryValue,
                    { color: colors.textMain },
                  ]}
                >
                  {currentService?.name || ''}
                </Text>
              </View>
              {selectedDate && (
                <View style={s.successSummaryRow}>
                  <Icon
                    name="event"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      s.successSummaryLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    تاریخ:
                  </Text>
                  <Text
                    style={[
                      s.successSummaryValue,
                      { color: colors.textMain },
                    ]}
                  >
                    {toPersianDigit(selectedDate.jd)}{' '}
                    {PERSIAN_MONTHS[selectedDate.jm - 1]}
                  </Text>
                </View>
              )}
              {selectedTime && (
                <View style={s.successSummaryRow}>
                  <Icon
                    name="schedule"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      s.successSummaryLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    ساعت:
                  </Text>
                  <Text
                    style={[
                      s.successSummaryValue,
                      { color: colors.textMain },
                    ]}
                  >
                    {selectedTime.time}
                  </Text>
                </View>
              )}
              <View style={s.successSummaryRow}>
                <Icon name="payments" size={16} color="#43A047" />
                <Text
                  style={[
                    s.successSummaryLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  مبلغ پرداختی:
                </Text>
                <Text
                  style={[
                    s.successSummaryValue,
                    { color: '#43A047' },
                  ]}
                >
                  {toPersianDigit(depositAmount.toLocaleString('en-US'))} تومان
                </Text>
              </View>
            </View>

            <View style={s.successBtnWrapper}>
              <Button
                title="بازگشت به صفحه کسب‌وکار"
                onPress={handleClose}
                variant="outline"
              />
            </View>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  // ═══════ هدر ═══════
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 3,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ═══════ Step Indicator ═══════
  stepIndicatorWrapper: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 6,
  },

  // ═══════ Scroll ═══════
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 40,
    paddingHorizontal: 16,
    flexGrow: 1,
  },

  // ═══════ Step Content ═══════
  stepContent: {
    gap: 14,
    flex: 1,
  },

  // ═══════ Section Header ═══════
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  sectionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },

  // ═══════ Selected Date Chip ═══════
  selectedDateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════ Time Section ═══════
  timeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#4CAF5015',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availableText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },

  // 🎯 یادآوری پرداخت
  paymentHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 4,
  },
  paymentHintText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },

  // ═══════ Footer ═══════
  footerContainer: {
    paddingTop: 10,
    paddingBottom: 6,
    borderTopWidth: 1,
    gap: 8,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  prevBtnText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  nextBtnWrapper: {
    flex: 1,
  },

  // ═══════ Success ═══════
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
    gap: 16,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  sparkle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  successTitle: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 21,
  },
  successSummary: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    marginTop: 8,
  },
  successSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successSummaryLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
    minWidth: 90,
  },
  successSummaryValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  successBtnWrapper: {
    width: '100%',
    marginTop: 12,
  },
});