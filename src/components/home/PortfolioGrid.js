// src/components/business/PortfolioGrid.js
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../common/Card';

export default function PortfolioGrid({ portfolios, onPortfolioPress }) {
  const { colors } = useTheme();

  if (!portfolios || portfolios.length === 0) {
    return (
      <Card variant="elevated" padding={24} radius={16}>
        <View style={s.emptyState}>
          <Icon name="photo-library" size={48} color={colors.textSecondary + '60'} />
          <Text style={[s.emptyText, { color: colors.textSecondary }]}>
            هنوز نمونه‌کاری ثبت نشده است
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <View style={s.portfolioSection}>
      <Text style={[s.sectionTitle, { color: colors.textMain }]}>
        گالری نمونه‌کارها
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.portfolioScroll}
      >
        {portfolios.map((portfolio, index) => (
          <TouchableOpacity
            key={portfolio.id || index}
            activeOpacity={0.9}
            onPress={() => onPortfolioPress(portfolio, index)}
            style={s.portfolioItem}
          >
            <Image
              source={{ uri: portfolio.coverImage || portfolio.images[0] }}
              style={s.portfolioImage}
            />
            {/* Badge تعداد تصاویر */}
            {portfolio.images && portfolio.images.length > 1 && (
              <View style={s.imageCountBadge}>
                <Icon name="collections" size={14} color="#fff" />
                <Text style={s.imageCountText}>{portfolio.images.length}</Text>
              </View>
            )}
            {/* عنوان نمونه‌کار */}
            {portfolio.title && (
              <View style={s.portfolioTitleOverlay}>
                <Text style={s.portfolioTitle} numberOfLines={1}>
                  {portfolio.title}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  portfolioSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    marginBottom: 4,
  },
  portfolioScroll: {
    gap: 10,
    paddingRight: 4,
  },
  portfolioItem: {
    width: 160,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  portfolioTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  portfolioTitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
});