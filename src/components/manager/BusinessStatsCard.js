import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../theme/ThemeContext';

const STATS = [
  {key: 'bookings', label: 'رزرو',    icon: 'event',         color: '#1E88E5'},
  {key: 'rating',   label: 'امتیاز',  icon: 'star',          color: '#FFC107'},
  {key: 'revenue',  label: 'درآمد',   icon: 'attach-money',  color: '#43A047'},
];

const BusinessStatsCard = ({stats = {}}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.card, {backgroundColor: colors.cardBackground}]}>
      {STATS.map(({key, label, icon, color}) => (
        <View key={key} style={styles.item}>
          <View style={[styles.iconBox, {backgroundColor: color + '22'}]}>
            <Icon name={icon} size={22} color={color} />
          </View>
          <Text style={[styles.value, {color: colors.textMain, fontFamily: 'Vazir-Bold'}]}>
            {key === 'revenue'
              ? stats[key]?.toLocaleString('fa-IR')
              : stats[key]}
          </Text>
          <Text style={[styles.label, {color: colors.textSecondary, fontFamily: 'Vazir'}]}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    borderRadius: 16,
    padding: 20,
  },
  item: {alignItems: 'center', gap: 6},
  iconBox: {padding: 10, borderRadius: 12},
  value: {fontSize: 18},
  label: {fontSize: 12},
});

export default BusinessStatsCard;
