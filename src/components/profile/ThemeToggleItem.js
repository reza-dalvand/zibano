// src/components/profile/ThemeToggleItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function ThemeToggleItem({ isDark, onToggle }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        s.menuItem,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={s.menuItemLeft}>
        <View style={[s.menuIconBox, { backgroundColor: '#FFC107' + '20' }]}>
          <Icon
            name={isDark ? 'light-mode' : 'dark-mode'}
            size={24}
            color="#FFC107"
          />
        </View>
        <View style={s.menuTextContainer}>
          <Text style={[s.menuTitle, { color: colors.textMain }]}>
            حالت شب / روز
          </Text>
          <Text style={[s.menuSubtitle, { color: colors.textSecondary }]}>
            {isDark ? 'تم تاریک فعال است' : 'تم روشن فعال است'}
          </Text>
        </View>
      </View>

      {/* ✅ سوئیچ تم با alignSelf به جای transform */}
      <View
        style={[
          s.themeSwitch,
          { backgroundColor: isDark ? colors.primary : colors.border },
        ]}
      >
        <View
          style={[
            s.themeSwitchKnob,
            {
              alignSelf: isDark ? 'flex-start' : 'flex-end',
              backgroundColor: '#fff',
            },
          ]}
        />
      </View>
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
  themeSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  themeSwitchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});