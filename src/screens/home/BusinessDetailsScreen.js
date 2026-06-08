// src/screens/home/BusinessDetailsScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// دیتای موقت و کامل برای پروفایل کسب‌وکار
const MOCK_BUSINESS_DETAILS = {
  id: '1',
  name: 'مجموعه زیبایی و سلامت نیلارام',
  city: 'تهران',
  address: 'سعادت‌آباد، خیابان سرو غربی، ساختمان پزشکان نگین، طبقه ۳',
  phone: '۰۲۱۲۲۳۳۴۴۵۵',
  workingHours: 'همه روزه از ساعت ۱۰:۰۰ الی ۲۰:۰۰',
  rating: 4.9,
  reviewsCount: 142,
  VIP: true,
  logo: 'https://picsum.photos/150?random=21',
  banner: 'https://picsum.photos/800/450?random=45',
  about: 'مجموعه نیلارام با بیش از ۱۰ سال سابقه درخشان در زمینه خدمات تخصصی پوست، فیشیال، مژه و ناخن، با کادری مجرب و محیطی کاملاً بهداشتی و آرامش‌بخش میزبان شما بانوان عزیز است.',
  services: [
    { id: 's1', name: 'فیشیال تخصصی و پاکسازی پوست', price: '۷۵۰,۰۰۰ تومان', duration: '۶۰ دقیقه', discount: 10 },
    { id: 's2', name: 'کاشت مژه هالیوودی (تار به تار)', price: '۵۸۰,۰۰۰ تومان', duration: '۹۰ دقیقه', discount: 0 },
    { id: 's3', name: 'ژلیش و پدیکور VIP پا', price: '۳۲۰,۰۰۰ تومان', duration: '۴۵ دقیقه', discount: 15 },
    { id: 's4', name: 'کراتینه و احیای موهای آسیب‌دیده', price: '۱,۸۰۰,۰۰۰ تومان', duration: '۱۲۰ دقیقه', discount: 5 },
  ]
};

