// src/components/home/search/SearchPostCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';

export default function SearchPostCard({ post, onPress }) {
  const { colors } = useTheme();

  if (!post) return null;

  const media = post.gallery || post.images || [];
  const firstImage = media[0] || 'https://picsum.photos/400/400?random=0';
  const hasDiscount = post.discount > 0;
  const isMagazine = post.source === 'magazine';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(post)}
      style={[s.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
    >
      {/* تصویر */}
      <View style={s.imageWrapper}>
        <Image source={{ uri: firstImage }} style={s.image} />

        {/* تگ مجله */}
        {isMagazine && (
          <View style={s.magazineTag}>
            <Icon name="auto-awesome" size={10} color="#fff" />
            <Text style={s.magazineTagText}>مجله</Text>
          </View>
        )}

        {/* تگ تخفیف */}
        {/* {hasDiscount && !isMagazine && (
          <View style={s.discountTag}>
            <Text style={s.discountTagText}>{post.discount}٪</Text>
          </View>
        )} */}

        {/* آیکون چندتصویری */}
        {media.length > 1 && (
          <View style={s.carouselIcon}>
            <Icon name="collections" size={16} color="#FFF" />
          </View>
        )}
      </View>

      {/* اطلاعات */}
      <View style={s.info}>
        <Text style={[s.businessName, { color: colors.textMain }]} numberOfLines={1}>
          {post.businessName}
        </Text>
        <Text style={[s.caption, { color: colors.textSecondary }]} numberOfLines={2}>
          {post.caption}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    width: '32%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
  },
  magazineTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(156, 39, 176, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  magazineTagText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: 'Vazir-Bold',
  },
  discountTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#E53935',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountTagText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  carouselIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
    borderRadius: 6,
  },
  info: {
    padding: 8,
    gap: 3,
  },
  businessName: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  caption: {
    fontSize: 10,
    fontFamily: 'Vazir',
    lineHeight: 14,
  },
});