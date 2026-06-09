// src/screens/manageBusiness/ManageScheduleScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useBusiness } from '../../context/BusinessContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import BottomSheet from '../../components/common/BottomSheet';
import EmptyState from '../../components/common/EmptyState';

const DAYS = [
  { key: 'sat', label: 'شنبه' },
  { key: 'sun', label: 'یک‌شنبه' },
  { key: 'mon', label: 'دوشنبه' },
  { key: 'tue', label: 'سه‌شنبه' },
  { key: 'wed', label: 'چهارشنبه' },
  { key: 'thu', label: 'پنج‌شنبه' },
  { key: 'fri', label: 'جمعه' },
];

const SLOT_DURATIONS = [
  { id: 15, label: '۱۵ دقیقه' },
  { id: 30, label: '۳۰ دقیقه' },
  { id: 45, label: '۴۵ دقیقه' },
  { id: 60, label: '۶۰ دقیقه' },
  { id: 90, label: '۹۰ دقیقه' },
  { id: 120, label: '۱۲۰ دقیقه' },
];

// تولید ساعات قابل انتخاب (۰۷:۰۰ تا ۲۲:۰۰ - هر ۳۰ دقیقه)
const generateTimeOptions = () => {
  const times = [];
  for (let h = 7; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push({
        id: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      });
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();
const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function ManageScheduleScreen({ navigation }) {
  const { colors } = useTheme();
  const { businessData, updateSchedule } = useBusiness();

  const [selectedEmployee, setSelectedEmployee] = useState(
    businessData.team?.[0]?.id || null
  );
  const [selectedService, setSelectedService] = useState(null);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [editingField, setEditingField] = useState(null); // 'start' یا 'end'

  // فیلتر خدمات: فقط خدماتی که به کارمند انتخاب شده متصل هستند
  const employeeServices = useMemo(() => {
    if (!selectedEmployee) return [];
    const emp = businessData.team?.find((m) => m.id === selectedEmployee);
    if (!emp?.services) return [];
    return (businessData.services || []).filter((s) =>
      emp.services.includes(s.id)
    );
  }, [selectedEmployee, businessData.team, businessData.services]);

  // مقداردهی اولیه selectedService
  React.useEffect(() => {
    if (employeeServices.length > 0 && !selectedService) {
      setSelectedService(employeeServices[0].id);
    }
    if (employeeServices.length > 0) {
      const stillExists = employeeServices.find((s) => s.id === selectedService);
      if (!stillExists) setSelectedService(employeeServices[0].id);
    }
  }, [employeeServices, selectedService]);

  // گرفتن برنامه فعلی
  const currentSchedule = useMemo(() => {
    if (!selectedEmployee || !selectedService) return {};
    return (
      businessData.schedules?.[selectedEmployee]?.[selectedService] || {}
    );
  }, [selectedEmployee, selectedService, businessData.schedules]);

  const handleToggleDay = (dayKey) => {
    const current = currentSchedule[dayKey] || {};
    const newActive = !current.active;
    updateSchedule(selectedEmployee, selectedService, dayKey, {
      active: newActive,
      start: current.start || '09:00',
      end: current.end || '18:00',
      slotDuration: current.slotDuration || 60,
    });
  };

  const openTimePicker = (dayKey, field) => {
    setEditingDay(dayKey);
    setEditingField(field);
    setTimePickerVisible(true);
  };

  const handleTimeSelect = (timeId) => {
    if (!editingDay || !editingField) return;
    const current = currentSchedule[editingDay] || {};
    updateSchedule(selectedEmployee, selectedService, editingDay, {
      active: current.active ?? true,
      start: editingField === 'start' ? timeId : current.start || '09:00',
      end: editingField === 'end' ? timeId : current.end || '18:00',
      slotDuration: current.slotDuration || 60,
    });
    setTimePickerVisible(false);
  };

  const handleDurationChange = (dayKey, duration) => {
    const current = currentSchedule[dayKey] || {};
    updateSchedule(selectedEmployee, selectedService, dayKey, {
      active: current.active ?? true,
      start: current.start || '09:00',
      end: current.end || '18:00',
      slotDuration: duration,
    });
  };

  // محاسبه تعداد slot های قابل رزرو برای یک روز
  const calcSlotsCount = (day) => {
    if (!day.active) return 0;
    const [sh, sm] = (day.start || '09:00').split(':').map(Number);
    const [eh, em] = (day.end || '18:00').split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const duration = day.slotDuration || 60;
    if (endMin <= startMin) return 0;
    return Math.floor((endMin - startMin) / duration);
  };

  return (
    <ScreenWrapper padding={0} edges={['top']}>
      <Header title="مدیریت زمان‌بندی" onBackPress={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* انتخاب کارمند */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            کارمند
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.chipsRow}
          >
            {(businessData.team || []).map((emp) => {
              const isActive = selectedEmployee === emp.id;
              return (
                <TouchableOpacity
                  key={emp.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedEmployee(emp.id)}
                  style={[
                    s.chip,
                    {
                      backgroundColor: isActive
                        ? colors.primary + '20'
                        : colors.cardBackground,
                      borderColor: isActive ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.chipText,
                      { color: isActive ? colors.primary : colors.textMain },
                    ]}
                  >
                    {emp.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {(!businessData.team || businessData.team.length === 0) && (
              <Text style={[s.emptyHint, { color: colors.textSecondary }]}>
                ابتدا اعضای تیم را تعریف کنید
              </Text>
            )}
          </ScrollView>
        </View>

        {/* انتخاب خدمت */}
        {selectedEmployee && (
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              خدمت
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.chipsRow}
            >
              {employeeServices.map((svc) => {
                const isActive = selectedService === svc.id;
                return (
                  <TouchableOpacity
                    key={svc.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedService(svc.id)}
                    style={[
                      s.chip,
                      {
                        backgroundColor: isActive
                          ? colors.primary + '20'
                          : colors.cardBackground,
                        borderColor: isActive ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        s.chipText,
                        { color: isActive ? colors.primary : colors.textMain },
                      ]}
                    >
                      {svc.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {employeeServices.length === 0 && (
                <Text style={[s.emptyHint, { color: colors.textSecondary }]}>
                  هیچ خدمتی به این کارمند اختصاص داده نشده
                </Text>
              )}
            </ScrollView>
          </View>
        )}

        {/* برنامه هفتگی */}
        {selectedEmployee && selectedService && (
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              برنامه هفتگی
            </Text>
            <Card variant="elevated" padding={0} radius={18}>
              {DAYS.map((day, index) => {
                const dayData = currentSchedule[day.key] || {
                  active: false,
                  start: '09:00',
                  end: '18:00',
                  slotDuration: 60,
                };
                const slots = calcSlotsCount(dayData);
                return (
                  <View
                    key={day.key}
                    style={[
                      s.dayRow,
                      index < DAYS.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View style={s.dayHeader}>
                      <Switch
                        value={dayData.active}
                        onValueChange={() => handleToggleDay(day.key)}
                        thumbColor={dayData.active ? colors.primary : '#ccc'}
                        trackColor={{
                          true: colors.primary + '55',
                          false: '#ddd',
                        }}
                      />
                      <Text
                        style={[
                          s.dayLabel,
                          {
                            color: dayData.active
                              ? colors.textMain
                              : colors.textSecondary,
                          },
                        ]}
                      >
                        {day.label}
                      </Text>
                    </View>

                    {dayData.active && (
                      <View style={s.dayDetails}>
                        <View style={s.timeRow}>
                          <TouchableOpacity
                            style={[
                              s.timePicker,
                              { backgroundColor: colors.background, borderColor: colors.border },
                            ]}
                            onPress={() => openTimePicker(day.key, 'start')}
                          >
                            <Icon name="play-arrow" size={16} color={colors.primary} />
                            <Text
                              style={[s.timeText, { color: colors.textMain }]}
                            >
                              {toPersianDigit(dayData.start)}
                            </Text>
                          </TouchableOpacity>

                          <Text style={[s.timeSep, { color: colors.textSecondary }]}>
                            تا
                          </Text>

                          <TouchableOpacity
                            style={[
                              s.timePicker,
                              { backgroundColor: colors.background, borderColor: colors.border },
                            ]}
                            onPress={() => openTimePicker(day.key, 'end')}
                          >
                            <Icon name="stop" size={16} color={colors.primary} />
                            <Text
                              style={[s.timeText, { color: colors.textMain }]}
                            >
                              {toPersianDigit(dayData.end)}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View style={s.durationRow}>
                          <Icon
                            name="access-time"
                            size={14}
                            color={colors.textSecondary}
                          />
                          <Text
                            style={[s.durationLabel, { color: colors.textSecondary }]}
                          >
                            هر نوبت:
                          </Text>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={s.durationChips}
                          >
                            {SLOT_DURATIONS.map((d) => {
                              const isSel = dayData.slotDuration === d.id;
                              return (
                                <TouchableOpacity
                                  key={d.id}
                                  onPress={() =>
                                    handleDurationChange(day.key, d.id)
                                  }
                                  style={[
                                    s.durationChip,
                                    {
                                      backgroundColor: isSel
                                        ? colors.primary
                                        : colors.cardBackground,
                                      borderColor: isSel
                                        ? colors.primary
                                        : colors.border,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      s.durationChipText,
                                      {
                                        color: isSel ? '#fff' : colors.textMain,
                                      },
                                    ]}
                                  >
                                    {d.label}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </View>

                        <View style={s.slotsInfoRow}>
                          <Icon
                            name="info-outline"
                            size={14}
                            color={colors.primary}
                          />
                          <Text
                            style={[s.slotsInfoText, { color: colors.primary }]}
                          >
                            {toPersianDigit(slots)} نوبت قابل رزرو در این روز
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </Card>
          </View>
        )}

        {/* Empty State */}
        {(!selectedEmployee || !selectedService) && (
          <EmptyState
            icon="📅"
            title="کارمند یا خدمت را انتخاب کنید"
            description="ابتدا یک کارمند و سپس خدمت موردنظر را انتخاب کنید تا بتوانید برنامه زمانی او را مدیریت کنید"
          />
        )}
      </ScrollView>

      {/* Time Picker BottomSheet */}
      <BottomSheet
        visible={timePickerVisible}
        onClose={() => setTimePickerVisible(false)}
        title={editingField === 'start' ? 'انتخاب ساعت شروع' : 'انتخاب ساعت پایان'}
        snapPoint={0.7}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.timeGrid}
        >
          {TIME_OPTIONS.map((time) => (
            <TouchableOpacity
              key={time.id}
              activeOpacity={0.8}
              onPress={() => handleTimeSelect(time.id)}
              style={[
                s.timeOption,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Icon name="schedule" size={16} color={colors.primary} />
              <Text style={[s.timeOptionText, { color: colors.textMain }]}>
                {toPersianDigit(time.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BottomSheet>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    marginBottom: 10,
  },
  chipsRow: {
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  emptyHint: {
    fontSize: 12,
    fontFamily: 'Vazir',
    paddingVertical: 8,
  },
  dayRow: {
    padding: 14,
    gap: 10,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayLabel: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  dayDetails: {
    gap: 10,
    paddingRight: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timePicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  timeSep: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  durationChips: {
    gap: 6,
  },
  durationChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  durationChipText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  slotsInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#A88B7D10',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  slotsInfoText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 20,
  },
  timeOption: {
    width: '23%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  timeOptionText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});