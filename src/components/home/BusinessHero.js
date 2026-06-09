// src/components/business/BusinessHero.js
import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const GALLERY_HEIGHT = 380;

export default function BusinessHero({
  gallery = [],
  onBackPress,
  isFavorite,
  onFavoritePress,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleShare = async () => {
    try {
      await Share.share({ message: 'رزرو از اپلیکیشن زیبانو' });
    } catch (e) {}
  };

  return (
    <View style={s.heroContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
      >
        {gallery.map((img, i) => (
          <Image key={i} source={{ uri: img }} style={s.heroImage} />
        ))}
      </ScrollView>

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
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={22}
            color={isFavorite ? '#FF4B6E' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      {/* Indicator */}
      <View style={s.galleryIndicators}>
        {gallery.map((_, i) => (
          <View
            key={i}
            style={[
              s.galleryDot,
              {
                backgroundColor:
                  i === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                width: i === currentIndex ? 20 : 6,
              },
            ]}
          />
        ))}
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
  galleryIndicators: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  galleryDot: {
    height: 6,
    borderRadius: 3,
  },
});