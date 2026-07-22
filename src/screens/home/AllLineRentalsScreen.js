// src/screens/home/AllLineRentalsScreen.js
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import AllLineRentalsHeader from '../../components/home/AllLineRentalsHeader';
import AllLineRentalsCard from '../../components/home/AllLineRentalsCard';
import AllLineRentalsEmptyState from '../../components/home/AllLineRentalsEmptyState';
import LineRentalFilterModal from '../../components/home/LineRentalFilterModal';

const MOCK_LINE_RENTALS = [
  {
    id: 'lr_1',
    businessId: 'b1',
    title: 'لاین ناخن VIP با تجهیزات کامل',
    serviceTypeName: 'کاشت ناخن',
    serviceTypeIcon: 'brush',
    serviceTypeColor: '#7B1FA2',
    collabType: 'percent',
    priceDisplay: '۴۰-۶۰٪',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    lineImage: 'https://picsum.photos/400/300?random=70',
    contactPhone: '09121234567',
    description: 'لاین ناخن کامل با میز حرفه‌ای، دستگاه UV/LED، و مجموعه کامل لاک ژل.',
    createdAt: '۱۴۰۳/۰۴/۱۱',
    expiresAt: '۱۴۰۳/۰۵/۱۱',
    serviceTypeId: 'nail',
    fixedAmount: 0,
    createdAtTimestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'lr_2',
    businessId: 'b2',
    title: 'لاین میکاپ با نور طبیعی',
    serviceTypeName: 'میکاپ و گریم',
    serviceTypeIcon: 'palette',
    serviceTypeColor: '#AD1457',
    collabType: 'hourly',
    priceDisplay: '۱۵۰K / ساعت',
    businessName: 'استودیو لاویا',
    city: 'تهران، نیاوران',
    lineImage: 'https://picsum.photos/400/300?random=71',
    contactPhone: '09129876543',
    description: 'لاین میکاپ با نور طبیعی، آینه LED حرفه‌ای و میز گریم کامل.',
    createdAt: '۱۴۰۳/۰۴/۰۴',
    expiresAt: '۱۴۰۳/۰۵/۰۴',
    serviceTypeId: 'makeup',
    fixedAmount: 0,
    createdAtTimestamp: Date.now() - 8 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'lr_3',
    businessId: 'b3',
    title: 'لاین لیزر با دستگاه الکس',
    serviceTypeName: 'لیزر موهای زائد',
    serviceTypeIcon: 'flash-on',
    serviceTypeColor: '#00838F',
    collabType: 'fixed',
    priceDisplay: '۸M ماهانه',
    businessName: 'کلینیک رویال',
    city: 'اصفهان',
    lineImage: 'https://picsum.photos/400/300?random=72',
    contactPhone: '09121112233',
    description: 'لاین لیزر با دستگاه الکساندرایت ۲۰۲۴، اتاق اختصاصی با تهویه مناسب.',
    createdAt: '۱۴۰۳/۰۳/۲۷',
    expiresAt: '۱۴۰۳/۰۴/۲۷',
    serviceTypeId: 'laser',
    fixedAmount: 8000000,
    createdAtTimestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'lr_4',
    businessId: 'b4',
    title: 'لاین فیشیال حرفه‌ای',
    serviceTypeName: 'فیشیال',
    serviceTypeIcon: 'face-retouching-natural',
    serviceTypeColor: '#C2185B',
    collabType: 'fixed',
    priceDisplay: '۵M + رهن',
    businessName: 'مرکز پوست صدف',
    city: 'تهران، ونک',
    lineImage: 'https://picsum.photos/400/300?random=73',
    contactPhone: '09124445566',
    description: 'لاین فیشیال VIP با تخت حرفه‌ای، دستگاه هیدروفیشیال و محصولات کره‌ای.',
    createdAt: '۱۴۰۳/۰۳/۲۰',
    expiresAt: '۱۴۰۳/۰۴/۲۰',
    serviceTypeId: 'facial',
    fixedAmount: 5000000,
    createdAtTimestamp: Date.now() - 22 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'lr_5',
    businessId: 'b5',
    title: 'لاین کراتین و رنگ مو',
    serviceTypeName: 'کراتین و احیای مو',
    serviceTypeIcon: 'flare',
    serviceTypeColor: '#E65100',
    collabType: 'percent',
    priceDisplay: '۵۰-۵۰٪',
    businessName: 'سالن زیبایی افرا',
    city: 'تهران، شهرک غرب',
    lineImage: 'https://picsum.photos/400/300?random=74',
    contactPhone: '09127778899',
    description: 'لاین تخصصی کراتین و رنگ مو با مواد اورجینال برزیلی و ایتالیایی.',
    createdAt: '۱۴۰۳/۰۳/۱۵',
    expiresAt: '۱۴۰۳/۰۴/۱۵',
    serviceTypeId: 'keratin',
    fixedAmount: 0,
    createdAtTimestamp: Date.now() - 27 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'lr_6',
    businessId: 'b6',
    title: 'لاین مژه و ابرو',
    serviceTypeName: 'کاشت مژه و ابرو',
    serviceTypeIcon: 'visibility',
    serviceTypeColor: '#4527A0',
    collabType: 'hourly',
    priceDisplay: '۱۰۰K / ساعت',
    businessName: 'سالن زیبایی ماهرو',
    city: 'کرج، فردیس',
    lineImage: 'https://picsum.photos/400/300?random=75',
    contactPhone: '09125556677',
    description: 'لاین کاشت مژه با تخت راحت، نور تخصصی و مجموعه کامل مژه‌های هالیوودی.',
    createdAt: '۱۴۰۳/۰۳/۱۰',
    expiresAt: '۱۴۰۳/۰۴/۱۰',
    serviceTypeId: 'eyelash',
    fixedAmount: 0,
    createdAtTimestamp: Date.now() - 32 * 24 * 60 * 60 * 1000,
  },
];

export default function AllLineRentalsScreen({ navigation }) {
  const { colors } = useTheme();
  const [ads] = useState(MOCK_LINE_RENTALS);
  const [refreshing, setRefreshing] = useState(false);
  
  // 🎯 state فیلتر ساده‌شده
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    collabType: 'all',
    serviceType: 'all',
  });

  // 🎯 تشخیص فیلتر فعال
  const hasActiveFilter =
    filters.collabType !== 'all' ||
    filters.serviceType !== 'all';

  // 🎯 فیلتر ساده‌شده
  const filteredAds = useMemo(() => {
    let data = [...ads];

    if (filters.collabType !== 'all') {
      data = data.filter(a => a.collabType === filters.collabType);
    }
    if (filters.serviceType !== 'all') {
      data = data.filter(a => a.serviceTypeId === filters.serviceType);
    }

    return data;
  }, [ads, filters]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAdPress = (ad) => {
    navigation.navigate('LineRentalDetail', { ad });
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <AllLineRentalsHeader
        adsCount={filteredAds.length}
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
            tintColor="#667eea"
          />
        }
      >
        <View style={s.listContainer}>
          {filteredAds.length > 0 ? (
            filteredAds.map((ad) => (
              <AllLineRentalsCard key={ad.id} ad={ad} onPress={handleAdPress} />
            ))
          ) : (
            <AllLineRentalsEmptyState />
          )}
        </View>
      </ScrollView>

      {/* 🎯 مدال فیلتر ساده‌شده */}
      <LineRentalFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
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
    paddingTop: 16,
  },
});