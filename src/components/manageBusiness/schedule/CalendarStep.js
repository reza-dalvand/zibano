// src/components/manageBusiness/schedule/CalendarStep.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import { toPersianDigit } from '../../../utils/numberUtils';
import {
  toJalaali,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  jalaaliMonthLength,
  getFirstDayOfWeekJalaali,
} from '../../../utils/dateUtils';

export default function CalendarStep({ selectedDates, onDatesChange }) {
  const { colors } = useTheme();
  
  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  const [viewMonth, setViewMonth] = useState(() => ({
    jy: today.jy,
    jm: today.jm,
  }));

  const goToPrev = () => {
    setViewMonth((prev) =>
      prev.jm === 1 ? { jy: prev.jy - 1, jm: 12 } : { ...prev, jm: prev.jm - 1 }
    );
  };

  const goToNext = () => {
    setViewMonth((prev) =>
      prev.jm === 12 ? { jy: prev.jy + 1, jm: 1 } : { ...prev, jm: prev.jm + 1 }
    );
  };

  const monthLength = jalaaliMonthLength(viewMonth.jy, viewMonth.jm);
  const firstDayOfWeek = getFirstDayOfWeekJalaali(viewMonth.jy, viewMonth.jm);

  const isSameDate = (d1, d2) =>
    d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd;

  const isSelected = (day) =>
    selectedDates.some((d) => isSameDate(d, { jy: viewMonth.jy, jm: viewMonth.jm, jd: day }));

  const isPast = (jy, jm, jd) => {
    const val = jy * 10000 + jm * 100 + jd;
    const todayVal = today.jy * 10000 + today.jm * 100 + today.jd;
    return val < todayVal;
  };

  const toggleDay = (day) => {
    const dateObj = { jy: viewMonth.jy, jm: viewMonth.jm, jd: day };
    if (isSelected(day)) {
      onDatesChange(selectedDates.filter((d) => !isSameDate(d, dateObj)));
    } else {
      onDatesChange([...selectedDates, dateObj]);
    }
  };

  const selectAllMonth = () => {
    const monthDates = [];
    for (let d = 1; d <= monthLength; d++) {
      if (!isPast(viewMonth.jy, viewMonth.jm, d)) {
        monthDates.push({ jy: viewMonth.jy, jm: viewMonth.jm, jd: d });
      }
    }
    const combined = [...selectedDates];
    monthDates.forEach((md) => {
      if (!combined.some((d) => isSameDate(d, md))) {
        combined.push(md);
      }
    });
    onDatesChange(combined);
  };

  const clearAll = () => onDatesChange([]);

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ empty: true, key: `e-${i}` });
  }
  for (let d = 1; d <= monthLength; d++) {
    days.push({ jd: d, jy: viewMonth.jy, jm: viewMonth.jm, key: `d-${d}` });
  }

  const selectedInMonth = days.filter(
    (d) => !d.empty && isSelected(d.jd)
  ).length;

  return (
    <View style={s.container}>
      {/* هدر ماه */}
      <View style={[s.header, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <TouchableOpacity onPress={goToPrev} style={s.navBtn}>
          <Icon name="chevron-right" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <View style={s.monthInfo}>
          <Text style={[s.monthName, { color: colors.textMain }]}>
            {PERSIAN_MONTHS[viewMonth.jm - 1]}
          </Text>
          <Text style={[s.year, { color: colors.textSecondary }]}>
            {toPersianDigit(viewMonth.jy)}
          </Text>
        </View>
        <TouchableOpacity onPress={goToNext} style={s.navBtn}>
          <Icon name="chevron-left" size={24} color={colors.textMain} />
        </TouchableOpacity>
      </View>

      {/* دکمه‌های انتخاب */}
      <View style={s.actionRow}>
        <TouchableOpacity
          onPress={selectAllMonth}
          style={[s.actionBtn, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '40' }]}
        >
          <Icon name="check-box" size={16} color={colors.primary} />
          <Text style={[s.actionText, { color: colors.primary }]}>
            انتخاب کل ماه ({toPersianDigit(monthLength - days.filter((d) => !d.empty && isPast(d.jy, d.jm, d.jd)).length)} روز)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={clearAll}
          style={[s.actionBtn, { backgroundColor: '#E5393510', borderColor: '#E5393540' }]}
        >
          <Icon name="delete-outline" size={16} color="#E53935" />
          <Text style={[s.actionText, { color: '#E53935' }]}>پاک کردن همه</Text>
        </TouchableOpacity>
      </View>

      {/* شمارنده */}
      {/* <View style={[s.counterBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
        <Icon name="event-available" size={16} color={colors.primary} />
        <Text style={[s.counterText, { color: colors.primary }]}>
          {toPersianDigit(selectedDates.length)} روز انتخاب شده
          {selectedInMonth > 0 && ` (${toPersianDigit(selectedInMonth)} روز در این ماه)`}
        </Text>
      </View> */}

      {/* روزهای هفته */}
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

      {/* شبکه روزها */}
      <View style={s.daysGrid}>
        {days.map((day) => {
          if (day.empty) return <View key={day.key} style={s.dayCell} />;
          const disabled = isPast(day.jy, day.jm, day.jd);
          const isToday = isSameDate(day, today);
          const selected = isSelected(day.jd);
          const isFriday = (day.jd + firstDayOfWeek) % 7 === 6;

          return (
            <TouchableOpacity
              key={day.key}
              disabled={disabled}
              onPress={() => toggleDay(day.jd)}
              activeOpacity={0.7}
              style={[
                s.dayCell,
                selected && { backgroundColor: colors.primary },
                isToday && !selected && { borderColor: colors.primary, borderWidth: 2 },
                disabled && { opacity: 0.3 },
              ]}
            >
              <Text
                style={[
                  s.dayText,
                  { color: colors.textMain },
                  selected && { color: '#fff', fontFamily: 'Vazir-Bold' },
                  isFriday && !selected && !disabled && { color: '#E57373' },
                ]}
              >
                {toPersianDigit(day.jd)}
              </Text>
              {isToday && !selected && (
                <View style={[s.todayDot, { backgroundColor: colors.primary }]} />
              )}
              {selected && (
                <View style={s.checkIcon}>
                  <Icon name="check" size={12} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* لیست روزهای انتخاب شده */}
      {selectedDates.length > 0 && (
        <View style={[s.selectedList, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '30' }]}>
          <Text style={[s.selectedListTitle, { color: colors.primary }]}>
            روزهای انتخاب شده:
          </Text>
          <View style={s.selectedChips}>
            {selectedDates
              .sort((a, b) => {
                const aVal = a.jy * 10000 + a.jm * 100 + a.jd;
                const bVal = b.jy * 10000 + b.jm * 100 + b.jd;
                return aVal - bVal;
              })
              .slice(0, 8)
              .map((d, i) => (
                <View
                  key={i}
                  style={[s.selectedChip, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}
                >
                  <Text style={[s.selectedChipText, { color: colors.primary }]}>
                    {toPersianDigit(d.jd)} {PERSIAN_MONTHS[d.jm - 1]}
                  </Text>
                </View>
              ))}
            {selectedDates.length > 8 && (
              <View style={[s.selectedChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[s.selectedChipText, { color: colors.textSecondary }]}>
                  + {toPersianDigit(selectedDates.length - 8)} روز دیگر
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { gap: 12, paddingHorizontal: 4 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  navBtn: { padding: 8 },
  monthInfo: { alignItems: 'center', gap: 2 },
  monthName: { fontSize: 17, fontFamily: 'Vazir-Bold' },
  year: { fontSize: 13, fontFamily: 'Vazir' },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionText: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  counterText: { fontSize: 13, fontFamily: 'Vazir-Bold', flex: 1 },
  weekdaysRow: { flexDirection: 'row', marginBottom: 4 },
  weekdayCell: { flex: 1, alignItems: 'center' },
  weekday: { fontSize: 13, fontFamily: 'Vazir-Medium' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    position: 'relative',
  },
  dayText: { fontSize: 15, fontFamily: 'Vazir' },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  selectedList: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  selectedListTitle: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  selectedChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  selectedChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  selectedChipText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
});