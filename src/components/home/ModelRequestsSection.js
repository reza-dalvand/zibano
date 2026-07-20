// src/components/home/ModelRequestsSection.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native'; // 🆕
import ModelRequestCard from './ModelRequestCard';
import SeeAllButton from './SeeAllButton';

// 🎯 داده‌های کامل‌تر با businessId و contactPhone برای navigation
const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    businessId: 'b1', // 🆕 شناسه کسب‌وکار
    title: 'مدل فیشیال VIP عروس',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/400/300?random=50',
    businessName: 'کلینیک زیبایی صدف',
    city: 'تهران، سعادت‌آباد',
    costType: 'paid', // 🆕 نوع هزینه
    discount: 50,
    isUrgent: true,
    contactPhone: '09121234567', // 🆕 شماره تماس
    description: 'نیاز به مدل برای تست محصولات جدید فیشیال. این خدمت شامل پاکسازی عمیق پوست، استفاده از ماسک طلای ۲۴ عیار و ماساژ صورت با روغن‌های طبیعی است.',
    createdAt: '۱۴۰۳/۰۴/۱۰',
    expiresAt: '۱۴۰۳/۰۴/۲۰',
  },
  {
    id: 'mr_2',
    businessId: 'b2',
    title: 'مدل طراحی ناخن ژورنالی',
    serviceName: 'کاشت ناخن',
    serviceImage: 'https://picsum.photos/400/300?random=51',
    businessName: 'ناخن گالری پریا',
    city: 'کرج، فردیس',
    costType: 'material_cost',
    discount: 70,
    isUrgent: false,
    contactPhone: '09129876543',
    description: 'طراحی‌های جدید و خاص برای نمونه‌کار با تکنیک‌های روز دنیا.',
    createdAt: '۱۴۰۳/۰۴/۰۸',
    expiresAt: '۱۴۰۳/۰۴/۱۸',
  },
  {
    id: 'mr_3',
    businessId: 'b3',
    title: 'مدل تکنیک بالیاژ فرانسوی',
    serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/400/300?random=52',
    businessName: 'سالن زیبایی افرا',
    city: 'تهران، نیاوران',
    costType: 'paid',
    discount: 60,
    isUrgent: false,
    contactPhone: '09121112233',
    description: 'تست تکنیک جدید بالیاژ فرانسوی با مواد اورجینال ایتالیایی.',
    createdAt: '۱۴۰۳/۰۴/۰۵',
    expiresAt: '۱۴۰۳/۰۴/۱۵',
  },
  {
    id: 'mr_4',
    businessId: 'b4',
    title: 'مدل لیزر الکس ۲۰۲۴',
    serviceName: 'لیزر موهای زائد',
    serviceImage: 'https://picsum.photos/400/300?random=53',
    businessName: 'مرکز لیزر رویال',
    city: 'تهران، شهرک غرب',
    costType: 'material_cost',
    discount: 0,
    isUrgent: true,
    contactPhone: '09124445566',
    description: 'تست دستگاه جدید لیزر الکساندرایت ۲۰۲۴. بدون درد و با خنک‌کننده قوی.',
    createdAt: '۱۴۰۳/۰۴/۰۳',
    expiresAt: '۱۴۰۳/۰۴/۱۳',
  },
  {
    id: 'mr_5',
    businessId: 'b5',
    title: 'مدل اکستنشن مژه هالیوودی',
    serviceName: 'کاشت مژه',
    serviceImage: 'https://picsum.photos/400/300?random=54',
    businessName: 'سالن زیبایی افرا',
    city: 'تهران، نیاوران',
    costType: 'free',
    discount: 0,
    isUrgent: false,
    contactPhone: '09127778899',
    description: 'اکستنشن مژه هالیوودی با متریال درجه یک.',
    createdAt: '۱۴۰۳/۰۴/۰۱',
    expiresAt: '۱۴۰۳/۰۴/۱۱',
  },
];

export default function ModelRequestsSection() {
  const { colors } = useTheme();
  const navigation = useNavigation(); // 🆕

  // 🎯 هندلر کلیک روی کارت - هدایت مستقیم به جزئیات آگهی
  const handleItemPress = (request) => {
    navigation.navigate('ModelRequestDetail', { request });
  };

  // 🎯 هندلر کلیک روی "مشاهده همه" - هدایت به لیست کامل
  const handleSeeAll = () => {
    navigation.navigate('AllModelRequests');
  };

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={s.titleRow}>
          <View style={[s.iconBox, { backgroundColor: '#E91E6315' }]}>
            <Icon name="face-retouching-natural" size={18} color="#E91E63" />
          </View>
          <View style={s.titleTextCol}>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              فرصت‌های مدلینگ
            </Text>
            <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
              با تخفیف ویژه مدل شوید و نمونه‌کار بسازید
            </Text>
          </View>
        </View>
        <SeeAllButton onPress={handleSeeAll} count={MOCK_MODEL_REQUESTS.length} />
      </View>
      <View
        style={[
          s.promoBanner,
          {
            backgroundColor: '#E91E6308',
            borderColor: '#E91E6340',
          },
        ]}
      >
        <Icon name="auto-awesome" size={16} color="#E91E63" />
        <Text style={[s.promoText, { color: colors.textMain }]}>
          با شرکت در درخواست‌های مدلینگ، تا{' '}
          <Text style={{ fontFamily: 'Vazir-Bold', color: '#E91E63' }}>
            ۸۰٪ تخفیف
          </Text>{' '}
          بگیرید
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.cardsContainer}
      >
        {MOCK_MODEL_REQUESTS.map((request) => (
          <ModelRequestCard
            key={request.id}
            request={request}
            onPress={handleItemPress} // 🎯 هدایت مستقیم به جزئیات
          />
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  titleTextCol: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  promoText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 17,
  },
  cardsContainer: {
    gap: 12,
    paddingRight: 4,
  },
});