export default function BusinessDetailsScreen({ navigation, route }) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('services'); // 'services' یا 'about'

  // در آینده businessId را از route.params می‌گیرید و دیتای واقعی را لود می‌کنید
  const biz = MOCK_BUSINESS_DETAILS;

  return (
    <ScreenWrapper padding={0} edges={['bottom']}>
      {/* هدر با دکمه بازگشت */}
      <Header
        title={biz.name}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContainer}
      >
        {/* ۱. بنر و لوگوی سالن */}
        <View style={s.imageSection}>
          <Image source={{ uri: biz.banner }} style={s.bannerImage} />
          <View style={[s.logoWrapper, { borderColor: colors.background }]}>
            <Image source={{ uri: biz.logo }} style={s.logoImage} />
          </View>
        </View>

        {/* ۲. اطلاعات اصلی سالن */}
        <View style={s.infoContainer}>
          <View style={s.titleRow}>
            <Text style={[s.bizName, { color: colors.textMain }]}>{biz.name}</Text>
            {biz.VIP && (
              <View style={[s.vipBadge, { backgroundColor: colors.primary }]}>
                <Text style={s.vipText}>ویژه</Text>
              </View>
            )}
          </View>

          {/* امتیاز و لوکیشن سریع */}
          <View style={s.subInfoRow}>
            <View style={s.ratingBox}>
              <Icon name="star" size={16} color="#FFB300" />
              <Text style={[s.ratingText, { color: colors.textMain }]}>{biz.rating}</Text>
              <Text style={[s.reviewsText, { color: colors.textSecondary }]}>({biz.reviewsCount} نظر)</Text>
            </View>
            <View style={s.locationBox}>
              <Icon name="location-on" size={16} color={colors.textSecondary} />
              <Text style={[s.cityText, { color: colors.textSecondary }]}>{biz.city}</Text>
            </View>
          </View>
        </View>

        {/* ۳. سوئیچر تب‌ها (تب بار دستی و بسیار روان) */}
        <View style={[s.tabBar, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={[s.tabButton, activeTab === 'services' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('services')}
          >
            <Text style={[s.tabLabel, { color: activeTab === 'services' ? colors.primary : colors.textSecondary }, activeTab === 'services' && s.tabLabelBold]}>
              خدمات و نوبت‌دهی
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[s.tabButton, activeTab === 'about' && { borderBottomColor: colors.primary }]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[s.tabLabel, { color: activeTab === 'about' ? colors.primary : colors.textSecondary }, activeTab === 'about' && s.tabLabelBold]}>
              اطلاعات تماس و درباره
            </Text>
          </TouchableOpacity>
        </View>

        {/* ۴. محتوای تب‌ها */}
        <View style={s.tabContentContainer}>
          {activeTab === 'services' ? (
            // لیست خدمات سالن
            biz.services.map((service) => (
              <View 
                key={service.id} 
                style={[s.serviceCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              >
                <View style={s.serviceMainInfo}>
                  <Text style={[s.serviceName, { color: colors.textMain }]}>{service.name}</Text>
                  
                  <View style={s.serviceMetaRow}>
                    <Icon name="access-time" size={14} color={colors.textSecondary} />
                    <Text style={[s.durationText, { color: colors.textSecondary }]}>{service.duration}</Text>
                    
                    {service.discount > 0 && (
                      <View style={[s.discountBadge, { backgroundColor: colors.primary + '15' }]}>
                        <Text style={[s.discountText, { color: colors.primary }]}>{service.discount}٪ تخفیف</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={[s.servicePrice, { color: colors.primary }]}>{service.price}</Text>
                </View>

                {/* دکمه رزرو مستقیم */}
                <TouchableOpacity 
                  style={[s.bookButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('Booking')}
                >
                  <Text style={s.bookButtonText}>رزرو</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            // اطلاعات تکمیلی و آدرس سالن
            <View style={s.aboutWrapper}>
              <Text style={[s.aboutTitle, { color: colors.textMain }]}>درباره کسب‌وکار</Text>
              <Text style={[s.aboutText, { color: colors.textSecondary }]}>{biz.about}</Text>
              
              <View style={[s.divider, { backgroundColor: colors.border }]} />

              <View style={s.infoDetailRow}>
                <Icon name="place" size={20} color={colors.primary} />
                <View style={s.infoDetailTextContainer}>
                  <Text style={[s.infoDetailTitle, { color: colors.textMain }]}>آدرس دقیق</Text>
                  <Text style={[s.infoDetailValue, { color: colors.textSecondary }]}>{biz.address}</Text>
                </View>
              </View>

              <View style={s.infoDetailRow}>
                <Icon name="phone" size={20} color={colors.primary} />
                <View style={s.infoDetailTextContainer}>
                  <Text style={[s.infoDetailTitle, { color: colors.textMain }]}>شماره تماس</Text>
                  <Text style={[s.infoDetailValue, { color: colors.textSecondary }]}>{biz.phone}</Text>
                </View>
              </View>

              <View style={s.infoDetailRow}>
                <Icon name="schedule" size={20} color={colors.primary} />
                <View style={s.infoDetailTextContainer}>
                  <Text style={[s.infoDetailTitle, { color: colors.textMain }]}>ساعات کاری</Text>
                  <Text style={[s.infoDetailValue, { color: colors.textSecondary }]}>{biz.workingHours}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 120, // حل باگ افتادن محتوا زیر نویگیشن بار
  },
  imageSection: {
    width: width,
    height: 200,
    position: 'relative',
    marginBottom: 40, // فضا برای لوگویی که بیرون زده است
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoWrapper: {
    position: 'absolute',
    bottom: -30,
    right: 20, // راست‌چین بر اساس لایوت هوم
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bizName: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
  },
  vipBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  vipText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  reviewsText: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  cityText: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
  // استایل تب بار
  tabBar: {
    flexDirection: 'row',
    marginTop: 24,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Vazir',
  },
  tabLabelBold: {
    fontFamily: 'Vazir-Bold',
  },
  tabContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // استایل کارت خدمات
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  serviceMainInfo: {
    flex: 1,
    alignItems: 'flex-start', // چیدمان مرتب متون خدمات
    gap: 6,
  },
  serviceName: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    textAlign: 'right',
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  servicePrice: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    marginTop: 2,
  },
  bookButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  // استایل تب درباره ما
  aboutWrapper: {
    gap: 16,
  },
  aboutTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  aboutText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    lineHeight: 24,
    textAlign: 'justify',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 4,
  },
  infoDetailRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoDetailTextContainer: {
    flex: 1,
    gap: 4,
  },
  infoDetailTitle: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  infoDetailValue: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 20,
  },
});