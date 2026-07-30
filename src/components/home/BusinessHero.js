// src/components/home/BusinessHero.js
import React from 'react';
import { Share, Alert } from 'react-native';
import DetailHero from '../common/DetailHero';

export default function BusinessHero({
  gallery = [],
  businessId,
  businessName,
  onBackPress,
  isFavorite,
  onFavoritePress,
}) {
  const coverImage = gallery[0] || 'https://picsum.photos/800/600?random=45';
  const bookingLink = `https://zibano.app/book/${businessId || 'biz_1'}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌸 ${businessName || 'سالن زیبایی'}\n📱 با این لینک می‌توانید مستقیماً از من نوبت بگیرید:\n${bookingLink}\n✨ رزرو از اپلیکیشن زیبانو`,
      });
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  return (
    <DetailHero
      imageUrl={coverImage}
      onBack={onBackPress}
      onSave={onFavoritePress}
      isSaved={isFavorite}
      badges={gallery.length > 1 ? [{
        container: {
          position: 'absolute',
          top: 16,
          right: 70,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 14,
        },
        icon: 'collections',
        iconSize: 12,
        iconColor: '#fff',
        textStyle: { color: '#fff', fontSize: 12, fontFamily: 'Vazir-Bold' },
      }] : []}
    />
  );
}