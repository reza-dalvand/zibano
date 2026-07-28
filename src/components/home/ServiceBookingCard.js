// src/components/home/ServiceBookingCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Card from '../common/Card';
import { toPersianDigit, formatPrice } from '../../utils/numberUtils';
import { SERVICE_TYPE_CONFIG } from '../../constants/serviceTypes';

export default function ServiceBookingCard({ service, onBook }) {
  const { colors } = useTheme();
  const typeConfig = SERVICE_TYPE_CONFIG[service.typeId] || SERVICE_TYPE_CONFIG.default;
  const iconSize = 48;

  return (
    <Card variant="elevated" padding={0} radius={20} style={s.serviceCard}>
      <View style={s.serviceInner}>
        <View style={s.serviceImageWrap}>
          <View style={[s.iconContainer, { backgroundColor: typeConfig.bg + '60' }]}>
            <View style={[s.iconInnerCircle, { backgroundColor: typeConfig.bg + '40' }]}>
              <Icon name={typeConfig.icon} size={iconSize * 0.5} color={typeConfig.color} />
            </View>
          </View>
          {service.discount > 0 && (
            <View style={s.serviceDiscountBadge}>
              <Icon name="local-offer" size={9} color="#fff" />
              <Text style={s.serviceDiscountText}>{toPersianDigit(service.discount)}٪</Text>
            </View>
          )}
        </View>

        <View style={s.serviceInfo}>
          <Text style={[s.serviceName, { color: colors.textMain }]} numberOfLines={2}>
            {service.name}
          </Text>
          <View style={s.servicePriceRow}>
            <View style={s.servicePriceCol}>
              {service.discount > 0 && (
                <Text style={[s.serviceOriginalPrice, { color: colors.textSecondary }]}>
                  {formatPrice(service.originalPrice)}
                </Text>
              )}
              <Text style={[s.serviceFinalPrice, { color: colors.primary }]}>
                {formatPrice(service.price)}
              </Text>
            </View>
            <TouchableOpacity style={s.bookBtn} onPress={() => onBook(service)} activeOpacity={0.85}>
              <Icon name="event-available" size={14} color="#fff" />
              <Text style={s.bookBtnText}>رزرو</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  serviceCard: { overflow: 'hidden' },
  serviceInner: { flexDirection: 'row', padding: 14, gap: 14 },
  serviceImageWrap: { position: 'relative' },
  iconContainer: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  iconInnerCircle: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center' },
  serviceDiscountBadge: {
    position: 'absolute', top: 4, left: 4,
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: '#E53935', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 8,
    shadowColor: '#E53935', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
  },
  serviceDiscountText: { color: '#fff', fontSize: 10, fontFamily: 'Vazir-Bold' },
  serviceInfo: { flex: 1, gap: 6 },
  serviceName: { fontSize: 14, fontFamily: 'Vazir-Bold', lineHeight: 20 },
  servicePriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' },
  servicePriceCol: { alignItems: 'flex-start', gap: 2, flex: 1 },
  serviceOriginalPrice: { fontSize: 11, fontFamily: 'Vazir', textDecorationLine: 'line-through' },
  serviceFinalPrice: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#43A047', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12,
    shadowColor: '#43A047', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  bookBtnText: { color: '#fff', fontSize: 13, fontFamily: 'Vazir-Bold' },
});