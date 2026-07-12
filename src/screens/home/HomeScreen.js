// src/screens/home/HomeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import AdSlider from '../../components/home/AdSlider';
import CategoryGrid from '../../components/home/CategoryGrid';
import HomeHeader from '../../components/home/HomeHeader';
import ServiceListCard from '../../components/home/ServiceListCard';
import BusinessListCard from '../../components/home/BusinessListCard';
import { useAuth } from '../../context/AuthContext';

// ============ دیتای موقت ============
const MOCK_ADS = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/800/400?random=1',
    title: 'جشنواره تخفیف‌های بهار کلینیک رُز',
    subtitle: 'تا ۳۰٪ تخفیف خدمات پوست',
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/800/400?random=2',
    title: 'افتتاحیه سالن زیبایی لاویا',
    subtitle: 'نوبت‌دهی آنلاین با بیعانه اقتصادی',
  },
];

const MOCK_CATEGORIES = [
  { id: 1, name: 'میکاپ', icon: 'face', color: '#E91E63' },
  { id: 2, name: 'کاشت ناخن', icon: 'brush', color: '#9C27B0' },
  { id: 3, name: 'لیزر مو', icon: 'flash-on', color: '#2196F3' },
  { id: 4, name: 'پاکسازی', icon: 'spa', color: '#4CAF50' },
  { id: 5, name: 'رنگ مو', icon: 'palette', color: '#FF9800' },
  { id: 6, name: 'کراتین', icon: 'auto-awesome', color: '#00BCD4' },
  { id: 7, name: 'مژه', icon: 'visibility', color: '#795548' },
  { id: 8, name: 'ماساژ', icon: 'self-improvement', color: '#607D8B' },
];

const MOCK_SERVICES = [
  {
    id: 1,
    name: 'فیشیال تخصصی پوست',
    business: 'کلینیک صدف',
    price: '۷۵۰,۰۰۰',
    originalPrice: '۹۵۰,۰۰۰',
    rating: '۴.۸',
    image: 'https://picsum.photos/300/300?random=11',
    discount: 20,
    duration: '۶۰ دقیقه',
  },
  {
    id: 2,
    name: 'کاشت مژه هالیوودی',
    business: 'سالن زیبایی افرا',
    price: '۵۸۰,۰۰۰',
    originalPrice: '۵۸۰,۰۰۰',
    rating: '۴.۹',
    image: 'https://picsum.photos/300/300?random=12',
    discount: 0,
    duration: '۹۰ دقیقه',
  },
  {
    id: 3,
    name: 'لیزر فول بادی',
    business: 'مرکز لیزر رویال',
    price: '۲,۵۰۰,۰۰۰',
    originalPrice: '۳,۲۰۰,۰۰۰',
    rating: '۴.۷',
    image: 'https://picsum.photos/300/300?random=13',
    discount: 22,
    duration: '۱۲۰ دقیقه',
  },
];

const MOCK_BUSINESSES = [
  {
    id: 1,
    name: 'مجموعه زیبایی و سلامت نیلارام',
    address: 'تهران، سعادت آباد',
    rating: '۵.۰',
    reviewsCount: 142,
    VIP: true,
    logo: 'https://picsum.photos/200?random=21',
    servicesCount: 24,
    category: 'کلینیک پوست و مو',
  },
  {
    id: 2,
    name: 'سالن تخصصی کراتین و رنگ موی النا',
    address: 'تهران، نیاوران',
    rating: '۴.۷',
    reviewsCount: 89,
    VIP: false,
    logo: 'https://picsum.photos/200?random=22',
    servicesCount: 18,
    category: 'سالن زیبایی',
  },
];
// =================================

// کامپوننت سکشن با عنوان و "مشاهده همه"
function SectionHeader({ title, onSeeAll, colors }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={[s.sectionTitle, { color: colors.textMain }]}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[s.seeAll, { color: colors.primary }]}>مشاهده همه</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <ScreenWrapper scrollable padding={0} edges={['bottom', 'left', 'right']}>
      {/* هدر مدرن */}
      <HomeHeader
        userName={user?.name}
        userAvatar={user?.avatar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() =>
          navigation?.navigate('SearchFilter', { query: searchQuery })
        }
        onNotificationPress={() => console.log('Notifications')}
        notificationCount={3}
      />

      <View style={s.bodyContainer}>
        {/* ۱. اسلایدر تبلیغات */}
        <View style={s.section}>
          <AdSlider
            ads={MOCK_ADS}
            onPress={ad => console.log('Ad pressed:', ad.id)}
          />
        </View>

        {/* ۲. دسته‌بندی خدمات */}
        <View style={s.section}>
          <SectionHeader title="دسته‌بندی خدمات" colors={colors} />
          <CategoryGrid
            categories={MOCK_CATEGORIES}
            selectedId={selectedCategory}
            onSelect={item => {
              setSelectedCategory(item.id);
              navigation.navigate('CategoryBusinesses', {
                categoryId: item.id,
                categoryName: item.name,
              });
            }}
          />
        </View>

        {/* ۳. محبوب‌ترین خدمات */}
        <View style={s.section}>
          <SectionHeader
            title="🔥 محبوب‌ترین خدمات"
            onSeeAll={() => console.log('See all services')}
            colors={colors}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.servicesScroll}
          >
            {MOCK_SERVICES.map(service => (
              <ServiceListCard
                key={service.id}
                service={service}
                onPress={() =>
                  navigation?.navigate('ServiceDetail', { id: service.id })
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* ۴. سالن‌های برتر */}
        <View style={[s.section, s.lastSection]}>
          <SectionHeader
            title="⭐ سالن‌ها و کلینیک‌های برتر"
            onSeeAll={() => console.log('See all businesses')}
            colors={colors}
          />

          {MOCK_BUSINESSES.map(biz => (
            <BusinessListCard
              key={biz.id}
              business={biz}
              onPress={() =>
                navigation?.navigate('BusinessDetails', { id: biz.id })
              }
            />
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  bodyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  section: {
    marginTop: 24,
  },
  lastSection: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
  },
  seeAll: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  servicesScroll: {
    gap: 12,
    paddingRight: 4,
  },
});
