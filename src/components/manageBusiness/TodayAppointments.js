// src/components/manager/TodayAppointments.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import AppointmentManagerCard from './AppointmentManagerCard';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

export default function TodayAppointments({
  appointments,
  onStatusChange,
  onSeeAll,
}) {
  const { colors } = useTheme();

  return (
    <View style={[s.section, s.lastSection]}>
      <View style={s.sectionHeader}>
        <Text style={[s.sectionTitle, { color: colors.textMain, marginBottom: 0 }]}>
          نوبت‌های امروز
        </Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[s.seeAllText, { color: colors.primary }]}>
            مشاهده همه
          </Text>
        </TouchableOpacity>
      </View>

      {appointments.length > 0 ? (
        <View style={s.appointmentsList}>
          {appointments.map((item) => (
            <AppointmentManagerCard
              key={item.id}
              appointment={item}
              onStatusChange={onStatusChange}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="📅"
          title="نوبتی برای امروز نیست"
          description="هنوز هیچ مشتری برای امروز نوبت رزرو نکرده است"
          actionLabel="مشاهده تقویم"
          onAction={onSeeAll}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  lastSection: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  appointmentsList: {
    gap: 12,
  },
});