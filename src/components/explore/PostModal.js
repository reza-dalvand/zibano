// src/components/explore/PostModal.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  Dimensions,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import StarRating from '../common/StarRating';
import GallerySlider from './GallerySlider';
import { toPersianDigit } from '../../utils/numberUtils';
import FavoriteButton from '../common/FavoriteButton';
import { useModalBackHandler } from '../../hooks/useModalBackHandler';

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

  // 🆕 انیمیشن‌های فلش‌های اسکرول
  const scrollHintOpacity = useRef(new Animated.Value(0)).current;

  const [isSaved, setIsSaved] = useState(post?.saved || false);
  const isMagazine = post?.source === 'magazine';
  const { onRequestClose } = useModalBackHandler(visible, onClose);

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

      // 🆕 نمایش فلش‌های اسکرول بعد از باز شدن مدال و سپس محو شدن
      const media = post?.gallery || post?.images || [];
      if (media.length > 1) {
        setTimeout(() => {
          Animated.sequence([
            Animated.timing(scrollHintOpacity, { toValue: 0.9, duration: 400, useNativeDriver: true }),
            Animated.delay(1800),
            Animated.timing(scrollHintOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
          ]).start();
        }, 500);
      }
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(modalScale, { toValue: 0.85, duration: 200, useNativeDriver: true }),
        Animated.timing(modalOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(contentTranslateY, { toValue: 30, duration: 200, useNativeDriver: true }),
      ]).start();
      scrollHintOpacity.setValue(0);
    }
  }, [visible, post]);

  if (!post) return null;

  const media = post.gallery || post.images || [];

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

  // 🆕 هندلر رزرو - رفتن به صفحه کسب‌وکار
  const handleBooking = () => {
    onClose();
    setTimeout(() => {
      onNavigateToProfile?.(post.businessId);
    }, 300);
  };

  const heroBadges = [];
  if (isMagazine) {
    heroBadges.push({
      container: styles.magazineBadge,
      icon: 'auto-awesome',
      iconSize: 12,
      iconColor: '#fff',
      text: 'مجله زیبانو',
      textStyle: styles.magazineBadgeText,
    });
  }
  if (media.length > 1) {
    heroBadges.push({
      container: styles.imageCounterBadge,
      icon: 'arrow-forward-ios',
      iconSize: 12,
      iconColor: '#fff',
      text: `${toPersianDigit(media.length)} تصویر`,
      textStyle: styles.imageCounterText,
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onRequestClose}
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
          <FavoriteButton
            isFavorite={isSaved}
            onPress={handleSave}
            size={22}
            color={colors.textMain}
            activeColor={colors.primary}
            style={[
              styles.headerActionBtn,
              {
                backgroundColor: isSaved ? colors.primary + '20' : colors.background,
                borderColor: isSaved ? colors.primary : colors.border,
              },
            ]}
          />
        </View>

        {/* 🆕 گالری تصاویر با فلش‌های اسکرول */}
        <View style={styles.galleryWrapper}>
          <GallerySlider gallery={media} containerWidth={MODAL_WIDTH} />

          {/* 🆕 فلش‌های راهنمای اسکرول - فقط وقتی بیش از یک تصویر وجود دارد */}
          {media.length > 1 && (
            <Animated.View
              style={[styles.scrollHintsContainer, { opacity: scrollHintOpacity }]}
              pointerEvents="none"
            >
              {/* فلش راست (شروع اسکرول) */}
              <View style={styles.scrollHintRight}>
                <View style={styles.scrollHintPill}>
                  <Icon name="chevron-right" size={18} color="#fff" />
                </View>
              </View>
              {/* فلش چپ (ادامه اسکرول) */}
              <View style={styles.scrollHintLeft}>
                <View style={styles.scrollHintPill}>
                  <Icon name="chevron-left" size={18} color="#fff" />
                </View>
              </View>
            </Animated.View>
          )}
        </View>

        {/* اطلاعات کسب‌وکار - فقط برای پست‌های کسب‌وکار */}
        {/* 🆕 ساختار جدید با دکمه رزرو */}
        {!isMagazine && (
          <View
            style={[
              styles.businessInfoCard,
              {
                backgroundColor: colors.cardBackground,
                borderBottomColor: colors.border,
              },
            ]}
          >
            {/* قسمت اطلاعات کسب‌وکار (قابل کلیک برای پروفایل) */}
            <TouchableOpacity
              onPress={handleProfilePress}
              activeOpacity={0.85}
              style={styles.bizInfoTouchable}
            >
              <Image source={{ uri: post.businessLogo }} style={styles.bizAvatar} />
              <View style={styles.bizInfoCol}>
                <View style={styles.bizNameRow}>
                  <Text style={[styles.bizName, { color: colors.textMain }]} numberOfLines={1}>
                    {post.businessName}
                  </Text>
                  <Icon name="verified" size={16} color="#4FC3F7" />
                </View>
                <Text style={[styles.bizSubtitle, { color: colors.textSecondary }]}>
                  مشاهده پروفایل
                </Text>
              </View>
            </TouchableOpacity>

            {/* 🆕 دکمه رزرو نوبت */}
            <TouchableOpacity
              onPress={handleBooking}
              activeOpacity={0.85}
              style={styles.bookBtn}
            >
              <Icon name="event-available" size={16} color="#fff" />
              <Text style={styles.bookBtnText}>رزرو نوبت</Text>
            </TouchableOpacity>
          </View>
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
        </Animated.ScrollView>

        {/* ❌ CTA پایین حذف شد */}
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
  // 🆕 فلش‌های راهنمای اسکرول
  scrollHintsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  scrollHintLeft: {
    alignItems: 'flex-start',
  },
  scrollHintRight: {
    alignItems: 'flex-end',
  },
  scrollHintPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  magazineBadge: {
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
  magazineBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  imageCounterBadge: {
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
  // 🆕 کارت کسب‌وکار با دکمه رزرو
  businessInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderBottomWidth: 1,
  },
  bizInfoTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
    gap: 3,
  },
  bizNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bizName: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    flexShrink: 1,
  },
  bizSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  // 🆕 دکمه رزرو سبز
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#43A047',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#43A047',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
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
    marginBottom: 16,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 20,
  },
  // ❌ استایل‌های CTA حذف شدند
});