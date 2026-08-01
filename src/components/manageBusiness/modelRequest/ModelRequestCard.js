// src/components/manageBusiness/modelRequest/ModelRequestCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import CostTypeBadge from '../../common/CostTypeBadge';
import Badge from '../../common/Badge';

export default function ModelRequestCard({ request, onPress }) {
  const { colors } = useTheme();

  const statusConfig = {
    active:   { label: 'فعال',     variant: 'success', color: '#4CAF50' },
    inactive: { label: 'غیرفعال',  variant: 'error',   color: '#E53935' },
  };
  const currentStatus = statusConfig[request.status] || statusConfig.inactive;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress?.(request)}
      style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      {/* Thumbnail خدمت */}
      {request.serviceImage ? (
        <Image source={{ uri: request.serviceImage }} style={s.thumbnail} />
      ) : (
        <View style={[s.thumbnail, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}>
          <Icon name="image" size={24} color={colors.textSecondary} />
        </View>
      )}

      {/* محتوا */}
      <View style={s.content}>
        <Text style={[s.title, { color: colors.textMain }]} numberOfLines={1}>
          {request.title}
        </Text>

        <View style={s.metaRow}>
          <CostTypeBadge type={request.costType} variant="compact" />
          <View style={s.spacer} />
          <Badge
            label={currentStatus.label}
            variant={currentStatus.variant}
            size="sm"
          />
        </View>
      </View>

      {/* فلش */}
      <Icon name="chevron-left" size={22} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spacer: {
    flex: 1,
  },
});