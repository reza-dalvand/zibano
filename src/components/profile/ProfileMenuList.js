// src/components/profile/ProfileMenuList.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/useThemeStore';
import ProfileMenuCard from './ProfileMenuCard';

export default function ProfileMenuList({ title, items, onItemPress }) {
  const { colors } = useTheme();
  return (
    <View style={s.section}>
      {/* ✅ شرطی کردن: فقط وقتی title مقدار دارد رندر شود */}
      {title ? (
        <Text style={[s.sectionTitle, { color: colors.textMain }]}>
          {title}
        </Text>
      ) : null}
      <View style={s.menuContainer}>
        {items.map((item) => (
          <ProfileMenuCard
            key={item.id}
            item={item}
            onPress={() => onItemPress?.(item)}
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    marginBottom: 12,
  },
  menuContainer: {
    gap: 0,
  },
});