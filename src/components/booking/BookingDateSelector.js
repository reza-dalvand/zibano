// src/components/booking/BookingDateSelector.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
  'مرداد', 'شهریور', 'مهر', 'آبان',
  'آذر', 'دی', 'بهمن', 'اسفند',
];

const PERSIAN_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// تبدیل میلادی به شمسی
function toJalaali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { jy, jm, jd };
}

// تولید روزهای موجود (شبیه‌سازی - در آینده از API)
const generateAvailableDates = () => {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    // جمعه‌ها تعطیل (dayOfWeek === 5)
    if (dayOfWeek !== 5) {
      const j = toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
      dates.push({
        ...j,
        dayOfWeek,
        weekdayName: PERSIAN_WEEKDAYS[(dayOfWeek + 1) % 7],
        key: `${j.jy}-${j.jm}-${j.jd}`,
      });
    }
  }
  return dates;
};

export default function BookingDateSelector({ selectedDate, onDateSelect }) {
  const { colors } = useTheme();

  const availableDates = useMemo(() => generateAvailableDates(), []);

  // گروه‌بندی بر اساس ماه
  const groupedByMonth = useMemo(() => {
    const groups = {};
    availableDates.forEach((date) => {
      const monthKey = `${date.jy}-${date.jm}`;
      if (!groups[monthKey]) {
        groups[monthKey] = {
          jy: date.jy,
          jm: date.jm,
          label: `${PERSIAN_MONTHS[date.jm - 1]} ${toPersianDigit(date.jy)}`,
          dates: [],
        };
      }
      groups[monthKey].dates.push(date);
    });
    return Object.values(groups);
  }, [availableDates]);

  const isSameDate = (d1, d2) =>
    d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd;

  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  return (
    <View style={s.container}>
      <View style={s.sectionHeader}>
        <View style={[s.sectionIconBox, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="event" size={18} color={colors.primary} />
        </View>
        <View style={s.sectionHeaderText}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            روز مورد نظر را انتخاب کنید
          </Text>
          <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
            {toPersianDigit(availableDates.length)} روز فعال برای رزرو
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {groupedByMonth.map((group) => (
          <View key={group.label} style={s.monthGroup}>
            <Text style={[s.monthLabel, { color: colors.textMain }]}>
              {group.label}
            </Text>
            <View style={s.datesGrid}>
              {group.dates.map((date) => {
                const isSelected = isSameDate(date, selectedDate);
                const isToday = isSameDate(date, today);
                const isFriday = date.dayOfWeek === 5;

                return (
                  <TouchableOpacity
                    key={date.key}
                    onPress={() => onDateSelect(date)}
                    activeOpacity={0.7}
                    style={[
                      s.dateTag,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.cardBackground,
                        borderColor: isSelected
                          ? colors.primary
                          : isToday
                          ? colors.primary + '60'
                          : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        s.dateWeekday,
                        {
                          color: isSelected
                            ? '#ffffffcc'
                            : isFriday
                            ? '#E57373'
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      {date.weekdayName}
                    </Text>
                    <Text
                      style={[
                        s.dateDay,
                        {
                          color: isSelected ? '#fff' : colors.textMain,
                        },
                      ]}
                    >
                      {toPersianDigit(date.jd)}
                    </Text>
                    {isToday && !isSelected && (
                      <View style={[s.todayDot, { backgroundColor: colors.primary }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* روز انتخاب شده */}
      {selectedDate && (
        <View style={[s.selectedBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '40' }]}>
          <Icon name="event-available" size={16} color={colors.primary} />
          <Text style={[s.selectedText, { color: colors.primary }]}>
            {PERSIAN_WEEKDAYS[(selectedDate.dayOfWeek + 1) % 7]}{' '}
            {toPersianDigit(selectedDate.jd)}{' '}
            {PERSIAN_MONTHS[selectedDate.jm - 1]}{' '}
            {toPersianDigit(selectedDate.jy)}
          </Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: 10,
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
  },
  scrollContent: {
    paddingBottom: 8,
  },
  monthGroup: {
    marginBottom: 14,
    gap: 8,
  },
  monthLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    marginRight: 4,
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateTag: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 2,
    position: 'relative',
  },
  dateWeekday: {
    fontSize: 9,
    fontFamily: 'Vazir',
  },
  dateDay: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  todayDot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  selectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
});