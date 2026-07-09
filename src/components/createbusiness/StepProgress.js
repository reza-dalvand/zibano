// src/components/createbusiness/StepProgress.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

const STEPS = [
  { id: 1, label: 'اطلاعات', icon: 'store' },
  { id: 2, label: 'احراز هویت', icon: 'verified-user' },
];

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function StepProgress({ currentStep, totalSteps }) {
  const { colors } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep - 1) / (totalSteps - 1 || 1),
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={s.container}>
      <View style={s.progressBarWrapper}>
        <View style={[s.progressBarBg, { backgroundColor: colors.border }]} />
        <Animated.View
          style={[
            s.progressBarFill,
            {
              backgroundColor: colors.primary,
              width: progressWidth,
            },
          ]}
        />
      </View>

      <View style={s.currentStepInfo}>
        <View style={[s.stepBadge, { backgroundColor: colors.primary + '20' }]}>
          <Icon
            name={STEPS[currentStep - 1]?.icon || 'star'}
            size={14}
            color={colors.primary}
          />
          <Text style={[s.stepBadgeText, { color: colors.primary }]}>
            مرحله {toPersianDigit(currentStep)} از {toPersianDigit(totalSteps)}
          </Text>
        </View>
        <Text style={[s.currentStepTitle, { color: colors.textMain }]}>
          {STEPS[currentStep - 1]?.label}
        </Text>
      </View>

      <View style={s.dotsRow}>
        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <View
              key={step.id}
              style={[
                s.dot,
                {
                  backgroundColor: isCompleted
                    ? colors.primary
                    : isActive
                    ? colors.primary
                    : colors.border,
                  width: isActive ? 24 : isCompleted ? 10 : 8,
                  height: isActive ? 10 : isCompleted ? 10 : 8,
                  opacity: isActive || isCompleted ? 1 : 0.5,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, gap: 16 },
  progressBarWrapper: { height: 4, borderRadius: 2, overflow: 'hidden', position: 'relative' },
  progressBarBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  progressBarFill: { position: 'absolute', top: 0, left: 0, bottom: 0, borderRadius: 2 },
  currentStepInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  stepBadgeText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  currentStepTitle: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  dotsRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dot: { borderRadius: 5 },
});