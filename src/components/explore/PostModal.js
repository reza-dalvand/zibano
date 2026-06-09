// src/components/explore/PostModal.js
import React from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import StarRating from '../common/StarRating';
import GallerySlider from './GallerySlider';
import PostActionBar from './PostActionBar';
import { toPersianDigit } from '../../constants/exploreFilters';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 🎯 ابعاد ۸۰٪ × ۸۰٪ و موقعیت مرکزی
const MODAL_WIDTH = SCREEN_WIDTH * 0.95;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;
const MODAL_TOP = (SCREEN_HEIGHT - MODAL_HEIGHT) / 2;
const MODAL_LEFT = (SCREEN_WIDTH - MODAL_WIDTH) / 2;

export default function PostModal({ post, visible, onClose, onSave, onNavigateToProfile }) {
  const { colors } = useTheme();

  if (!post || !visible) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.businessName}\n${post.caption}\nرزرو از اپلیکیشن زیبانو`,
      });
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  const handleProfilePress = () => {
    onClose();
    onNavigateToProfile(post.businessId);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.backdrop}
      />

      {/* محتوای مدال با ابعاد ۸۰٪ × ۸۰٪ */}
      <View
        style={[
          styles.modal,
          {
            backgroundColor: colors.background,
            width: MODAL_WIDTH,
            height: MODAL_HEIGHT,
            top: MODAL_TOP,
            left: MODAL_LEFT,
          },
        ]}
      >
        {/* 🎯 هدر: آواتار + اطلاعات | دکمه بستن */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerUser}>
            <Image source={{ uri: post.businessLogo }} style={styles.avatar} />
            <View style={styles.headerInfo}>
              <Text
                style={[styles.businessName, { color: colors.textMain }]}
                numberOfLines={1}
              >
                {post.businessName}
              </Text>
              <TouchableOpacity
                onPress={handleProfilePress}
                style={styles.profileLink}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.profileLinkText, { color: colors.primary }]}
                >
                  نمایش پروفایل کسب‌وکار
                </Text>
                <Icon name="arrow-forward" size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* 🎯 دکمه بستن داخل هدر (بدون تداخل) */}
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.closeBtn,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
            activeOpacity={0.8}
          >
            <Icon name="close" size={20} color={colors.textMain} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* امتیاز ۵ ستاره */}
          <View style={styles.ratingContainer}>
            <StarRating value={post.rating} size="md" />
            <Text style={[styles.ratingNumber, { color: colors.textSecondary }]}>
              ({toPersianDigit(post.rating.toFixed(1))})
            </Text>
          </View>

          {/* اسلایدر عکس‌ها */}
          <GallerySlider gallery={post.gallery} containerWidth={MODAL_WIDTH - 40} />

          {/* دکمه‌های اکشن */}
          <PostActionBar post={post} onSave={onSave} onShare={handleShare} />

          {/* کپشن */}
          <View style={styles.captionSection}>
            <View style={styles.captionRow}>
              <Text style={[styles.captionUsername, { color: colors.textMain }]}>
                {post.businessName}
              </Text>
              <Text style={[styles.captionText, { color: colors.textMain }]}>
                {' '}{post.caption}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  modal: {
    position: 'absolute',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // 🎯 هدر با flexbox: آواتار+اطلاعات | دکمه بستن
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 10,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 2,
  },
  businessName: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  profileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  profileLinkText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    textDecorationLine: 'underline',
  },

  // 🎯 دکمه بستن ساده داخل هدر (نه absolute)
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // امتیاز
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ratingNumber: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },

  // کپشن
  captionSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  captionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  captionUsername: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    marginLeft: 6,
  },
  captionText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 20,
    flex: 1,
  },
});