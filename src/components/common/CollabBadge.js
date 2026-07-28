// src/components/common/CollabBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLLAB_TYPE_META } from '../../constants/meta';

export default function CollabBadge({
  type,
  priceDisplay,
  size = 'md',
  variant = 'default', // 'default' | 'solid' | 'compact'
}) {
  const meta = COLLAB_TYPE_META[type] || COLLAB_TYPE_META.percent;

  // حالت compact - فقط برچسب
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

  // حالت solid - پررنگ (مثل AllLineRentalsCard)
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
        {priceDisplay && (
          <>
            <View style={[s.solidDot, { backgroundColor: 'rgba(255,255,255,0.4)' }]} />
            <Text style={s.solidText}>{priceDisplay}</Text>
          </>
        )}
      </View>
    );
  }

  // حالت پیش‌فرض - با border
  return (
    <View
      style={[
        s.defaultContainer,
        { backgroundColor: meta.bg, borderColor: meta.border },
      ]}
    >
      <Icon name={meta.icon} size={14} color={meta.color} />
      <Text style={[s.defaultText, { color: meta.color }]}>
        همکاری {meta.label}
      </Text>
      {priceDisplay && (
        <View style={s.priceSection}>
          <View style={[s.dot, { backgroundColor: meta.color + '60' }]} />
          <Text style={[s.priceText, { color: meta.color }]}>
            {priceDisplay}
          </Text>
        </View>
      )}
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
    paddingVertical: 3,
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
  },
  solidText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  solidDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },

  // Default
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  defaultText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  priceText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});