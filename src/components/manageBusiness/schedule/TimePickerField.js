// src/components/manageBusiness/schedule/TimePickerField.js
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../../stores/useThemeStore';
import { toPersianDigit } from '../../../utils/numberUtils';

export default function TimePickerField({ 
  label, 
  value, 
  onChange, 
  icon = 'schedule', 
  color = '#2196F3' 
}) {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);

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
    <View style={s.wrapper}>
      <Text style={[s.label, { color: colors.textSecondary }]}>{label}</Text>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={[s.field, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        activeOpacity={0.8}
      >
        <View style={[s.iconBox, { backgroundColor: color + '18' }]}>
          <Icon name={icon} size={18} color={color} />
        </View>
        <Text style={[s.value, { color: colors.textMain }]}>
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

const s = StyleSheet.create({
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