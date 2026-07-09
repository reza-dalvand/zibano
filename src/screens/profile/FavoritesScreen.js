// src/screens/profile/FavoritesScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
// 🆕 اضافه شدن PostModal برای نمایش پست ویترین
import { PostModal } from '../../components/explore';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// ❌ MOCK_FAVORITE_SERVICES حذف شد - تب خدمات دیگر وجود ندارد

const MOCK_FAVORITE_BUSINESSES = [
  {
    id: 'b1',
    name: 'سالن زیبایی نیلارام',
    category: 'کلینیک پوست و مو',
    city: 'تهران، سعادت‌آباد',
    rating: 4.9,
    logo: 'https://picsum.photos/150?random=21',
  },
  {
    id: 'b2',
    name: 'مرکز لیزر رویال',
    category: 'مرکز لیزر',
    city: 'تهران، شهرک غرب',
    rating: 4.8,
    logo: 'https://picsum.photos/150?random=25',
  },
];

// 🎯 داده‌های پست‌های ویترین با ساختار سازگار با PostModal
const MOCK_FAVORITE_POSTS = [
  {
    id: 'p1',
    businessName: 'کلینیک زیبایی صدف',
    businessLogo: 'https://picsum.photos/100/100?random=1',
    businessId: 'b1',
    rating: 4.8,
    caption: 'فیشیال VIP با ماسک طلا ✨ بهترین خدمات پوست صورت',
    saved: true,
    gallery: [
      'https://picsum.photos/800/800?random=101',
      'https://picsum.photos/800/800?random=102',
    ],
  },
  {
    id: 'p2',
    businessName: 'سالن زیبایی ماهرو',
    businessLogo: 'https://picsum.photos/100/100?random=2',
    businessId: 'b2',
    rating: 4.6,
    caption: 'میکاپ عروس اروپایی 👰‍♀️ سبک مینیمال و طبیعی',
    saved: true,
    gallery: [
      'https://picsum.photos/800/800?random=103',
      'https://picsum.photos/800/800?random=104',
      'https://picsum.photos/800/800?random=105',
    ],
  },
  {
    id: 'p3',
    businessName: 'مرکز لیزر رویال',
    businessLogo: 'https://picsum.photos/100/100?random=3',
    businessId: 'b3',
    rating: 4.9,
    caption: 'لیزر فول بادی با جدیدترین دستگاه ۲۰۲۴ 🌸',
    saved: true,
    gallery: ['https://picsum.photos/800/800?random=106'],
  },
  {
    id: 'p4',
    businessName: 'ناخن گالری پریا',
    businessLogo: 'https://picsum.photos/100/100?random=9',
    businessId: 'b9',
    rating: 4.4,
    caption: 'طراحی ناخن با سبک ژورنالی و مینیمال 💖',
    saved: true,
    gallery: [
      'https://picsum.photos/800/800?random=107',
      'https://picsum.photos/800/800?random=108',
    ],
  },
];

// 🎯 فقط ۲ تب باقی می‌ماند (خدمات حذف شد)
const TABS = [
  { id: 'businesses', label: 'کسب‌وکار', icon: 'store' },
  { id: 'posts', label: 'ویترین', icon: 'collections' },
];

