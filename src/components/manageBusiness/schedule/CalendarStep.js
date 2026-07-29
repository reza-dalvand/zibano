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

export default function CalendarStep({ selectedDates, onDatesChange, existingDates = [] }) {
  const { colors } = useTheme();
  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    // اگر روز موجودی هست، به ماه اولین آن روز برو
    if (existingDates && existingDates.length > 0) {
      const first = existingDates[0];
      return { jy: first.jy, jm: first.jm };
    }
    return { jy: today.jy, jm: today.jm };
  });

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

  // 🆕 بررسی آیا این روز قبلاً تنظیم شده است
  const isExisting = (day) =>
    existingDates.some((d) => isSameDate(d, { jy: viewMonth.jy, jm: viewMonth.jm, jd: day }));

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

  const existingInMonth = days.filter(
    (d) => !d.empty && isExisting(d.jd)
  ).length;

  return (
    <View style={calS.container}>
      {/* هدر ماه */}
      <View style={[calS.header, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <TouchableOpacity onPress={goToPrev} style={calS.navBtn}>
          <Icon name="chevron-right" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <View style={calS.monthInfo}>
          <Text style={[calS.monthName, { color: colors.textMain }]}>
            {PERSIAN_MONTHS[viewMonth.jm - 1]}
          </Text>
          <Text style={[calS.year, { color: colors.textSecondary }]}>
            {toPersianDigit(viewMonth.jy)}
          </Text>
        </View>
        <TouchableOpacity onPress={goToNext} style={calS.navBtn}>
          <Icon name="chevron-left" size={24} color={colors.textMain} />
        </TouchableOpacity>
      </View>

      {/* 🆕 بنر راهنما برای حالت ویرایش */}
      {/* {existingDates.length > 0 && (
        <View style={[calS.editingHintBox, { backgroundColor: '#43A04710', borderColor: '#43A04740' }]}>
          <Icon name="info-outline" size={16} color="#43A047" />
          <Text style={[calS.editingHintText, { color: colors.textSecondary }]}>
            روزهای <Text style={{ color: '#43A047', fontFamily: 'Vazir-Bold' }}>سبز رنگ</Text> قبلاً تنظیم شده‌اند. روی آن‌ها ضربه بزنید تا حذف شوند یا روزهای جدید اضافه کنید.
          </Text>
        </View>
      )} */}

      {/* دکمه‌های انتخاب همه و پاک کردن */}
      <View style={calS.actionRow}>
        <TouchableOpacity
          onPress={selectAllMonth}
          style={[calS.actionBtn, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '40' }]}
        >
          <Icon name="check-box" size={16} color={colors.primary} />
          <Text style={[calS.actionText, { color: colors.primary }]}>
            انتخاب کل ماه
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={clearAll}
          style={[calS.actionBtn, { backgroundColor: '#E5393510', borderColor: '#E5393540' }]}
        >
          <Icon name="delete-outline" size={16} color="#E53935" />
          <Text style={[calS.actionText, { color: '#E53935' }]}>پاک کردن همه</Text>
        </TouchableOpacity>
      </View>

      {/* شمارنده‌ها */}
      {/* <View style={calS.countersRow}>
        <View style={[calS.counterBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <Icon name="event-available" size={14} color={colors.primary} />
          <Text style={[calS.counterText, { color: colors.primary }]}>
            {toPersianDigit(selectedDates.length)} روز انتخاب شده
          </Text>
        </View>
        {existingInMonth > 0 && (
          <View style={[calS.counterBox, { backgroundColor: '#43A04710', borderColor: '#43A04740' }]}>
            <Icon name="event-note" size={14} color="#43A047" />
            <Text style={[calS.counterText, { color: '#43A047' }]}>
              {toPersianDigit(existingInMonth)} روز تنظیم‌شده
            </Text>
          </View>
        )}
      </View> */}

      {/* ردیف نام روزهای هفته */}
      <View style={calS.weekdaysRow}>
        {PERSIAN_WEEKDAYS.map((d, i) => (
          <View key={d} style={calS.weekdayCell}>
            <Text
              style={[
                calS.weekday,
                { color: i === 6 ? '#E57373' : colors.textSecondary },
              ]}
            >
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* شبکه روزهای ماه */}
      <View style={calS.daysGrid}>
        {days.map((day) => {
          if (day.empty) return <View key={day.key} style={calS.dayCell} />;
          const disabled = isPast(day.jy, day.jm, day.jd);
          const isToday = isSameDate(day, today);
          const selected = isSelected(day.jd);
          const existing = isExisting(day.jd);
          const isFriday = (day.jd + firstDayOfWeek) % 7 === 6;

          return (
            <TouchableOpacity
              key={day.key}
              disabled={disabled}
              onPress={() => toggleDay(day.jd)}
              activeOpacity={0.7}
              style={[
                calS.dayCell,
                // 🆕 اولویت استایل‌ها
                selected && { backgroundColor: colors.primary },
                !selected && existing && {
                  backgroundColor: '#43A04715',
                  borderColor: '#43A047',
                  borderWidth: 2,
                },
                !selected && !existing && isToday && { borderColor: colors.primary, borderWidth: 2 },
                disabled && { opacity: 0.3 },
              ]}
            >
              <Text
                style={[
                  calS.dayText,
                  { color: colors.textMain },
                  selected && { color: '#fff', fontFamily: 'Vazir-Bold' },
                  !selected && existing && { color: '#43A047', fontFamily: 'Vazir-Bold' },
                  isFriday && !selected && !existing && !disabled && { color: '#E57373' },
                ]}
              >
                {toPersianDigit(day.jd)}
              </Text>

              {/* نقطه امروز */}
              {isToday && !selected && !existing && (
                <View style={[calS.todayDot, { backgroundColor: colors.primary }]} />
              )}

              {/* 🆕 آیکون چک برای روزهای انتخاب شده */}
              {selected && (
                <View style={calS.checkIcon}>
                  <Icon name="check" size={12} color="#fff" />
                </View>
              )}

              {/* 🆕 نشانگر خاص برای روزهای existing (غیر انتخاب شده) */}
              {!selected && existing && (
                <View style={calS.existingDot}>
                  <Icon name="event" size={9} color="#43A047" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* لیست روزهای انتخاب شده */}
      {/* {selectedDates.length > 0 && (
        <View style={[calS.selectedList, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '30' }]}>
          <Text style={[calS.selectedListTitle, { color: colors.primary }]}>
            روزهای انتخاب شده:
          </Text>
          <View style={calS.selectedChips}>
            {selectedDates
              .sort((a, b) => {
                const aVal = a.jy * 10000 + a.jm * 100 + a.jd;
                const bVal = b.jy * 10000 + b.jm * 100 + b.jd;
                return aVal - bVal;
              })
              .slice(0, 8)
              .map((d, i) => {
                const isExistingDay = existingDates.some((ed) => isSameDate(ed, d));
                return (
                  <View
                    key={i}
                    style={[
                      calS.selectedChip,
                      {
                        backgroundColor: isExistingDay ? '#43A04720' : colors.primary + '20',
                        borderColor: isExistingDay ? '#43A04740' : colors.primary + '40',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        calS.selectedChipText,
                        { color: isExistingDay ? '#43A047' : colors.primary },
                      ]}
                    >
                      {toPersianDigit(d.jd)} {PERSIAN_MONTHS[d.jm - 1]}
                    </Text>
                  </View>
                );
              })}
            {selectedDates.length > 8 && (
              <View style={[calS.selectedChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[calS.selectedChipText, { color: colors.textSecondary }]}>
                  + {toPersianDigit(selectedDates.length - 8)} روز دیگر
                </Text>
              </View>
            )}
          </View>
        </View>
      )} */}
    </View>
  );
}

const calS = StyleSheet.create({
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
  // 🆕 بنر راهنما
  editingHintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  editingHintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
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
  // 🆕 ردیف شمارنده‌ها
  countersRow: {
    flexDirection: 'row',
    gap: 6,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
  },
  counterText: { fontSize: 11, fontFamily: 'Vazir-Bold', flex: 1 },
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
  // 🆕 نشانگر existing
  existingDot: {
    position: 'absolute',
    bottom: 3,
    left: 3,
  },
  selectedList: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  selectedListTitle: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  selectedChipText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
});