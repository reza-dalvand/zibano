// src/components/home/search/SearchServiceCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import { toPersianDigit } from '../../../utils/numberUtils';

export default function SearchServiceCard({ service, onPress }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(service)}
      style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      <Image source={{ uri: service.image }} style={s.image} />
      <View style={s.info}>
        <Text style={[s.name, { color: colors.textMain }]} numberOfLines={2}>
          {service.name}
        </Text>
        <View style={s.businessRow}>
          <Icon name="store" size={11} color={colors.primary} />
          <Text style={[s.business, { color: colors.primary }]} numberOfLines={1}>
            {service.business}
          </Text>
        </View>
        <View style={s.metaRow}>
          <View style={s.ratingBox}>
            <Icon name="star" size={12} color="#FFC107" />
            <Text style={[s.ratingText, { color: colors.textMain }]}>
              {service.rating}
            </Text>
          </View>
          <View style={[s.dot, { backgroundColor: colors.border }]} />
          <Icon name="schedule" size={12} color={colors.textSecondary} />
          <Text style={[s.duration, { color: colors.textSecondary }]}>
            {service.duration}
          </Text>
        </View>
        <View style={s.priceRow}>
          <View style={s.priceCol}>
            {service.discount > 0 && (
              <Text style={[s.originalPrice, { color: colors.textSecondary }]}>
                {service.originalPrice}
              </Text>
            )}
            <Text style={[s.price, { color: colors.primary }]}>
              {service.price} <Text style={s.currency}>تومان</Text>
            </Text>
          </View>
          {service.discount > 0 && (
            <View style={[s.discountBadge, { backgroundColor: '#E53935' }]}>
              <Text style={s.discountText}>{toPersianDigit(service.discount)}٪</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    gap: 0,
  },
  image: {
    width: 110,
    height: 110,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  name: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    lineHeight: 19,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  business: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  duration: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  priceCol: {
    gap: 1,
  },
  originalPrice: {
    fontSize: 10,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  currency: {
    fontSize: 9,
    fontFamily: 'Vazir',
  },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
});