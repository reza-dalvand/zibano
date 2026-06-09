// src/components/manager/StepProgress.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function StepProgress({ currentStep, totalSteps }) {
  const { colors } = useTheme();

  return (
    <View style={s.container}>
      {/* نوار پیشرفت */}
      <View style={s.progressContainer}>
        {[...Array(totalSteps)].map((_, index) => (
          <View
            key={index}
            style={[
              s.progressDot,
              {
                backgroundColor:
                  index + 1 <= currentStep ? colors.primary : colors.border,
              },
              index + 1 === currentStep && s.activeDot,
            ]}
          />
        ))}
      </View>

      {/* نشانگر مرحله */}
      <View style={s.stepIndicator}>
        <Text style={[s.stepNumber, { color: colors.primary }]}>
          مرحله {currentStep} از {totalSteps}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeDot: {
    width: 28,
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
});