// src/screens/home/AllModelRequestsScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import AllModelRequestsHeader from '../../components/home/AllModelRequestsHeader';
import AllModelRequestsCard from '../../components/home/AllModelRequestsCard';
import AllModelRequestsEmptyState from '../../components/home/AllModelRequestsEmptyState';

const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    title: 'مدل فیشیال VIP عروس',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/400/300?random=50',
    businessName: 'کلینیک زیبایی صدف',
    businessId: 'b1',
    city: 'تهران، سعادت‌آباد',
    discount: 50,
    isUrgent: true,
    costType: 'paid',
    description: 'نیاز به مدل برای تست محصولات جدید فیشیال. این خدمت شامل پاکسازی عمیق پوست، استفاده از ماسک طلای ۲۴ عیار و ماساژ صورت با روغن‌های طبیعی است. مدل باید پوست حساس نداشته باشد و ترجیحاً بین ۲۰ تا ۳۵ سال سن داشته باشد.',
    contactPhone: '09121234567',
    createdAt: '۱۴۰۳/۰۴/۱۰',
    expiresAt: '۱۴۰۳/۰۴/۲۰',
  },
  {
    id: 'mr_2',
    title: 'مدل طراحی ناخن ژورنالی',
    serviceName: 'کاشت ناخن',
    serviceImage: 'https://picsum.photos/400/300?random=51',
    businessName: 'ناخن گالری پریا',
    businessId: 'b2',
    city: 'کرج، فردیس',
    discount: 70,
    isUrgent: false,
    costType: 'material_cost',
    description: 'طراحی‌های جدید و خاص برای نمونه‌کار با تکنیک‌های روز دنیا. مناسب ناخن‌های طبیعی و سالم. مدل باید حداقل ۲ ساعت وقت آزاد داشته باشد.',
    contactPhone: '09129876543',
    createdAt: '۱۴۰۳/۰۴/۰۸',
    expiresAt: '۱۴۰۳/۰۴/۱۸',
  },
  {
    id: 'mr_3',
    title: 'مدل تکنیک بالیاژ فرانسوی',
    serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/400/300?random=52',
    businessName: 'سالن زیبایی افرا',
    businessId: 'b3',
    city: 'تهران، نیاوران',
    discount: 60,
    isUrgent: false,
    costType: 'paid',
    description: 'تست تکنیک جدید بالیاژ فرانسوی با مواد اورجینال ایتالیایی. مناسب موهای بلند و سالم. مدل باید موهای خود را حداقل ۶ ماه رنگ نکرده باشد.',
    contactPhone: '09121112233',
    createdAt: '۱۴۰۳/۰۴/۰۵',
    expiresAt: '۱۴۰۳/۰۴/۱۵',
  },
  {
    id: 'mr_4',
    title: 'مدل لیزر الکس ۲۰۲۴',
    serviceName: 'لیزر موهای زائد',
    serviceImage: 'https://picsum.photos/400/300?random=53',
    businessName: 'مرکز لیزر رویال',
    businessId: 'b4',
    city: 'تهران، شهرک غرب',
    discount: 0,
    isUrgent: true,
    costType: 'material_cost',
    description: 'تست دستگاه جدید لیزر الکساندرایت ۲۰۲۴. بدون درد و با خنک‌کننده قوی. مدل باید پوست روشن تا متوسط داشته باشد و موهای تیره.',
    contactPhone: '09124445566',
    createdAt: '۱۴۰۳/۰۴/۰۳',
    expiresAt: '۱۴۰۳/۰۴/۱۳',
  },
  {
    id: 'mr_5',
    title: 'مدل اکستنشن مژه هالیوودی',
    serviceName: 'کاشت مژه',
    serviceImage: 'https://picsum.photos/400/300?random=54',
    businessName: 'سالن زیبایی افرا',
    businessId: 'b3',
    city: 'تهران، نیاوران',
    discount: 0,
    isUrgent: false,
    costType: 'free',
    description: 'اکستنشن مژه هالیوودی با متریال درجه یک. مدل باید مژه‌های طبیعی سالم داشته باشد و به مواد حساسیت نداشته باشد.',
    contactPhone: '09127778899',
    createdAt: '۱۴۰۳/۰۴/۰۱',
    expiresAt: '۱۴۰۳/۰۴/۱۱',
  },
];

export default function AllModelRequestsScreen({ navigation }) {
  const { colors } = useTheme();
  const [requests, setRequests] = useState(MOCK_MODEL_REQUESTS);
  const [refreshing, setRefreshing] = useState(false);

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
        requestsCount={requests.length}
        onBackPress={() => navigation.goBack()}
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
          {requests.length > 0 ? (
            requests.map((request) => (
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