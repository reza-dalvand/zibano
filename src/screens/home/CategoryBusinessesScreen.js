// src/screens/home/CategoryBusinessesScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import EmptyState from '../../components/common/EmptyState';
import CategoryHeader from '../../components/home/CategoryHeader';
import BusinessListCard from '../../components/home/BusinessListCard';
import CategoryFilterModal from '../../components/home/CategoryFilterModal';

const CATEGORY_META = {
  1: { icon: 'face', color: '#E91E63' },
  2: { icon: 'brush', color: '#9C27B0' },
  3: { icon: 'flash-on', color: '#2196F3' },
  4: { icon: 'spa', color: '#4CAF50' },
  5: { icon: 'palette', color: '#FF9800' },
  6: { icon: 'auto-awesome', color: '#00BCD4' },
  7: { icon: 'visibility', color: '#795548' },
  8: { icon: 'self-improvement', color: '#607D8B' },
};

const MOCK_BUSINESSES = [
  {
    id: '1',
    name: 'کلینیک زیبایی صدف',
    serviceType: 'فیشیال VIP عروس',
    subServiceId: 'facial_vip',
    address: 'تهران، سعادت آباد، خیابان سرو غربی',
    rating: '۵.۰',
    ratingNum: 5.0,
    reviewsCount: 142,
    discount: 20,
    logo: 'https://picsum.photos/200?random=21',
    servicesCount: 24,
    category: 'کلینیک پوست و مو',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: true,
    isNew: false,
  },
  {
    id: '2',
    name: 'سالن زیبایی ماهرو',
    serviceType: 'میکاپ عروس اروپایی',
    subServiceId: 'makeup_bride',
    address: 'تهران، نیاوران',
    rating: '۴.۷',
    ratingNum: 4.7,
    reviewsCount: 89,
    discount: 15,
    logo: 'https://picsum.photos/200?random=22',
    servicesCount: 18,
    category: 'سالن زیبایی',
    provinceId: 'tehran',
    cityId: 'shemiran',
    VIP: false,
    isNew: true,
  },
  {
    id: '3',
    name: 'کلینیک رویال لیزر',
    serviceType: 'لیزر الکساندرایت فول بادی',
    subServiceId: 'laser_alex',
    address: 'اصفهان، خیابان چهارباغ',
    rating: '۴.۹',
    ratingNum: 4.9,
    reviewsCount: 215,
    discount: 30,
    logo: 'https://picsum.photos/200?random=23',
    servicesCount: 32,
    category: 'مرکز لیزر',
    provinceId: 'isfahan',
    cityId: 'isfahan-city',
    VIP: true,
    isNew: false,
  },
  {
    id: '4',
    name: 'سالن افرا',
    serviceType: 'کاشت ناخن ژله‌ای طرح‌دار',
    subServiceId: 'nail_gel',
    address: 'کرج، میدان کرج',
    rating: '۴.۶',
    ratingNum: 4.6,
    reviewsCount: 67,
    discount: 0,
    logo: 'https://picsum.photos/200?random=24',
    servicesCount: 15,
    category: 'مرکز کاشت ناخن',
    provinceId: 'alborz',
    cityId: 'karaj',
    VIP: false,
    isNew: false,
  },
  {
    id: '5',
    name: 'مرکز لیزر پارسه',
    serviceType: 'لیزر دایود صورت',
    subServiceId: 'laser_diode',
    address: 'تهران، شهرک غرب',
    rating: '۴.۸',
    ratingNum: 4.8,
    reviewsCount: 178,
    discount: 25,
    logo: 'https://picsum.photos/200?random=25',
    servicesCount: 12,
    category: 'مرکز لیزر',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: false,
    isNew: true,
  },
  {
    id: '6',
    name: 'ناخن گالری پریا',
    serviceType: 'ژلیش ناخن مینیمال',
    subServiceId: 'nail_gelish',
    address: 'کرج، فردیس',
    rating: '۴.۴',
    ratingNum: 4.4,
    reviewsCount: 56,
    discount: 0,
    logo: 'https://picsum.photos/200?random=26',
    servicesCount: 8,
    category: 'مرکز کاشت ناخن',
    provinceId: 'alborz',
    cityId: 'fardis',
    VIP: false,
    isNew: false,
  },
  {
    id: '7',
    name: 'سالن النا',
    serviceType: 'میکاپ مجلسی شاین',
    subServiceId: 'makeup_party',
    address: 'تهران، ونک',
    rating: '۴.۹',
    ratingNum: 4.9,
    reviewsCount: 124,
    discount: 10,
    logo: 'https://picsum.photos/200?random=27',
    servicesCount: 20,
    category: 'سالن زیبایی',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    VIP: true,
    isNew: false,
  },
  {
    id: '8',
    name: 'کلینیک ماه',
    serviceType: 'هیدروفیشیال تخصصی',
    subServiceId: 'facial_hydro',
    address: 'مشهد، بلوار وکیل‌آباد',
    rating: '۴.۷',
    ratingNum: 4.7,
    reviewsCount: 98,
    discount: 0,
    logo: 'https://picsum.photos/200?random=28',
    servicesCount: 14,
    category: 'کلینیک پوست و مو',
    provinceId: 'khorasan',
    cityId: 'mashhad',
    VIP: false,
    isNew: true,
  },
];

