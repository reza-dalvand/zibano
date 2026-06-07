// src/screens/HomeScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import SearchBar from '../../components/common/SearchBar';
import AdSlider from '../../components/home/AdSlider';
import CategoryGrid from '../../components/home/CategoryGrid';

// دیتای موقت برای نمایش اولیه (بعداً با API جایگزین می‌شود)
const MOCK_ADS = [
  { id: 1, imageUrl: 'https://picsum.photos/800/400?random=1', title: 'جشنواره تخفیف‌های بهار کلینیک رُز', subtitle: 'تا ۳۰٪ تخفیف خدمات پوست' },
  { id: 2, imageUrl: 'https://picsum.photos/800/400?random=2', title: 'افتتاحیه سالن زیبایی لاویا', subtitle: 'نوبت‌دهی آنلاین با بیعانه اقتصادی' },
];

const MOCK_CATEGORIES = [
  { id: 1, name: 'میکاپ', icon: 'face' },
  { id: 2, name: 'کاشت ناخن', icon: 'brush' },
  { id: 3, name: 'لیزر مو', icon: 'flash-on' },
  { id: 4, name: 'پاکسازی', icon: 'spa' },
];

const MOCK_SERVICES = [
  { id: 1, name: 'فیشیال تخصصی پوست', business: 'کلینیک صدف', price: '۷۵۰,۰۰۰ تومان', rating: '۴.۸', image: 'https://picsum.photos/150?random=11' },
  { id: 2, name: 'کاشت مژه هالیوودی', business: 'سالن زیبایی افرا', price: '۵۸۰,۰۰۰ تومان', rating: '۴.۹', image: 'https://picsum.photos/150?random=12' },
];

const MOCK_BUSINESSES = [
  { id: 1, name: 'مجموعه زیبایی و سلامت نیلارام', address: 'تهران، سعادت آباد', rating: '۵.۰', VIP: true, logo: 'https://picsum.photos/100?random=21' },
  { id: 2, name: 'سالن تخصصی کراتین و رنگ موی النا', address: 'تهران، نیاوران', rating: '۴.۷', VIP: false, logo: 'https://picsum.photos/100?random=22' },
];

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <ScreenWrapper scrollable padding={0} edges={['top']}>
      
      {/* هدر و بخش جستجو */}
      <View style={s.headerContainer}>
        <View style={s.welcomeRow}>
          <Text style={[s.welcomeText, { color: colors.textSecondary }]}>سلام، وقت بخیر 👋</Text>
          <Text style={[s.appName, { color: colors.primary }]}>زیبانو</Text>
        </View>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="جستجوی خدمات، سالن‌ها و کلینیک‌ها..."
          onSubmit={() => {
            // هدایت به صفحه SearchFilterScreen همراه با کوئری
            navigation?.navigate('SearchFilter', { query: searchQuery });
          }}
        />
      </View>

      {/* ۱. اسلایدر تبلیغات کسب‌وکارها */}
      <AdSlider 
        ads={MOCK_ADS} 
        onPress={(ad) => console.log('Ad pressed:', ad.id)} 
      />

      {/* کانتینر داخلی برای بخش‌هایی که نیاز به پدینگ افقی دارند */}
      <View style={s.bodyContainer}>
        
        {/* ۲. دسته‌بندی خدمات */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>دسته‌بندی خدمات</Text>
        </View>
        <CategoryGrid
          categories={MOCK_CATEGORIES}
          selectedId={selectedCategory}
          onSelect={(item) =>
            navigation.navigate(
              'CategoryBusinesses',
              {
                categoryId: item.id,
                categoryName: item.name,
              },
            )
          }
        />

        {/* ۳. پیشنهاد خدمات (محبوب‌ترین‌ها / بیشترین رزرو) */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>پیشنهاد خدمات زیبایی</Text>
          <TouchableOpacity>
            <Text style={[s.seeAll, { color: colors.primary }]}>مشاهده همه</Text>
          </TouchableOpacity>
        </View>
        
        {MOCK_SERVICES.map((service) => (
          <TouchableOpacity 
            key={service.id} 
            style={[s.serviceCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => navigation?.navigate('ServiceDetail', { id: service.id })}
          >
            <Image source={{ uri: service.image }} style={s.serviceImage} />
            <View style={s.serviceInfo}>
              <Text style={[s.serviceName, { color: colors.textMain }]}>{service.name}</Text>
              <Text style={[s.serviceBusiness, { color: colors.textSecondary }]}>{service.business}</Text>
              <View style={s.priceRow}>
                <Text style={[s.servicePrice, { color: colors.primary }]}>{service.price}</Text>
                <Text style={[s.rating, { color: colors.textMain }]}>⭐ {service.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* ۴. پیشنهاد کسب‌وکارها (برتر و پربازدید) */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>سالن‌ها و کلینیک‌های برتر</Text>
          <TouchableOpacity>
            <Text style={[s.seeAll, { color: colors.primary }]}>مشاهده همه</Text>
          </TouchableOpacity>
        </View>

        {MOCK_BUSINESSES.map((biz) => (
          <TouchableOpacity 
            key={biz.id} 
            style={[s.bizCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => navigation?.navigate('BusinessDetail', { id: biz.id })}
          >
            <Image source={{ uri: biz.logo }} style={s.bizLogo} />
            <View style={s.bizInfo}>
              <View style={s.titleRow}>
                <Text style={[s.bizName, { color: colors.textMain }]}>{biz.name}</Text>
                {biz.VIP && (
                  <View style={[s.vipBadge, { backgroundColor: colors.primary }]}>
                    <Text style={s.vipText}>ویژه</Text>
                  </View>
                )}
              </View>
              <Text style={[s.bizAddress, { color: colors.textSecondary }]}>📍 {biz.address}</Text>
              <Text style={[s.bizRating, { color: colors.textMain }]}>امتیاز: {biz.rating} از ۵</Text>
            </View>
          </TouchableOpacity>
        ))}

      </View>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
  },
  welcomeRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Vazir',
  },
  appName: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
  },
  bodyContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  seeAll: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  // استایل کارت‌های خدمات
  serviceCard: {
    flexDirection: 'row-reverse',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  serviceImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  serviceInfo: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  serviceBusiness: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  priceRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 4,
  },
  servicePrice: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  // استایل کارت‌های کسب‌وکار
  bizCard: {
    flexDirection: 'row-reverse',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    gap: 14,
  },
  bizLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  bizInfo: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  bizName: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  vipBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vipText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  bizAddress: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  bizRating: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
});