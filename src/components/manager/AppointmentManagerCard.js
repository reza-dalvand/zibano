import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../theme/ThemeContext';

const STATUS = {
  pending:   {label: 'در انتظار', color: '#FFA000', icon: 'schedule'},
  confirmed: {label: 'تأیید شده', color: '#43A047', icon: 'check-circle'},
  cancelled: {label: 'لغو شده',   color: '#E53935', icon: 'cancel'},done:      {label: 'انجام شده', color: '#1E88E5', icon: 'task-alt'},
};

const AppointmentManagerCard = ({appointment, onStatusChange}) => {
  const {colors} = useTheme();
  const s = STATUS[appointment.status] || STATUS.pending;

  return (
    <View style={[styles.card, {backgroundColor: colors.cardBackground, borderColor: colors.border}]}>
      <View style={styles.header}>
        <Text style={[styles.name, {color: colors.textMain, fontFamily: 'Vazir-Medium'}]}>
          {appointment.customerName}
        </Text>
        <View style={[styles.badge, {backgroundColor: s.color + '22'}]}>
          <Icon name={s.icon} size={14} color={s.color} />
          <Text style={[styles.badgeText, {color: s.color, fontFamily: 'Vazir'}]}>{s.label}</Text>
        </View>
      </View>

      <Text style={[styles.meta, {color: colors.textSecondary, fontFamily: 'Vazir'}]}>
        {appointment.serviceName}  ·  {appointment.date}  ·  {appointment.time}
      </Text>

      <View style={styles.actions}>
        {appointment.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.btn, {backgroundColor: '#43A04722'}]}
              onPress={() => onStatusChange?.(appointment.id, 'confirmed')}>
              <Text style={[styles.btnText, {color: '#43A047', fontFamily: 'Vazir-Medium'}]}>تأیید</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, {backgroundColor: '#E5393522'}]}
              onPress={() => onStatusChange?.(appointment.id, 'cancelled')}>
              <Text style={[styles.btnText, {color: '#E53935', fontFamily: 'Vazir-Medium'}]}>لغو</Text>
            </TouchableOpacity>
          </>
        )}
        {appointment.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.btn, {backgroundColor: '#1E88E522'}]}
            onPress={() => onStatusChange?.(appointment.id, 'done')}>
            <Text style={[styles.btnText, {color: '#1E88E5', fontFamily: 'Vazir-Medium'}]}>انجام شد</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {borderRadius: 12, padding: 14, borderWidth: 0.5, marginBottom: 10},
  header: {flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6},
  name: {fontSize: 15},
  badge: {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20},
  badgeText: {fontSize: 12},
  meta: {fontSize: 12, textAlign: 'right', marginBottom: 10},
  actions: {flexDirection: 'row-reverse', gap: 8},
  btn: {paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8},
  btnText: {fontSize: 13},
});

export default AppointmentManagerCard;
