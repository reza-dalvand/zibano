// src/screens/home/CategoryBusinessesScreen.js
import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import EmptyState from '../../components/common/EmptyState';
import CategoryHeader from '../../components/home/CategoryHeader';
import BusinessListCard from '../../components/home/BusinessListCard';
import CategoryFilterModal from '../../components/home/CategoryFilterModal';
import ActiveFiltersBar from '../../components/home/ActiveFiltersBar';

// مپ کردن آیکون‌ها و رنگ‌ها برای دسته‌بندی‌های مختلف
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

const INITIAL_FILTERS = {
  province: null,
  city: null,
  minRating: '0',
  sortBy: 'top_rated',
};

// ============ دیتای موقت با فیلدهای جدید ============
const MOCK_BUSINESSES = [
  {
    id: '1',
    name: 'مجموعه زیبایی و سلامت نیلارام',
    address: 'تهران، سعادت آباد، خیابان سرو غربی',
    rating: '۵.۰',
    ratingNum: 5.0,
    reviewsCount: 142,
    VIP: true,
    logo: 'https://picsum.photos/200?random=21',
    servicesCount: 24,
    category: 'کلینیک پوست و مو',
    provinceId: 'tehran',
    cityId: 'tehran-city',
  },
  {
    id: '2',
    name: 'سالن تخصصی کراتین و رنگ موی النا',
    address: 'تهران، نیاوران',
    rating: '۴.۷',
    ratingNum: 4.7,
    reviewsCount: 89,
    VIP: false,
    logo: 'https://picsum.photos/200?random=22',
    servicesCount: 18,
    category: 'سالن زیبایی',
    provinceId: 'tehran',
    cityId: 'shemiran',
  },
  {
    id: '3',
    name: 'کلینیک زیبایی صدف',
    address: 'اصفهان، خیابان چهارباغ',
    rating: '۴.۹',
    ratingNum: 4.9,
    reviewsCount: 215,
    VIP: true,
    logo: 'https://picsum.photos/200?random=23',
    servicesCount: 32,
    category: 'کلینیک پوست و مو',
    provinceId: 'isfahan',
    cityId: 'isfahan-city',
  },
  {
    id: '4',
    name: 'سالن زیبایی افرا',
    address: 'کرج، میدان کرج',
    rating: '۴.۶',
    ratingNum: 4.6,
    reviewsCount: 67,
    VIP: false,
    logo: 'https://picsum.photos/200?random=24',
    servicesCount: 15,
    category: 'سالن زیبایی',
    provinceId: 'alborz',
    cityId: 'karaj',
  },
  {
    id: '5',
    name: 'مرکز لیزر رویال',
    address: 'تهران، شهرک غرب',
    rating: '۴.۸',
    ratingNum: 4.8,
    reviewsCount: 178,
    VIP: true,
    logo: 'https://picsum.photos/200?random=25',
    servicesCount: 12,
    category: 'مرکز لیزر',
    provinceId: 'tehran',
    cityId: 'tehran-city',
  },
  {
    id: '6',
    name: 'ناخن گالری پریا',
    address: 'کرج، فردیس',
    rating: '۴.۴',
    ratingNum: 4.4,
    reviewsCount: 56,
    VIP: false,
    logo: 'https://picsum.photos/200?random=26',
    servicesCount: 8,
    category: 'مرکز کاشت ناخن',
    provinceId: 'alborz',
    cityId: 'fardis',
  },
];
// =================================

