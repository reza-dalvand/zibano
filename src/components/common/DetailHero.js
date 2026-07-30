// src/components/common/DetailHero.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FavoriteButton from './FavoriteButton';

export default function DetailHero({
  imageUrl,
  onBack,
  onSave,
  isSaved,
  badges = [],
}) {
  const insets = useSafeAreaInsets();
  const heroHeight = 320 + insets.top;

  return (
    <View style={[s.container, { height: heroHeight, marginTop: -insets.top }]}>
      <Image source={{ uri: imageUrl }} style={s.image} />
      <View style={s.gradient} />

      <View style={[s.topActions, { top: insets.top + 12 }]}>
        <TouchableOpacity style={s.actionBtn} onPress={onBack}>
          <Icon name="arrow-forward" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <FavoriteButton
          isFavorite={isSaved}
          onPress={onSave}
          size={22}
          color="#fff"
          activeColor="#FFD700"
          style={s.actionBtn}
        />
      </View>

      {/* ✅ بهبود: اعتبارسنجی ساختار badges
      {badges.length > 0 && (
        <View style={s.badgesContainer}>
          {badges.map((badge, i) => {
            if (!badge || !badge.container) return null;
            return (
              <View key={i} style={badge.container}>
                {badge.icon && (
                  <Icon
                    name={badge.icon}
                    size={badge.iconSize || 12}
                    color={badge.iconColor || '#fff'}
                  />
                )}
                {badge.text && (
                  <Text style={badge.textStyle || s.defaultBadgeText}>
                    {badge.text}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      )} */}
    </View>
  );
}

const s = StyleSheet.create({
  container: { width: '100%', position: 'relative', backgroundColor: '#000' },
  image: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, resizeMode: 'cover' },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  topActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  badgesContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
});