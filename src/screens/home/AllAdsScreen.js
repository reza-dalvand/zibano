// src/screens/home/AllAdsScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../../stores/useThemeStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import AllAdsHeader from '../../components/home/AllAdsHeader';
import AllAdsCard from '../../components/home/AllAdsCard';
import AllAdsEmptyState from '../../components/home/AllAdsEmptyState';

// ✅ اضافه شدن businessId به داده‌های موقت برای هدایت صحیح
const MOCK_ALL_ADS = [
  {
    id: 1,
    businessId: '1', // ✅ شناسه کسب‌وکار برای نویگیشن
    imageUrl: 'https://picsum.photos/800/400?random=1',
    title: 'جشنواره تخفیف‌های بهار کلینیک رُز',
    subtitle: 'تا ۳۰٪ تخفیف خدمات پوست و فیشیال VIP',
    badge: 'پیشنهاد ویژه',
    businessName: 'کلینیک زیبایی رُز',
    city: 'تهران، ونک',
  },
  {
    id: 2,
    businessId: '2', // ✅ شناسه کسب‌وکار برای نویگیشن
    imageUrl: 'https://picsum.photos/800/400?random=2',
    title: 'افتتاحیه سالن زیبایی لاویا',
    subtitle: 'نوبت‌دهی آنلاین با بیعانه اقتصادی',
    badge: 'جدید',
    businessName: 'سالن زیبایی لاویا',
    city: 'تهران، نیاوران',
  },
  // ... سایر آیتم‌ها هم می‌توانند businessId داشته باشند
];

export default function AllAdsScreen({ navigation }) {
  const { colors } = useTheme();
  const [ads, setAds] = useState(MOCK_ALL_ADS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // ✅ تابع هدایت به صفحه جزئیات کسب‌وکار
  const handleAdPress = (ad) => {
    // هدایت به صفحه BusinessDetails که در HomeStackNavigator تعریف شده است
    navigation.navigate('BusinessDetails', { 
      businessId: ad.businessId || '1' 
    });
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <AllAdsHeader
        adsCount={ads.length}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={s.listContainer}>
          {ads.length > 0 ? (
            ads.map((ad) => (
              <AllAdsCard
                key={ad.id}
                ad={ad}
                onPress={handleAdPress} // ✅ پاس دادن تابع نویگیشن به کامپوننت
              />
            ))
          ) : (
            <AllAdsEmptyState />
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