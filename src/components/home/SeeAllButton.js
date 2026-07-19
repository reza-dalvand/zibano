// src/components/home/SeeAllButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function SeeAllButton({ onPress, count }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        s.container,
        {
          backgroundColor: colors.primary + '12',
          borderColor: colors.primary + '35',
        },
      ]}
    >
      <Text style={[s.text, { color: colors.primary }]}>مشاهده همه</Text>
      <View style={[s.iconCircle, { backgroundColor: colors.primary }]}>
        <Icon name="chevron-left" size={14} color="#fff" />
      </View>
      {count !== undefined && count > 0 && (
        <View style={[s.countBadge, { backgroundColor: colors.primary }]}>
          <Text style={s.countText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    position: 'relative',
  },
  text: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    position: 'absolute',
    top: -6,
    left: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  countText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Vazir-Bold',
  },
});