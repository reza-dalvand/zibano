// src/components/booking/TimeSlotGrid.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

export default function TimeSlotGrid({ slots = [], selectedId, onSelect }) {
  const { colors } = useTheme();

  const availableCount = slots.filter((s) => s.isAvailable).length;

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={[s.sectionIcon, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="access-time" size={18} color={colors.primary} />
        </View>
        <Text style={[s.sectionTitle, { color: colors.textMain }]}>
          انتخاب ساعت
        </Text>
        <View style={{ flex: 1 }} />
        <View style={[s.availableBadge, { backgroundColor: '#4CAF5015' }]}>
          <View style={[s.availableDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={[s.availableText, { color: '#4CAF50' }]}>
            {availableCount} ساعت آزاد
          </Text>
        </View>
      </View>

      <View style={s.timeGrid}>
        {slots.map((slot) => {
          const isSelected = selectedId === slot.id;
          const isBooked = !slot.isAvailable;

          return (
            <TouchableOpacity
              key={slot.id}
              disabled={isBooked}
              activeOpacity={0.8}
              style={[
                s.timeCard,
                {
                  borderColor: isSelected
                    ? colors.primary
                    : isBooked
                    ? colors.border + '60'
                    : colors.border,
                  backgroundColor: isSelected
                    ? colors.primary
                    : isBooked
                    ? colors.border + '30'
                    : colors.cardBackground,
                },
              ]}
              onPress={() => onSelect(slot.id)}
            >
              <Icon
                name={isBooked ? 'block' : 'schedule'}
                size={14}
                color={
                  isSelected ? '#fff' : isBooked ? colors.textSecondary + '80' : colors.textSecondary
                }
              />
              <Text
                style={[
                  s.timeText,
                  {
                    color: isSelected
                      ? '#fff'
                      : isBooked
                      ? colors.textSecondary + '60'
                      : colors.textMain,
                    fontFamily: isSelected ? 'Vazir-Bold' : 'Vazir-Medium',
                  },
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availableText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeCard: {
    width: '31.5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  timeText: {
    fontSize: 13,
  },
});