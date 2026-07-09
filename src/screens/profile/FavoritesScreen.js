// src/screens/profile/FavoritesScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = (num) =>
  `${toPersianDigit((num || 0).toLocaleString('en-US'))} تومان`;

// 🎯 داده‌های کسب‌وکارهای مورد علاقه
const MOCK_FAVORITE_BUSINESSES = [
  {
    id: 'b1',
    businessId: '1',
    name: 'سالن زیبایی نیلارام',
    category: 'کلینیک پوست و مو',
    city: 'تهران، سعادت‌آباد',
    rating: 4.9,
    reviewsCount: 142,
    logo: 'https://picsum.photos/150?random=21',
    VIP: true,
  },
  {
    id: 'b2',
    businessId: '2',
    name: 'مرکز لیزر رویال',
    category: 'مرکز لیزر',
    city: 'تهران، شهرک غرب',
    rating: 4.8,
    reviewsCount: 178,
    logo: 'https://picsum.photos/150?random=25',
    VIP: true,
  },
  {
    id: 'b3',
    businessId: '3',
    name: 'ناخن گالری پریا',
    category: 'مرکز کاشت ناخن',
    city: 'کرج، فردیس',
    rating: 4.4,
    reviewsCount: 56,
    logo: 'https://picsum.photos/150?random=26',
    VIP: false,
  },
];

// 🎯 داده‌های پست‌های ویترین ذخیره شده
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
    businessId: 'b4',
    rating: 4.4,
    caption: 'طراحی ناخن با سبک ژورنالی و مینیمال 💖',
    saved: true,
    gallery: [
      'https://picsum.photos/800/800?random=107',
      'https://picsum.photos/800/800?random=108',
    ],
  },
];

// 🎯 فقط ۲ تب (خدمات حذف شد)
const TABS = [
  { id: 'businesses', label: 'کسب‌وکار', icon: 'store' },
  { id: 'posts', label: 'ویترین', icon: 'collections' },
];

