import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from './ThemeContext';

const BusinessCard = ({business, onPress}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: colors.cardBackground}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Image source={{uri: business.logo}} style={styles.logo} />
      <View style={styles.content}>
        <Text style={[styles.name, {color: colors.textMain}]} numberOfLines={1}>
          {business.name}
        </Text>
        <Text style={[styles.category, {color: colors.textSecondary}]} numberOfLines={1}>
          {business.category}
        </Text>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Icon name="star" size={16} color={colors.primary} />
            <Text style={[styles.ratingText, {color: colors.textMain}]}>
              {business.rating.toFixed(1)}
            </Text>
          </View>
          <Text style={[styles.city, {color: colors.textSecondary}]}>
            {business.city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  city: {
    fontSize: 13,
  },
});

export default BusinessCard;
