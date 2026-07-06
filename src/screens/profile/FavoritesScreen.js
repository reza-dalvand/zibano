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

const MOCK_FAVORITE_BUSINESSES = [
  { id: 'b1', name: 'سالن زیبایی نیلارام', category: 'کلینیک پوست و مو', city: 'تهران، سعادت‌آباد', rating: 4.9, logo: 'https://picsum.photos/150?random=21' },
  { id: 'b2', name: 'مرکز لیزر رویال', category: 'مرکز لیزر', city: 'تهران، شهرک غرب', rating: 4.8, logo: 'https://picsum.photos/150?random=25' },
];

const MOCK_FAVORITE_SERVICES = [
  { id: 's1', name: 'فیشیال تخصصی پوست', business: 'سالن نیلارام', price: 675000, duration: 60, image: 'https://picsum.photos/300/300?random=11' },
  { id: 's2', name: 'کاشت مژه هالیوودی', business: 'سالن افرا', price: 580000, duration: 90, image: 'https://picsum.photos/300/300?random=12' },
];

const MOCK_FAVORITE_POSTS = [
  { id: 'p1', businessName: 'کلینیک زیبایی صدف', businessLogo: 'https://picsum.photos/100/100?random=1', image: 'https://picsum.photos/400/400?random=1', caption: 'فیشیال VIP با ماسک طلا' },
  { id: 'p2', businessName: 'سالن زیبایی ماهرو', businessLogo: 'https://picsum.photos/100/100?random=2', image: 'https://picsum.photos/400/400?random=3', caption: 'میکاپ عروس اروپایی' },
];

const TABS = [
  { id: 'businesses', label: 'سالن‌ها', icon: 'store' },
  { id: 'services', label: 'خدمات', icon: 'spa' },
  { id: 'posts', label: 'پست‌های ویترین', icon: 'collections' },
];

