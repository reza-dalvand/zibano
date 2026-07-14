// src/screens/home/BookingScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import BottomSheet from '../../components/common/BottomSheet';
import Button from '../../components/common/Button';
import BookingServiceInfo from '../../components/booking/BookingServiceInfo';
import BookingDateSelector from '../../components/booking/BookingDateSelector';
import BookingTimeSelector from '../../components/booking/BookingTimeSelector';
import BookingPaymentBar from '../../components/booking/BookingPaymentBar';

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
  'مرداد', 'شهریور', 'مهر', 'آبان',
  'آذر', 'دی', 'بهمن', 'اسفند',
];

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

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

// دیتای موقت
const MOCK_SERVICE = {
  id: 's1',
  name: 'فیشیال تخصصی و پاکسازی پوست VIP',
  businessName: 'سالن زیبایی نیلارام',
  description:
    'فیشیال حرفه‌ای پوست با استفاده از بهترین محصولات کره‌ای و فرانسوی. شامل پاکسازی عمیق، لایه‌برداری ملایم، ماسک طلا ۲۴ عیار، ماساژ صورت با روغن‌های طبیعی و استفاده از دستگاه هیدروفیشیال برای آبرسانی عمیق پوست. این خدمت توسط متخصصان با تجربه و در محیطی کاملاً بهداشتی ارائه می‌شود.',
  originalPrice: 850000,
  discount: 12,
  duration: 60,
  hasDeposit: true,
  depositPercent: 30,
};

const MOCK_TIME_SLOTS = [
  { id: 't1', time: '۱۰:۰۰', isAvailable: true },
  { id: 't2', time: '۱۱:۳۰', isAvailable: true },
  { id: 't3', time: '۱۳:۰۰', isAvailable: false },
  { id: 't4', time: '۱۴:۳۰', isAvailable: true },
  { id: 't5', time: '۱۶:۰۰', isAvailable: true },
  { id: 't6', time: '۱۷:۳۰', isAvailable: false },
  { id: 't7', time: '۱۹:۰۰', isAvailable: true },
];