export default function CategoryBusinessesScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { categoryId, categoryName } = route.params || {};
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    serviceType: null,
    sortBy: 'all', // ✅ پیش‌فرض تغییر کرد
  });

  const categoryMeta = CATEGORY_META[categoryId] || {
    icon: 'spa',
    color: colors.primary,
  };

  const hasActiveFilter =
    (filters.serviceType && filters.serviceType !== 'all') ||
    filters.sortBy !== 'all';

  const filteredData = useMemo(() => {
    let data = [...MOCK_BUSINESSES];

    // فیلتر جستجو
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          (item.serviceType && item.serviceType.toLowerCase().includes(q)),
      );
    }

    // فیلتر نوع خدمت (از Dropdown مدال فیلتر)
    if (filters.serviceType && filters.serviceType !== 'all') {
      data = data.filter((item) => item.subServiceId === filters.serviceType);
    }

    // ✅ مرتب‌سازی - فقط اگر "all" نباشد
    if (filters.sortBy === 'top_rated') {
      data.sort((a, b) => b.ratingNum - a.ratingNum);
    } else if (filters.sortBy === 'most_booked') {
      data.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (filters.sortBy === 'highest_discount') {
      data.sort((a, b) => b.discount - a.discount);
    }
    // اگر sortBy === 'all' باشد، هیچ مرتب‌سازی انجام نمی‌شود (ترتیب اصلی)

    return data;
  }, [search, filters]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleBusinessPress = (business) => {
    navigation.navigate('BusinessDetails', { businessId: business.id });
  };

  return (
    <ScreenWrapper scrollable={false} padding={0} edges={['bottom', 'left', 'right']}>
      <CategoryHeader
        categoryName={categoryName}
        categoryIcon={categoryMeta.icon}
        categoryColor={categoryMeta.color}
        resultCount={filteredData.length}
        searchQuery={search}
        onSearchChange={setSearch}
        onBackPress={() => navigation.goBack()}
        onFilterPress={() => setFilterVisible(true)}
        hasActiveFilter={hasActiveFilter}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={s.listContainer}>
          {filteredData.length > 0 ? (
            filteredData.map((business) => (
              <BusinessListCard
                key={business.id}
                business={business}
                categoryIcon={categoryMeta.icon}
                onPress={() => handleBusinessPress(business)}
              />
            ))
          ) : (
            <View style={s.emptyContainer}>
              <EmptyState
                icon="🔍"
                title="کسب‌وکاری یافت نشد"
                description={
                  search
                    ? 'با این عبارت جستجو نتیجه‌ای پیدا نشد.'
                    : 'فیلترهای خود را تغییر دهید تا نتایج بیشتری ببینید.'
                }
                actionLabel={search ? 'پاک کردن جستجو' : 'حذف فیلترها'}
                onAction={() => {
                  if (search) {
                    setSearch('');
                  } else {
                    setFilters({ serviceType: null, sortBy: 'all' });
                  }
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* مدال فیلتر */}
      <CategoryFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
        categoryId={categoryId}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 4,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 400,
    justifyContent: 'center',
  },
});