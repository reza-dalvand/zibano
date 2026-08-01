// src/components/home/search/SearchLineCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import CollabBadge from '../../common/CollabBadge';

export default function SearchLineCard({ ad, onPress }) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(ad)}
      style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      {/* تصویر */}
      <View style={s.imageContainer}>
        <Image source={{ uri: ad.lineImage }} style={s.image} />
        <View style={s.imageGradient} />
        
        {/* Badge نوع خدمت */}
        <View style={[s.serviceBadge, { backgroundColor: ad.serviceTypeColor || '#607D8B' }]}>
          <Icon name={ad.serviceTypeIcon || 'spa'} size={10} color="#fff" />
          <Text style={s.serviceBadgeText} numberOfLines={1}>
            {ad.serviceTypeName}
          </Text>
        </View>
      </View>
      
      {/* اطلاعات */}
      <View style={s.info}>
        <Text style={[s.title, { color: colors.textMain }]} numberOfLines={2}>
          {ad.title}
        </Text>
        
        <View style={s.businessRow}>
          <Icon name="store" size={11} color={colors.primary} />
          <Text style={[s.businessName, { color: colors.primary }]} numberOfLines={1}>
            {ad.businessName}
          </Text>
        </View>
        
        <CollabBadge
          type={ad.collabType}
          priceDisplay={ad.priceDisplay}
          variant="compact"
        />
        
        <View style={s.locationRow}>
          <Icon name="location-on" size={11} color={colors.textSecondary} />
          <Text style={[s.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
            {ad.city}
          </Text>
        </View>
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
    height: 120,
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
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  serviceBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serviceBadgeText: {
    color: '#fff',
    fontSize: 9,
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
});