// src/components/manageBusiness/schedule/ScheduleModal.js
import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../../stores/useThemeStore';
import BottomSheet from '../../common/BottomSheet';
import Button from '../../common/Button';
import Card from '../../common/Card';
import ServiceTypeIcon from '../services/ServiceTypeIcon';

// ══════════════════════════════════════════
//            ثابت‌ها و توابع کمکی
// ══════════════════════════════════════════

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
  'مرداد', 'شهریور', 'مهر', 'آبان',
  'آذر', 'دی', 'بهمن', 'اسفند',
];

const PERSIAN_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

const STEPS = [
  { id: 1, label: 'خدمت', icon: 'spa' },
  { id: 2, label: 'تاریخ', icon: 'calendar-today' },
  { id: 3, label: 'ساعات', icon: 'schedule' },
];

const SLOT_DURATIONS = [
  { id: 15, label: '۱۵ دقیقه', hint: 'کوتاه' },
  { id: 30, label: '۳۰ دقیقه', hint: 'استاندارد' },
  { id: 45, label: '۴۵ دقیقه', hint: 'متوسط' },
  { id: 60, label: '۶۰ دقیقه', hint: 'یک ساعت' },
  { id: 90, label: '۹۰ دقیقه', hint: 'طولانی' },
  { id: 120, label: '۱۲۰ دقیقه', hint: 'ویژه' },
];

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// تبدیل دقیقه به HH:MM
const minutesToTime = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// تبدیل HH:MM به دقیقه
const timeToMinutes = (time) => {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// الگوریتم تبدیل میلادی به شمسی
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

// ══════════════════════════════════════════
//    کامپوننت داخلی: TimePicker (ساعت)
// ══════════════════════════════════════════

function TimePickerField({ label, value, onChange, icon = 'schedule', color = '#2196F3' }) {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);
  
  // تبدیل HH:MM به Date برای DateTimePicker
  const dateValue = useMemo(() => {
    const [h, m] = (value || '09:00').split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }, [value]);

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      const h = selectedDate.getHours();
      const m = selectedDate.getMinutes();
      onChange(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  };

  return (
    <View style={tpS.wrapper}>
      <Text style={[tpS.label, { color: colors.textSecondary }]}>{label}</Text>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={[tpS.field, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        activeOpacity={0.8}
      >
        <View style={[tpS.iconBox, { backgroundColor: color + '18' }]}>
          <Icon name={icon} size={18} color={color} />
        </View>
        <Text style={[tpS.value, { color: colors.textMain }]}>
          {toPersianDigit(value || '۰۹:۰۰')}
        </Text>
        <Icon name="keyboard-arrow-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={dateValue}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minuteInterval={5}
          locale="fa-IR"
        />
      )}
    </View>
  );
}

const tpS = StyleSheet.create({
  wrapper: { flex: 1, gap: 4 },
  label: { fontSize: 11, fontFamily: 'Vazir-Medium' },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { fontSize: 15, fontFamily: 'Vazir-Bold', flex: 1 },
});

// ══════════════════════════════════════════
//        کامپوننت داخلی: نشانگر مراحل
// ══════════════════════════════════════════

