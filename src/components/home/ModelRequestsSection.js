// src/components/home/ModelRequestsSection.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ModelRequestCard from './ModelRequestCard';
import SeeAllButton from './SeeAllButton';

const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    title: 'مدل فیشیال VIP عروس',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/400/300?random=50',
    businessName: 'کلینیک زیبایی صدف',
    city: 'تهران، سعادت‌آباد',
    discount: 50,
    isUrgent: true,
  },
  {
    id: 'mr_2',
    title: 'مدل طراحی ناخن ژورنالی',
    serviceName: 'کاشت ناخن',
    serviceImage: 'https://picsum.photos/400/300?random=51',
    businessName: 'ناخن گالری پریا',
    city: 'کرج، فردیس',
    discount: 70,
    isUrgent: false,
  },
  {
    id: 'mr_3',
    title: 'مدل تکنیک بالیاژ فرانسوی',
    serviceName: 'رنگ و لایت مو',
    serviceImage: 'https://picsum.photos/400/300?random=52',
    businessName: 'سالن زیبایی افرا',
    city: 'تهران، نیاوران',
    discount: 60,
    isUrgent: false,
  },
  {
    id: 'mr_4',
    title: 'مدل لیزر الکس ۲۰۲۴',
    serviceName: 'لیزر موهای زائد',
    serviceImage: 'https://picsum.photos/400/300?random=53',
    businessName: 'مرکز لیزر رویال',
    city: 'تهران، شهرک غرب',
    discount: 0, // 🎯 بدون تخفیف → "با هزینه مواد"
    isUrgent: true,
  },
  {
    id: 'mr_5',
    title: 'مدل اکستنشن مژه هالیوودی',
    serviceName: 'کاشت مژه',
    serviceImage: 'https://picsum.photos/400/300?random=54',
    businessName: 'سالن زیبایی افرا',
    city: 'تهران، نیاوران',
    discount: 0,
    isUrgent: false,
  },
];

export default function ModelRequestsSection({ onSeeAll, onItemPress }) {
  const { colors } = useTheme();

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
        <SeeAllButton onPress={onSeeAll} count={MOCK_MODEL_REQUESTS.length} />
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
            onPress={onItemPress}
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