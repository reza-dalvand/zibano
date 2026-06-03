import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import ScreenWrapper from '../components/common/ScreenWrapper';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import ServiceCard from '../components/customer/ServiceCard';
import BusinessCard from '../components/customer/BusinessCard';

// دیتای نمونه خدمات (منطبق با پراپ‌های ServiceCard)
const MOCK_SERVICES = [
  {
    id: 's1',
    categoryId: 'skin',
    name: 'فیشیال و پاکسازی تخصصی پوست',
    duration: 60, // به صورت عدد برای ServiceCard
    price: 450000, // به صورت عدد
    discount: 10, // درصد تخفیف
    image: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: 's2',
    categoryId: 'laser',
    name: 'لیزر موهای زائد (فول بادی)',
    duration: 90,
    price: 1200000,
    discount: 0,
    image: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: 's3',
    categoryId: 'makeup',
    name: 'میکاپ و گریم VIP',
    duration: 180,
    price: 3500000,
    discount: 15,
    image: 'https://picsum.photos/400/300?random=3',
  },
];

// دیتای نمونه سالن‌ها (منطبق با پراپ‌های BusinessCard)
const MOCK_BUSINESSES = [
  {
    id: 'b1',
    categoryId: 'skin',
    name: 'مرکز تخصصی پوست و موی رویال',
    category: 'کلینیک زیبایی',
    rating: 4.8, // به صورت عدد برای BusinessCard
    city: 'تهران، سعادت‌آباد',
    logo: 'https://picsum.photos/150/150?random=10',
  },
  {
    id: 'b2',
    categoryId: 'makeup',
    name: 'سالن زیبایی ماهرو',
    category: 'آرایشگاه زنانه',
    rating: 4.5,
    city: 'تهران، نیاوران',
    logo: 'https://picsum.photos/150/150?random=11',
  },
];

// فیلترهای بالای صفحه
const FILTERS = [
  { id: 'all', label: 'همه' },
  { id: 'skin', label: 'مراقبت پوست' },
  { id: 'laser', label: 'لیزر' },
  { id: 'makeup', label: 'میکاپ' },
  { id: 'hair', label: 'خدمات مو' },
];

export default function CategoryServicesScreen({ navigation }) {
  const { colors } = useTheme();
  
  // استیت‌های مدیریت صفحه
  const [viewType, setViewType] = useState('services'); // 'services' | 'businesses'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // فیلتر هوشمند دیتا بر اساس نوع نمایش (سالن یا خدمت)، سرچ و چیپ‌ها
  const listData = useMemo(() => {
    const dataSource = viewType === 'services' ? MOCK_SERVICES : MOCK_BUSINESSES;
    
    return dataSource.filter(item => {
      const matchesFilter = selectedFilter === 'all' || item.categoryId === selectedFilter;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [viewType, searchQuery, selectedFilter]);

  // رندر کردن آیتم‌های لیست بر اساس نوع انتخاب شده
  const renderItem = ({ item }) => {
    if (viewType === 'services') {
      return (
        <ServiceCard 
          service={item} 
          onPress={() => console.log('Navigate to ServiceDetail:', item.id)} 
        />
      );
    }
    return (
      <BusinessCard 
        business={item} 
        onPress={() => console.log('Navigate to BusinessProfile:', item.id)} 
      />
    );
  };

  return (
    <ScreenWrapper scrollable={false} padding={0}>
      {/* هدر صفحه و دکمه بازگشت */}
      <View style={[styles.header, { borderColor: colors.border }]}>
        <TouchableOpacity 
          onPress={() => navigation?.goBack()} 
          style={[styles.backButton, { backgroundColor: colors.cardBackground }]}
        >
          <Icon name="chevron-right" size={26} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>دسته‌بندی خدمات</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* تب‌های تغییر وضعیت بین خدمات و سالن‌ها */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            viewType === 'services' && { backgroundColor: colors.primary, borderColor: colors.primary }
          ]}
          onPress={() => setViewType('services')}
        >
          <Text style={[
            styles.tabText,
            { color: viewType === 'services' ? '#fff' : colors.textSecondary }
          ]}>خدمات</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            viewType === 'businesses' && { backgroundColor: colors.primary, borderColor: colors.primary }
          ]}
          onPress={() => setViewType('businesses')}
        >
          <Text style={[
            styles.tabText,
            { color: viewType === 'businesses' ? '#fff' : colors.textSecondary }
          ]}>سالن‌ها و کلینیک‌ها</Text>
        </TouchableOpacity>
      </View>

      {/* نوار جستجو */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={viewType === 'services' ? "جستجو در خدمات..." : "جستجو در سالن‌ها..."}
        />
      </View>

      {/* نوار فیلترها (اسکرول افقی) */}
      <View style={styles.filterSection}>
        <FilterBar
          filters={FILTERS}
          selectedId={selectedFilter}
          onSelect={(item) => setSelectedFilter(item.id)}
        />
      </View>

      {/* لیست اصلی */}
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={64} color={colors.textSecondary + '60'} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              موردی با این مشخصات یافت نشد!
            </Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
  },
  tabContainer: {
    flexDirection: 'row-reverse',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCD1CB', // رنگ border پیش‌فرض
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Vazir-Medium',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  filterSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Vazir-Medium',
  },
});