// src/components/manageBusiness/portfolio/PortfolioCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function PortfolioCard({ portfolio, onPress, onEdit, onDelete, serviceName }) {
  const { colors } = useTheme();

  const imageCount = portfolio.images?.length || 1;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(portfolio)}
      style={[s.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      {/* تصویر کاور */}
      <View style={s.imageContainer}>
        <Image
          source={{ uri: portfolio.coverImage || portfolio.images?.[0] }}
          style={s.image}
          resizeMode="cover"
        />

        {/* گرادیان پایین */}
        <View style={s.imageGradient} />

        {/* Badge تعداد تصاویر */}
        {imageCount > 1 && (
          <View style={s.imageCountBadge}>
            <Icon name="collections" size={11} color="#fff" />
            <Text style={s.imageCountText}>
              {toPersianDigit(imageCount)}
            </Text>
          </View>
        )}

        {/* عنوان روی تصویر */}
        {portfolio.title && (
          <View style={s.titleOverlay}>
            <Text style={s.titleText} numberOfLines={1}>
              {portfolio.title}
            </Text>
          </View>
        )}
      </View>

      {/* اطلاعات پایین */}
      <View style={s.info}>
        {/* نام خدمت مرتبط */}
        {serviceName && (
          <View style={[s.serviceRow, { backgroundColor: colors.primary + '10' }]}>
            <Icon name="spa" size={11} color={colors.primary} />
            <Text style={[s.serviceName, { color: colors.primary }]} numberOfLines={1}>
              {serviceName}
            </Text>
          </View>
        )}

        {/* توضیحات کوتاه */}
        {portfolio.description && (
          <Text style={[s.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {portfolio.description}
          </Text>
        )}

        {/* دکمه‌های اکشن */}
        <View style={s.actions}>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation?.(); onEdit(portfolio); }}
            style={[s.actionBtn, { backgroundColor: colors.primary + '15' }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="edit" size={14} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation?.(); onDelete(portfolio); }}
            style={[s.actionBtn, { backgroundColor: '#E5393515' }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="delete-outline" size={14} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  titleText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  info: {
    padding: 10,
    gap: 6,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  serviceName: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  description: {
    fontSize: 10,
    fontFamily: 'Vazir',
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});