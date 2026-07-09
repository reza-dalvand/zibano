// src/components/explore/GallerySlider.js
import React, { useRef, useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 32;

export default function GallerySlider({ gallery = [], containerWidth }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const sliderWidth = containerWidth || SLIDER_WIDTH;

  // 🎯 معکوس کردن آرایه تصاویر برای اسکرول به سمت راست در RTL
  const reversedGallery = [...gallery].reverse();

  // 🎯 اسکرول به ابتدای لیست (تصویر اول واقعی) بعد از mount
  useEffect(() => {
    if (flatListRef.current && reversedGallery.length > 0) {
      // تاخیر کوتاه برای اطمینان از render شدن FlatList
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: (reversedGallery.length - 1) * sliderWidth,
          animated: false,
        });
      }, 50);
    }
  }, [reversedGallery.length, sliderWidth]);

  const onScroll = (e) => {
    const slideSize = e.nativeEvent.layoutMeasurement.width;
    if (slideSize === 0) return;
    
    // 🎯 محاسبه ایندکس در لیست معکوس
    const reversedIndex = Math.round(
      e.nativeEvent.contentOffset.x / slideSize
    );
    
    // 🎯 تبدیل به ایندکس واقعی (معکوس کردن دوباره)
    const actualIndex = reversedGallery.length - 1 - reversedIndex;
    setCurrentIndex(Math.max(0, Math.min(actualIndex, gallery.length - 1)));
  };

  if (!gallery || gallery.length === 0) return null;

  return (
    <View style={[styles.container, { height: sliderWidth }]}>
      <FlatList
        ref={flatListRef}
        data={reversedGallery}
        keyExtractor={(item, index) => `img-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image 
            source={{ uri: item }} 
            style={[styles.image, { width: sliderWidth, height: sliderWidth }]} 
            resizeMode="cover"
          />
        )}
        // 🎯 کلید حل مشکل: شروع از انتهای لیست معکوس (= ابتدای لیست واقعی)
        initialScrollIndex={reversedGallery.length - 1}
        getItemLayout={(data, index) => ({
          length: sliderWidth,
          offset: sliderWidth * index,
          index,
        })}
      />
      
      {/* 🎯 Dots Indicator با نمایش صحیح */}
      {gallery.length > 1 && (
        <View style={styles.dotsContainer}>
          {gallery.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                  width: i === currentIndex ? 16 : 6,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#000',
  },
  image: {
    resizeMode: 'cover',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});