// src/screens/home/BookingScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import BottomSheet from '../../components/common/BottomSheet';
import BookingCalendar from '../../components/customer/BookingCalendar';
import BookingStepIndicator from '../../components/booking/BookingStepIndicator';
import EmployeeSelector from '../../components/booking/EmployeeSelector';
import TimeSlotGrid from '../../components/booking/TimeSlotGrid';
import BookingSummaryBar from '../../components/booking/BookingSummaryBar';

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
  name: 'کاشت ناخن ژله‌ای VIP',
  originalPrice: 650000,
  discount: 20,
  duration: 90,
  hasDeposit: true,
  depositPercent: 30,
};

const MOCK_EMPLOYEES = [
  { id: 'e1', name: 'سارا احمدی', role: 'ناخن‌کار', experience: '۵ سال' },
  { id: 'e2', name: 'مریم رضایی', role: 'ناخن‌کار', experience: '۳ سال' },
  { id: 'e3', name: 'الناز کریمی', role: 'میکاپ', experience: '۷ سال' },
  { id: 'e4', name: 'نگار موسوی', role: 'متخصص پوست', experience: '۴ سال' },
];

const MOCK_TIME_SLOTS = [
  { id: 't1', time: '۱۰:۰۰', isAvailable: true },
  { id: 't2', time: '۱۱:۳۰', isAvailable: true },
  { id: 't3', time: '۱۳:۰۰', isAvailable: false },
  { id: 't4', time: '۱۴:۳۰', isAvailable: true },
  { id: 't5', time: '۱۶:۰۰', isAvailable: true },
  { id: 't6', time: '۱۷:۳۰', isAvailable: false },
  { id: 't7', time: '۱۹:۰۰', isAvailable: true },
];

export default function BookingModal({ visible, onClose, service }) {
  const { colors } = useTheme();
  const currentService = service || MOCK_SERVICE;

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // محاسبه مرحله فعلی
  const currentStep = useMemo(() => {
    if (!selectedEmployee) return 1;
    if (!selectedDate) return 2;
    if (!selectedTime) return 3;
    return 4; // کامل
  }, [selectedEmployee, selectedDate, selectedTime]);

  // محاسبات قیمت
  const originalPrice = parsePrice(currentService.originalPrice ?? currentService.price);
  const discountPercent = parsePrice(currentService.discount);
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const hasDeposit = currentService.hasDeposit || false;
  const depositPercent = parsePrice(currentService.depositPercent) || 30;
  const depositAmount = hasDeposit
    ? Math.round((finalPrice * depositPercent) / 100)
    : finalPrice;

  const canConfirm = selectedEmployee && selectedDate && selectedTime;

  const handleConfirm = () => {
    console.log('✅ Booking:', {
      service: currentService.name,
      employee: selectedEmployee,
      date: selectedDate,
      time: selectedTime,
      deposit: depositAmount,
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoint={0.92}
    >
      {/* هدر مدال با اطلاعات خدمت */}
      <View style={[s.header, { borderBottomColor: colors.border }]}>
        <View style={s.headerIconBox}>
          <Icon name="event-available" size={22} color={colors.primary} />
        </View>
        <View style={s.headerInfo}>
          <Text style={[s.headerTitle, { color: colors.textMain }]} numberOfLines={1}>
            رزرو نوبت
          </Text>
          <Text style={[s.headerSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {currentService.name}
          </Text>
        </View>
        <View style={[s.durationBadge, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="schedule" size={12} color={colors.primary} />
          <Text style={[s.durationText, { color: colors.primary }]}>
            {toPersianDigit(currentService.duration)} دقیقه
          </Text>
        </View>
      </View>

      {/* Step Indicator */}
      <BookingStepIndicator currentStep={currentStep} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ۱. انتخاب کارمند */}
        <EmployeeSelector
          employees={MOCK_EMPLOYEES}
          selectedId={selectedEmployee}
          onSelect={(id) => {
            setSelectedEmployee(id);
            setSelectedDate(null);
            setSelectedTime(null);
          }}
        />

        {/* ۲. تقویم (فقط وقتی کارمند انتخاب شده) */}
        {selectedEmployee && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={[s.sectionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="calendar-today" size={18} color={colors.primary} />
              </View>
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                انتخاب تاریخ
              </Text>
            </View>

            <BookingCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />

            {/* Chip تاریخ انتخاب‌شده */}
            {selectedDate && (
              <View
                style={[
                  s.selectedDateChip,
                  {
                    backgroundColor: colors.primary + '12',
                    borderColor: colors.primary + '40',
                  },
                ]}
              >
                <Icon name="event" size={15} color={colors.primary} />
                <Text style={[s.selectedDateText, { color: colors.primary }]}>
                  {toPersianDigit(selectedDate.jd)} {PERSIAN_MONTHS[selectedDate.jm - 1]}{' '}
                  {toPersianDigit(selectedDate.jy)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ۳. ساعات (فقط وقتی تاریخ انتخاب شده) */}
        {selectedDate && (
          <TimeSlotGrid
            slots={MOCK_TIME_SLOTS}
            selectedId={selectedTime}
            onSelect={setSelectedTime}
          />
        )}

        {/* فضای خالی برای SummaryBar */}
        <View style={{ height: 280 }} />
      </ScrollView>

      {/* ۴. نوار خلاصه و پرداخت */}
      <BookingSummaryBar
        originalPrice={originalPrice}
        finalPrice={finalPrice}
        depositAmount={depositAmount}
        discountPercent={discountPercent}
        hasDeposit={hasDeposit}
        canConfirm={canConfirm}
        onConfirm={handleConfirm}
      />
    </BottomSheet>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#A88B7D15',
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
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  durationText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  selectedDateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 12,
    marginHorizontal: 4,
  },
  selectedDateText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
});