export default function CategoryBusinessesScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { categoryId, categoryName } = route.params || {};

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // گرفتن متای دسته (آیکون و رنگ)
  const categoryMeta = CATEGORY_META[categoryId] || {
    icon: 'spa',
    color: colors.primary,
  };

  // محاسبه تعداد فیلترهای فعال
  const activeFiltersCount =
    (filters.province ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.minRating !== '0' ? 1 : 0) +
    (filters.sortBy && filters.sortBy !== 'top_rated' ? 1 : 0);

  // فیلتر و مرتب‌سازی داده‌ها
  const filteredData = useMemo(() => {
    let data = [...MOCK_BUSINESSES];

    // فیلتر بر اساس جستجو
    if (search.trim()) {
      data = data.filter(
        item => item.name.includes(search) || item.address.includes(search),
      );
    }

    // فیلتر بر اساس استان
    if (filters.province) {
      data = data.filter(item => item.provinceId === filters.province);
    }

    // فیلتر بر اساس شهر
    if (filters.city) {
      data = data.filter(item => item.cityId === filters.city);
    }

    // فیلتر بر اساس امتیاز
    if (filters.minRating !== '0') {
      const minRatingNum = parseFloat(filters.minRating);
      data = data.filter(item => item.ratingNum >= minRatingNum);
    }

    // مرتب‌سازی
    switch (filters.sortBy) {
      case 'top_rated':
        data.sort((a, b) => b.ratingNum - a.ratingNum);
        break;
      case 'most_booked':
        data.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case 'highest_discount':
        // شبیه‌سازی
        break;
      case 'nearest':
        // شبیه‌سازی
        break;
    }

    return data;
  }, [search, filters]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleBusinessPress = business => {
    navigation.navigate('BusinessDetails', { businessId: business.id });
  };

  const handleClearFilters = () => setFilters(INITIAL_FILTERS);

  return (
    <ScreenWrapper
      scrollable={false}
      padding={0}
      edges={['bottom', 'left', 'right']}
    >
      {/* هدر گرادیانی با آیکون و SearchBar */}
      <CategoryHeader
        categoryName={categoryName}
        categoryIcon={categoryMeta.icon}
        categoryColor={categoryMeta.color}
        resultCount={filteredData.length}
        searchQuery={search}
        onSearchChange={setSearch}
        onBackPress={() => navigation.goBack()}
      />

      {/* دکمه فیلتر شناور */}
      <View style={s.filterButtonContainer}>
        <TouchableOpacity
          style={[
            s.filterButton,
            {
              backgroundColor:
                activeFiltersCount > 0 ? colors.primary : colors.cardBackground,
              borderColor:
                activeFiltersCount > 0 ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.8}
        >
          <Icon
            name="tune"
            size={20}
            color={activeFiltersCount > 0 ? '#fff' : colors.textMain}
          />
          <Text
            style={[
              s.filterButtonText,
              {
                color: activeFiltersCount > 0 ? '#fff' : colors.textMain,
              },
            ]}
          >
            فیلتر و مرتب‌سازی
          </Text>
          {activeFiltersCount > 0 && (
            <View style={s.filterBadge}>
              <Text style={s.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* چیپ‌های فیلتر فعال */}
      <ActiveFiltersBar
        filters={filters}
        onChange={setFilters}
        onClearAll={handleClearFilters}
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
        {/* لیست کسب‌وکارها */}
        <View style={s.listContainer}>
          {filteredData.length > 0 ? (
            filteredData.map(business => (
              <BusinessListCard
                key={business.id}
                business={business}
                onPress={() => handleBusinessPress(business)}
              />
            ))
          ) : (
            <View style={s.emptyContainer}>
              <EmptyState
                icon="🔍"
                title="کسب‌وکاری یافت نشد"
                description={
                  search || activeFiltersCount > 0
                    ? `با این فیلترها نتیجه‌ای پیدا نشد. لطفاً فیلترها را تغییر دهید.`
                    : `در حال حاضر کسب‌وکاری در این دسته ثبت نشده است.`
                }
                actionLabel={
                  activeFiltersCount > 0
                    ? 'حذف همه فیلترها'
                    : search
                    ? 'پاک کردن جستجو'
                    : 'بازگشت به خانه'
                }
                onAction={() => {
                  if (activeFiltersCount > 0) handleClearFilters();
                  else if (search) setSearch('');
                  else navigation.goBack();
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* مدال فیلتر */}
      <CategoryFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  filterButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Vazir-Medium',
  },
  filterBadge: {
    backgroundColor: '#E53935',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  filterBadgeText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
    gap: 4,
  },
  emptyContainer: {
    flex: 1,
    minHeight: 400,
    justifyContent: 'center',
  },
});
