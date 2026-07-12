import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useTheme} from './ThemeContext';

const ServiceCard = ({service, onPress}) => {
  const {colors} = useTheme();
  const hasDiscount = service.discount > 0;
  const finalPrice = hasDiscount
    ? service.price * (1 - service.discount / 100)
    : service.price;

  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: colors.cardBackground}]}
      onPress={onPress}
      activeOpacity={0.7}>
      {service.image && (
        <Image source={{uri: service.image}} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={[styles.name, {color: colors.textMain}]} numberOfLines={2}>
          {service.name}
        </Text>
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            {hasDiscount && (
              <Text style={[styles.originalPrice, {color: colors.textSecondary}]}>
                {service.price.toLocaleString('fa-IR')}
              </Text>
            )}
            <Text style={[styles.price, {color: colors.primary}]}>
              {finalPrice.toLocaleString('fa-IR')} تومان
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
  },
  duration: {
    fontSize: 13,},
});

export default ServiceCard;
