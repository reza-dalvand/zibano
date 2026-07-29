// src/components/manageBusiness/schedule/StepIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';

const STEPS = [
  { id: 1, label: 'خدمت', icon: 'spa' },
  { id: 2, label: 'ساعات', icon: 'schedule' },
  { id: 3, label: 'تاریخ‌ها', icon: 'calendar-today' },
];

export { STEPS };

export default function StepIndicator({ currentStep }) {
  const { colors } = useTheme();
  
  return (
    <View style={s.container}>
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <React.Fragment key={step.id}>
            <View style={s.stepItem}>
              <View
                style={[
                  s.circle,
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
                  s.label,
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
                  s.connector,
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

const s = StyleSheet.create({
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