export default function FavoritesScreen({ navigation }) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('businesses');
  // 🆕 state برای پست فعال در مدال ویترین
  const [activePost, setActivePost] = useState(null);

  const counts = useMemo(
    () => ({
      businesses: MOCK_FAVORITE_BUSINESSES.length,
      // ❌ services حذف شد
      posts: MOCK_FAVORITE_POSTS.length,
    }),
    []
  );

  // 🎯 هندلر ذخیره/حذف پست از علاقه‌مندی
  const handleSavePost = (postId) => {
    // در فاز واقعی، اینجا به API یا Context متصل می‌شود
    // فعلاً فقط مدال را می‌بندیم اگر پست حذف شد
    if (activePost?.id === postId) {
      setActivePost(null);
    }
  };

  // 🎯 هندلر رفتن به پروفایل کسب‌وکار از مدال
  const handleNavigateToProfile = (businessId) => {
    setActivePost(null);
    navigation.navigate('Home', {
      screen: 'BusinessDetails',
      params: { businessId },
    });
  };

  const renderBusinesses = () => {
    if (MOCK_FAVORITE_BUSINESSES.length === 0) {
      return (
        <EmptyState
          icon="🏪"
          title="هنوز کسب‌وکاری ذخیره نکرده‌اید"
          description="با تپ کردن روی آیکون قلب در صفحه کسب‌وکارها، آن‌ها را به علاقه‌مندی‌ها اضافه کنید"
          actionLabel="مشاهده کسب‌وکارها"
          onAction={() => navigation.navigate('Home')}
        />
      );
    }
    return (
      <View style={s.businessList}>
        {MOCK_FAVORITE_BUSINESSES.map((biz) => (
          <Card
            key={biz.id}
            variant="elevated"
            padding={14}
            radius={16}
            style={s.bizCard}
          >
            <View style={s.bizRow}>
              <Image source={{ uri: biz.logo }} style={s.bizLogo} />
              <View style={s.bizInfo}>
                <Text
                  style={[s.bizName, { color: colors.textMain }]}
                  numberOfLines={1}
                >
                  {biz.name}
                </Text>
                <Text
                  style={[s.bizCategory, { color: colors.primary }]}
                  numberOfLines={1}
                >
                  {biz.category}
                </Text>
                <View style={s.bizMeta}>
                  <Icon
                    name="location-on"
                    size={12}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[s.bizCity, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {biz.city}
                  </Text>
                  <View style={s.dot} />
                  <Icon name="star" size={12} color="#FFC107" />
                  <Text style={[s.bizRating, { color: colors.textMain }]}>
                    {toPersianDigit(biz.rating)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={s.removeBtn}>
                <Icon name="favorite" size={22} color="#E91E63" />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>
    );
  };

  // ❌ renderServices حذف شد

  const renderPosts = () => {
    if (MOCK_FAVORITE_POSTS.length === 0) {
      return (
        <EmptyState
          icon="🖼️"
          title="هنوز پستی ذخیره نکرده‌اید"
          description="پست‌های جالب ویترین را ذخیره کنید تا بعداً به آن‌ها دسترسی داشته باشید"
          actionLabel="مشاهده ویترین"
          onAction={() => navigation.navigate('Explore')}
        />
      );
    }
    return (
      <View style={s.postsGrid}>
        {MOCK_FAVORITE_POSTS.map((post) => (
          <Card
            key={post.id}
            variant="elevated"
            padding={0}
            radius={14}
            style={s.postCard}
          >
            {/* 🎯 TouchableOpacity برای باز کردن مدال */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setActivePost(post)}
            >
              <View style={s.postImageWrap}>
                <Image
                  source={{ uri: post.gallery?.[0] }}
                  style={s.postImage}
                />
                {/* نشانگر گالری (تعداد تصاویر) */}
                {post.gallery && post.gallery.length > 1 && (
                  <View style={s.postGalleryBadge}>
                    <Icon name="collections" size={12} color="#fff" />
                    <Text style={s.postGalleryBadgeText}>
                      {toPersianDigit(post.gallery.length)}
                    </Text>
                  </View>
                )}
                {/* دکمه حذف از علاقه‌مندی */}
                <TouchableOpacity
                  style={s.postRemoveBtn}
                  onPress={() => handleSavePost(post.id)}
                >
                  <Icon name="bookmark" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={s.postInfo}>
                <View style={s.postBusinessRow}>
                  <Image
                    source={{ uri: post.businessLogo }}
                    style={s.postBizLogo}
                  />
                  <Text
                    style={[s.postBizName, { color: colors.textMain }]}
                    numberOfLines={1}
                  >
                    {post.businessName}
                  </Text>
                </View>
                <Text
                  style={[s.postCaption, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {post.caption}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom']}>
      {/* Tabs */}
      <View style={[s.tabsWrapper, { backgroundColor: colors.background }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabsContainer}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = counts[tab.id] || 0;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  s.tabButton,
                  {
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.cardBackground,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Icon
                  name={tab.icon}
                  size={16}
                  color={isActive ? '#fff' : colors.textSecondary}
                />
                <Text
                  style={[
                    s.tabText,
                    { color: isActive ? '#fff' : colors.textMain },
                  ]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    s.tabBadge,
                    {
                      backgroundColor: isActive
                        ? 'rgba(255,255,255,0.3)'
                        : colors.primary + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.tabBadgeText,
                      { color: isActive ? '#fff' : colors.primary },
                    ]}
                  >
                    {toPersianDigit(count)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContainer}
      >
        {activeTab === 'businesses' && renderBusinesses()}
        {activeTab === 'posts' && renderPosts()}
      </ScrollView>

      {/* 🆕 مدال ویترین - دقیقاً مشابه صفحه Explore */}
      <PostModal
        post={activePost}
        visible={!!activePost}
        onClose={() => setActivePost(null)}
        onSave={handleSavePost}
        onNavigateToProfile={handleNavigateToProfile}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  tabsWrapper: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  tabsContainer: { gap: 8, paddingRight: 4 },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
  },
  tabText: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  tabBadge: {
    minWidth: 22,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  listContainer: { padding: 16, paddingBottom: 100, gap: 12 },

  // ========== کسب‌وکارها ==========
  businessList: { gap: 12 },
  bizCard: { marginBottom: 0 },
  bizRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bizLogo: { width: 60, height: 60, borderRadius: 14 },
  bizInfo: { flex: 1, gap: 3 },
  bizName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  bizCategory: { fontSize: 12, fontFamily: 'Vazir-Medium' },
  bizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  bizCity: { fontSize: 11, fontFamily: 'Vazir', flex: 1 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#ccc' },
  bizRating: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  removeBtn: { padding: 6 },

  // ========== ویترین ==========
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  postCard: { width: '48%', overflow: 'hidden', marginBottom: 0 },
  postImageWrap: { position: 'relative' },
  postImage: { width: '100%', height: 150 },
  postGalleryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  postGalleryBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  postRemoveBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postInfo: { padding: 10, gap: 6 },
  postBusinessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postBizLogo: { width: 22, height: 22, borderRadius: 11 },
  postBizName: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },
  postCaption: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 16,
  },
});