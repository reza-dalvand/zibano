//src/components/common/CharCounter.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { toPersianDigit } from '../../utils/numberUtils';

export default function CharCounter({ current, max }) {
  const { colors } = useTheme();
  const remaining = max - current;
  const isNearLimit = remaining <= 50 && remaining > 0;
  const isAtLimit = remaining === 0;
  const percentage = (current / max) * 100;

  const getStatusColor = () => {
    if (isAtLimit) return '#E53935';
    if (isNearLimit) return '#FF9800';
    return colors.primary;
  };

  const statusColor = getStatusColor();

  return (
    <View>
      <View style={s.counterRow}>
        <View style={s.left}>
          <Icon
            name="text-fields"
            size={12}
            color={statusColor}
          />
          <Text style={[s.counterText, { color: statusColor }]}>
            {toPersianDigit(current)} از {toPersianDigit(max)} کاراکتر
          </Text>
        </View>
        <View style={[s.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              s.progressFill,
              { width: `${percentage}%`, backgroundColor: statusColor },
            ]}
          />
        </View>
      </View>

      {isNearLimit && !isAtLimit && (
        <View style={[s.warning, { backgroundColor: '#FF980010', borderColor: '#FF980030' }]}>
          <Icon name="warning" size={12} color="#FF9800" />
          <Text style={s.warningText}>
            فقط {toPersianDigit(remaining)} کاراکتر باقی مانده است
          </Text>
        </View>
      )}

      {isAtLimit && (
        <View style={[s.warning, { backgroundColor: '#E5393510', borderColor: '#E5393530' }]}>
          <Icon name="error-outline" size={12} color="#E53935" />
          <Text style={[s.warningText, { color: '#E53935' }]}>
            به حداکثر تعداد کاراکتر رسیدید
          </Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: -10,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  counterText: { fontSize: 11, fontFamily: 'Vazir-Medium' },
  progressBar: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: -2,
    marginBottom: 4,
  },
  warningText: { fontSize: 11, fontFamily: 'Vazir-Medium', color: '#FF9800' },
});