import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-jalali-calendars';
import {useTheme} from './ThemeContext';

const BookingCalendar = ({selectedDate, onDayPress, markedDates = {}}) => {
  const {colors, isDark} = useTheme();

  const theme = {
    backgroundColor: colors.background,
    calendarBackground: colors.cardBackground,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: colors.primary,
    dayTextColor: colors.textMain,
    textDisabledColor: colors.border,
    dotColor: colors.primary,
    selectedDotColor: '#FFFFFF',
    arrowColor: colors.primary,
    monthTextColor: colors.textMain,
    textDayFontFamily: 'Vazir',
    textMonthFontFamily: 'Vazir-Medium',
    textDayHeaderFontFamily: 'Vazir',
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 13,
  };

  const marks = selectedDate
    ? {
        ...markedDates,
        [selectedDate]: {selected: true, disableTouchEvent: true},
      }
    : markedDates;

  return (
    <View style={[styles.container, {backgroundColor: colors.cardBackground}]}>
      <Calendar
        theme={theme}
        markedDates={marks}
        onDayPress={onDayPress}
        enableSwipeMonths
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default BookingCalendar;
