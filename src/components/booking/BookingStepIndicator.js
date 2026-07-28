// src/components/booking/BookingStepIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

// ✅ STEPS پیش‌فرض (اگر prop پاس داده نشود)
const DEFAULT_STEPS = [
  { id: 1, label: 'بررسی', icon: 'info-outline' },
  { id: 2, label: 'تاریخ', icon: 'calendar-today' },
  { id: 3, label: 'ساعت', icon: 'schedule' },
];

export default function BookingStepIndicator({ 
  currentStep, 
  steps = DEFAULT_STEPS  // ✅ prop جدید با مقدار پیش‌فرض
}) {
  const { colors } = useTheme();
  
  return (
    <View style={s.container}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        const isPending = currentStep < step.id;
        
        return (
          <React.Fragment key={step.id}>
            <View style={s.stepItem}>
              <View
                style={[
                  s.stepCircle,
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
                  s.stepLabel,
                  {
                    color: isPending ? colors.textSecondary : colors.textMain,
                    fontFamily: isActive ? 'Vazir-Bold' : 'Vazir',
                  },
                ]}
              >
                {step.label}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  s.connector,
                  {
                    backgroundColor:
                      currentStep > step.id ? colors.primary : colors.border,
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

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 11,
  },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    marginBottom: 20,
    borderRadius: 1,
  },
});