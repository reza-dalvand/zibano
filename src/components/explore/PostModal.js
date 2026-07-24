// src/components/explore/PostModal.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  Dimensions,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import StarRating from '../common/StarRating';
import GallerySlider from './GallerySlider';
import { toPersianDigit } from '../../constants/exploreFilters';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_WIDTH = SCREEN_WIDTH * 0.92;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.92;
const MODAL_TOP = (SCREEN_HEIGHT - MODAL_HEIGHT) / 2;
const MODAL_LEFT = (SCREEN_WIDTH - MODAL_WIDTH) / 2;

export default function PostModal({
  post,
  visible,
  onClose,
  onSave,
  onNavigateToProfile,
}) {
  const { colors, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.85)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;

  const [isSaved, setIsSaved] = useState(post?.saved || false);

  // ✅ تشخیص نوع پست (مجله یا کسب‌وکار)
  const isMagazine = post?.source === 'magazine';

  useEffect(() => {
    if (post) {
      setIsSaved(post.saved);
    }
  }, [post]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(modalScale, { toValue: 1, bounciness: 8, speed: 18, useNativeDriver: true }),
        Animated.timing(modalOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(contentTranslateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(modalScale, { toValue: 0.85, duration: 200, useNativeDriver: true }),
        Animated.timing(modalOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(contentTranslateY, { toValue: 30, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!post) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `✨ ${post.businessName}\n${post.caption}\n📱 مشاهده در اپلیکیشن زیبانو`,
      });
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  const handleProfilePress = () => {
    onClose();
    setTimeout(() => {
      onNavigateToProfile?.(post.businessId);
    }, 300);
  };

  const handleSave = () => {
    const newState = !isSaved;
    setIsSaved(newState);
    onSave?.(post.id);
  };

  // ✅ هندلر رزرو نوبت - هدایت به صفحه کسب‌وکار
  const handleBooking = () => {
    onClose();
    setTimeout(() => {
      onNavigateToProfile?.(post.businessId);
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.65)',
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modal,
          {
            backgroundColor: colors.background,
            width: MODAL_WIDTH,
            height: MODAL_HEIGHT,
            top: MODAL_TOP,
            left: MODAL_LEFT,
            opacity: modalOpacity,
            transform: [{ scale: modalScale }],
            borderColor: colors.border,
          },
        ]}
      >
        {/* هدر مدال */}
        <View
          style={[
            styles.modalHeader,
            {
              backgroundColor: colors.cardBackground,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.headerActionBtn,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
            activeOpacity={0.7}
          >
            <Icon name="close" size={22} color={colors.textMain} />
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            onPress={handleShare}
            style={[
              styles.headerActionBtn,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
            activeOpacity={0.7}
          >
            <Icon name="share" size={20} color={colors.textMain} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            style={[
              styles.headerActionBtn,
              {
                backgroundColor: isSaved ? colors.primary + '20' : colors.background,
                borderColor: isSaved ? colors.primary : colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Icon
              name={isSaved ? 'bookmark' : 'bookmark-border'}
              size={22}
              color={isSaved ? colors.primary : colors.textMain}
            />
          </TouchableOpacity>
        </View>

        {/* اسلایدر تصاویر */}
        <View style={styles.galleryWrapper}>
          <GallerySlider gallery={post.gallery} containerWidth={MODAL_WIDTH} />

          {/* تگ منبع روی گالری (فقط برای مجله) */}
          {isMagazine && (
            <View style={styles.sourceBadgeOnGallery}>
              <Icon name="auto-awesome" size={12} color="#fff" />
              <Text style={styles.sourceBadgeText}>مجله زیبانو</Text>
            </View>
          )}

          {post.gallery && post.gallery.length > 1 && (
            <View
              style={[
                styles.imageCounter,
                { backgroundColor: 'rgba(0, 0, 0, 0.65)' },
              ]}
            >
              <Icon name="arrow-forward-ios" size={12} color="#fff" />
              <Text style={styles.imageCounterText}>
                {toPersianDigit(post.gallery.length)} تصویر
              </Text>
            </View>
          )}
        </View>

        {/* اطلاعات کسب‌وکار - فقط برای پست‌های کسب‌وکار */}
        {!isMagazine && (
          <TouchableOpacity
            onPress={handleProfilePress}
            style={[
              styles.businessInfoCard,
              {
                backgroundColor: colors.cardBackground,
                borderBottomColor: colors.border,
              },
            ]}
            activeOpacity={0.85}
          >
            <Image source={{ uri: post.businessLogo }} style={styles.bizAvatar} />
            <View style={styles.bizInfoCol}>
              <View style={styles.bizNameRow}>
                <Text style={[styles.bizName, { color: colors.textMain }]} numberOfLines={1}>
                  {post.businessName}
                </Text>
                <Icon name="verified" size={16} color="#4FC3F7" />
              </View>
              <Text style={[styles.bizSubtitle, { color: colors.primary }]}>
                مشاهده پروفایل کسب‌وکار
              </Text>
            </View>
            <Icon name="chevron-left" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* هدر مجله زیبانو - فقط برای مجله */}
        {isMagazine && (
          <View
            style={[
              styles.magazineInfoCard,
              {
                backgroundColor: colors.cardBackground,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={[styles.magazineIconBox, { backgroundColor: '#9C27B020' }]}>
              <Icon name="auto-awesome" size={22} color="#9C27B0" />
            </View>
            <View style={styles.bizInfoCol}>
              <View style={styles.bizNameRow}>
                <Text style={[styles.bizName, { color: colors.textMain }]} numberOfLines={1}>
                  {post.businessName}
                </Text>
              </View>
              <Text style={[styles.magazineSubtitle, { color: '#9C27B0' }]}>
                مقاله و محتوای آموزشی
              </Text>
            </View>
          </View>
        )}

        {/* محتوای اسکرولی */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={{
            transform: [{ translateY: contentTranslateY }],
          }}
        >
          {/* ⭐ امتیاز - فقط برای کسب‌وکار */}
          {!isMagazine && post.rating > 0 && (
            <View
              style={[
                styles.ratingContainer,
                { backgroundColor: colors.cardBackground, borderColor: colors.border },
              ]}
            >
              <View style={styles.ratingLeft}>
                <Icon name="star" size={20} color="#FFC107" />
                <Text style={[styles.ratingNumber, { color: colors.textMain }]}>
                  {toPersianDigit(post.rating?.toFixed(1) || '0')}
                </Text>
                <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>
                  از {toPersianDigit(5)}
                </Text>
              </View>
              <View style={[styles.ratingDivider, { backgroundColor: colors.border }]} />
              <StarRating value={post.rating} size="md" />
            </View>
          )}

          {/* 📝 کپشن / توضیحات */}
          <View style={[styles.captionCard, { borderColor: colors.border }]}>
            <View style={styles.captionHeader}>
              <View
                style={[
                  styles.captionIconBox,
                  { backgroundColor: isMagazine ? '#9C27B015' : colors.primary + '15' },
                ]}
              >
                <Icon
                  name={isMagazine ? 'article' : 'description'}
                  size={16}
                  color={isMagazine ? '#9C27B0' : colors.primary}
                />
              </View>
              <Text style={[styles.captionLabel, { color: colors.textSecondary }]}>
                {isMagazine ? 'متن مقاله' : 'توضیحات'}
              </Text>
            </View>
            <Text style={[styles.captionText, { color: colors.textMain }]}>
              {post.caption}
            </Text>
          </View>

          {/* 🏷️ تگ‌های خدمت - فقط برای کسب‌وکار */}
          {!isMagazine && (
            <View style={styles.tagsSection}>
              <Text style={[styles.tagsLabel, { color: colors.textSecondary }]}>
                خدمات مرتبط
              </Text>
              <View style={styles.tagsRow}>
                <View
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: colors.primary + '15',
                      borderColor: colors.primary + '30',
                    },
                  ]}
                >
                  <Icon name="spa" size={12} color={colors.primary} />
                  <Text style={[styles.tagText, { color: colors.primary }]}>
                    فیشیال تخصصی
                  </Text>
                </View>
                <View
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: colors.primary + '15',
                      borderColor: colors.primary + '30',
                    },
                  ]}
                >
                  <Icon name="auto-awesome" size={12} color={colors.primary} />
                  <Text style={[styles.tagText, { color: colors.primary }]}>
                    ماسک طلا
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* 💡 راهنما */}
          <View
            style={[
              styles.hintCard,
              {
                backgroundColor: isMagazine ? '#9C27B008' : colors.primary + '08',
                borderColor: isMagazine ? '#9C27B025' : colors.primary + '25',
              },
            ]}
          >
            <Icon
              name={isMagazine ? 'menu-book' : 'lightbulb'}
              size={18}
              color={isMagazine ? '#9C27B0' : colors.primary}
            />
            <Text style={[styles.hintText, { color: colors.textSecondary }]}>
              {isMagazine
                ? 'این مقاله توسط تیم تحریریه مجله زیبانو تهیه شده است'
                : 'با رزرو نوبت از این کسب‌وکار، از تخفیف‌های ویژه بهره‌مند شوید'}
            </Text>
          </View>

          {/* فضای خالی برای دکمه CTA */}
          {!isMagazine && <View style={{ height: 100 }} />}
        </Animated.ScrollView>

        {/* 🎯 دکمه CTA پایین - فقط برای کسب‌وکارها نمایش داده می‌شود */}
        {!isMagazine && (
          <View
            style={[
              styles.ctaContainer,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleBooking}
              style={[styles.ctaButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.9}
            >
              <View style={styles.ctaIconBox}>
                <Icon name="event-available" size={22} color={colors.primary} />
              </View>
              <View style={styles.ctaTextCol}>
                <Text style={styles.ctaTitle}>رزرو نوبت</Text>
                <Text style={styles.ctaSubtitle}>از {post.businessName}</Text>
              </View>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    position: 'absolute',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  galleryWrapper: {
    width: '100%',
    height: '40%',
    position: 'relative',
    backgroundColor: '#000',
  },
  sourceBadgeOnGallery: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(156, 39, 176, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sourceBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  businessInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  magazineInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
  },
  magazineIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  magazineSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
  bizAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bizInfoCol: {
    flex: 1,
    gap: 4,
  },
  bizNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bizName: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    flexShrink: 1,
  },
  bizSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingNumber: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
  },
  ratingLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  ratingDivider: {
    width: 1,
    height: 24,
  },
  captionCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 10,
  },
  captionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  captionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionLabel: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  captionText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    lineHeight: 24,
    textAlign: 'justify',
  },
  tagsSection: {
    marginBottom: 16,
    gap: 8,
  },
  tagsLabel: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    marginBottom: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: '10%',
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 20,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaTextCol: {
    flex: 1,
    gap: 2,
  },
  ctaTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  ctaSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontFamily: 'Vazir',
  },
});