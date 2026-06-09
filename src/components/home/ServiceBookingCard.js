// src/components/business/ServiceBookingCard.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../common/Card';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = (num) => `${num.toLocaleString('fa-IR')} تومان`;

export default function ServiceBookingCard({ service, onBook }) {
  const { colors } = useTheme();

  return (
    <Card variant="elevated" padding={0} radius={20} style={s.serviceCard}>
      <View style={s.serviceInner}>
        <View style={s.serviceImageWrap}>
          <Image source={{ uri: service.image }} style={s.serviceImage} />
          {service.discount > 0 && (
            <View style={s.serviceDiscountBadge}>
              <Text style={s.serviceDiscountText}>
                {toPersianDigit(service.discount)}٪
              </Text>
            </View>
          )}
        </View>
        <View style={s.serviceInfo}>
          <Text
            style={[s.serviceName, { color: colors.textMain }]}
            numberOfLines={2}
          >
            {service.name}
          </Text>
          <View style={s.serviceMeta}>
            <Icon name="schedule" size={14} color={colors.textSecondary} />
            <Text style={[s.serviceDuration, { color: colors.textSecondary }]}>
              {toPersianDigit(service.duration)} دقیقه
            </Text>
          </View>
          <View style={s.servicePriceRow}>
            <View style={s.servicePriceCol}>
              {service.discount > 0 && (
                <Text
                  style={[
                    s.serviceOriginalPrice,
                    { color: colors.textSecondary },
                  ]}
                >
                  {formatPrice(service.originalPrice)}
                </Text>
              )}
              <Text style={[s.serviceFinalPrice, { color: colors.primary }]}>
                {formatPrice(service.price)}
              </Text>
            </View>
            <TouchableOpacity
              style={[s.bookBtn, { backgroundColor: colors.primary }]}
              onPress={() => onBook(service)}
            >
              <Text style={s.bookBtnText}>رزرو</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  serviceCard: {
    overflow: 'hidden',
  },
  serviceInner: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  serviceImageWrap: {
    position: 'relative',
  },
  serviceImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  serviceDiscountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#E53935',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  serviceDiscountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  serviceInfo: {
    flex: 1,
    gap: 6,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    lineHeight: 20,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceDuration: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  servicePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  servicePriceCol: {
    alignItems: 'flex-start',
    gap: 2,
  },
  serviceOriginalPrice: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
  },
  serviceFinalPrice: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  bookBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
});