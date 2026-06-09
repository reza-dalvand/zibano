// src/screens/home/BookingScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import BookingCalendar from '../../components/customer/BookingCalendar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// آیکون‌های مختلف برای نقش‌های کارمندان
const ROLE_ICONS = {
  'ناخن‌کار': 'brush',
  'آرایشگر': 'face',
  'متخصص پوست': 'spa',
  'لیزر': 'flash-on',
  'میکاپ': 'auto-awesome',
  default: 'person',
};

const ROLE_COLORS = {
  'ناخن‌کار': '#E91E63',
  'آرایشگر': '#9C27B0',
  'متخصص پوست': '#4CAF50',
  'لیزر': '#2196F3',
  'میکاپ': '#FF9800',
  default: '#607D8B',
};

// داده‌های نمونه با قیمت و تخفیف واقعی
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
];

const MOCK_TIME_SLOTS = [
  { id: 't1', time: '۱۰:۰۰', isAvailable: true },
  { id: 't2', time: '۱۱:۳۰', isAvailable: true },
  { id: 't3', time: '۱۳:۰۰', isAvailable: false },
  { id: 't4', time: '۱۴:۳۰', isAvailable: true },
  { id: 't5', time: '۱۶:۰۰', isAvailable: true },
  { id: 't6', time: '۱۷:۳۰', isAvailable: false },
];

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
  'مرداد', 'شهریور', 'مهر', 'آبان',
  'آذر', 'دی', 'بهمن', 'اسفند',
];


const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// ✅ تابع جدید: استخراج عدد خالص از رشته‌های فارسی مثل "۷۵۰,۰۰۰ تومان"
const parsePrice = (val) => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    // تبدیل اعداد فارسی و عربی به انگلیسی
    const eng = val
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    // حذف هر کاراکتری غیر از اعداد انگلیسی
    const cleaned = eng.replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
  }
  return 0;
};

// ✅ تابع ایمن فرمت قیمت
const formatPrice = (num) => {
  const n = parsePrice(num);
  return toPersianDigit(n.toLocaleString('en-US'));
};

