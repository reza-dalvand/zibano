// src/components/customer/BookingCalendar.js
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { toPersianDigit, formatPrice } from '../../utils/numberUtils';
import {
  toJalaali,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  isLeapJalaaliYear,
  jalaaliMonthLength,
  getFirstDayOfWeekJalaali
} from '../../utils/dateUtils';

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

  // JS getDay: 0=Sun → Persian: ش=0, ی=1, د=2, س=3, چ=4, پ=5, ج=6
  const firstDayOfWeek = getFirstDayOfWeekJalaali(viewMonth.jy, viewMonth.jm);
  
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