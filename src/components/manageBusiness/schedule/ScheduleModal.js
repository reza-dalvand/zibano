// src/components/manageBusiness/schedule/ScheduleModal.js
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import BottomSheet from '../../common/BottomSheet';
import Button from '../../common/Button';
import { toPersianDigit } from '../../../utils/numberUtils';
import { timeToMinutes } from '../../../utils/dateUtils';

// Import کامپوننت‌های شکسته شده
import StepIndicator from './StepIndicator';
import ServiceSelectionStep from './ServiceSelectionStep';
import CalendarStep from './CalendarStep';
import WorkingHoursStep from './WorkingHoursStep';

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

  // 🆕 ref برای کنترل scroll
  const scrollRef = useRef(null);
  const scrollContentKey = useRef(0);

  const [selectedDates, setSelectedDates] = useState([]);
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('21:00');
  const [slotDuration, setSlotDuration] = useState(0);
  const [breaks, setBreaks] = useState([]);

  useEffect(() => {
    if (visible) {
      setCurrentStep(initialServiceId ? 2 : 1);
      setSelectedServiceId(initialServiceId || null);
      setSelectedDates([]);
      setWorkStart('09:00');
      setWorkEnd('21:00');
      setSlotDuration(0);
      setBreaks([]);
    }
  }, [visible, initialServiceId]);

  // 🎯 رفع مشکل scroll: هر بار که مرحله تغییر می‌کند، به بالا scroll کن
  useEffect(() => {
    // استفاده از setTimeout برای اطمینان از اینکه رندر کامل شده
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [currentStep]);

  // محاسبه تعداد slot ها
  const computedSlotCount = useMemo(() => {
    const startMin = timeToMinutes(workStart);
    const endMin = timeToMinutes(workEnd);
    if (!startMin || !endMin || endMin <= startMin || !slotDuration || slotDuration <= 0) return 0;

    const occupiedRanges = breaks.map((b) => {
      const bStart = Math.max(timeToMinutes(b.start), startMin);
      const bEnd = Math.min(timeToMinutes(b.end), endMin);
      return { start: bStart, end: Math.max(bStart, bEnd) };
    });

    let count = 0;
    let currentMin = startMin;
    while (currentMin + slotDuration <= endMin) {
      const slotEnd = currentMin + slotDuration;
      const isOccupied = occupiedRanges.some(
        (range) => currentMin < range.end && slotEnd > range.start
      );
      if (!isOccupied) count++;
      currentMin += slotDuration;
    }
    return count;
  }, [workStart, workEnd, slotDuration, breaks]);

  const canGoNext = useMemo(() => {
    if (currentStep === 1) return !!selectedServiceId;
    if (currentStep === 2) {
      const startMin = timeToMinutes(workStart);
      const endMin = timeToMinutes(workEnd);
      if (!startMin || !endMin || endMin <= startMin) return false;
      if (!slotDuration || slotDuration <= 0) return false;
      const allBreaksValid = breaks.every((b) => {
        const bStart = timeToMinutes(b.start);
        const bEnd = timeToMinutes(b.end);
        return bEnd > bStart && bStart >= startMin && bEnd <= endMin;
      });
      return allBreaksValid && computedSlotCount > 0;
    }
    if (currentStep === 3) return selectedDates.length > 0;
    return false;
  }, [currentStep, selectedServiceId, workStart, workEnd, slotDuration, breaks, selectedDates, computedSlotCount]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      // force re-render محتوا با تغییر key
      scrollContentKey.current += 1;
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollContentKey.current += 1;
    }
  };

  const handleSave = () => {
    if (!selectedServiceId || selectedDates.length === 0) return;

    selectedDates.forEach((date) => {
      onSave({
        serviceId: selectedServiceId,
        date,
        workStart,
        workEnd,
        slotDuration,
        breaks: breaks.map(({ id, ...rest }) => rest),
        slotCount: computedSlotCount,
      });
    });
    onClose();
  };

  const getFooterContent = () => {
    if (currentStep === 3) {
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
            title={`ذخیره (${toPersianDigit(selectedDates.length)} روز)`}
            onPress={handleSave}
            variant="primary"
            size="lg"
            disabled={!canGoNext}
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
          iconPosition="right"
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
        ref={scrollRef}
        // 🎯 کلید داینامیک: هر بار که مرحله عوض می‌شود، ScrollView از اول رندر می‌شود
        key={`scroll-${currentStep}-${scrollContentKey.current}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={modalS.scrollContent}
        keyboardShouldPersistTaps="handled"
        // 🎯 تنظیمات اضافی برای اطمینان از scroll به بالا
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={16}
        maintainVisibleContentPosition={null}
      >
        {currentStep === 1 && (
          <ServiceSelectionStep
            services={services.filter((s) => s.isActive !== false)}
            selectedId={selectedServiceId}
            onSelect={setSelectedServiceId}
          />
        )}
        {currentStep === 2 && (
          <WorkingHoursStep
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
        {currentStep === 3 && (
          <CalendarStep
            selectedDates={selectedDates}
            onDatesChange={setSelectedDates}
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