// src/components/home/BusinessListCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Badge from '../common/Badge';

export default function BusinessListCard({ business, onPress }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        s.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={s.header}>
        <Image source={{ uri: business.logo }} style={s.logo} />
        <View style={s.info}>
          <View style={s.titleRow}>
            <Text
              style={[s.name, { color: colors.textMain }]}
              numberOfLines={1}
            >
              {business.name}
            </Text>
            {business.VIP && <Badge label="ویژه" variant="primary" size="sm" />}
          </View>
          <Text style={[s.category, { color: colors.primary }]}>
            {business.category}
          </Text>
        </View>
      </View>

      <View style={s.details}>
        <View style={s.metaRow}>
          <Icon name="location-on" size={16} color={colors.textSecondary} />
          <Text
            style={[s.address, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {business.address}
          </Text>
        </View>

        <View style={[s.statsRow, { borderTopColor: colors.border }]}>
          <View style={s.statItem}>
            <Icon name="star" size={16} color="#FFC107" />
            <Text style={[s.statText, { color: colors.textMain }]}>
              {business.rating}
            </Text>
            <Text style={[s.statLabel, { color: colors.textSecondary }]}>
              ({business.reviewsCount})
            </Text>
          </View>

          <View style={[s.statDivider, { backgroundColor: colors.border }]} />

          <View style={s.statItem}>
            <Icon name="spa" size={16} color={colors.primary} />
            <Text style={[s.statText, { color: colors.textMain }]}>
              {business.servicesCount} خدمت
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  category: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
  details: {
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  address: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
});