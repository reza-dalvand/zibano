// src/components/home/search/SearchModelCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import CostTypeBadge from '../../common/CostTypeBadge';
import { toPersianDigit } from '../../../utils/numberUtils';

export default function SearchModelCard({ request, onPress }) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(request)}
      style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      {/* تصویر */}
      <View style={s.imageContainer}>
        <Image source={{ uri: request.serviceImage }} style={s.image} />
        <View style={s.imageGradient} />
        
        {/* Badge نوع هزینه */}
        <View style={s.costBadgeWrapper}>
          <CostTypeBadge type={request.costType} variant="solid" />
        </View>
        
        {/* Badge فوری */}
        {/* {request.isUrgent && (
          <View style={s.urgentBadge}>
            <Icon name="flash-on" size={10} color="#fff" />
            <Text style={s.urgentText}>فوری</Text>
          </View>
        )} */}
      </View>
      
      {/* اطلاعات */}
      <View style={s.info}>
        <Text style={[s.title, { color: colors.textMain }]} numberOfLines={2}>
          {request.title}
        </Text>
        
        <View style={s.businessRow}>
          <Icon name="store" size={11} color={colors.primary} />
          <Text style={[s.businessName, { color: colors.primary }]} numberOfLines={1}>
            {request.businessName}
          </Text>
        </View>
        
        <View style={s.locationRow}>
          <Icon name="location-on" size={11} color={colors.textSecondary} />
          <Text style={[s.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
            {request.city}
          </Text>
        </View>
        
        {/* {request.discount > 0 && (
          <View style={s.discountRow}>
            <Icon name="local-offer" size={11} color="#E53935" />
            <Text style={s.discountText}>
              {toPersianDigit(request.discount)}٪ تخفیف
            </Text>
          </View>
        )} */}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    width: 180,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 12,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  costBadgeWrapper: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  urgentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,152,0,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgentText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  info: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    lineHeight: 19,
    minHeight: 38,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessName: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 10,
    fontFamily: 'Vazir',
    flex: 1,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E5393515',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  discountText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
    color: '#E53935',
  },
});