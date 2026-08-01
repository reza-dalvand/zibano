// src/components/home/search/SearchBusinessCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import { toPersianDigit } from '../../../utils/numberUtils';

export default function SearchBusinessCard({ business, onPress }) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(business)}
      style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      {/* ردیف اصلی: لوگو + اطلاعات + امتیاز */}
      <View style={s.mainRow}>
        {/* لوگو */}
        <View style={s.logoWrapper}>
          <Image source={{ uri: business.logo }} style={s.logo} />
          {business.VIP && (
            <View style={s.vipBadge}>
              <Icon name="workspace-premium" size={10} color="#FFD700" />
            </View>
          )}
        </View>
        
        {/* اطلاعات */}
        <View style={s.infoCol}>
          <Text style={[s.name, { color: colors.textMain }]} numberOfLines={1}>
            {business.name}
          </Text>
          
          <View style={s.categoryRow}>
            <Icon name="spa" size={12} color={colors.primary} />
            <Text style={[s.category, { color: colors.primary }]} numberOfLines={1}>
              {business.category}
            </Text>
          </View>
          
          <View style={s.locationRow}>
            <Icon name="location-on" size={12} color={colors.textSecondary} />
            <Text style={[s.location, { color: colors.textSecondary }]} numberOfLines={1}>
              {business.address}
            </Text>
          </View>
        </View>
        
        {/* امتیاز */}
        <View style={s.ratingBox}>
          <Icon name="star" size={14} color="#FFC107" />
          <Text style={[s.ratingText, { color: colors.textMain }]}>
            {business.rating}
          </Text>
          <Text style={[s.reviewsText, { color: colors.textSecondary }]}>
            ({toPersianDigit(business.reviewsCount)})
          </Text>
        </View>
      </View>
      
      {/* فوتر: تعداد خدمات + تخفیف + دکمه مشاهده */}
      <View style={[s.footer, { borderTopColor: colors.border }]}>
        <View style={s.servicesCount}>
          <Icon name="check-circle" size={13} color={colors.primary} />
          <Text style={[s.servicesText, { color: colors.textSecondary }]}>
            {toPersianDigit(business.servicesCount)} خدمت
          </Text>
        </View>
        
        {business.discount > 0 && (
          <View style={s.discountBadge}>
            <Icon name="local-offer" size={10} color="#fff" />
            <Text style={s.discountText}>{toPersianDigit(business.discount)}٪</Text>
          </View>
        )}
        
        <View style={s.spacer} />
        
        <View style={[s.viewBtn, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[s.viewBtnText, { color: colors.primary }]}>مشاهده</Text>
          <Icon name="chevron-left" size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    marginBottom: 12,
  },
  mainRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  logoWrapper: {
    position: 'relative',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  vipBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  category: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  location: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFC10715',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  reviewsText: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  servicesCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  servicesText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#E53935',
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  spacer: {
    flex: 1,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  viewBtnText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});