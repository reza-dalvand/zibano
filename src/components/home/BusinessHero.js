// src/components/home/BusinessHero.js
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const GALLERY_HEIGHT = 380;

export default function BusinessHero({
  gallery = [],
  businessId,
  businessName,
  onBackPress,
  isFavorite,
  onFavoritePress,
}) {
  // 🎯 فقط اولین تصویر را نمایش بده
  const coverImage = gallery[0] || 'https://picsum.photos/800/600?random=45';

  // 🎯 تولید لینک اختصاصی کسب و کار
  const bookingLink = `https://zibano.app/book/${businessId || 'biz_1'}`;

  // 🎯 اشتراک‌گذاری لینک اختصاصی
  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌸 ${businessName || 'سالن زیبایی'}

📱 با این لینک می‌توانید مستقیماً از من نوبت بگیرید:
${bookingLink}

✨ رزرو از اپلیکیشن زیبانو`,
      });
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  return (
    <View style={s.heroContainer}>
      {/* 🎯 فقط یک Image ساده - بدون اسلایدر */}
      <Image source={{ uri: coverImage }} style={s.heroImage} />

      {/* Gradient Overlay */}
      <View style={s.heroGradientTop} />
      <View style={s.heroGradientBottom} />

      {/* دکمه‌های شناور */}
      <View style={s.heroTopActions}>
        <TouchableOpacity style={s.heroActionButton} onPress={onBackPress}>
          <Icon name="arrow-forward" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={s.heroActionButton} onPress={handleShare}>
          <Icon name="share" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={s.heroActionButton}
          onPress={onFavoritePress}
        >
          <Icon
            name={isFavorite ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isFavorite ? '#FFD700' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  heroContainer: {
    width: width,
    height: GALLERY_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width: width,
    height: GALLERY_HEIGHT,
    resizeMode: 'cover',
  },
  heroGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  heroGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  heroTopActions: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroActionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});