// src/components/home/PortfolioGrid.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
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
      
      {/* 🎯 Grid دو ستونه */}
      <View style={s.portfolioGrid}>
        {portfolios.map((portfolio, index) => {
          const imageCount = portfolio.images?.length || 1;
          return (
            <TouchableOpacity
              key={portfolio.id || index}
              activeOpacity={0.9}
              onPress={() => onPortfolioPress(portfolio, index)}
              style={s.portfolioItem}
            >
              <Image
                source={{ uri: portfolio.coverImage || portfolio.images?.[0] }}
                style={s.portfolioImage}
                resizeMode="cover"
              />
              
              {/* گرادیان پایین */}
              <View style={s.imageGradient} />
              
              {/* Badge تعداد تصاویر */}
              {imageCount > 1 && (
                <View style={s.imageCountBadge}>
                  <Icon name="collections" size={11} color="#fff" />
                  <Text style={s.imageCountText}>{imageCount}</Text>
                </View>
              )}
              
              {/* عنوان نمونه‌کار روی تصویر */}
              {portfolio.title && (
                <View style={s.portfolioTitleOverlay}>
                  <Text style={s.portfolioTitle} numberOfLines={2}>
                    {portfolio.title}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
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
  // 🎯 Grid دو ستونه
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  portfolioItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  portfolioTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  portfolioTitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    lineHeight: 17,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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