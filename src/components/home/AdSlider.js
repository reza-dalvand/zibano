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
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 60;
const CARD_SPACING = 10;
const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function AdSlider({ ads = [], onPress, autoPlayInterval = 4000 }) {
  const { colors } = useTheme();
  const navigation = useNavigation(); // ✅ اضافه شد: تعریف navigation
  
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const autoPlayRef = useRef(null);

  // 🎯 معکوس کردن آرایه برای تغییر جهت اسکرول
  const reversedAds = [...ads].reverse();

  useEffect(() => {
    if (ads.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const nextIndex = (prev + 1) % ads.length;
          // 🎯 اسکرول به اسلاید بعدی با ایندکس معکوس
          const reversedNextIndex = ads.length - 1 - nextIndex;
          flatListRef.current?.scrollToOffset({
            offset: reversedNextIndex * (CARD_WIDTH + CARD_SPACING),
            animated: true,
          });
          return nextIndex;
        });
      }, autoPlayInterval);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [ads.length, autoPlayInterval]); // ✅ اضافه شدن autoPlayInterval به وابستگی‌ها

  useEffect(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: autoPlayInterval,
      useNativeDriver: false,
    }).start();
  }, [activeIndex, autoPlayInterval]); // ✅ اضافه شدن autoPlayInterval به وابستگی‌ها

  // 🎯 هندلر اسکرول با محاسبه ایندکس معکوس
  const onScroll = (e) => {
    const slideSize = e.nativeEvent.layoutMeasurement?.width || CARD_WIDTH + CARD_SPACING;
    if (slideSize === 0) return;
    const reversedIndex = Math.round(
      e.nativeEvent.contentOffset.x / slideSize
    );
    // 🎯 تبدیل ایندکس معکوس به ایندکس واقعی
    const actualIndex = reversedAds.length - 1 - reversedIndex;
    setActiveIndex(Math.max(0, Math.min(actualIndex, ads.length - 1)));
  };

  // 🎯 رفتن به اسلاید با ایندکس معکوس
  const goToSlide = (index) => {
    const reversedIndex = ads.length - 1 - index;
    flatListRef.current?.scrollToOffset({
      offset: reversedIndex * (CARD_WIDTH + CARD_SPACING),
      animated: true,
    });
    setActiveIndex(index);
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
        <TouchableOpacity
          onPress={() => navigation.navigate('AllAds')} // ✅ حالا navigation به درستی کار می‌کند
          style={s.seeAllBtn}
          activeOpacity={0.7}
        >
          <Text style={[s.seeAllText, { color: colors.primary }]}>
            همه
          </Text>
          <Icon name="chevron-left" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* 🎯 FlatList با آرایه معکوس شده */}
      <FlatList
        ref={flatListRef}
        data={reversedAds}
        renderItem={({ item }) => {
          const actualIndex = ads.findIndex((a) => a.id === item.id);
          const isActive = actualIndex === activeIndex;
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
              <View style={s.gradientOverlay} />
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
                  {/* 🎯 دکمه رزرو نوبت با سایه کمرنگ‌تر */}
                  <TouchableOpacity
                    onPress={() => onPress?.(item)}
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
        // 🎯 شروع از انتهای لیست معکوس (= ابتدای لیست واقعی)
        initialScrollIndex={reversedAds.length - 1}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + CARD_SPACING,
          offset: (CARD_WIDTH + CARD_SPACING) * index,
          index,
        })}
        contentContainerStyle={s.flatListContent}
      />

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
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
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
  badgeBox: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
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
  // 🎯 دکمه رزرو نوبت با سایه کمرنگ‌تر
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#43A047',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    // 🎯 سایه کمرنگ‌تر
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,  // ✅ کاهش از 0.25 به 0.15
    shadowRadius: 4,      // ✅ کاهش از 8 به 4
    elevation: 3,         // ✅ کاهش از 5 به 3
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