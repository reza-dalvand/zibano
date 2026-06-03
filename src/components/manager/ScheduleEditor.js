import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Switch, StyleSheet} from 'react-native';
import {useTheme} from '../theme/ThemeContext';

const DAYS = [
  {key: 'sat', label: 'شنبه'},
  {key: 'sun', label: 'یک‌شنبه'},
  {key: 'mon', label: 'دوشنبه'},
  {key: 'tue', label: 'سه‌شنبه'},
  {key: 'wed', label: 'چهارشنبه'},
  {key: 'thu', label: 'پنج‌شنبه'},
  {key: 'fri', label: 'جمعه'},
];

const ScheduleEditor = ({schedule = {}, onChange}) => {
  const {colors} = useTheme();

  const toggle = key => {
    const updated = {
      ...schedule,
      [key]: {
        ...schedule[key],
        active: !schedule[key]?.active,
        start: schedule[key]?.start || '09:00',
        end: schedule[key]?.end || '18:00',
      },
    };
    onChange?.(updated);
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.cardBackground}]}>
      {DAYS.map(({key, label}) => {
        const day = schedule[key] || {active: false, start: '09:00', end: '18:00'};
        return (
          <View key={key} style={[styles.row, {borderBottomColor: colors.border}]}>
            <Switch
              value={!!day.active}
              onValueChange={() => toggle(key)}
              thumbColor={day.active ? colors.primary : '#ccc'}
              trackColor={{true: colors.primary + '55', false: '#ddd'}}
            />
            <Text style={[styles.label, {color: colors.textMain, fontFamily: 'Vazir-Medium'}]}>
              {label}
            </Text>{day.active && (
              <Text style={[styles.time, {color: colors.textSecondary, fontFamily: 'Vazir'}]}>
                {day.start} - {day.end}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {borderRadius: 12, overflow: 'hidden'},
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 10,
  },
  label: {flex: 1, fontSize: 14, textAlign: 'right'},
  time: {fontSize: 12},
});

export default ScheduleEditor;
