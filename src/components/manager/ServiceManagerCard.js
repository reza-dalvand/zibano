import React from 'react';
import {View, Text, Switch, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../theme/ThemeContext';

const ServiceManagerCard = ({service, onToggle, onEdit}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.card, {backgroundColor: colors.cardBackground, borderColor: colors.border}]}>
      <View style={styles.row}>
        <Switch
          value={service.active}
          onValueChange={() => onToggle?.(service.id)}
          thumbColor={service.active ? colors.primary : '#ccc'}
          trackColor={{true: colors.primary + '55', false: '#ddd'}}
        />
        <View style={styles.info}>
          <Text style={[styles.name, {color: colors.textMain, fontFamily: 'Vazir-Medium'}]}>
            {service.name}
          </Text>
          <Text style={[styles.price, {color: colors.primary, fontFamily: 'Vazir'}]}>
            {service.price?.toLocaleString('fa-IR')} تومان
          </Text>
        </View>
        <TouchableOpacity onPress={() => onEdit?.(service)}>
          <Icon name="edit" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {borderRadius: 12, padding: 14, borderWidth: 0.5, marginBottom: 8},
  row: {flexDirection: 'row-reverse', alignItems: 'center', gap: 12},
  info: {flex: 1, alignItems: 'flex-end'},
  name: {fontSize: 14, marginBottom: 2},
  price: {fontSize: 13},
});

export default ServiceManagerCard;
