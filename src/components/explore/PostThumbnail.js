// src/components/explore/PostThumbnail.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const THUMBNAIL_SIZE = width / 3;

export default function PostThumbnail({ post, onPress }) {
  if (!post) return null;

  const isMagazine = post.source === 'magazine';
  const hasDiscount = post.discount > 0;
  
  // 🎯 اصلاح اصلی: fallback ایمن برای gallery یا images
  const media = post.gallery || post.images || [];
  const firstImage = media[0] || 'https://picsum.photos/400/400?random=0'; // تصویر پیش‌فرض در صورت نبود آرایه

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(post)}
      style={styles.container}
    >
      <Image source={{ uri: firstImage }} style={styles.image} />
      
      {/* ✅ تگ منبع (مجله / کسب‌وکار) */}
      {isMagazine && (
        <View style={styles.magazineTag}>
          <Icon name="auto-awesome" size={10} color="#fff" />
          <Text style={styles.magazineTagText}>مجله</Text>
        </View>
      )}
      
      {/* ✅ تگ تخفیف (فقط برای کسب‌وکارها) */}
      {hasDiscount && !isMagazine && (
        <View style={styles.discountTag}>
          <Text style={styles.discountTagText}>{post.discount}٪</Text>
        </View>
      )}
      
      {/* آیکون چندتصویری */}
      {media.length > 1 && (
        <View style={styles.carouselIcon}>
          <Icon name="collections" size={16} color="#FFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    padding: 1,
    position: 'relative',
  },
  image: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
});