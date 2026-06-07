// src/screens/home/CategoryBusinessesScreen.js

import React, {useMemo, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  StyleSheet,
} from 'react-native';

import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import FilterBar from '../../components/home/FilterBar';
import BusinessCard from '../../components/home/BusinessCard';
import EmptyState from '../../components/common/EmptyState';

const MOCK_BUSINESSES = [
  {
    id: '1',
    name: 'سالن زیبایی افرا',
    city: 'تهران',
    rating: 4.9,
    servicesCount: 24,
    bookings: 320,
    discount: 15,
    logo: 'https://picsum.photos/200',
  },
  {
    id: '2',
    name: 'کلینیک ماه',
    city: 'تهران',
    rating: 4.6,
    servicesCount: 18,
    bookings: 520,
    discount: 5,
    logo: 'https://picsum.photos/201',
  },
  {
    id: '3',
    name: 'مرکز زیبایی رز',
    city: 'کرج',
    rating: 4.8,
    servicesCount: 32,
    bookings: 280,
    discount: 25,
    logo: 'https://picsum.photos/202',
  },
  {
     id: '4',
     name: 'مرکز cccc رز',
     city: 'کرج',
     rating: 4.8,
     servicesCount: 32,
     bookings: 280,
     discount: 25,
     logo: 'https://picsum.photos/202',
   },
];

const FILTERS = [
  { id: 'top_rated', label: 'بیشترین امتیاز' },
  { id: 'most_booked', label: 'بیشترین رزرو' },
  { id: 'highest_discount', label: 'بیشترین تخفیف' },
];

const CategoryBusinessesScreen = ({ navigation, route }) => {
  const { categoryName } = route.params;

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('top_rated');
  const [refreshing, setRefreshing] = useState(false);

  const filteredData = useMemo(() => {
    let data = [...MOCK_BUSINESSES];

    if (search.trim()) {
      data = data.filter(item => item.name.includes(search));
    }

    switch (selectedFilter) {
      case 'top_rated':
        data.sort((a, b) => b.rating - a.rating);
        break;
      case 'most_booked':
        data.sort((a, b) => b.bookings - a.bookings);
        break;
      case 'highest_discount':
        data.sort((a, b) => b.discount - a.discount);
        break;
    }

    return data;
  }, [search, selectedFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    // مانند صفحه هوم پدینگ صفر قرار می‌دهیم تا هدر متصل به کناره‌ها باشد
    <ScreenWrapper padding={0} edges={['bottom']}>
      
      {/* هدر صفحه با دکمه بازگشت استاندارد */}
      <Header
        title={categoryName}
     //    onBackPress={() => navigation.goBack()}
      />

      {/* بخش سرچ بار کانتینر با پدینگ هماهنگ با صفحه هوم */}
      <View style={s.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="جستجوی کسب و کار..."
        />
      </View>

      {/* لیست اصلی بیزینس‌ها با کانتینر پدینگ‌دار هماهنگ با bodyContainer هوم */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        contentContainerStyle={s.listBodyContainer}
        renderItem={({item}) => (
          <BusinessCard
            business={item}
            onPress={() =>
              navigation.navigate('BusinessDetails', { businessId: item.id })
            }
          />
        )}
        ListEmptyComponent={<EmptyState title="کسب و کاری پیدا نشد" />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ScreenWrapper>
  );
};

const s = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
  },
  filterWrapper: {
    marginBottom: 14,
  },
  listBodyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    paddingTop: 2,
  },
});

export default CategoryBusinessesScreen;