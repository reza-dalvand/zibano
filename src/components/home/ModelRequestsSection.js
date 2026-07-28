// src/components/home/ModelRequestsSection.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../stores/useThemeStore';
import { useNavigation } from '@react-navigation/native';
import SectionHeader from '../common/SectionHeader';
import ModelRequestCard from './ModelRequestCard';
import SeeAllButton from './SeeAllButton';
import Card from '../common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from 'react-native';

// ✅ داده‌های MOCK کامل
const MOCK_MODEL_REQUESTS = [
  {
    id: 'mr_1',
    title: 'مدل فیشیال VIP عروس',
    serviceName: 'فیشیال تخصصی پوست',
    serviceImage: 'https://picsum.photos/400/300?random=50',
    businessName: 'کلینیک زیبایی صدف',
    businessId: 'b1',
    city: 'تهران، سعادت‌آباد',
    serviceTypeId: 'facial',
    discount: 50,
    isUrgent: true,
    costType: 'paid',
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
    serviceTypeId: 'nail',
    discount: 70,
    isUrgent: false,
    costType: 'material_cost',
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
    serviceTypeId: 'hair',
    discount: 60,
    isUrgent: false,
    costType: 'paid',
    contactPhone: '09121112233',
    createdAt: '۱۴۰۳/۰۴/۰۵',
    expiresAt: '۱۴۰۳/۰۴/۱۵',
  },
];

export default function ModelRequestsSection() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  
  const handleItemPress = (request) => {
    navigation.navigate('ModelRequestDetail', { request });
  };
  
  const handleSeeAll = () => {
    navigation.navigate('AllModelRequests');
  };
  
  return (
    <View style={s.section}>
      <SectionHeader
        icon="face-retouching-natural"
        iconColor="#E91E63"
        title="فرصت‌های مدلینگ"
        subtitle="با تخفیف ویژه مدل شوید و نمونه‌کار بسازید"
        rightElement={
          <SeeAllButton onPress={handleSeeAll} count={MOCK_MODEL_REQUESTS.length} />
        }
      />
      <Card variant="default" padding={10} radius={12} style={[s.promoBanner, { backgroundColor: '#E91E6308', borderColor: '#E91E6340' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="auto-awesome" size={16} color="#E91E63" />
          <Text style={{ fontSize: 11, fontFamily: 'Vazir', flex: 1, lineHeight: 17, color: colors.textMain }}>
            با شرکت در درخواست‌های مدلینگ، تا{' '}
            <Text style={{ fontFamily: 'Vazir-Bold', color: '#E91E63' }}>۸۰٪ تخفیف</Text> بگیرید
          </Text>
        </View>
      </Card>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cardsContainer}>
        {MOCK_MODEL_REQUESTS.map((request) => (
          <ModelRequestCard key={request.id} request={request} onPress={handleItemPress} />
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  section: { marginBottom: 24 },
  promoBanner: { borderWidth: 1, marginBottom: 12 },
  cardsContainer: { gap: 12, paddingRight: 4 },
});