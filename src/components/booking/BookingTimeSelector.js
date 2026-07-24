// src/components/booking/BookingTimeSelector.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

export default function BookingTimeSelector({ slots = [], selectedId, onSelect }) {
  const { colors } = useTheme();
  const availableCount = slots.filter((s) => s.isAvailable).length;

  return (
    <View style={s.container}>
      <View style={s.sectionHeader}>
        <View style={[s.sectionIconBox, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="access-time" size={18} color={colors.primary} />
        </View>
        <View style={s.sectionHeaderText}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            ساعت مورد نظر را انتخاب کنید
          </Text>
          <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
            {availableCount} ساعت آزاد
          </Text>
        </View>
      </View>

      <View style={s.timeGrid}>
        {slots.map((slot) => {
          const isSelected = selectedId === slot.id;
          const isAvailable = slot.isAvailable;
          return (
            <TouchableOpacity
              key={slot.id}
              onPress={() => isAvailable && onSelect(slot)}
              disabled={!isAvailable}
              activeOpacity={0.7}
              style={[
                s.timeChip,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : isAvailable
                    ? colors.cardBackground
                    : colors.background,
                  borderColor: isSelected
                    ? colors.primary
                    : isAvailable
                    ? colors.border
                    : colors.border + '60',
                },
              ]}
            >
              <Text
                style={[
                  s.timeText,
                  {
                    color: isSelected
                      ? '#fff'
                      : isAvailable
                      ? colors.textMain
                      : colors.textSecondary + '60',
                  },
                ]}
              >
                {slot.time}
              </Text>
              {!isAvailable && (
                <Text style={[s.bookedLabel, { color: colors.textSecondary + '80' }]}>
                  پر
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  sectionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    minWidth: 72,
  },
  timeText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  bookedLabel: {
    fontSize: 8,
    fontFamily: 'Vazir',
  },
});