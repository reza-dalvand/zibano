s
// src/screens/booking/BookingScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// داده‌های شبیه‌سازی شده بر اساس مستندات پروژه
const MOCK_SERVICE = {
  id: 's1',
  name: 'کاشت ناخن',
  price: '۴۵۰,۰۰۰ تومان',
  deposit: '۱۰۰,۰۰۰ تومان',
  hasDeposit: true,
};

const MOCK_EMPLOYEES = [
  { id: 'e1', name: 'سارا', avatar: 'https://picsum.photos/100?random=1', role: 'ناخن‌کار ارشد' },
  { id: 'e2', name: 'مریم', avatar: 'https://picsum.photos/100?random=2', role: 'متخصص طراحی' },
];

const MOCK_DATES = [
  { id: 'd1', dayName: 'شنبه', date: '۱۲ آبان' },
  { id: 'd2', dayName: 'یکشنبه', date: '۱۳ آبان' },
  { id: 'd3', dayName: 'دوشنبه', date: '۱۴ آبان' },
  { id: 'd4', dayName: 'سه‌شنبه', date: '۱۵ آبان' },
];

const MOCK_TIME_SLOTS = [
  { id: 't1', time: '۱۰:۰۰ تا ۱۲:۰۰', isAvailable: true },
  { id: 't2', time: '۱۲:۰۰ تا ۱۴:۰۰', isAvailable: false },
  { id: 't3', time: '۱۴:۰۰ تا ۱۶:۰۰', isAvailable: true },
  { id: 't4', time: '۱۶:۰۰ تا ۱۸:۰۰', isAvailable: true },
];

export default function BookingScreen({ navigation, route }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // مدیریت استیت‌های فرم رزرو
  const [selectedEmployee, setSelectedEmployee] = useState(MOCK_EMPLOYEES[0].id);
  const [selectedDate, setSelectedDate] = useState(MOCK_DATES[0].id);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleBookingConfirm = () => {
    // در اینجا کاربر به درگاه پرداخت برای بیعانه منتقل می‌شود
    // پس از پرداخت، نوبت به صورت خودکار تایید می‌شود
    console.log('Booking confirmed for:', {
      service: MOCK_SERVICE.name,
      employee: selectedEmployee,
      date: selectedDate,
      time: selectedTime,
    });
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom']}>
      <Header
        title={`رزرو ${MOCK_SERVICE.name}`}
        subtitle="مرحله انتخاب زمان و کارمند"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        
        {/* بخش ۱: انتخاب کارمند ارائه‌دهنده خدمت */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>انتخاب کارمند</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.horizontalList}>
            {MOCK_EMPLOYEES.map((emp) => {
              const isSelected = selectedEmployee === emp.id;
              return (
                <TouchableOpacity
                  key={emp.id}
                  activeOpacity={0.8}
                  style={[
                    s.employeeCard,
                    { 
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary + '10' : colors.cardBackground
                    }
                  ]}
                  onPress={() => setSelectedEmployee(emp.id)}
                >
                  <Image source={{ uri: emp.avatar }} style={s.avatar} />
                  <Text style={[s.empName, { color: colors.textMain }]}>{emp.name}</Text>
                  <Text style={[s.empRole, { color: colors.textSecondary }]}>{emp.role}</Text>
                  {isSelected && (
                    <View style={[s.checkBadge, { backgroundColor: colors.primary }]}>
                      <Icon name="check" size={12} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* بخش ۲: انتخاب تاریخ */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>تاریخ مراجعه</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.horizontalList}>
            {MOCK_DATES.map((day) => {
              const isSelected = selectedDate === day.id;
              return (
                <TouchableOpacity
                  key={day.id}
                  activeOpacity={0.8}
                  style={[
                    s.dateCard,
                    { 
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : colors.cardBackground
                    }
                  ]}
                  onPress={() => setSelectedDate(day.id)}
                >
                  <Text style={[s.dayName, { color: isSelected ? '#fff' : colors.textMain }]}>
                    {day.dayName}
                  </Text>
                  <Text style={[s.dateText, { color: isSelected ? '#fff' : colors.textSecondary }]}>
                    {day.date}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* بخش ۳: زمان‌های از پیش تعریف‌شده و قابل رزرو */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>زمان‌های موجود</Text>
          <View style={s.timeGrid}>
            {MOCK_TIME_SLOTS.map((slot) => {
              const isSelected = selectedTime === slot.id;
              const isAvailable = slot.isAvailable;
              return (
                <TouchableOpacity
                  key={slot.id}
                  disabled={!isAvailable}
                  activeOpacity={0.8}
                  style={[
                    s.timeCard,
                    { 
                      borderColor: isSelected ? colors.primary : (isAvailable ? colors.border : colors.border + '50'),
                      backgroundColor: isSelected ? colors.primary + '15' : (isAvailable ? colors.cardBackground : colors.background),
                      opacity: isAvailable ? 1 : 0.5
                    }
                  ]}
                  onPress={() => setSelectedTime(slot.id)}
                >
                  <Text style={[
                    s.timeText, 
                    { color: isSelected ? colors.primary : colors.textMain },
                    !isAvailable && { textDecorationLine: 'line-through' }
                  ]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>

      {/* بخش پایین (Footer): نمایش قیمت و دکمه پرداخت بیعانه */}
      <View style={[s.footer, { backgroundColor: colors.cardBackground, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={s.priceInfo}>
          <Text style={[s.priceLabel, { color: colors.textSecondary }]}>هزینه کل: {MOCK_SERVICE.price}</Text>
          {MOCK_SERVICE.hasDeposit && (
            <Text style={[s.depositText, { color: colors.textMain }]}>
              مبلغ بیعانه: <Text style={{ color: colors.primary, fontFamily: 'Vazir-Bold' }}>{MOCK_SERVICE.deposit}</Text>
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[s.confirmBtn, { backgroundColor: selectedTime ? colors.primary : colors.border }]}
          disabled={!selectedTime}
          onPress={handleBookingConfirm}
        >
          <Text style={s.confirmBtnText}>تایید و پرداخت</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 140, // ایجاد فضا برای فوتر ثابت
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Vazir-Bold',
    fontSize: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  // استایل‌های کارت کارمندان
  employeeCard: {
    width: 100,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    marginHorizontal: 4,
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 10,
  },
  empName: {
    fontFamily: 'Vazir-Bold',
    fontSize: 14,
    marginBottom: 2,
  },
  empRole: {
    fontFamily: 'Vazir',
    fontSize: 10,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  // استایل‌های کارت تاریخ
  dateCard: {
    width: 80,
    height: 85,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  dayName: {
    fontFamily: 'Vazir-Bold',
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    fontFamily: 'Vazir',
    fontSize: 11,
  },
  // استایل‌های گرید زمان‌ها
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  timeCard: {
    width: '47%', // دو ستونه بودن گرید
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Vazir-Medium',
    fontSize: 13,
  },
  // استایل فوتر تایید
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontFamily: 'Vazir',
    fontSize: 12,
    marginBottom: 2,
  },
  depositText: {
    fontFamily: 'Vazir-Medium',
    fontSize: 14,
  },
  confirmBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    fontFamily: 'Vazir-Bold',
    fontSize: 14,
    color: '#fff',
  },
});