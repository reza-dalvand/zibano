// src/components/home/ServiceListCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

export default function ServiceListCard({ service, onPress }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[s.card, { backgroundColor: colors.cardBackground }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={s.imageContainer}>
        <Image source={{ uri: service.image }} style={s.image} />
        {service.discount > 0 && (
          <View style={s.discountBadge}>
            <Text style={s.discountText}>{service.discount}٪</Text>
          </View>
        )}
      </View>

      <View style={s.info}>
        <Text
          style={[s.name, { color: colors.textMain }]}
          numberOfLines={1}
        >
          {service.name}
        </Text>
        <Text
          style={[s.business, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {service.business}
        </Text>

        <View style={s.meta}>
          <View style={s.ratingBox}>
            <Icon name="star" size={14} color="#FFC107" />
            <Text style={[s.ratingText, { color: colors.textMain }]}>
              {service.rating}
            </Text>
          </View>
          <Icon name="schedule" size={14} color={colors.textSecondary} />
          <Text style={[s.durationText, { color: colors.textSecondary }]}>
            {service.duration}
          </Text>
        </View>

        <View style={s.priceRow}>
          {service.discount > 0 && (
            <Text style={[s.originalPrice, { color: colors.textSecondary }]}>
              {service.originalPrice}
            </Text>
          )}
          <Text style={[s.price, { color: colors.primary }]}>
            {service.price} <Text style={s.currencyText}>تومان</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    width: 200,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  info: {
    padding: 12,
    gap: 6,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  business: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  durationText: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  originalPrice: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  currencyText: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
});