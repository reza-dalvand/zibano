// src/components/manageBusiness/portfolio/PortfolioDetailModal.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import { toPersianDigit } from '../../../utils/numberUtils';
import { useModalBackHandler } from '../../../hooks/useModalBackHandler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_WIDTH = SCREEN_WIDTH * 0.94;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.88;
const GALLERY_HEIGHT = MODAL_HEIGHT * 0.42;

export default function PortfolioDetailModal({
  visible,
  onClose,
  portfolio,
  onEdit,
  services,
}) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const { onRequestClose } = useModalBackHandler(visible, onClose);

  // 🎯 Flag برای جلوگیری از تداخل اسکرول دستی و فلش‌ها
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // انیمیشن‌ها
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.85)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCurrentIndex(0);
    isScrollingRef.current = false;
  }, [portfolio, visible]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          bounciness: 8,
          speed: 18,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalScale, {
          toValue: 0.85,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!portfolio || !visible) return null;

  const images = portfolio.images || [portfolio.coverImage];

  // پیدا کردن نام خدمت مرتبط
  const getServiceName = () => {
    if (!portfolio.serviceId || !services) return null;
    const service = services.find((s) => s.id === portfolio.serviceId);
    return service?.name || null;
  };
  const serviceName = getServiceName();

  // 🎯 هندلر اسکرول - فقط وقتی کاربر دستی اسکرول می‌کند
  const handleScroll = (event) => {
    // اگر اسکرول از طرف فلش‌هاست، ignore کن
    if (isScrollingRef.current) return;

    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / MODAL_WIDTH);
    const clampedIndex = Math.max(0, Math.min(newIndex, images.length - 1));

    if (clampedIndex !== currentIndex) {
      setCurrentIndex(clampedIndex);
    }
  };

  // 🎯 هندلر پایان اسکرول دستی
  const handleMomentumScrollEnd = (event) => {
    if (isScrollingRef.current) {
      // اسکرول از فلش‌ها بود، flag را ریست کن
      isScrollingRef.current = false;
      return;
    }

    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / MODAL_WIDTH);
    const clampedIndex = Math.max(0, Math.min(newIndex, images.length - 1));
    setCurrentIndex(clampedIndex);
  };

  // 🎯 فلش قبلی - در RTL سمت راست
  const goToPrev = () => {
    if (currentIndex <= 0 || isScrollingRef.current) return;

    const prevIndex = currentIndex - 1;
    const offsetX = prevIndex * MODAL_WIDTH;

    // ست کردن flag قبل از اسکرول
    isScrollingRef.current = true;
    setCurrentIndex(prevIndex);

    // اسکرول با انیمیشن
    scrollViewRef.current?.scrollTo({
      x: offsetX,
      y: 0,
      animated: true,
    });

    // ریست flag بعد از اتمام انیمیشن
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 400);
  };

  // 🎯 فلش بعدی - در RTL سمت چپ
  const goToNext = () => {
    if (currentIndex >= images.length - 1 || isScrollingRef.current) return;

    const nextIndex = currentIndex + 1;
    const offsetX = nextIndex * MODAL_WIDTH;

    // ست کردن flag قبل از اسکرول
    isScrollingRef.current = true;
    setCurrentIndex(nextIndex);

    // اسکرول با انیمیشن
    scrollViewRef.current?.scrollTo({
      x: offsetX,
      y: 0,
      animated: true,
    });

    // ریست flag بعد از اتمام انیمیشن
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 400);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
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
        {/* ═══ هدر - با دکمه‌های بزرگ‌تر ═══ */}
        <View
          style={[
            s.header,
            {
              backgroundColor: colors.cardBackground,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={[
              s.headerBtn,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <Icon name="close" size={22} color={colors.textMain} />
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <Text
              style={[s.headerTitle, { color: colors.textMain }]}
              numberOfLines={1}
            >
              {portfolio.title || 'نمونه‌کار'}
            </Text>
            <Text style={[s.headerSubtitle, { color: colors.textSecondary }]}>
              {toPersianDigit(currentIndex + 1)} از {toPersianDigit(images.length)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              onClose();
              setTimeout(() => onEdit?.(portfolio), 300);
            }}
            style={[
              s.headerBtn,
              {
                backgroundColor: colors.primary + '15',
                borderColor: colors.primary + '40',
              },
            ]}
          >
            <Icon name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ═══ گالری تصاویر - با ScrollView ═══ */}
        <View style={s.galleryWrapper}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={MODAL_WIDTH}
            disableIntervalMomentum={false}
            contentContainerStyle={s.galleryContent}
          >
            {images.map((img, index) => (
              <Image
                key={`img-${index}`}
                source={{ uri: img }}
                style={s.galleryImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* 🎯 فلش قبلی - سمت راست (در RTL) - آیکون chevron-right */}
          {images.length > 1 && currentIndex > 0 && (
            <TouchableOpacity
              onPress={goToPrev}
              activeOpacity={0.85}
              style={[s.arrowBtn, s.arrowRight]}
            >
              <Icon name="chevron-left" size={28} color="#fff" />
            </TouchableOpacity>
          )}

          {/* 🎯 فلش بعدی - سمت چپ (در RTL) - آیکون chevron-left */}
          {images.length > 1 && currentIndex < images.length - 1 && (
            <TouchableOpacity
              onPress={goToNext}
              activeOpacity={0.85}
              style={[s.arrowBtn, s.arrowLeft]}
            >
              <Icon name="chevron-right" size={28} color="#fff" />
            </TouchableOpacity>
          )}

          {/* شمارنده تصاویر */}
          {images.length > 1 && (
            <View style={s.imageCounter}>
              <Icon name="photo-library" size={12} color="#fff" />
              <Text style={s.imageCounterText}>
                {toPersianDigit(images.length)} تصویر
              </Text>
            </View>
          )}
        </View>

        {/* ═══ Indicator Dots ═══ */}
        {images.length > 1 && (
          <View style={[s.indicators, { backgroundColor: colors.cardBackground }]}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[
                  s.dot,
                  {
                    backgroundColor:
                      i === currentIndex ? colors.primary : colors.border,
                    width: i === currentIndex ? 20 : 6,
                  },
                ]}
              />
            ))}
          </View>
        )}

        {/* ═══ محتوای اسکرولی ═══ */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
        >
          {/* عنوان و دسته‌بندی */}
          <View
            style={[
              s.contentCard,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            <View style={s.contentHeader}>
              <View
                style={[
                  s.contentIconBox,
                  { backgroundColor: colors.primary + '15' },
                ]}
              >
                <Icon name="photo-library" size={18} color={colors.primary} />
              </View>
              <View style={s.contentTitleCol}>
                <Text style={[s.contentTitle, { color: colors.textMain }]}>
                  {portfolio.title || 'نمونه‌کار'}
                </Text>
                {serviceName && (
                  <View style={s.serviceBadge}>
                    <Icon name="spa" size={11} color={colors.primary} />
                    <Text style={[s.serviceBadgeText, { color: colors.primary }]}>
                      {serviceName}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {portfolio.description ? (
              <Text style={[s.descriptionText, { color: colors.textSecondary }]}>
                {portfolio.description}
              </Text>
            ) : (
              <Text style={[s.noDescription, { color: colors.textSecondary }]}>
                توضیحاتی برای این نمونه‌کار ثبت نشده است
              </Text>
            )}
          </View>

          {/* راهنما */}
          <View
            style={[
              s.hintCard,
              {
                backgroundColor: colors.primary + '08',
                borderColor: colors.primary + '25',
              },
            ]}
          >
            <Icon name="info-outline" size={16} color={colors.primary} />
            <Text style={[s.hintText, { color: colors.textSecondary }]}>
              برای ویرایش این نمونه‌کار، روی آیکون ویرایش در بالای صفحه ضربه بزنید
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
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

  // ═══ هدر ═══
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },

  // ═══ گالری ═══
  galleryWrapper: {
    width: '100%',
    height: GALLERY_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  galleryContent: {
    // هیچ padding ای نمی‌خوایم
  },
  galleryImage: {
    width: MODAL_WIDTH,
    height: GALLERY_HEIGHT,
  },
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
    zIndex: 5,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },

  // 🎯 فلش‌های navigation
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  arrowLeft: {
    left: 12,
  },
  arrowRight: {
    right: 12,
  },

  // ═══ Indicators ═══
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },

  // ═══ محتوا ═══
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  contentCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  contentIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentTitleCol: {
    flex: 1,
    gap: 6,
  },
  contentTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#A88B7D15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  serviceBadgeText: {
    fontSize: 11,
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