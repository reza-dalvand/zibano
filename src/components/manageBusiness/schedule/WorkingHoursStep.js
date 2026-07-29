// src/components/manageBusiness/schedule/WorkingHoursStep.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import Card from '../../common/Card';
import TimePickerField from './TimePickerField';
import { toPersianDigit } from '../../../utils/numberUtils';
import {
  PERSIAN_MONTHS,
  minutesToTime,
  timeToMinutes,
} from '../../../utils/dateUtils';

export default function WorkingHoursStep({
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

  // افزودن بازه استراحت
  const addBreak = () => {
    const lastBreak = breaks[breaks.length - 1];
    let newStart = '13:00';
    let newEnd = '14:00';
    if (lastBreak) {
      const lastEndMin = timeToMinutes(lastBreak.end);
      newStart = minutesToTime(lastEndMin + 60);
      newEnd = minutesToTime(lastEndMin + 120);
    }
    if (timeToMinutes(newStart) < timeToMinutes(workStart)) newStart = workStart;
    if (timeToMinutes(newEnd) > timeToMinutes(workEnd)) newEnd = workEnd;
    onBreaksChange([...breaks, { id: Date.now(), start: newStart, end: newEnd }]);
  };

  const removeBreak = (id) => {
    onBreaksChange(breaks.filter((b) => b.id !== id));
  };

  const updateBreak = (id, field, value) => {
    onBreaksChange(
      breaks.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  // محاسبه slot های قابل رزرو
  const availableSlots = useMemo(() => {
    const startMin = timeToMinutes(workStart);
    const endMin = timeToMinutes(workEnd);
    if (!startMin || !endMin || endMin <= startMin || !slotDuration || slotDuration <= 0) return [];

    const occupiedRanges = breaks.map((b) => {
      const bStart = Math.max(timeToMinutes(b.start), startMin);
      const bEnd = Math.min(timeToMinutes(b.end), endMin);
      return { start: bStart, end: Math.max(bStart, bEnd) };
    });

    const slots = [];
    let currentMin = startMin;
    while (currentMin + slotDuration <= endMin) {
      const slotEnd = currentMin + slotDuration;
      const isOccupied = occupiedRanges.some(
        (range) => currentMin < range.end && slotEnd > range.start
      );
      if (!isOccupied) {
        slots.push({
          start: minutesToTime(currentMin),
          end: minutesToTime(slotEnd),
        });
      }
      currentMin += slotDuration;
    }
    return slots;
  }, [workStart, workEnd, slotDuration, breaks]);

  const workStartMin = timeToMinutes(workStart);
  const workEndMin = timeToMinutes(workEnd);
  const isValidRange = workEndMin > workStartMin && workStartMin > 0;

  return (
    <View style={s.container}>
      {/* هدر تاریخ */}
      {selectedDate && (
        <View style={[s.dateHeader, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
          <Icon name="event" size={20} color={colors.primary} />
          <View style={s.dateInfo}>
            <Text style={[s.dateLabel, { color: colors.textSecondary }]}>
              تنظیم ساعات برای:
            </Text>
            <Text style={[s.dateValue, { color: colors.primary }]}>
              {toPersianDigit(selectedDate.jd)} {PERSIAN_MONTHS[selectedDate.jm - 1]} {toPersianDigit(selectedDate.jy)}
            </Text>
          </View>
        </View>
      )}

      {/* بخش ۱: بازه کاری */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <View style={[s.sectionIconBox, { backgroundColor: '#2196F318' }]}>
            <Icon name="access-time" size={18} color="#2196F3" />
          </View>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            بازه ساعت کاری
          </Text>
        </View>
        <Card variant="default" padding={14} radius={14}>
          <View style={s.timeRow}>
            <TimePickerField
              label="ساعت شروع"
              value={workStart}
              onChange={onWorkStartChange}
              icon="play-arrow"
              color="#43A047"
            />
            <View style={s.timeArrow}>
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
            <View style={[s.summaryRow, { backgroundColor: '#43A04710', borderColor: '#43A04740' }]}>
              <Icon name="check-circle" size={14} color="#43A047" />
              <Text style={[s.summaryText, { color: '#43A047' }]}>
                مجموع ساعات کاری: {toPersianDigit(Math.floor((workEndMin - workStartMin) / 60))} ساعت
                {(workEndMin - workStartMin) % 60 > 0 && ` و ${toPersianDigit((workEndMin - workStartMin) % 60)} دقیقه`}
              </Text>
            </View>
          ) : workStartMin > 0 && workEndMin > 0 ? (
            <View style={[s.summaryRow, { backgroundColor: '#E5393510', borderColor: '#E5393540' }]}>
              <Icon name="error-outline" size={14} color="#E53935" />
              <Text style={[s.summaryText, { color: '#E53935' }]}>
                ساعت پایان باید بعد از ساعت شروع باشد
              </Text>
            </View>
          ) : null}
        </Card>
      </View>

      {/* بخش ۲: مدت هر نوبت (input دستی) */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <View style={[s.sectionIconBox, { backgroundColor: '#FF980018' }]}>
            <Icon name="timer" size={18} color="#FF9800" />
          </View>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            مدت هر نوبت (به دقیقه)
          </Text>
        </View>
        <Card variant="default" padding={14} radius={14}>
          <View style={[s.inputWrap, { borderColor: colors.border }]}>
            <TextInput
              style={[s.input, { color: colors.textMain }]}
              value={slotDuration ? String(slotDuration) : ''}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9]/g, '');
                const min = Math.min(Number(cleaned) || 0, 480);
                onSlotDurationChange(min);
              }}
              placeholder="مثلاً ۶۰ دقیقه"
              placeholderTextColor={colors.textSecondary + '80'}
              keyboardType="number-pad"
            />
            <Text style={[s.inputHint, { color: colors.textSecondary }]}>
              {slotDuration ? `= ${toPersianDigit(slotDuration)} دقیقه` : ''}
            </Text>
          </View>
        </Card>
      </View>

      {/* بخش ۳: بازه‌های استراحت */}
      <View style={s.section}>
        <View style={s.sectionHeader}>
          <View style={[s.sectionIconBox, { backgroundColor: '#9C27B018' }]}>
            <Icon name="coffee" size={18} color="#9C27B0" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              بازه‌های استراحت
            </Text>
            <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
              در این ساعات نوبت ارائه نمی‌دهید
            </Text>
          </View>
          {breaks.length > 0 && (
            <View style={[s.breaksCountBadge, { backgroundColor: '#9C27B020' }]}>
              <Text style={[s.breaksCountText, { color: '#9C27B0' }]}>
                {toPersianDigit(breaks.length)} بازه
              </Text>
            </View>
          )}
        </View>

        {breaks.length > 0 ? (
          <View style={s.breaksList}>
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
                    s.breakCard,
                    !isBreakValid && { borderColor: '#E53935', borderWidth: 1.5 },
                  ]}
                >
                  <View style={s.breakHeader}>
                    <View style={[s.breakNumberBox, { backgroundColor: '#9C27B0' }]}>
                      <Text style={s.breakNumberText}>{toPersianDigit(index + 1)}</Text>
                    </View>
                    <Text style={[s.breakTitle, { color: colors.textMain }]}>
                      استراحت {toPersianDigit(index + 1)}
                    </Text>
                    {breakDuration > 0 && (
                      <View style={[s.breakDurationBadge, { backgroundColor: '#9C27B015' }]}>
                        <Icon name="timer" size={10} color="#9C27B0" />
                        <Text style={[s.breakDurationText, { color: '#9C27B0' }]}>
                          {toPersianDigit(breakDuration)} دقیقه
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => removeBreak(brk.id)}
                      style={[s.removeBreakBtn, { backgroundColor: '#E5393515' }]}
                    >
                      <Icon name="close" size={16} color="#E53935" />
                    </TouchableOpacity>
                  </View>

                  <View style={s.breakTimeRow}>
                    <TimePickerField
                      label="از ساعت"
                      value={brk.start}
                      onChange={(v) => updateBreak(brk.id, 'start', v)}
                      icon="play-arrow"
                      color="#FF9800"
                    />
                    <View style={s.breakTimeArrow}>
                      <Text style={[s.breakTimeArrowText, { color: colors.textSecondary }]}>
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

                  {!isBreakValid && workStartMin > 0 && workEndMin > 0 && (
                    <View style={s.breakErrorRow}>
                      <Icon name="warning" size={12} color="#E53935" />
                      <Text style={[s.breakErrorText, { color: '#E53935' }]}>
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
            style={[s.noBreaksCard, { borderColor: colors.border, borderStyle: 'dashed', borderWidth: 1.5 }]}
          >
            <Icon name="event-available" size={32} color={colors.textSecondary + '80'} />
            <Text style={[s.noBreaksTitle, { color: colors.textMain }]}>
              بدون بازه استراحت
            </Text>
            <Text style={[s.noBreaksText, { color: colors.textSecondary }]}>
              در تمام ساعات کاری نوبت ارائه می‌دهید
            </Text>
          </Card>
        )}

        <TouchableOpacity
          onPress={addBreak}
          style={[
            s.addBreakBtn,
            {
              backgroundColor: colors.primary + '10',
              borderColor: colors.primary + '40',
            },
          ]}
          activeOpacity={0.8}
        >
          <Icon name="add-circle" size={20} color={colors.primary} />
          <Text style={[s.addBreakText, { color: colors.primary }]}>
            افزودن بازه استراحت
          </Text>
        </TouchableOpacity>
      </View>

      {/* بخش ۴: پیش‌نمایش نوبت‌ها */}
      <Card
        variant="default"
        padding={14}
        radius={14}
        style={[
          s.previewCard,
          {
            backgroundColor: isValidRange && availableSlots.length > 0 ? '#43A04708' : '#FF980010',
            borderColor: isValidRange && availableSlots.length > 0 ? '#43A04740' : '#FF980040',
          },
        ]}
      >
        <View style={s.previewHeader}>
          <Icon
            name={availableSlots.length > 0 ? 'event-available' : 'warning'}
            size={20}
            color={availableSlots.length > 0 ? '#43A047' : '#FF9800'}
          />
          <Text style={[s.previewTitle, { color: availableSlots.length > 0 ? '#43A047' : '#FF9800' }]}>
            پیش‌نمایش نوبت‌های قابل رزرو
          </Text>
          <View style={{ flex: 1 }} />
          <View style={[s.previewCountBadge, { backgroundColor: availableSlots.length > 0 ? '#43A04720' : '#FF980020' }]}>
            <Text style={[s.previewCountText, { color: availableSlots.length > 0 ? '#43A047' : '#FF9800' }]}>
              {toPersianDigit(availableSlots.length)} نوبت
            </Text>
          </View>
        </View>

        {availableSlots.length > 0 ? (
          <View style={s.slotsGrid}>
            {availableSlots.slice(0, 12).map((slot, idx) => (
              <View key={idx} style={[s.slotChip, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '40' }]}>
                <Text style={[s.slotText, { color: colors.primary }]}>
                  {toPersianDigit(slot.start)} - {toPersianDigit(slot.end)}
                </Text>
              </View>
            ))}
            {availableSlots.length > 12 && (
              <View style={[s.slotChip, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[s.slotText, { color: colors.textSecondary }]}>
                  + {toPersianDigit(availableSlots.length - 12)} نوبت دیگر
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={[s.noSlotsText, { color: colors.textSecondary }]}>
            {isValidRange
              ? 'لطفاً مدت نوبت را وارد کنید'
              : 'لطفاً ابتدا بازه کاری معتبر وارد کنید'}
          </Text>
        )}
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
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
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 14, fontFamily: 'Vazir-Bold', flex: 1 },
  sectionSubtitle: { fontSize: 11, fontFamily: 'Vazir', marginTop: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  timeArrow: { paddingBottom: 12 },
  inputWrap: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    paddingVertical: 0,
    textAlign: 'right',
  },
  inputHint: { fontSize: 10, fontFamily: 'Vazir' },
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
  breakTimeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  breakTimeArrow: { paddingBottom: 12, paddingHorizontal: 4 },
  breakTimeArrowText: { fontSize: 12, fontFamily: 'Vazir-Medium' },
  breakErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingVertical: 4,
  },
  breakErrorText: { fontSize: 11, fontFamily: 'Vazir', flex: 1 },
  noBreaksCard: { alignItems: 'center', gap: 6 },
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
  breaksCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  breaksCountText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  previewCard: { borderWidth: 1.5, gap: 10 },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  previewTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  previewCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  previewCountText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  slotChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  slotText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  noSlotsText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
    marginTop: 4,
  },
});