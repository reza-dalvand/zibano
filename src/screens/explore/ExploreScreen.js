import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';

const { width } = Dimensions.get('window');
const THUMBNAIL_SIZE = width / 3; // سایز دقیق برای ۳ ستون

// دیتای نمونه با فیلدهای کامل‌تر برای پست اینستاگرامی
const MOCK_POSTS = [
  {
    id: 'p1',
    businessName: 'کلینیک زیبایی صدف',
    businessLogo: 'https://picsum.photos/100/100?random=1',
    caption: 'فیشیال تخصصی VIP با استفاده از بهترین متریال روز دنیا ✨\nبرای رزرو نوبت به لینک بایو مراجعه کنید.',
    likes: '۱,۲۴۰',
    comments: '۴۵',
    saved: false,
    liked: false,
    gallery: [
      'https://picsum.photos/800/800?random=1',
      'https://picsum.photos/800/800?random=2',
    ],
  },
  {
    id: 'p2',
    businessName: 'سالن زیبایی ماهرو',
    businessLogo: 'https://picsum.photos/100/100?random=2',
    caption: 'میکاپ و شینیون تخصصی عروس 👰‍♀',
    likes: '۸۹۰',
    comments: '۱۲',
    saved: true,
    liked: true,
    gallery: [
      'https://picsum.photos/800/800?random=3',
    ],
  },
  {
    id: 'p3',
    businessName: 'مرکز لیزر رویال',
    businessLogo: 'https://picsum.photos/100/100?random=3',
    caption: 'تخفیف ویژه جشنواره بهاره لیزر فول بادی 🌸',
    likes: '۳,۴۰۰',
    comments: '۱۲۰',
    saved: false,
    liked: false,
    gallery: [
      'https://picsum.photos/800/800?random=4',
      'https://picsum.photos/800/800?random=5',
      'https://picsum.photos/800/800?random=6',
    ],
  },
  {
    id: 'p4',
    businessName: 'کراتین سنتر النا',
    businessLogo: 'https://picsum.photos/100/100?random=4',
    caption: 'احیای ۱۰۰٪ موهای آسیب‌دیده با مواد برزیلی تضمینی.',
    likes: '۵۶۰',
    comments: '۸',
    saved: false,
    liked: false,
    gallery: [
      'https://picsum.photos/800/800?random=7',
    ],
  },
  {
    id: 'p5',
    businessName: 'ناخن کار مریم',
    businessLogo: 'https://picsum.photos/100/100?random=5',
    caption: 'طراحی مینیمال و ژلیش ناخن طبیعی 💅',
    likes: '۴۲۰',
    comments: '۵',
    saved: false,
    liked: false,
    gallery: [
      'https://picsum.photos/800/800?random=8',
    ],
  },
];

