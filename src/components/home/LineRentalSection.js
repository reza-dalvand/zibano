// src/components/home/LineRentalSection.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import LineRentalCard from './LineRentalCard';
import SeeAllButton from './SeeAllButton';

const MOCK_LINE_RENTALS = [
  {
    id: 'lr_1',
    title: 'لاین ناخن VIP با تجهیزات کامل',
    serviceTypeName: 'کاشت ناخن',
    serviceTypeIcon: 'brush',
    serviceTypeColor: '#7B1FA2',
    collabType: 'percent',
    priceDisplay: '۴۰-۶۰٪',
    businessName: 'سالن نیلارام',
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
    serviceTypeName: 'لیزر',
    serviceTypeIcon: 'flash-on',
    serviceTypeColor: '#00838F',
    collabType: 'fixed',
    priceDisplay: '۸M ماهانه',
    businessName: 'کلینیک رویال',
    city: 'اصفهان',
    lineImage: 'https://picsum.photos/400/300?random=72',
  },
  {
    id: 'lr_4',
    title: 'لاین فیشیال حرفه‌ای',
    serviceTypeName: 'فیشیال',
    serviceTypeIcon: 'face-retouching-natural',
    serviceTypeColor: '#C2185B',
    collabType: 'fixed',
    priceDisplay: '۵M + رهن',
    businessName: 'مرکز پوست صدف',
    city: 'تهران',
    lineImage: 'https://picsum.photos/400/300?random=73',
  },
];

export default function LineRentalSection({ onSeeAll, onItemPress }) {
  const { colors } = useTheme();

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={s.titleRow}>
          <View style={[s.iconBox, { backgroundColor: '#667eea15' }]}>
            <Icon name="storefront" size={18} color="#667eea" />
          </View>
          <View style={s.titleTextCol}>
            <Text style={[s.sectionTitle, { color: colors.textMain }]}>
              فرصت‌های همکاری
            </Text>
            <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
             با اجاره لاین و کسب‌وکار خود را گسترش دهید
            </Text>
          </View>
        </View>
        <SeeAllButton onPress={onSeeAll} count={MOCK_LINE_RENTALS.length} />
      </View>

      <View
        style={[
          s.promoBanner,
          {
            backgroundColor: '#667eea08',
            borderColor: '#667eea40',
          },
        ]}
      >
        <Icon name="workspace-premium" size={16} color="#667eea" />
        <Text style={[s.promoText, { color: colors.textMain }]}>
          برای متخصصان: با حداقل سرمایه، کسب‌وکار خود را راه‌اندازی کنید
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.cardsContainer}
      >
        {MOCK_LINE_RENTALS.map((ad) => (
          <LineRentalCard key={ad.id} ad={ad} onPress={onItemPress} />
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