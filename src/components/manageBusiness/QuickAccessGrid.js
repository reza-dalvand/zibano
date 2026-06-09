// src/components/manager/QuickAccessGrid.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function QuickAccessGrid({ items, onItemPress }) {
  const { colors } = useTheme();

  return (
    <View style={s.section}>
      <Text style={[s.sectionTitle, { color: colors.textMain }]}>
        دسترسی سریع
      </Text>
      <View style={s.quickAccessGrid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={s.quickAccessItem}
            onPress={() => onItemPress?.(item)}
            activeOpacity={0.8}
          >
            <View
              style={[
                s.quickAccessIcon,
                {
                  backgroundColor: item.gradient[0] + '20',
                  borderColor: item.gradient[0],
                },
              ]}
            >
              <Icon name={item.icon} size={28} color={item.gradient[0]} />
              {item.badge && item.badge > 0 && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{item.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[s.quickAccessLabel, { color: colors.textMain }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAccessItem: {
    width: '31%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickAccessIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  quickAccessLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E53935',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
});