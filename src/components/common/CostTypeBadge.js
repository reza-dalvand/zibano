// src/components/common/CostTypeBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COST_TYPE_META } from '../../constants/meta';

export default function CostTypeBadge({
  type,
  size = 'md',
  variant = 'default', // 'default' | 'solid' | 'compact'
}) {
  const meta = COST_TYPE_META[type] || COST_TYPE_META.material_cost;

  // Compact - کوچک
  if (variant === 'compact') {
    return (
      <View
        style={[
          s.compactContainer,
          { backgroundColor: meta.bg, borderColor: meta.border },
        ]}
      >
        <Icon name={meta.icon} size={10} color={meta.color} />
        <Text style={[s.compactText, { color: meta.color }]}>
          {meta.label}
        </Text>
      </View>
    );
  }

  // Solid - پررنگ (مثل ModelRequestCard)
  if (variant === 'solid') {
    return (
      <View
        style={[
          s.solidContainer,
          { backgroundColor: meta.color },
        ]}
      >
        <Icon name={meta.icon} size={11} color="#fff" />
        <Text style={s.solidText}>{meta.label}</Text>
      </View>
    );
  }

  // Default
  return (
    <View
      style={[
        s.defaultContainer,
        { backgroundColor: meta.bg, borderColor: meta.border },
      ]}
    >
      <Icon name={meta.icon} size={14} color={meta.color} />
      <Text style={[s.defaultText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  // Compact
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  compactText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },

  // Solid
  solidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  solidText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },

  // Default
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  defaultText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});