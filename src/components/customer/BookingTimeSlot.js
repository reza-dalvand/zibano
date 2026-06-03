import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from './ThemeContext';

// status: 'available' | 'booked' | 'selected'
const BookingTimeSlot = ({time, status = 'available', onPress}) => {
  const {colors} = useTheme();

  const isBooked = status === 'booked';
  const isSelected = status === 'selected';

  const backgroundColor = isSelected
    ? colors.primary
    : isBooked
    ? colors.border
    : colors.cardBackground;

  const textColor = isSelected
    ? '#FFFFFF'
    : isBooked
    ? colors.textSecondary
    : colors.textMain;

  return (
    <TouchableOpacity
      style={[styles.slot, {backgroundColor, borderColor: colors.border}]}
      onPress={isBooked ? null : onPress}
      activeOpacity={isBooked ? 1 : 0.7}
      disabled={isBooked}>
      <Text style={[styles.time, {color: textColor, fontFamily: 'Vazir'}]}>
        {time}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  slot: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    margin: 4,
    alignItems: 'center',
    minWidth: 72,
  },
  time: {
    fontSize: 14,
  },
});

export default BookingTimeSlot;