export default function FavoritesScreen({ navigation }) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('businesses');

  const counts = useMemo(
    () => ({
      businesses: MOCK_FAVORITE_BUSINESSES.length,
      posts: MOCK_FAVORITE_POSTS.length,
    }),
    []
  );

  // 🎯 هندلر کلیک روی کارت کسب‌وکار
  const handleBusinessPress = (biz) => {
    navigation.navigate('Home', {
      screen: 'BusinessDetails',
      params: { businessId: biz.businessId },
    });
  };

  // 🎯 هندلر حذف از علاقه‌مندی
  const handleRemoveFavorite = (id, e) => {
    if (e) e.stopPropagation?.();
    console.log('Remove favorite:', id);
  };

  // ═══════════ رندر کسب‌وکارها ═══════════
  const renderBusinesses = () => {
    if (MOCK_FAVORITE_BUSINESSES.length === 0) {
      return (
        <EmptyState
          icon="🏪"
          title="هنوز کسب‌وکاری ذخیره نکرده‌اید"
          description="با تپ کردن روی آیکون ذخیره در صفحه کسب‌وکارها، آن‌ها را به علاقه‌مندی‌ها اضافه کنید"
          actionLabel="مشاهده کسب‌وکارها"
          onAction={() => navigation.navigate('Home')}
        />
      );
    }
    return (
      <View style={s.businessList}>
        {MOCK_FAVORITE_BUSINESSES.map((biz) => (
          <TouchableOpacity
            key={biz.id}
            activeOpacity={0.85}
            onPress={() => handleBusinessPress(biz)}
            style={{ marginBottom: 0 }}
          >
            <Card
              variant="elevated"
              padding={14}
              radius={18}
              style={s.bizCard}
            >
              <View style={s.bizRow}>
                {/* لوگو */}
                <View style={s.bizLogoWrapper}>
                  <Image source={{ uri: biz.logo }} style={s.bizLogo} />
                  {biz.VIP && (
                    <View style={[s.vipBadge, { backgroundColor: colors.primary }]}>
                      <Icon name="workspace-premium" size={10} color="#fff" />
                    </View>
                  )}
                </View>

                {/* اطلاعات */}
                <View style={s.bizInfo}>
                  <Text style={[s.bizName, { color: colors.textMain }]} numberOfLines={1}>
                    {biz.name}
                  </Text>
                  <Text style={[s.bizCategory, { color: colors.primary }]} numberOfLines={1}>
                    {biz.category}
                  </Text>
                  <View style={s.bizMeta}>
                    <Icon name="location-on" size={12} color={colors.textSecondary} />
                    <Text style={[s.bizCity, { color: colors.textSecondary }]} numberOfLines={1}>
                      {biz.city}
                    </Text>
                    <View style={[s.dot, { backgroundColor: colors.border }]} />
                    <Icon name="star" size={12} color="#FFC107" />
                    <Text style={[s.bizRating, { color: colors.textMain }]}>
                      {toPersianDigit(biz.rating)}
                    </Text>
                    <Text style={[s.bizReviews, { color: colors.textSecondary }]}>
                      ({toPersianDigit(biz.reviewsCount)})
                    </Text>
                  </View>
                </View>

                {/* آیکون‌های کناری */}
                <View style={s.bizActions}>
                  {/* 🎯 آیکون bookmark اینستاگرام (ذخیره شده) */}
                  <TouchableOpacity
                    onPress={(e) => handleRemoveFavorite(biz.id, e)}
                    style={[s.saveBtn, { backgroundColor: '#E91E6315' }]}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon name="bookmark" size={22} color="#E91E63" />
                  </TouchableOpacity>

                  {/* فلش پروفایل */}
                  <View style={[s.arrowBox, { backgroundColor: colors.primary + '15' }]}>
                    <Icon name="chevron-left" size={20} color={colors.primary} />
                  </View>
                </View>
              </View>

              {/* Hint */}
              <View style={[s.bizHintRow, { borderTopColor: colors.border }]}>
                <Icon name="touch-app" size={12} color={colors.textSecondary} />
                <Text style={[s.bizHintText, { color: colors.textSecondary }]}>
                  برای مشاهده پروفایل، روی کارت تپ کنید
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ═══════════ رندر پست‌های ویترین ═══════════
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
          <Card key={post.id} variant="elevated" padding={0} radius={14} style={s.postCard}>
            <TouchableOpacity activeOpacity={0.9}>
              <View style={s.postImageWrap}>
                <Image source={{ uri: post.gallery?.[0] }} style={s.postImage} />
                {post.gallery && post.gallery.length > 1 && (
                  <View style={s.postGalleryBadge}>
                    <Icon name="collections" size={12} color="#fff" />
                    <Text style={s.postGalleryBadgeText}>
                      {toPersianDigit(post.gallery.length)}
                    </Text>
                  </View>
                )}
                {/* 🎯 آیکون bookmark اینستاگرام */}
                <TouchableOpacity
                  style={s.postSaveBtn}
                  onPress={() => console.log('Remove post:', post.id)}
                >
                  <Icon name="bookmark" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={s.postInfo}>
                <View style={s.postBusinessRow}>
                  <Image source={{ uri: post.businessLogo }} style={s.postBizLogo} />
                  <Text style={[s.postBizName, { color: colors.textMain }]} numberOfLines={1}>
                    {post.businessName}
                  </Text>
                </View>
                <Text style={[s.postCaption, { color: colors.textSecondary }]} numberOfLines={2}>
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
                    backgroundColor: isActive ? colors.primary : colors.cardBackground,
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
                <Text style={[s.tabText, { color: isActive ? '#fff' : colors.textMain }]}>
                  {tab.label}
                </Text>
                <View
                  style={[
                    s.tabBadge,
                    {
                      backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : colors.primary + '20',
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

  // ═══════════ کسب‌وکارها ═══════════
  businessList: { gap: 12 },
  bizCard: {
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  bizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bizLogoWrapper: {
    position: 'relative',
  },
  bizLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  vipBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  bizInfo: {
    flex: 1,
    gap: 3,
  },
  bizName: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  bizCategory: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
  bizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  bizCity: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 2,
  },
  bizRating: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  bizReviews: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
  bizActions: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  saveBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bizHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  bizHintText: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },

  // ═══════════ ویترین ═══════════
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
  postSaveBtn: {
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
  postBusinessRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  postBizLogo: { width: 22, height: 22, borderRadius: 11 },
  postBizName: { fontSize: 11, fontFamily: 'Vazir-Bold', flex: 1 },
  postCaption: { fontSize: 11, fontFamily: 'Vazir', lineHeight: 16 },
});