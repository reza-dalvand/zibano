import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from './ThemeContext';

const AppointmentCard = ({appointment, onPress, onCancel}) => {
  const {colors} = useTheme();

  const statusColors = {
    pending: '#FFA500',
    confirmed: '#4CAF50',
    cancelled: '#F44336',
    completed: '#757575',
  };

  const statusLabels = {
    pending: 'در انتظار',
    confirmed: 'تأیید شده',
    cancelled: 'لغو شده',
    completed: 'انجام شده',
  };

  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: colors.cardBackground}]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.businessInfo}>
          {appointment.businessLogo && (
            <Image
              source={{uri: appointment.businessLogo}}
              style={styles.logo}
            />
          )}
          <View style={styles.businessText}>
            <Text
              style={[
                styles.businessName,
                {color: colors.textMain, fontFamily: 'Vazir-Bold'},]}
              numberOfLines={1}>
              {appointment.businessName}
            </Text>
            <Text
              style={[
                styles.serviceName,
                {color: colors.textSecondary, fontFamily: 'Vazir'},
              ]}
              numberOfLines={1}>
              {appointment.serviceName}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: statusColors[appointment.status] + '20'},
          ]}>
          <Text
            style={[
              styles.statusText,
              {
                color: statusColors[appointment.status],
                fontFamily: 'Vazir',
              },
            ]}>
            {statusLabels[appointment.status]}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Icon name="calendar-today" size={16} color={colors.textSecondary} />
          <Text
            style={[
              styles.detailText,
              {color: colors.textMain, fontFamily: 'Vazir'},
            ]}>
            {appointment.date}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="access-time" size={16} color={colors.textSecondary} />
          <Text
            style={[
              styles.detailText,
              {color: colors.textMain, fontFamily: 'Vazir'},
            ]}>
            {appointment.time}
          </Text>
        </View>
        {appointment.teamMember && (
          <View style={styles.detailRow}>
            <Icon name="person" size={16} color={colors.textSecondary} />
            <Text
              style={[
                styles.detailText,
                {color: colors.textMain, fontFamily: 'Vazir'},
              ]}>
              {appointment.teamMember}
            </Text>
          </View>
        )}
      </View>

      {appointment.status === 'confirmed' && onCancel && (
        <TouchableOpacity
          style={[styles.cancelBtn, {borderColor: colors.border}]}
          onPress={onCancel}>
          <Text
            style={[
              styles.cancelText,
              {color: '#F44336', fontFamily: 'Vazir'},
            ]}>
            لغو نوبت
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  businessInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginLeft: 10,
  },
  businessText: {
    flex: 1,
    justifyContent: 'center',
  },
  businessName: {
    fontSize: 15,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
  },
});

export default AppointmentCard;