function StepIndicator({ currentStep }) {
  const { colors } = useTheme();
  return (
    <View style={stepS.container}>
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <React.Fragment key={step.id}>
            <View style={stepS.stepItem}>
              <View
                style={[
                  stepS.circle,
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
                  <Icon name="check" size={18} color="#fff" />
                ) : (
                  <Icon
                    name={step.icon}
                    size={16}
                    color={isActive ? colors.primary : colors.textSecondary}
                  />
                )}
              </View>
              <Text
                style={[
                  stepS.label,
                  {
                    color: isCompleted || isActive ? colors.textMain : colors.textSecondary,
                    fontFamily: isActive ? 'Vazir-Bold' : 'Vazir',
                  },
                ]}
              >
                {step.label}
              </Text>
            </View>
            {index < STEPS.length - 1 && (
              <View
                style={[
                  stepS.connector,
                  {
                    backgroundColor: currentStep > step.id ? colors.primary : colors.border,
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

const stepS = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepItem: { alignItems: 'center', gap: 6 },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 11 },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    marginBottom: 20,
    borderRadius: 1,
  },
});

// ══════════════════════════════════════════
//    کامپوننت داخلی: مرحله انتخاب خدمت
// ══════════════════════════════════════════

function ServiceSelectionStep({ services, selectedId, onSelect }) {
  const { colors } = useTheme();
  return (
    <View style={svcS.container}>
      <View style={svcS.header}>
        <Icon name="spa" size={20} color={colors.primary} />
        <Text style={[svcS.title, { color: colors.textMain }]}>
          خدمت موردنظر را انتخاب کنید
        </Text>
      </View>
      <Text style={[svcS.subtitle, { color: colors.textSecondary }]}>
        برای تنظیم ساعات کاری، ابتدا خدمت را مشخص نمایید
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={svcS.list}
      >
        {services.map((service) => {
          const isSelected = selectedId === service.id;
          return (
            <TouchableOpacity
              key={service.id}
              activeOpacity={0.8}
              onPress={() => onSelect(service.id)}
              style={[
                svcS.card,
                {
                  backgroundColor: isSelected ? colors.primary + '08' : colors.cardBackground,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <ServiceTypeIcon typeId={service.typeId} size={52} />
              <View style={svcS.info}>
                <Text style={[svcS.name, { color: colors.textMain }]}>
                  {service.name}
                </Text>
                <Text style={[svcS.type, { color: colors.textSecondary }]}>
                  {service.typeName}
                </Text>
                <View style={svcS.metaRow}>
                  <Icon name="schedule" size={12} color={colors.textSecondary} />
                  <Text style={[svcS.meta, { color: colors.textSecondary }]}>
                    {toPersianDigit(service.duration || 60)} دقیقه
                  </Text>
                </View>
              </View>
              {isSelected && (
                <View style={[svcS.checkBadge, { backgroundColor: colors.primary }]}>
                  <Icon name="check" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const svcS = StyleSheet.create({
  container: { flex: 1, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  subtitle: { fontSize: 12, fontFamily: 'Vazir', marginBottom: 8 },
  list: { gap: 10, paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    position: 'relative',
  },
  info: { flex: 1, gap: 3 },
  name: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  type: { fontSize: 12, fontFamily: 'Vazir-Medium' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  meta: { fontSize: 11, fontFamily: 'Vazir' },
  checkBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

// ══════════════════════════════════════════
//    کامپوننت داخلی: تقویم شمسی
// ══════════════════════════════════════════

function CalendarStep({ selectedDate, onSelect }) {
  const { colors } = useTheme();

  const today = useMemo(() => {
    const now = new Date();
    return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) return { jy: selectedDate.jy, jm: selectedDate.jm };
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

  const firstDayOfWeek = useMemo(() => {
    const { jy, jm } = viewMonth;
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
    const d = new Date(gy, gm - 1, gd);
    return (d.getDay() + 1) % 7;
  }, [viewMonth]);

  const isSameDate = (d1, d2) =>
    d1 && d2 && d1.jy === d2.jy && d1.jm === d2.jm && d1.jd === d2.jd;

  const isPast = (jy, jm, jd) => {
    const val = jy * 10000 + jm * 100 + jd;
    const todayVal = today.jy * 10000 + today.jm * 100 + today.jd;
    return val < todayVal;
  };

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ empty: true, key: `e-${i}` });
  }
  for (let d = 1; d <= monthLength; d++) {
    days.push({ jd: d, jy: viewMonth.jy, jm: viewMonth.jm, key: `d-${d}` });
  }

  return (
    <View style={calS.container}>
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

      <View style={calS.daysGrid}>
        {days.map((day, index) => {
          if (day.empty) return <View key={day.key} style={calS.dayCell} />;
          const disabled = isPast(day.jy, day.jm, day.jd);
          const isToday = isSameDate(day, today);
          const isSelected = isSameDate(day, selectedDate);
          const isFriday = (index % 7) === 6;

          return (
            <TouchableOpacity
              key={day.key}
              disabled={disabled}
              onPress={() => onSelect?.(day)}
              activeOpacity={0.7}
              style={[
                calS.dayCell,
                isSelected && { backgroundColor: colors.primary },
                isToday && !isSelected && { borderColor: colors.primary, borderWidth: 2 },
                disabled && { opacity: 0.3 },
              ]}
            >
              <Text
                style={[
                  calS.dayText,
                  { color: colors.textMain },
                  isSelected && { color: '#fff', fontFamily: 'Vazir-Bold' },
                  isFriday && !isSelected && !disabled && { color: '#E57373' },
                ]}
              >
                {toPersianDigit(day.jd)}
              </Text>
              {isToday && !isSelected && (
                <View style={[calS.todayDot, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedDate && (
        <View style={[calS.selectedBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <Icon name="event" size={18} color={colors.primary} />
          <Text style={[calS.selectedText, { color: colors.primary }]}>
            {toPersianDigit(selectedDate.jd)} {PERSIAN_MONTHS[selectedDate.jm - 1]} {toPersianDigit(selectedDate.jy)}
          </Text>
        </View>
      )}
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
  selectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignSelf: 'center',
  },
  selectedText: { fontSize: 14, fontFamily: 'Vazir-Bold' },
});

// ══════════════════════════════════════════
//    🆕 کامپوننت داخلی: ساعات کاری (جدید)
// ══════════════════════════════════════════

function WorkingHoursStep({ 
  selectedDate, 
  workStart, 
  workEnd, 
  slotDuration, 
  breaks,
  onWorkStartChange,
  onWorkEndChange,
  onSlotDurationChange,
  onBreaksChange,
}) {
  const { colors } = useTheme();

  // ═══════ افزودن بازه استراحت جدید ═══════
  const addBreak = () => {
    const lastBreak = breaks[breaks.length - 1];
    let newStart = '13:00';
    let newEnd = '14:00';
    
    if (lastBreak) {
      const lastEndMin = timeToMinutes(lastBreak.end);
      newStart = minutesToTime(lastEndMin + 60);
      newEnd = minutesToTime(lastEndMin + 120);
    }
    
    // بررسی معتبر بودن
    if (timeToMinutes(newStart) < timeToMinutes(workStart)) newStart = workStart;
    if (timeToMinutes(newEnd) > timeToMinutes(workEnd)) newEnd = workEnd;
    
    onBreaksChange([...breaks, { id: Date.now(), start: newStart, end: newEnd }]);
  };

  // ═══════ حذف بازه استراحت ═══════
  const removeBreak = (id) => {
    onBreaksChange(breaks.filter((b) => b.id !== id));
  };

  // ═══════ به‌روزرسانی بازه استراحت ═══════
  const updateBreak = (id, field, value) => {
    onBreaksChange(
      breaks.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  // ═══════ محاسبه تعداد slotهای قابل رزرو ═══════
  const calcAvailableSlots = useMemo(() => {
    const startMin = timeToMinutes(workStart);
    const endMin = timeToMinutes(workEnd);
    if (endMin <= startMin || slotDuration <= 0) return 0;
    
    const totalMin = endMin - startMin;
    const breakMin = breaks.reduce((sum, b) => {
      const bStart = Math.max(timeToMinutes(b.start), startMin);
      const bEnd = Math.min(timeToMinutes(b.end), endMin);
      return sum + Math.max(0, bEnd - bStart);
    }, 0);
    
    const availableMin = totalMin - breakMin;
    return Math.floor(availableMin / slotDuration);
  }, [workStart, workEnd, slotDuration, breaks]);

  const workStartMin = timeToMinutes(workStart);
  const workEndMin = timeToMinutes(workEnd);
  const isValidRange = workEndMin > workStartMin;
  const totalHours = isValidRange ? Math.floor((workEndMin - workStartMin) / 60) : 0;
  const totalMinutesRem = isValidRange ? (workEndMin - workStartMin) % 60 : 0;

  return (
    <View style={whS.container}>
      {/* هدر تاریخ */}
      <View style={[whS.dateHeader, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
        <Icon name="event" size={20} color={colors.primary} />
        <View style={whS.dateInfo}>
          <Text style={[whS.dateLabel, { color: colors.textSecondary }]}>
            تنظیم ساعات برای:
          </Text>
          <Text style={[whS.dateValue, { color: colors.primary }]}>
            {toPersianDigit(selectedDate.jd)} {PERSIAN_MONTHS[selectedDate.jm - 1]} {toPersianDigit(selectedDate.jy)}
          </Text>
        </View>
      </View>

      {/* ═══════ بخش ۱: بازه کاری ═══════ */}
      <View style={whS.section}>
        <View style={whS.sectionHeader}>
          <View style={[whS.sectionIconBox, { backgroundColor: '#2196F318' }]}>
            <Icon name="access-time" size={18} color="#2196F3" />
          </View>
          <Text style={[whS.sectionTitle, { color: colors.textMain }]}>
            بازه کاری
          </Text>
        </View>
        
        <Card variant="default" padding={14} radius={14}>
          <View style={whS.timeRow}>
            <TimePickerField
              label="ساعت شروع"
              value={workStart}
              onChange={onWorkStartChange}
              icon="play-arrow"
              color="#43A047"
            />
            <View style={whS.timeArrow}>
              <Icon name="arrow-left" size={20} color={colors.textSecondary} />
            </View>
            <TimePickerField
              label="ساعت پایان"
              value={workEnd}
              onChange={onWorkEndChange}
              icon="stop"
              color="#E53935"
            />
          </View>
          
          {isValidRange ? (
            <View style={[whS.summaryRow, { backgroundColor: '#43A04710', borderColor: '#43A04740' }]}>
              <Icon name="check-circle" size={14} color="#43A047" />
              <Text style={[whS.summaryText, { color: '#43A047' }]}>
                مجموع ساعات کاری: {toPersianDigit(totalHours)} ساعت
                {totalMinutesRem > 0 && ` و ${toPersianDigit(totalMinutesRem)} دقیقه`}
              </Text>
            </View>
          ) : (
            <View style={[whS.summaryRow, { backgroundColor: '#E5393510', borderColor: '#E5393540' }]}>
              <Icon name="error-outline" size={14} color="#E53935" />
              <Text style={[whS.summaryText, { color: '#E53935' }]}>
                ساعت پایان باید بعد از ساعت شروع باشد
              </Text>
            </View>
          )}
        </Card>
      </View>

      {/* ═══════ بخش ۲: مدت هر نوبت ═══════ */}
      <View style={whS.section}>
        <View style={whS.sectionHeader}>
          <View style={[whS.sectionIconBox, { backgroundColor: '#FF980018' }]}>
            <Icon name="timer" size={18} color="#FF9800" />
          </View>
          <Text style={[whS.sectionTitle, { color: colors.textMain }]}>
            مدت هر نوبت
          </Text>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={whS.durationChips}
        >
          {SLOT_DURATIONS.map((d) => {
            const isSel = slotDuration === d.id;
            return (
              <TouchableOpacity
                key={d.id}
                onPress={() => onSlotDurationChange(d.id)}
                activeOpacity={0.8}
                style={[
                  whS.durationChip,
                  {
                    backgroundColor: isSel ? colors.primary : colors.cardBackground,
                    borderColor: isSel ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[whS.durationChipLabel, { color: isSel ? '#fff' : colors.textMain }]}>
                  {d.label}
                </Text>
                <Text style={[whS.durationChipHint, { color: isSel ? '#ffffffcc' : colors.textSecondary }]}>
                  {d.hint}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ═══════ بخش ۳: بازه‌های استراحت ═══════ */}
      <View style={whS.section}>
        <View style={whS.sectionHeader}>
          <View style={[whS.sectionIconBox, { backgroundColor: '#9C27B018' }]}>
            <Icon name="coffee" size={18} color="#9C27B0" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[whS.sectionTitle, { color: colors.textMain }]}>
              بازه‌های استراحت
            </Text>
            <Text style={[whS.sectionSubtitle, { color: colors.textSecondary }]}>
              زمان‌هایی که نوبت نمی‌دهید
            </Text>
          </View>
          {breaks.length > 0 && (
            <View style={[whS.breaksCountBadge, { backgroundColor: '#9C27B020' }]}>
              <Text style={[whS.breaksCountText, { color: '#9C27B0' }]}>
                {toPersianDigit(breaks.length)} بازه
              </Text>
            </View>
          )}
        </View>

        {/* لیست بازه‌های استراحت */}
        {breaks.length > 0 ? (
          <View style={whS.breaksList}>
            {breaks.map((brk, index) => {
              const bStartMin = timeToMinutes(brk.start);
              const bEndMin = timeToMinutes(brk.end);
              const isBreakValid = bEndMin > bStartMin && 
                                   bStartMin >= workStartMin && 
                                   bEndMin <= workEndMin;
              const breakDuration = bEndMin > bStartMin ? bEndMin - bStartMin : 0;
              
              return (
                <Card
                  key={brk.id}
                  variant="default"
                  padding={12}
                  radius={14}
                  style={[
                    whS.breakCard,
                    !isBreakValid && { borderColor: '#E53935', borderWidth: 1.5 },
                  ]}
                >
                  {/* هدر بازه */}
                  <View style={whS.breakHeader}>
                    <View style={[whS.breakNumberBox, { backgroundColor: '#9C27B0' }]}>
                      <Text style={whS.breakNumberText}>{toPersianDigit(index + 1)}</Text>
                    </View>
                    <Text style={[whS.breakTitle, { color: colors.textMain }]}>
                      استراحت {toPersianDigit(index + 1)}
                    </Text>
                    {breakDuration > 0 && (
                      <View style={[whS.breakDurationBadge, { backgroundColor: '#9C27B015' }]}>
                        <Icon name="timer" size={10} color="#9C27B0" />
                        <Text style={[whS.breakDurationText, { color: '#9C27B0' }]}>
                          {toPersianDigit(breakDuration)} دقیقه
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => removeBreak(brk.id)}
                      style={[whS.removeBreakBtn, { backgroundColor: '#E5393515' }]}
                    >
                      <Icon name="close" size={16} color="#E53935" />
                    </TouchableOpacity>
                  </View>
                  
                  {/* فیلدهای زمان */}
                  <View style={whS.breakTimeRow}>
                    <TimePickerField
                      label="از ساعت"
                      value={brk.start}
                      onChange={(v) => updateBreak(brk.id, 'start', v)}
                      icon="play-arrow"
                      color="#FF9800"
                    />
                    <View style={whS.breakTimeArrow}>
                      <Text style={[whS.breakTimeArrowText, { color: colors.textSecondary }]}>
                        تا
                      </Text>
                    </View>
                    <TimePickerField
                      label="تا ساعت"
                      value={brk.end}
                      onChange={(v) => updateBreak(brk.id, 'end', v)}
                      icon="stop"
                      color="#F44336"
                    />
                  </View>

                  {/* پیام خطا */}
                  {!isBreakValid && (
                    <View style={whS.breakErrorRow}>
                      <Icon name="warning" size={12} color="#E53935" />
                      <Text style={[whS.breakErrorText, { color: '#E53935' }]}>
                        بازه باید بین ساعت کاری ({toPersianDigit(workStart)} تا {toPersianDigit(workEnd)}) باشد
                      </Text>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        ) : (
          <Card
            variant="default"
            padding={20}
            radius={14}
            style={[whS.noBreaksCard, { borderColor: colors.border, borderStyle: 'dashed', borderWidth: 1.5 }]}
          >
            <Icon name="event-available" size={32} color={colors.textSecondary + '80'} />
            <Text style={[whS.noBreaksTitle, { color: colors.textMain }]}>
              بدون بازه استراحت
            </Text>
            <Text style={[whS.noBreaksText, { color: colors.textSecondary }]}>
              در تمام ساعات کاری نوبت ارائه می‌دهید
            </Text>
          </Card>
        )}

        {/* دکمه افزودن بازه */}
        <TouchableOpacity
          onPress={addBreak}
          style={[
            whS.addBreakBtn,
            {
              backgroundColor: colors.primary + '10',
              borderColor: colors.primary + '40',
            },
          ]}
          activeOpacity={0.8}
        >
          <Icon name="add-circle" size={20} color={colors.primary} />
          <Text style={[whS.addBreakText, { color: colors.primary }]}>
            افزودن بازه استراحت
          </Text>
        </TouchableOpacity>
      </View>

      {/* ═══════ بخش ۴: پیش‌نمایش ═══════ */}
      <Card
        variant="default"
        padding={14}
        radius={14}
        style={[
          whS.previewCard,
          {
            backgroundColor: isValidRange && calcAvailableSlots > 0 ? '#43A04708' : '#FF980010',
            borderColor: isValidRange && calcAvailableSlots > 0 ? '#43A04740' : '#FF980040',
          },
        ]}
      >
        <View style={whS.previewHeader}>
          <Icon 
            name={calcAvailableSlots > 0 ? 'event-available' : 'warning'} 
            size={20} 
            color={calcAvailableSlots > 0 ? '#43A047' : '#FF9800'} 
          />
          <Text style={[whS.previewTitle, { color: calcAvailableSlots > 0 ? '#43A047' : '#FF9800' }]}>
            پیش‌نمایش نوبت‌ها
          </Text>
        </View>
        
        <View style={whS.previewRow}>
          <Text style={[whS.previewLabel, { color: colors.textSecondary }]}>
            تعداد نوبت قابل رزرو:
          </Text>
          <Text style={[whS.previewValue, { color: calcAvailableSlots > 0 ? '#43A047' : '#FF9800' }]}>
            {toPersianDigit(calcAvailableSlots)} نوبت
          </Text>
        </View>
        
        <View style={whS.previewRow}>
          <Text style={[whS.previewLabel, { color: colors.textSecondary }]}>
            ساعات کاری:
          </Text>
          <Text style={[whS.previewValue, { color: colors.textMain }]}>
            {toPersianDigit(workStart)} تا {toPersianDigit(workEnd)}
          </Text>
        </View>

        {breaks.length > 0 && (
          <View style={whS.previewRow}>
            <Text style={[whS.previewLabel, { color: colors.textSecondary }]}>
              مجموع استراحت:
            </Text>
            <Text style={[whS.previewValue, { color: '#9C27B0' }]}>
              {toPersianDigit(
                breaks.reduce((sum, b) => {
                  const dur = timeToMinutes(b.end) - timeToMinutes(b.start);
                  return sum + (dur > 0 ? dur : 0);
                }, 0)
              )} دقیقه
            </Text>
          </View>
        )}
      </Card>
    </View>
  );
}

const whS = StyleSheet.create({
  container: { gap: 16, paddingHorizontal: 4 },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  dateInfo: { flex: 1, gap: 2 },
  dateLabel: { fontSize: 11, fontFamily: 'Vazir' },
  dateValue: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  
  section: { gap: 10 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 14, fontFamily: 'Vazir-Bold', flex: 1 },
  sectionSubtitle: { fontSize: 11, fontFamily: 'Vazir', marginTop: 2 },
  
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  timeArrow: {
    paddingBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  summaryText: { fontSize: 12, fontFamily: 'Vazir-Bold', flex: 1 },
  
  durationChips: {
    gap: 8,
    paddingVertical: 2,
  },
  durationChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 2,
    minWidth: 80,
  },
  durationChipLabel: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  durationChipHint: { fontSize: 10, fontFamily: 'Vazir' },
  
  breaksList: { gap: 10 },
  breakCard: { borderWidth: 1 },
  breakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  breakNumberBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakNumberText: { color: '#fff', fontSize: 12, fontFamily: 'Vazir-Bold' },
  breakTitle: { fontSize: 13, fontFamily: 'Vazir-Bold', flex: 1 },
  breakDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  breakDurationText: { fontSize: 10, fontFamily: 'Vazir-Bold' },
  removeBreakBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakTimeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  breakTimeArrow: {
    paddingBottom: 12,
    paddingHorizontal: 4,
  },
  breakTimeArrowText: { fontSize: 12, fontFamily: 'Vazir-Medium' },
  breakErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingVertical: 4,
  },
  breakErrorText: { fontSize: 11, fontFamily: 'Vazir', flex: 1 },
  
  noBreaksCard: {
    alignItems: 'center',
    gap: 6,
  },
  noBreaksTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  noBreaksText: { fontSize: 12, fontFamily: 'Vazir', textAlign: 'center' },
  
  addBreakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  addBreakText: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  
  previewCard: {
    borderWidth: 1.5,
    gap: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  previewTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  previewLabel: { fontSize: 12, fontFamily: 'Vazir' },
  previewValue: { fontSize: 13, fontFamily: 'Vazir-Bold' },
});

// ══════════════════════════════════════════
//          کامپوننت اصلی: مدال
// ══════════════════════════════════════════

export default function ScheduleModal({
  visible,
  onClose,
  services,
  initialServiceId,
  existingSchedule,
  onSave,
}) {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // 🆕 state های جدید
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('21:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [breaks, setBreaks] = useState([]);

  React.useEffect(() => {
    if (visible) {
      setCurrentStep(initialServiceId ? 2 : 1);
      setSelectedServiceId(initialServiceId || null);
      setSelectedDate(null);
      setWorkStart('09:00');
      setWorkEnd('21:00');
      setSlotDuration(30);
      setBreaks([]);
    }
  }, [visible, initialServiceId]);

  const canGoNext = useMemo(() => {
    if (currentStep === 1) return !!selectedServiceId;
    if (currentStep === 2) return !!selectedDate;
    if (currentStep === 3) {
      const startMin = timeToMinutes(workStart);
      const endMin = timeToMinutes(workEnd);
      if (endMin <= startMin) return false;
      
      // بررسی معتبر بودن همه بازه‌ها
      const allBreaksValid = breaks.every((b) => {
        const bStart = timeToMinutes(b.start);
        const bEnd = timeToMinutes(b.end);
        return bEnd > bStart && bStart >= startMin && bEnd <= endMin;
      });
      
      return allBreaksValid;
    }
    return false;
  }, [currentStep, selectedServiceId, selectedDate, workStart, workEnd, breaks]);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    if (!selectedServiceId || !selectedDate) return;
    
    // محاسبه تعداد slotها
    const startMin = timeToMinutes(workStart);
    const endMin = timeToMinutes(workEnd);
    const breakMin = breaks.reduce((sum, b) => {
      const bStart = Math.max(timeToMinutes(b.start), startMin);
      const bEnd = Math.min(timeToMinutes(b.end), endMin);
      return sum + Math.max(0, bEnd - bStart);
    }, 0);
    const availableMin = endMin - startMin - breakMin;
    const slotCount = Math.floor(availableMin / slotDuration);
    
    onSave({
      serviceId: selectedServiceId,
      date: selectedDate,
      workStart,
      workEnd,
      slotDuration,
      breaks: breaks.map(({ id, ...rest }) => rest),
      slotCount,
    });
    onClose();
  };

  const getFooterContent = () => {
    if (currentStep === 3) {
      const startMin = timeToMinutes(workStart);
      const endMin = timeToMinutes(workEnd);
      const isValid = endMin > startMin;
      const breakMin = breaks.reduce((sum, b) => {
        const bStart = Math.max(timeToMinutes(b.start), startMin);
        const bEnd = Math.min(timeToMinutes(b.end), endMin);
        return sum + Math.max(0, bEnd - bStart);
      }, 0);
      const slotCount = isValid ? Math.floor((endMin - startMin - breakMin) / slotDuration) : 0;
      
      return (
        <View style={modalS.footerRow}>
          <Button
            title="قبلی"
            onPress={handlePrev}
            variant="outline"
            size="lg"
            style={modalS.halfBtn}
          />
          <Button
            title={`ذخیره (${toPersianDigit(slotCount)} نوبت)`}
            onPress={handleSave}
            variant="primary"
            size="lg"
            disabled={!canGoNext || slotCount <= 0}
            style={modalS.halfBtn}
            icon={<Icon name="check" size={20} color="#fff" />}
            iconPosition="right"
          />
        </View>
      );
    }
    return (
      <View style={modalS.footerRow}>
        {currentStep > 1 && (
          <Button
            title="قبلی"
            onPress={handlePrev}
            variant="outline"
            size="lg"
            style={modalS.halfBtn}
          />
        )}
        <Button
          title="ادامه"
          onPress={handleNext}
          variant="primary"
          size="lg"
          disabled={!canGoNext}
          style={currentStep === 1 ? modalS.fullBtn : modalS.halfBtn}
          icon={<Icon name="arrow-back" size={20} color="#fff" />}
          iconPosition="left"
        />
      </View>
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="تنظیم زمان‌بندی خدمت"
      snapPoint={0.95}
      footer={getFooterContent()}
    >
      <StepIndicator currentStep={currentStep} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={modalS.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {currentStep === 1 && (
          <ServiceSelectionStep
            services={services.filter((s) => s.isActive !== false)}
            selectedId={selectedServiceId}
            onSelect={setSelectedServiceId}
          />
        )}

        {currentStep === 2 && (
          <CalendarStep
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        )}

        {currentStep === 3 && selectedDate && (
          <WorkingHoursStep
            selectedDate={selectedDate}
            workStart={workStart}
            workEnd={workEnd}
            slotDuration={slotDuration}
            breaks={breaks}
            onWorkStartChange={setWorkStart}
            onWorkEndChange={setWorkEnd}
            onSlotDurationChange={setSlotDuration}
            onBreaksChange={setBreaks}
          />
        )}

        <View style={{ height: 200 }} />
      </ScrollView>
    </BottomSheet>
  );
}

const modalS = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  footerRow: { flexDirection: 'row', gap: 10 },
  halfBtn: { flex: 1 },
  fullBtn: { flex: 1 },
});