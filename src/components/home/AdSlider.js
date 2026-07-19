// src/components/home/AdSlider.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 60;
const CARD_SPACING = 10;

export default function AdSlider({ ads = [], onPress, autoPlayInterval = 4000 }) {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const autoPlayRef = useRef(null);

  useEffect(() => {
    if (ads.length > 1) {
      autoPlayRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % ads.length;
        flatListRef.current?.scrollToOffset({
          offset: nextIndex * (CARD_WIDTH + CARD_SPACING),
          animated: true,
        });
        setActiveIndex(nextIndex);
      }, autoPlayInterval);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeIndex, ads.length]);

  useEffect(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: autoPlayInterval,
      useNativeDriver: false,
    }).start();
  }, [activeIndex]);

  const onScroll = (e) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING)
    );
    if (index !== activeIndex) setActiveIndex(index);
  };

  const goToSlide = (index) => {
    flatListRef.current?.scrollToOffset({
      offset: index * (CARD_WIDTH + CARD_SPACING),
      animated: true,
    });
    setActiveIndex(index);
  };

  if (!ads || ads.length === 0) return null;

  return (
    <View style={s.container}>
      <FlatList
        ref={flatListRef}
        data={ads}
        renderItem={({ item, index }) => {
          const isActive = index === activeIndex;
          return (
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => onPress?.(item)}
              style={[
                s.slideCard,
                {
                  width: CARD_WIDTH,
                  marginRight: CARD_SPACING,
                  shadowColor: isActive ? colors.primary : '#000',
                },
              ]}
            >
              <Image source={{ uri: item.imageUrl }} style={s.image} />

              {/* ❌ badgeBox (تگ پرفروش/جدید/پیشنهاد ویژه) حذف شد */}
              {/* ❌ gradientOverlay حذف شد */}
              {/* ❌ contentOverlay (عنوان، زیرعنوان، دکمه) حذف شد */}

              {/* Progress bar بالای کارت (اختیاری) */}
              {isActive && ads.length > 1 && (
                <View style={s.progressContainer}>
                  <View style={[s.progressBg, { backgroundColor: 'rgba(255,255,255,0.35)' }]}>
                    <Animated.View
                      style={[
                        s.progressFill,
                        {
                          backgroundColor: '#fff',
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          }),
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={s.flatListContent}
      />

      {/* Indicator Dots */}
      {ads.length > 1 && (
        <View style={s.dotsContainer}>
          {ads.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => goToSlide(i)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  s.dot,
                  {
                    backgroundColor:
                      i === activeIndex ? colors.primary : colors.border,
                    width: i === activeIndex ? 24 : 8,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  slideCard: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#eee',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Progress bar (بالای کارت)
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    zIndex: 2,
  },
  progressBg: {
    height: 3,
    borderRadius: 0,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 0,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});