export default function BookingModal({ visible, onClose, service }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const currentService = service || MOCK_SERVICE;

  const [selectedEmployee, setSelectedEmployee] = useState(MOCK_EMPLOYEES[0].id);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // ✅ محاسبه ایمن قیمت‌ها (پشتیبانی از string و number)
  // اگر originalPrice نداشت، از price استفاده می‌کند
  const originalPrice = parsePrice(currentService.originalPrice ?? currentService.price);
  const discountPercent = parsePrice(currentService.discount);
  
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  
  const hasDeposit = currentService.hasDeposit || false;
  const depositPercent = parsePrice(currentService.depositPercent) || 30;
  const depositAmount = hasDeposit ? Math.round((finalPrice * depositPercent) / 100) : finalPrice;

  const handleConfirm = () => {
    console.log('✅ Booking:', {
      service: currentService.name,
      employee: selectedEmployee,
      date: selectedDate,
      time: selectedTime,
      deposit: depositAmount,
    });
    // TODO: navigate to payment gateway
  };

  const canConfirm = selectedEmployee && selectedDate && selectedTime;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[s.container, { backgroundColor: colors.background }]}>
        {/* هدر مودال */}
        <View
          style={[
            s.header,
            {
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
              paddingTop: insets.top + 10,
            },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={s.closeBtn}>
            <Icon name="close" size={26} color={colors.textMain} />
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <Text style={[s.headerTitle, { color: colors.textMain }]}>
              رزرو نوبت
            </Text>
            <Text
              style={[s.headerSubtitle, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {currentService.name}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
        >
          {/* ۱. انتخاب کارمند با آیکون */}
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              <Icon name="people" size={18} color={colors.primary} />  انتخاب کارمند
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.employeeRow}
            >
              {MOCK_EMPLOYEES.map((emp) => {
                const isSelected = selectedEmployee === emp.id;
                const icon = ROLE_ICONS[emp.role] || ROLE_ICONS.default;
                const color = ROLE_COLORS[emp.role] || ROLE_COLORS.default;
                return (
                  <TouchableOpacity
                    key={emp.id}
                    activeOpacity={0.8}
                    style={[
                      s.employeeCard,
                      {
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected
                          ? colors.primary + '12'
                          : colors.cardBackground,
                      },
                    ]}
                    onPress={() => setSelectedEmployee(emp.id)}
                  >
                    <View
                      style={[
                        s.iconCircle,
                        { backgroundColor: color + '20' },
                      ]}
                    >
                      <Icon name={icon} size={28} color={color} />
                    </View>
                    <Text
                      style={[s.empName, { color: colors.textMain }]}
                      numberOfLines={1}
                    >
                      {emp.name}
                    </Text>
                    <Text
                      style={[s.empRole, { color: colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {emp.role}
                    </Text>
                    <Text
                      style={[s.empExp, { color: colors.textSecondary }]}
                    >
                      {emp.experience}
                    </Text>
                    {isSelected && (
                      <View
                        style={[s.checkBadge, { backgroundColor: colors.primary }]}
                      >
                        <Icon name="check" size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* ۲. تقویم شمسی */}
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              <Icon name="calendar-today" size={18} color={colors.primary} />  انتخاب تاریخ
            </Text>
            <BookingCalendar
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
            />
            {selectedDate && (
              <View
                style={[
                  s.selectedDateChip,
                  { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' },
                ]}
              >
                <Icon name="event" size={16} color={colors.primary} />
                <Text style={[s.selectedDateText, { color: colors.primary }]}>
                  {toPersianDigit(selectedDate.jd)} {PERSIAN_MONTHS[selectedDate.jm - 1]}{' '}
                  {toPersianDigit(selectedDate.jy)}
                </Text>
              </View>
            )}
          </View>

          {/* ۳. انتخاب ساعت */}
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              <Icon name="access-time" size={18} color={colors.primary} />  انتخاب ساعت
            </Text>
            <View style={s.timeGrid}>
              {MOCK_TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot.id;
                return (
                  <TouchableOpacity
                    key={slot.id}
                    disabled={!slot.isAvailable}
                    activeOpacity={0.8}
                    style={[
                      s.timeCard,
                      {
                        borderColor: isSelected
                          ? colors.primary
                          : slot.isAvailable
                          ? colors.border
                          : colors.border + '50',
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.cardBackground,
                        opacity: slot.isAvailable ? 1 : 0.4,
                      },
                    ]}
                    onPress={() => setSelectedTime(slot.id)}
                  >
                    <Icon
                      name="schedule"
                      size={14}
                      color={isSelected ? '#fff' : colors.textSecondary}
                    />
                    <Text
                      style={[
                        s.timeText,
                        {
                          color: isSelected ? '#fff' : colors.textMain,
                        },
                      ]}
                    >
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* فوتر: خلاصه قیمت و دکمه پرداخت */}
        <View
          style={[
            s.footer,
            {
              backgroundColor: colors.cardBackground,
              borderTopColor: colors.border,
              paddingBottom: Math.max(insets.bottom, 16) + 10,
            },
          ]}
        >
          <View style={s.priceSummary}>
            {/* قیمت اصلی با خط‌خوردگی */}
            {currentService.discount > 0 && (
              <Text style={[s.originalPrice, { color: colors.textSecondary }]}>
                {formatPrice(originalPrice)} تومان
              </Text>
            )}
            {/* قیمت نهایی */}
            <View style={s.finalPriceRow}>
              <Text style={[s.finalPrice, { color: colors.primary }]}>
                {formatPrice(finalPrice)}
              </Text>
              <Text style={[s.currencyText, { color: colors.textMain }]}>
                تومان
              </Text>
              {currentService.discount > 0 && (
                <View
                  style={[s.discountBadge, { backgroundColor: '#4CAF5022' }]}
                >
                  <Text style={[s.discountText, { color: '#4CAF50' }]}>
                    {toPersianDigit(currentService.discount)}٪ تخفیف
                  </Text>
                </View>
              )}
            </View>
            {/* مبلغ بیعانه */}
            <Text style={[s.depositLabel, { color: colors.textSecondary }]}>
              مبلغ قابل پرداخت:{' '}
              <Text style={{ color: colors.textMain, fontFamily: 'Vazir-Bold' }}>
                {formatPrice(depositAmount)} تومان
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[
              s.payBtn,
              {
                backgroundColor: canConfirm ? colors.primary : colors.border,
              },
            ]}
            disabled={!canConfirm}
            onPress={handleConfirm}
          >
            <Icon name="payment" size={20} color="#fff" />
            <Text style={s.payBtnText}>
              {currentService.hasDeposit ? 'پرداخت بیعانه' : 'پرداخت و ثبت نوبت'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 220,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginBottom: 14,
    flexDirection: 'row-reverse',
    textAlign: 'right',
  },
  // کارمندها
  employeeRow: {
    gap: 12,
    paddingRight: 4,
  },
  employeeCard: {
    width: 115,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  empName: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  empRole: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
  empExp: {
    fontSize: 10,
    fontFamily: 'Vazir',
    marginTop: 4,
  },
  checkBadge: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  // تاریخ انتخاب شده
  selectedDateChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
  },
  selectedDateText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  // ساعات
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeCard: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  // فوتر
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  priceSummary: {
    gap: 4,
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
    textAlign: 'right',
  },
  finalPriceRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  finalPrice: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
  },
  currencyText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    marginLeft: 8,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  discountText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  depositLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'right',
    marginTop: 2,
  },
  payBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
});