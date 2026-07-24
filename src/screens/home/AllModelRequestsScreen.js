// src/screens/home/AllModelRequestsScreen.js
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../../stores/useThemeStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import AllModelRequestsHeader from '../../components/home/AllModelRequestsHeader';
import AllModelRequestsCard from '../../components/home/AllModelRequestsCard';
import AllModelRequestsEmptyState from '../../components/home/AllModelRequestsEmptyState';
import ModelRequestFilterModal from '../../components/home/ModelRequestFilterModal';

const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    title: 'مدل فیشیال VIP عروس',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/400/300?random=50',
    businessName: 'کلینیک زیبایی صدف',
    businessId: 'b1',
    city: 'تهران، سعادت‌آباد',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    serviceTypeId: 'facial',
    discount: 50,
    isUrgent: true,
    costType: 'paid',
    description: 'نیاز به مدل برای تست محصولات جدید فیشیال. این خدمت شامل پاکسازی عمیق پوست، استفاده از ماسک طلای ۲۴ عیار و ماساژ صورت با روغن‌های طبیعی است. مدل باید پوست حساس نداشته باشد و ترجیحاً بین ۲۰ تا ۳۵ سال سن داشته باشد.',
    contactPhone: '09121234567',
    createdAt: '۱۴۰۳/۰۴/۱۰',
    expiresAt: '۱۴۰۳/۰۴/۲۰',
    createdAtTimestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'mr_2',
    title: 'مدل طراحی ناخن ژورنالی',
    serviceName: 'کاشت ناخن',
    serviceImage: 'https://picsum.photos/400/300?random=51',
    businessName: 'ناخن گالری پریا',
    businessId: 'b2',
    city: 'کرج، فردیس',
    provinceId: 'alborz',
    cityId: 'fardis',
    serviceTypeId: 'nail',
    discount: 70,
    isUrgent: false,
    costType: 'material_cost',
    description: 'طراحی‌های جدید و خاص برای نمونه‌کار با تکنیک‌های روز دنیا. مناسب ناخن‌های طبیعی و سالم. مدل باید حداقل ۲ ساعت وقت آزاد داشته باشد.',
    contactPhone: '09129876543',
    createdAt: '۱۴۰۳/۰۴/۰۸',
    expiresAt: '۱۴۰۳/۰۴/۱۸',
    createdAtTimestamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'mr_3',
    title: 'مدل تکنیک بالیاژ فرانسوی',
    serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/400/300?random=52',
    businessName: 'سالن زیبایی افرا',
    businessId: 'b3',
    city: 'تهران، نیاوران',
    provinceId: 'tehran',
    cityId: 'shemiran',
    serviceTypeId: 'hair',
    discount: 60,
    isUrgent: false,
    costType: 'paid',
    description: 'تست تکنیک جدید بالیاژ فرانسوی با مواد اورجینال ایتالیایی. مناسب موهای بلند و سالم. مدل باید موهای خود را حداقل ۶ ماه رنگ نکرده باشد.',
    contactPhone: '09121112233',
    createdAt: '۱۴۰۳/۰۴/۰۵',
    expiresAt: '۱۴۰۳/۰۴/۱۵',
    createdAtTimestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'mr_4',
    title: 'مدل لیزر الکس ۲۰۲۴',
    serviceName: 'لیزر موهای زائد',
    serviceImage: 'https://picsum.photos/400/300?random=53',
    businessName: 'مرکز لیزر رویال',
    businessId: 'b4',
    city: 'تهران، شهرک غرب',
    provinceId: 'tehran',
    cityId: 'tehran-city',
    serviceTypeId: 'laser',
    discount: 0,
    isUrgent: true,
    costType: 'material_cost',
    description: 'تست دستگاه جدید لیزر الکساندرایت ۲۰۲۴. بدون درد و با خنک‌کننده قوی. مدل باید پوست روشن تا متوسط داشته باشد و موهای تیره.',
    contactPhone: '09124445566',
    createdAt: '۱۴۰۳/۰۴/۰۳',
    expiresAt: '۱۴۰۳/۰۴/۱۳',
    createdAtTimestamp: Date.now() - 17 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'mr_5',
    title: 'مدل اکستنشن مژه هالیوودی',
    serviceName: 'کاشت مژه',
    serviceImage: 'https://picsum.photos/400/300?random=54',
    businessName: 'سالن زیبایی افرا',
    businessId: 'b3',
    city: 'تهران، نیاوران',
    provinceId: 'tehran',
    cityId: 'shemiran',
    serviceTypeId: 'eyelash',
    discount: 0,
    isUrgent: false,
    costType: 'free',
    description: 'اکستنشن مژه هالیوودی با متریال درجه یک. مدل باید مژه‌های طبیعی سالم داشته باشد و به مواد حساسیت نداشته باشد.',
    contactPhone: '09127778899',
    createdAt: '۱۴۰۳/۰۴/۰۱',
    expiresAt: '۱۴۰۳/۰۴/۱۱',
    createdAtTimestamp: Date.now() - 19 * 24 * 60 * 60 * 1000,
  },
];

export default function AllModelRequestsScreen({ navigation }) {
  const { colors } = useTheme();
  const [requests] = useState(MOCK_MODEL_REQUESTS);
  const [refreshing, setRefreshing] = useState(false);

  // 🎯 state فیلتر ساده‌شده
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    costType: 'all',
    serviceType: 'all',
  });

  // 🎯 تشخیص فیلتر فعال
  const hasActiveFilter =
    filters.costType !== 'all' || filters.serviceType !== 'all';

  // 🎯 فیلتر ساده‌شده
  const filteredRequests = useMemo(() => {
    let data = [...requests];

    if (filters.costType !== 'all') {
      data = data.filter(r => r.costType === filters.costType);
    }
    if (filters.serviceType !== 'all') {
      data = data.filter(r => r.serviceTypeId === filters.serviceType);
    }

    return data;
  }, [requests, filters]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };
  const handleRequestPress = (request) => {
    navigation.navigate('ModelRequestDetail', { request });
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <AllModelRequestsHeader
        requestsCount={filteredRequests.length}
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
            tintColor="#E91E63"
          />
        }
      >
        <View style={s.listContainer}>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <AllModelRequestsCard
                key={request.id}
                request={request}
                onPress={handleRequestPress}
              />
            ))
          ) : (
            <AllModelRequestsEmptyState />
          )}
        </View>
      </ScrollView>

      {/* 🎯 مدال فیلتر ساده‌شده */}
      <ModelRequestFilterModal
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