export default function FavoritesScreen({ navigation }) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('businesses');

  const counts = useMemo(
    () => ({
      businesses: MOCK_FAVORITE_BUSINESSES.length,
      services: MOCK_FAVORITE_SERVICES.length,
      posts: MOCK_FAVORITE_POSTS.length,
    }),
    []
  );

  const renderBusinesses = () => {
    if (MOCK_FAVORITE_BUSINESSES.length === 0) {
      return (
        <EmptyState
          icon="🏪"
          title="هنوز سالنی ذخیره نکرده‌اید"
          description="با تپ کردن روی آیکون قلب در صفحه کسب‌وکارها، آن‌ها را به علاقه‌مندی‌ها اضافه کنید"
          actionLabel="مشاهده سالن‌ها"
          onAction={() => navigation.navigate('Home')}
        />
      );
    }
    return (
      <View style={s.businessList}>
        {MOCK_FAVORITE_BUSINESSES.map((biz) => (
          <Card key={biz.id} variant="elevated" padding={14} radius={16} style={s.bizCard}>
            <View style={s.bizRow}>
              <Image source={{ uri: biz.logo }} style={s.bizLogo} />
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

  const renderServices = () => {
    if (MOCK_FAVORITE_SERVICES.length === 0) {
      return (
        <EmptyState
          icon="💅"
          title="هنوز خدمتی ذخیره نکرده‌اید"
          description="خدمات مورد علاقه خود را از پروفایل کسب‌وکارها ذخیره کنید"
          actionLabel="مشاهده خدمات"
          onAction={() => navigation.navigate('Home')}
        />
      );
    }
    return (
      <View style={s.serviceList}>
        {MOCK_FAVORITE_SERVICES.map((svc) => (
          <Card key={svc.id} variant="elevated" padding={0} radius={16} style={s.svcCard}>
            <View style={s.svcRow}>
              <Image source={{ uri: svc.image }} style={s.svcImage} />
              <View style={s.svcInfo}>
                <Text style={[s.svcName, { color: colors.textMain }]} numberOfLines={2}>
                  {svc.name}
                </Text>
                <Text style={[s.svcBusiness, { color: colors.textSecondary }]} numberOfLines={1}>
                  {svc.business}
                </Text>
                <View style={s.svcMeta}>
                  <Icon name="schedule" size={12} color={colors.textSecondary} />
                  <Text style={[s.svcDuration, { color: colors.textSecondary }]}>
                    {toPersianDigit(svc.duration)} دقیقه
                  </Text>
                </View>
                <Text style={[s.svcPrice, { color: colors.primary }]}>
                  {formatPrice(svc.price)}
                </Text>
              </View>
              <TouchableOpacity style={s.svcRemoveBtn}>
                <Icon name="favorite" size={20} color="#E91E63" />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>
    );
  };

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
            <View style={s.postImageWrap}>
              <Image source={{ uri: post.image }} style={s.postImage} />
              <TouchableOpacity style={s.postRemoveBtn}>
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
          </Card>
        ))}
      </View>
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom']}>
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
                <Icon name={tab.icon} size={16} color={isActive ? '#fff' : colors.textSecondary} />
                <Text style={[s.tabText, { color: isActive ? '#fff' : colors.textMain }]}>
                  {tab.label}
                </Text>
                <View
                  style={[
                    s.tabBadge,
                    { backgroundColor: isActive ? '#fff30' : colors.primary + '20' },
                  ]}
                >
                  <Text style={[s.tabBadgeText, { color: isActive ? '#fff' : colors.primary }]}>
                    {toPersianDigit(count)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContainer}
      >
        {activeTab === 'businesses' && renderBusinesses()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'posts' && renderPosts()}
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  tabsWrapper: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  tabsContainer: { gap: 8, paddingRight: 4 },
  tabButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, borderWidth: 1,
  },
  tabText: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  tabBadge: {
    minWidth: 22, height: 20, paddingHorizontal: 6, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  tabBadgeText: { fontSize: 11, fontFamily: 'Vazir-Bold' },
  listContainer: { padding: 16, paddingBottom: 100, gap: 12 },
  businessList: { gap: 12 },
  bizCard: { marginBottom: 0 },
  bizRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bizLogo: { width: 60, height: 60, borderRadius: 14 },
  bizInfo: { flex: 1, gap: 3 },
  bizName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  bizCategory: { fontSize: 12, fontFamily: 'Vazir-Medium' },
  bizMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  bizCity: { fontSize: 11, fontFamily: 'Vazir', flex: 1 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#ccc' },
  bizRating: { fontSize: 12, fontFamily: 'Vazir-Bold' },
  removeBtn: { padding: 6 },
  serviceList: { gap: 12 },
  svcCard: { overflow: 'hidden', marginBottom: 0 },
  svcRow: { flexDirection: 'row', padding: 12, gap: 12 },
  svcImage: { width: 90, height: 90, borderRadius: 12 },
  svcInfo: { flex: 1, gap: 3, justifyContent: 'space-between' },
  svcName: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  svcBusiness: { fontSize: 11, fontFamily: 'Vazir' },
  svcMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  svcDuration: { fontSize: 11, fontFamily: 'Vazir' },
  svcPrice: { fontSize: 13, fontFamily: 'Vazir-Bold' },
  svcRemoveBtn: { padding: 4, alignSelf: 'flex-start' },
  postsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  postCard: { width: '48%', overflow: 'hidden', marginBottom: 0 },
  postImageWrap: { position: 'relative' },
  postImage: { width: '100%', height: 150 },
  postRemoveBtn: {
    position: 'absolute', top: 8, left: 8, width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center',
  },
  postInfo: { padding: 10, gap: 6 },
  postBusinessRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  postBizLogo: { width: 22, height: 22, borderRadius: 11 },
  postBizName: { fontSize: 11, fontFamily: 'Vazir-Bold', flex: 1 },
  postCaption: { fontSize: 11, fontFamily: 'Vazir', lineHeight: 16 },
});