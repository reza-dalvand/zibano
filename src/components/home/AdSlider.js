// src/components/home/AdSlider.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import SeeAllButton from './SeeAllButton';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 60;
const CARD_SPACING = 10;
const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function AdSlider({ ads = [], onPress, autoPlayInterval = 4000 }) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const autoPlayRef = useRef(null);

  // 🎯 اسکرول به اولین آیتم بعد از mount
  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: 0, animated: false });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 🎯 AutoPlay با scrollToIndex - حل مشکل بازگشت به اول
  useEffect(() => {
    if (ads.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const nextIndex = (prev + 1) % ads.length;
          const offset = nextIndex * (CARD_WIDTH + CARD_SPACING);

          // استفاده از scrollToOffset با محاسبه دقیق
          flatListRef.current?.scrollToOffset({
            offset,
            animated: true,
          });

          return nextIndex;
        });
      }, autoPlayInterval);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [ads.length, autoPlayInterval]);

  // 🎯 انیمیشن progress bar
  useEffect(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: autoPlayInterval,
      useNativeDriver: false,
    }).start();
  }, [activeIndex, autoPlayInterval]);

  // 🎯 محاسبه index از روی scroll position
  const onScroll = (e) => {
    const slideSize = CARD_WIDTH + CARD_SPACING;
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / slideSize);
    setActiveIndex(Math.max(0, Math.min(currentIndex, ads.length - 1)));
  };

  // 🎯 کلیک روی dot - رفتن به اسلاید مشخص
  const goToSlide = (index) => {
    const offset = index * (CARD_WIDTH + CARD_SPACING);
    flatListRef.current?.scrollToOffset({
      offset,
      animated: true,
    });
    setActiveIndex(index);
  };

  // 🎯 هندلر کلیک روی کارت
  const handleBookPress = (item) => {
    if (item.businessId) {
      navigation.navigate('BusinessDetails', { businessId: item.businessId });
    } else {
      onPress?.(item);
    }
  };

  // 🎯 هندلر اسکرول به index نامعتبر
  const onScrollToIndexFailed = (info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 300));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
      });
    });
  };

  if (!ads || ads.length === 0) return null;

  return (
    <View style={s.container}>
      <View style={s.sectionHeader}>
        <View style={s.titleRow}>
          <View style={[s.iconBox, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="local-fire-department" size={18} color={colors.primary} />
          </View>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            پیشنهادات ویژه
          </Text>
        </View>
        <SeeAllButton
          onPress={() => navigation.navigate('AllAds')}
          count={ads.length}
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={ads}
        renderItem={({ item, index }) => {
          const isActive = index === activeIndex;
          return (
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => handleBookPress(item)}
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
              <View style={s.gradientOverlay} />

              {/* Progress Bar */}
              {isActive && (
                <View style={s.progressContainer}>
                  <View style={[s.progressBg, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
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

              <View style={s.contentOverlay}>
                <Text style={s.title} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text style={s.subtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                )}
                <View style={s.ctaRow}>
                  <TouchableOpacity
                    onPress={() => handleBookPress(item)}
                    style={s.bookBtn}
                    activeOpacity={0.85}
                  >
                    <Icon name="event-available" size={14} color="#43A047" />
                    <Text style={s.bookBtnText}>رزرو نوبت</Text>
                    <Icon name="arrow-back" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
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
        onScrollToIndexFailed={onScrollToIndexFailed}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + CARD_SPACING,
          offset: (CARD_WIDTH + CARD_SPACING) * index,
          index,
        })}
        contentContainerStyle={s.flatListContent}
      />

      {/* Dots */}
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
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 4,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  slideCard: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
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
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '62%',
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 2,
  },
  progressBg: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    gap: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    fontFamily: 'Vazir',
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#43A047',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  bookBtnText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});