// ═══════════ نشانگر ۳ مرحله ═══════════
function ThreeStepIndicator({ currentStep, colors }) {
  const steps = [
    { id: 1, label: 'توضیحات', icon: 'description' },
    { id: 2, label: 'انتخاب روز', icon: 'event' },
    { id: 3, label: 'انتخاب ساعت', icon: 'access-time' },
  ];

  return (
    <View style={s.stepContainer}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <React.Fragment key={step.id}>
            <View style={s.stepItem}>
              <View
                style={[
                  s.stepCircle,
                  {
                    backgroundColor: isCompleted
                      ? colors.primary
                      : isActive
                      ? colors.primary + '20'
                      : colors.cardBackground,
                    borderColor: isCompleted || isActive
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                {isCompleted ? (
                  <Icon name="check" size={16} color="#fff" />
                ) : (
                  <Icon
                    name={step.icon}
                    size={14}
                    color={isActive ? colors.primary : colors.textSecondary}
                  />
                )}
              </View>
              <Text
                style={[
                  s.stepLabel,
                  {
                    color:
                      isCompleted || isActive
                        ? colors.textMain
                        : colors.textSecondary,
                    fontFamily: isActive ? 'Vazir-Bold' : 'Vazir',
                  },
                ]}
              >
                {step.label}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  s.stepLine,
                  {
                    backgroundColor:
                      currentStep > step.id ? colors.primary : colors.border,
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default function BookingModal({ visible, onClose, service }) {
  const { colors } = useTheme();
  const currentService = service || MOCK_SERVICE;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // محاسبات قیمت
  const originalPrice = parsePrice(
    currentService.originalPrice ?? currentService.price
  );
  const discountPercent = parsePrice(currentService.discount);
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const hasDeposit = currentService.hasDeposit || false;
  const depositPercent = parsePrice(currentService.depositPercent) || 30;
  const depositAmount = hasDeposit
    ? Math.round((finalPrice * depositPercent) / 100)
    : finalPrice;

  const canConfirm = selectedDate && selectedTime;

  const handleConfirm = () => {
    console.log('✅ Booking:', {
      service: currentService.name,
      date: selectedDate,
      time: selectedTime,
      deposit: depositAmount,
    });
    onClose();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setCurrentStep(3); // رفتن به مرحله ۳ بعد از انتخاب روز
  };

  const handleTimeSelect = (timeId) => {
    setSelectedTime(timeId);
  };

  // ═══════════ دکمه‌های ناوبری ═══════════
  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedDate) setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
      setSelectedTime(null);
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setSelectedDate(null);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    onClose();
  };

  // ═══════════ فوتر داینامیک ═══════════
  const renderFooter = () => {
    // مرحله ۱: فقط دکمه ادامه
    if (currentStep === 1) {
      return (
        <Button
          title="ادامه و انتخاب روز"
          onPress={handleNext}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Icon name="arrow-back" size={20} color="#fff" />}
          iconPosition="left"
        />
      );
    }

    // مرحله ۲: دکمه برگشت + ادامه
    if (currentStep === 2) {
      return (
        <View style={s.footerRow}>
          <Button
            title="برگشت"
            onPress={handleBack}
            variant="outline"
            size="lg"
            style={s.halfBtn}
            icon={<Icon name="arrow-forward" size={18} color={colors.primary} />}
            iconPosition="right"
          />
          <Button
            title="ادامه"
            onPress={handleNext}
            variant="primary"
            size="lg"
            disabled={!selectedDate}
            style={s.halfBtn}
            icon={<Icon name="arrow-back" size={18} color="#fff" />}
            iconPosition="left"
          />
        </View>
      );
    }

    // مرحله ۳: دکمه برگشت + خلاصه + پرداخت
    if (currentStep === 3) {
      return (
        <View style={s.step3Footer}>
          {/* خلاصه انتخاب‌ها */}
          <View
            style={[
              s.summaryBox,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            {selectedDate && (
              <View style={s.summaryItem}>
                <Icon name="event" size={14} color={colors.primary} />
                <Text style={[s.summaryText, { color: colors.textMain }]}>
                  {toPersianDigit(selectedDate.jd)}{' '}
                  {PERSIAN_MONTHS[selectedDate.jm - 1]}
                </Text>
              </View>
            )}
            {selectedTime && (
              <>
                <View
                  style={[s.summaryDot, { backgroundColor: colors.border }]}
                />
                <View style={s.summaryItem}>
                  <Icon name="schedule" size={14} color={colors.primary} />
                  <Text style={[s.summaryText, { color: colors.textMain }]}>
                    ساعت{' '}
                    {MOCK_TIME_SLOTS.find((t) => t.id === selectedTime)?.time}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* دکمه‌های ناوبری */}
          <View style={s.footerRow}>
            <Button
              title="برگشت"
              onPress={handleBack}
              variant="outline"
              size="lg"
              style={s.halfBtn}
              icon={
                <Icon name="arrow-forward" size={18} color={colors.primary} />
              }
              iconPosition="right"
            />
            <Button
              title={`پرداخت ${toPersianDigit(
                depositAmount.toLocaleString('en-US')
              )} تومان`}
              onPress={handleConfirm}
              variant="primary"
              size="lg"
              disabled={!canConfirm}
              style={[s.halfBtn, { backgroundColor: '#43A047' }]}
              icon={<Icon name="lock" size={18} color="#fff" />}
              iconPosition="right"
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
            {currentService.name}
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

      {/* نشانگر ۳ مرحله */}
      <ThreeStepIndicator currentStep={currentStep} colors={colors} />

      {/* محتوای اسکرولی */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* مرحله ۱: توضیحات خدمت */}
        {currentStep === 1 && (
          <View style={s.stepContent}>
            <View style={s.sectionHeader}>
              <View
                style={[
                  s.sectionIconBox,
                  { backgroundColor: colors.primary + '15' },
                ]}
              >
                <Icon name="info-outline" size={18} color={colors.primary} />
              </View>
              <View style={s.sectionHeaderText}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                  اطلاعات خدمت
                </Text>
                <Text
                  style={[s.sectionSubtitle, { color: colors.textSecondary }]}
                >
                  لطفاً اطلاعات خدمت و قیمت را بررسی کنید
                </Text>
              </View>
            </View>
            <BookingServiceInfo service={currentService} />
          </View>
        )}

        {/* مرحله ۲: انتخاب روز */}
        {currentStep === 2 && (
          <View style={s.stepContent}>
            <BookingDateSelector
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </View>
        )}

        {/* مرحله ۳: انتخاب ساعت */}
        {currentStep === 3 && (
          <View style={s.stepContent}>
            {/* Chip روز انتخاب شده */}
            {selectedDate && (
              <TouchableOpacity
                onPress={handleBack}
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

            <BookingTimeSelector
              slots={MOCK_TIME_SLOTS}
              selectedId={selectedTime}
              onSelect={handleTimeSelect}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
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
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 4,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 10,
  },
  stepLine: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    marginHorizontal: 2,
    marginBottom: 18,
  },

  // ═══════ محتوا ═══════
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  stepContent: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  sectionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 17,
  },

  // ═══════ Chip روز ═══════
  selectedDateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  selectedDateText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },

  // ═══════ فوتر ═══════
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfBtn: {
    flex: 1,
  },
  step3Footer: {
    gap: 10,
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  summaryDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});