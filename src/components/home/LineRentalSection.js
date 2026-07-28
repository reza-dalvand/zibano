// src/components/home/LineRentalSection.js
import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { useNavigation } from '@react-navigation/native';
import SectionHeader from '../common/SectionHeader';
import LineRentalCard from './LineRentalCard';
import SeeAllButton from './SeeAllButton';
import Card from '../common/Card';

// ✅ داده‌های MOCK کامل
const MOCK_LINE_RENTALS = [
  {
    id: 'lr_1',
    title: 'لاین ناخن VIP با تجهیزات کامل',
    serviceTypeName: 'کاشت ناخن',
    serviceTypeIcon: 'brush',
    serviceTypeColor: '#7B1FA2',
    collabType: 'percent',
    priceDisplay: '۴۰-۶۰٪',
    businessName: 'سالن زیبایی نیلارام',
    city: 'تهران، سعادت‌آباد',
    lineImage: 'https://picsum.photos/400/300?random=70',
  },
  {
    id: 'lr_2',
    title: 'لاین میکاپ با نور طبیعی',
    serviceTypeName: 'میکاپ و گریم',
    serviceTypeIcon: 'palette',
    serviceTypeColor: '#AD1457',
    collabType: 'hourly',
    priceDisplay: '۱۵۰K / ساعت',
    businessName: 'استودیو لاویا',
    city: 'تهران، نیاوران',
    lineImage: 'https://picsum.photos/400/300?random=71',
  },
  {
    id: 'lr_3',
    title: 'لاین لیزر با دستگاه الکس',
    serviceTypeName: 'لیزر موهای زائد',
    serviceTypeIcon: 'flash-on',
    serviceTypeColor: '#00838F',
    collabType: 'fixed',
    priceDisplay: '۸M ماهانه',
    businessName: 'کلینیک رویال',
    city: 'اصفهان',
    lineImage: 'https://picsum.photos/400/300?random=72',
  },
];

export default function LineRentalSection() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  
  const handleSeeAll = () => navigation.navigate('AllLineRentals');
  const handleItemPress = (ad) => navigation.navigate('LineRentalDetail', { ad });
  
  return (
    <View style={s.section}>
      <SectionHeader
        icon="storefront"
        iconColor="#667eea"
        title="فرصت‌های همکاری"
        subtitle="با اجاره لاین، کسب‌وکار خود را گسترش دهید"
        rightElement={<SeeAllButton onPress={handleSeeAll} count={MOCK_LINE_RENTALS.length} />}
      />
      <Card variant="default" padding={10} radius={12} style={[s.promoBanner, { backgroundColor: '#667eea08', borderColor: '#667eea40' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="workspace-premium" size={16} color="#667eea" />
          <Text style={{ fontSize: 11, fontFamily: 'Vazir', flex: 1, lineHeight: 17, color: colors.textMain }}>
            برای متخصصان: با حداقل سرمایه، کسب‌وکار خود را راه‌اندازی کنید
          </Text>
        </View>
      </Card>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cardsContainer}>
        {MOCK_LINE_RENTALS.map((ad) => (
          <LineRentalCard key={ad.id} ad={ad} onPress={handleItemPress} />
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