export default function ExploreScreen() {
  const { colors } = useTheme();
  
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activePost, setActivePost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // باز کردن مدال پست
  const openPost = (post) => {
    setCurrentImageIndex(0);
    setActivePost(post);
  };

  // آپدیت ایندکس اسلایدر عکس
  const onGalleryScroll = (e) => {
    const slideSize = e.nativeEvent.layoutMeasurement.width;
    const index = Math.round(e.nativeEvent.contentOffset.x / slideSize);
    setCurrentImageIndex(index);
  };

  // رندر کردن تامنیل‌ها (مربع‌های اکسپلور)
  const renderThumbnail = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => openPost(item)}
      style={styles.thumbnailContainer}
    >
      <Image source={{ uri: item.gallery[0] }} style={styles.thumbnailImage} />
      {/* آیکون آلبوم اگر پست چند عکسی است */}
      {item.gallery.length > 1 && (
        <View style={styles.carouselIcon}>
          <Icon name="collections" size={16} color="#FFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  // رندر مدال پست کامل (شبیه اینستاگرام)
  const renderPostModal = () => {
    if (!activePost) return null;

    return (
      <Modal visible={true} transparent={false} animationType="slide" onRequestClose={() => setActivePost(null)}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          
          {/* هدر پست (اطلاعات سالن و دکمه برگشت) */}
          <View style={[styles.postHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.postHeaderUser}>
              <Image source={{ uri: activePost.businessLogo }} style={styles.avatar} />
              <Text style={[styles.businessName, { color: colors.textMain }]}>{activePost.businessName}</Text>
            </View>
            <TouchableOpacity onPress={() => setActivePost(null)} style={styles.closeBtn}>
              <Icon name="close" size={26} color={colors.textMain} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* اسلایدر عکس‌ها */}
            <View style={styles.sliderContainer}>
              <FlatList
                data={activePost.gallery}
                keyExtractor={(item, index) => `img-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onGalleryScroll}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.fullImage} />
                )}
              />
              {/* نشانگر تعداد عکس */}
              {activePost.gallery.length > 1 && (
                <View style={styles.imageCounter}>
                  <Text style={styles.counterText}>
                    {currentImageIndex + 1} / {activePost.gallery.length}
                  </Text>
                </View>
              )}
            </View>

            {/* اکشن بار (لایک، کامنت، شیر، سیو) */}
            <View style={styles.actionBar}>
              <View style={styles.actionLeft}>
                <TouchableOpacity style={styles.actionIcon}>
                  <Icon 
                    name={activePost.liked ? "favorite" : "favorite-border"} 
                    size={28} 
                    color={activePost.liked ? "#E1306C" : colors.textMain} 
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon}>
                  <Icon name="chat-bubble-outline" size={26} color={colors.textMain} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon}>
                  <Icon name="near-me" size={28} color={colors.textMain} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.actionIcon}>
                <Icon 
                  name={activePost.saved ? "bookmark" : "bookmark-border"} 
                  size={28} 
                  color={activePost.saved ? colors.textMain : colors.textMain} 
                />
              </TouchableOpacity>
            </View>

            {/* بخش لایک‌ها و کپشن */}
            <View style={styles.captionSection}>
              <Text style={[styles.likesText, { color: colors.textMain }]}>
                {activePost.likes} پسند
              </Text>
              
              <View style={styles.captionRow}>
                <Text style={[styles.captionUsername, { color: colors.textMain }]}>
                  {activePost.businessName}
                </Text>
                <Text style={[styles.captionText, { color: colors.textMain }]}>
                  {activePost.caption}
                </Text>
              </View>

              <TouchableOpacity style={styles.viewCommentsBtn}>
                <Text style={[styles.viewCommentsText, { color: colors.textSecondary }]}>
                  مشاهده همه {activePost.comments} نظر
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </View>
      </Modal>
    );
  };

  return (
    <ScreenWrapper scrollable={false} padding={0}>
      {/* هدر صفحه */}
      <View style={[styles.header, { borderColor: colors.border, backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>اکسپلور</Text>
        <Icon name="search" size={24} color={colors.textMain} />
      </View>

      {/* گرید ۳ ستونه تصاویر */}
      <FlatList
        data={posts}
        numColumns={3}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // برای تب‌بار
        renderItem={renderThumbnail}
      />

      {/* مدال پست */}
      {renderPostModal()}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
  },
  /* استایل گرید اکسپلور */
  thumbnailContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    padding: 1, // فاصله ۱ پیکسلی بین عکس‌ها شبیه اینستاگرام
  },
  thumbnailImage: {
    flex: 1,
    backgroundColor: '#eee',
  },
  carouselIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  
  /* استایل مدال پست */
  modalContainer: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  postHeaderUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  businessName: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  closeBtn: {
    padding: 4,
  },
  sliderContainer: {
    height: width,
    width: width,
    position: 'relative',
  },
  fullImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIcon: {
    padding: 2,
  },
  captionSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  likesText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    marginBottom: 6,
  },
  captionRow: {
    flexDirection: 'row', // کنار هم قرار گرفتن نام کاربر و متن کپشن
    flexWrap: 'wrap',
  },
  captionUsername: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    marginRight: 6, // فاصله با متن کپشن
  },
  captionText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    lineHeight: 22,
  },
  viewCommentsBtn: {
    marginTop: 8,
  },
  viewCommentsText: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
});