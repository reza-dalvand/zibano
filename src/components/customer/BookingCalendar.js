// src/components/customer/BookingCalendar.js
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
  'مرداد', 'شهریور', 'مهر', 'آبان',
  'آذر', 'دی', 'بهمن', 'اسفند',
];
const PERSIAN_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

// --- الگوریتم تبدیل تاریخ میلادی به شمسی و بالعکس ---
function toJalaali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100)
    + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  return { jy, jm, jd };
}

function isLeapJalaaliYear(jy) {
  return [1, 5, 9, 13, 17, 22, 26, 30].includes(jy % 33);
}

function jalaaliMonthLength(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaaliYear(jy) ? 30 : 29;
}

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function BookingCalendar({
  selectedDate,
  onDateSelect,
  minDate,
  disabledDates = [],
}) {
  const { colors } = useTheme();

  // تاریخ امروز به شمسی
  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) return { jy: selectedDate.jy, jm: selectedDate.jm };
    return { jy: today.jy, jm: today.jm };
  });

  const goToPrevMonth = () => {
    setViewMonth((prev) => {
      if (prev.jm === 1) return { jy: prev.jy - 1, jm: 12 };
      return { ...prev, jm: prev.jm - 1 };
    });
  };

  const goToNextMonth = () => {
    setViewMonth((prev) => {
      if (prev.jm === 12) return { jy: prev.jy + 1, jm: 1 };
      return { ...prev, jm: prev.jm + 1 };
    });
  };

  const monthLength = jalaaliMonthLength(viewMonth.jy, viewMonth.jm);

  // پیدا کردن روز هفته اولین روز ماه (۰=شنبه)
  const firstDayGreg = useMemo(() => {
    const { jy, jm } = viewMonth;
    // محاسبه ساده روز هفته از طریق تاریخ میلادی متناظر
    let gy = (jy <= 979) ? 621 : 1600;
    let tempJy = jy - ((jy <= 979) ? 0 : 979);
    let days = (365 * tempJy) + (Math.floor(tempJy / 33) * 8)
      + Math.floor(((tempJy % 33) + 3) / 4) + 78 + 1
      + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy += 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) {
      gy += 100 * Math.floor(--days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
      gy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    let gd = days + 1;
    const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28,
      31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm = 0;
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
    return new Date(gy, gm - 1, gd);
  }, [viewMonth]);

  // JS getDay: 0=Sun → Persian: ش=0, ی=1, د=2, س=3, چ=4, پ=5, ج=6
  const firstDayOfWeek = (firstDayGreg.getDay() + 1) % 7;

  const isSameDate = (d1, d2) =>
    d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd;

  const isDateDisabled = (jy, jm, jd) => {
    const val = jy * 10000 + jm * 100 + jd;
    if (minDate) {
      const minVal = minDate.jy * 10000 + minDate.jm * 100 + minDate.jd;
      if (val < minVal) return true;
    }
    if (disabledDates.some((d) => isSameDate(d, { jy, jm, jd }))) return true;
    return false;
  };

  // ساخت آرایه روزها (با خانه‌های خالی برای شروع ماه)
  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ empty: true, key: `e-${i}` });
  }
  for (let d = 1; d <= monthLength; d++) {
    days.push({ jd: d, jy: viewMonth.jy, jm: viewMonth.jm, key: `d-${d}` });
  }

  const canGoPrev = !(minDate && viewMonth.jy === minDate.jy && viewMonth.jm === minDate.jm);

  return (
    <View style={[s.container, { backgroundColor: colors.cardBackground }]}>
      {/* هدر ماه */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={goToPrevMonth}
          disabled={!canGoPrev}
          style={[s.navBtn, { opacity: canGoPrev ? 1 : 0.3 }]}
        >
          <Icon name="chevron-right" size={26} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={[s.title, { color: colors.textMain }]}>
          {PERSIAN_MONTHS[viewMonth.jm - 1]} {toPersianDigit(viewMonth.jy)}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={s.navBtn}>
          <Icon name="chevron-left" size={26} color={colors.textMain} />
        </TouchableOpacity>
      </View>

      {/* ردیف نام روزهای هفته */}
      <View style={s.weekdaysRow}>
        {PERSIAN_WEEKDAYS.map((d, i) => (
          <View key={d} style={s.weekdayCell}>
            <Text
              style={[
                s.weekday,
                { color: i === 6 ? '#E57373' : colors.textSecondary },
              ]}
            >
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* شبکه روزهای ماه */}
      <View style={s.daysGrid}>
        {days.map((day, index) => {
          if (day.empty) {
            return <View key={day.key} style={s.dayCell} />;
          }
          const disabled = isDateDisabled(day.jy, day.jm, day.jd);
          const isToday = isSameDate(day, today);
          const isSelected = isSameDate(day, selectedDate);
          const isFriday = (index % 7) === 6;

          return (
            <TouchableOpacity
              key={day.key}
              disabled={disabled}
              onPress={() => onDateSelect?.(day)}
              activeOpacity={0.7}
              style={[
                s.dayCell,
                isSelected && { backgroundColor: colors.primary },
                isToday && !isSelected && {
                  borderColor: colors.primary,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Text
                style={[
                  s.dayText,
                  { color: colors.textMain },
                  disabled && { color: colors.border },
                  isSelected && { color: '#fff', fontFamily: 'Vazir-Bold' },
                  isFriday && !isSelected && !disabled && { color: '#E57373' },
                ]}
              >
                {toPersianDigit(day.jd)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  navBtn: {
    padding: 8,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekday: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  dayText: {
    fontSize: 15,
    fontFamily: 'Vazir',
  },
});