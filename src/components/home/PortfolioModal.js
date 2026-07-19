// src/components/home/PortfolioModal.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Avatar from '../common/Avatar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_WIDTH = SCREEN_WIDTH * 0.94;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.90;
const GALLERY_HEIGHT = MODAL_HEIGHT * 0.42;

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function PortfolioModal({
  visible,
  onClose,
  portfolio,
  // 🆕 پروپ‌های جدید
  businessName,
  businessLogo,
  ownerName,
  rating,
  reviewsCount,
}) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // ═══════════ انیمیشن‌ها ═══════════
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.85)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    setCurrentIndex(0);
  }, [portfolio, visible]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(modalScale, { toValue: 1, bounciness: 8, speed: 18, useNativeDriver: true }),
        Animated.timing(modalOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(contentTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(modalScale, { toValue: 0.85, duration: 200, useNativeDriver: true }),
        Animated.timing(modalOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(contentTranslateY, { toValue: 40, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!portfolio || !visible) return null;

  const images = portfolio.images || [portfolio.coverImage];
  // 🎯 معکوس کردن آرایه برای حل مشکل RTL
  const reversedImages = [...images].reverse();

  // 🎯 هندلر اسکرول - تبدیل ایندکس معکوس به ایندکس واقعی
  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement?.width || MODAL_WIDTH;
    if (slideSize === 0) return;
    const reversedIndex = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    const actualIndex = reversedImages.length - 1 - reversedIndex;
    setCurrentIndex(Math.max(0, Math.min(actualIndex, images.length - 1)));
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[s.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Modal Container */}
      <Animated.View
        style={[
          s.modal,
          {
            backgroundColor: colors.background,
            width: MODAL_WIDTH,
            height: MODAL_HEIGHT,
            top: (SCREEN_HEIGHT - MODAL_HEIGHT) / 2,
            left: (SCREEN_WIDTH - MODAL_WIDTH) / 2,
            opacity: modalOpacity,
            transform: [{ scale: modalScale }],
            borderColor: colors.border,
          },
        ]}
      >
        {/* ═══════ دکمه بستن شناور ═══════ */}
        <TouchableOpacity
          onPress={onClose}
          style={[s.closeFloatingBtn, { backgroundColor: 'rgba(0,0,0,0.55)' }]}
          activeOpacity={0.8}
        >
          <Icon name="close" size={22} color="#fff" />
        </TouchableOpacity>

        {/* ═══════ شمارنده تصاویر ═══════ */}
        {images.length > 1 && (
          <View style={s.imageCounter}>
            <Icon name="photo-library" size={12} color="#fff" />
            <Text style={s.imageCounterText}>
              {toPersianDigit(currentIndex + 1)} از {toPersianDigit(images.length)}
            </Text>
          </View>
        )}

        {/* ═══════ گالری تصاویر ═══════ */}
        <View style={s.galleryWrapper}>
          <FlatList
            ref={flatListRef}
            data={reversedImages}
            keyExtractor={(_, i) => `img-${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            initialScrollIndex={reversedImages.length - 1}
            getItemLayout={(data, index) => ({
              length: MODAL_WIDTH,
              offset: MODAL_WIDTH * index,
              index,
            })}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={s.galleryImage}
                resizeMode="cover"
              />
            )}
          />

          {/* گرادیان پایین گالری */}
          <View style={s.galleryGradient} />
        </View>

        {/* ═══════ Indicator Dots ═══════ */}
        {images.length > 1 && (
          <View style={s.indicators}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[
                  s.dot,
                  {
                    backgroundColor: i === currentIndex ? colors.primary : colors.border,
                    width: i === currentIndex ? 20 : 6,
                  },
                ]}
              />
            ))}
          </View>
        )}

        {/* ═══════ محتوای اسکرولی ═══════ */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
          style={{ transform: [{ translateY: contentTranslateY }] }}
        >
          {/* ═══════ کارت صاحب کسب‌وکار ═══════ */}
          {businessName && (
            <View style={[s.businessCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <Avatar
                uri={businessLogo}
                name={businessName}
                size="md"
                showBorder
              />
              <View style={s.businessInfo}>
                <View style={s.businessNameRow}>
                  <Text style={[s.businessName, { color: colors.textMain }]} numberOfLines={1}>
                    {businessName}
                  </Text>
                  <Icon name="verified" size={16} color="#4FC3F7" />
                </View>
                {ownerName && (
                  <View style={s.ownerRow}>
                    <Icon name="person" size={13} color={colors.textSecondary} />
                    <Text style={[s.ownerName, { color: colors.textSecondary }]} numberOfLines={1}>
                      مدیریت: {ownerName}
                    </Text>
                  </View>
                )}
                {rating > 0 && (
                  <View style={s.ratingRow}>
                    <Icon name="star" size={14} color="#FFC107" />
                    <Text style={[s.ratingText, { color: colors.textMain }]}>
                      {toPersianDigit(rating.toFixed(1))}
                    </Text>
                    {reviewsCount > 0 && (
                      <Text style={[s.reviewsText, { color: colors.textSecondary }]}>
                        ({toPersianDigit(reviewsCount)} نظر)
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <Icon name="chevron-left" size={22} color={colors.textSecondary} />
            </View>
          )}

          {/* ═══════ عنوان نمونه‌کار ═══════ */}
          <View style={[s.titleCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={s.titleHeader}>
              <View style={[s.titleIconBox, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="auto-awesome" size={18} color={colors.primary} />
              </View>
              <Text style={[s.titleHeaderLabel, { color: colors.textSecondary }]}>
                عنوان نمونه‌کار
              </Text>
            </View>
            <Text style={[s.titleText, { color: colors.textMain }]}>
              {portfolio.title || 'نمونه‌کار'}
            </Text>
          </View>

          {/* ═══════ توضیحات نمونه‌کار ═══════ */}
          <View style={[s.descriptionCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={s.descriptionHeader}>
              <View style={[s.descriptionIconBox, { backgroundColor: '#2196F315' }]}>
                <Icon name="description" size={18} color="#2196F3" />
              </View>
              <Text style={[s.descriptionHeaderLabel, { color: colors.textSecondary }]}>
                توضیحات
              </Text>
            </View>
            {portfolio.description ? (
              <Text style={[s.descriptionText, { color: colors.textMain }]}>
                {portfolio.description}
              </Text>
            ) : (
              <Text style={[s.noDescription, { color: colors.textSecondary }]}>
                توضیحاتی برای این نمونه‌کار ثبت نشده است
              </Text>
            )}
          </View>

          {/* ═══════ نکات و راهنما ═══════ */}
          <View style={[s.hintCard, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '25' }]}>
            <Icon name="lightbulb" size={18} color={colors.primary} />
            <Text style={[s.hintText, { color: colors.textSecondary }]}>
              برای مشاهده نمونه‌کارهای بیشتر، به صفحه کسب‌وکار مراجعه کنید و از گالری کامل دیدن نمایید
            </Text>
          </View>
        </Animated.ScrollView>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  modal: {
    position: 'absolute',
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 15,
  },
  // ═══════ دکمه بستن شناور ═══════
  closeFloatingBtn: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  // ═══════ شمارنده تصاویر ═══════
  imageCounter: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    zIndex: 10,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  // ═══════ گالری ═══════
  galleryWrapper: {
    width: '100%',
    height: GALLERY_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  galleryImage: {
    width: MODAL_WIDTH,
    height: GALLERY_HEIGHT,
  },
  galleryGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  // ═══════ Indicators ═══════
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  // ═══════ محتوا ═══════
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingTop: 12,
  },
  // ═══════ کارت کسب‌وکار ═══════
  businessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  businessInfo: {
    flex: 1,
    gap: 3,
  },
  businessNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  businessName: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    flexShrink: 1,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerName: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  reviewsText: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  // ═══════ کارت عنوان ═══════
  titleCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleHeaderLabel: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  titleText: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    lineHeight: 25,
  },
  // ═══════ کارت توضیحات ═══════
  descriptionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descriptionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionHeaderLabel: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 23,
    textAlign: 'justify',
  },
  noDescription: {
    fontSize: 12,
    fontFamily: 'Vazir',
    fontStyle: 'italic',
  },
  // ═══════ کارت راهنما ═══════
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  hintText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 19,
  },
});