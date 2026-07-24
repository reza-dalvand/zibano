// src/components/profile/ProfileMenuCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

export default function ProfileMenuCard({ item, onPress, rightElement = null }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        s.menuItem,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={s.menuItemLeft}>
        <View
          style={[s.menuIconBox, { backgroundColor: item.color + '20' }]}
        >
          <Icon name={item.icon} size={24} color={item.color} />
          {item.badge && item.badge > 0 && (
            <View style={s.menuBadge}>
              <Text style={s.menuBadgeText}>{item.badge}</Text>
            </View>
          )}
        </View>
        <View style={s.menuTextContainer}>
          <Text style={[s.menuTitle, { color: colors.textMain }]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={[s.menuSubtitle, { color: colors.textSecondary }]}>
              {item.subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement || (
        <Icon name="chevron-left" size={24} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  menuBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E53935',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  menuBadgeText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  menuTextContainer: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  menuSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
});