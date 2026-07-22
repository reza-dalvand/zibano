// src/screens/home/BusinessDetailsScreen.js
import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import BusinessHero from '../../components/home/BusinessHero';
import BusinessInfoCard from '../../components/home/BusinessInfoCard';
import BusinessTabs from '../../components/home/BusinessTabs';
import ServiceBookingCard from '../../components/home/ServiceBookingCard';
import PortfolioGrid from '../../components/home/PortfolioGrid';
import PortfolioModal from '../../components/home/PortfolioModal';
import BusinessAbout from '../../components/home/BusinessAbout';
import StickyBookingBar from '../../components/home/StickyBookingBar';
import BookingModal from './BookingScreen';
import BusinessMapButton from '../../components/home/BusinessMapButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════
//                    MOCK DATA
// ═══════════════════════════════════════════════════════
const MOCK_BUSINESS = {
  id: '1',
  name: 'مجموعه زیبایی و سلامت نیلارام',
  ownerName: 'مریم حسینی',
  ownerVerified: true,
  memberSince: '۲ سال',
  category: 'کلینیک پوست و مو',
  city: 'تهران، سعادت‌آباد',
  address: 'سعادت‌آباد، خیابان سرو غربی، ساختمان پزشکان نگین، طبقه ۳',
  phone: '۰۲۱-۲۲۳۳۴۴۵۵',
  workingHours: 'شنبه تا پنج‌شنبه: ۱۰:۰۰ الی ۲۰:۰۰',
  location: {
    latitude: 35.7898,
    longitude: 51.3768,
  },
  rating: 4.9,
  reviewsCount: 142,
  servicesCount: 24,
  VIP: true,
  logo: 'https://picsum.photos/150?random=21',
  gallery: [
    'https://picsum.photos/800/600?random=45',
    'https://picsum.photos/800/600?random=46',
    'https://picsum.photos/800/600?random=47',
    'https://picsum.photos/800/600?random=48',
  ],
  about:
    'مجموعه نیلارام با بیش از ۱۰ سال سابقه درخشان در زمینه خدمات تخصصی پوست، فیشیال، مژه و ناخن، با کادری مجرب و محیطی کاملاً بهداشتی و آرامش‌بخش میزبان شما بانوان عزیز است.',
  services: [
    {
      id: 's1',
      name: 'فیشیال تخصصی و پاکسازی پوست',
      typeId: 'facial',
      price: 750000,
      originalPrice: 850000,
      discount: 12,
      duration: 60,
      image: 'https://picsum.photos/200/200?random=50',
    },
    {
      id: 's2',
      name: 'کاشت مژه هالیوودی (تار به تار)',
      typeId: 'eyelash',
      price: 580000,
      originalPrice: 580000,
      discount: 0,
      duration: 90,
      image: 'https://picsum.photos/200/200?random=51',
    },
    {
      id: 's3',
      name: 'ژلیش و پدیکور VIP پا',
      typeId: 'nail',
      price: 320000,
      originalPrice: 380000,
      discount: 15,
      duration: 45,
      image: 'https://picsum.photos/200/200?random=52',
    },
    {
      id: 's4',
      name: 'کراتینه و احیای موهای آسیب‌دیده',
      typeId: 'keratin',
      price: 1800000,
      originalPrice: 1900000,
      discount: 5,
      duration: 120,
      image: 'https://picsum.photos/200/200?random=53',
    },
  ],
  portfolios: [
    {
      id: 'pf1',
      title: 'فیشیال VIP عروس',
      coverImage: 'https://picsum.photos/400/400?random=60',
      images: [
        'https://picsum.photos/800/800?random=60',
        'https://picsum.photos/800/800?random=160',
        'https://picsum.photos/800/800?random=260',
      ],
      description:
        'فیشیال تخصصی عروس با استفاده از بهترین محصولات روز دنیا. شامل پاکسازی عمیق، ماسک طلا و ماساژ صورت.',
    },
    {
      id: 'pf2',
      title: 'کاشت ناخن ژلیش',
      coverImage: 'https://picsum.photos/400/400?random=61',
      images: [
        'https://picsum.photos/800/800?random=61',
        'https://picsum.photos/800/800?random=161',
      ],
      description: 'کاشت ناخن با طراحی مینیمال و ژلیش ماندگار تا ۳ هفته.',
    },
    {
      id: 'pf3',
      title: 'میکاپ و شینیون عروس',
      coverImage: 'https://picsum.photos/400/400?random=62',
      images: [
        'https://picsum.photos/800/800?random=62',
        'https://picsum.photos/800/800?random=162',
        'https://picsum.photos/800/800?random=262',
        'https://picsum.photos/800/800?random=362',
      ],
      description: 'میکاپ حرفه‌ای عروس با سبک اروپایی و شینیون مدرن.',
    },
    {
      id: 'pf4',
      title: 'لیزر موهای زائد',
      coverImage: 'https://picsum.photos/400/400?random=63',
      images: ['https://picsum.photos/800/800?random=63'],
      description: 'لیزر با دستگاه الکساندرایت ۲۰۲۴ - بدون درد و ماندگار.',
    },
    {
      id: 'pf5',
      title: 'رنگ و لایت مو',
      coverImage: 'https://picsum.photos/400/400?random=64',
      images: [
        'https://picsum.photos/800/800?random=64',
        'https://picsum.photos/800/800?random=164',
      ],
      description: 'رنگ مو با مواد اورجینال ایتالیایی و تکنیک‌های جدید لایت.',
    },
  ],
};

// ═══════════════════════════════════════════════════════
//               BUSINESS DETAILS SCREEN
// ═══════════════════════════════════════════════════════
export default function BusinessDetailsScreen({ navigation }) {
  const { colors } = useTheme();
  const biz = MOCK_BUSINESS;

  // ─── State Management ───
  const [activeTab, setActiveTab] = useState('services');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState(null);
  const [portfolioInitialIndex, setPortfolioInitialIndex] = useState(0);

  // ─── Derived Values ───
  const minServicePrice = useMemo(
    () => Math.min(...biz.services.map((s) => s.price)),
    [biz.services],
  );

  // ─── Handlers ───
  const openBooking = useCallback((service) => {
    setSelectedService(service);
    setBookingModalVisible(true);
  }, []);

  const closeBooking = useCallback(() => {
    setBookingModalVisible(false);
    setSelectedService(null);
  }, []);

  const openPortfolio = useCallback((portfolio, index = 0) => {
    setActivePortfolio(portfolio);
    setPortfolioInitialIndex(index);
    setPortfolioModalVisible(true);
  }, []);

  const closePortfolio = useCallback(() => {
    setPortfolioModalVisible(false);
    setActivePortfolio(null);
  }, []);

  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => !prev);
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openMap = useCallback(() => {
    navigation.navigate('BusinessMap', { business: biz });
  }, [navigation, biz]);

  // ─── Tab Content Renderer ───
  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return (
          <View style={s.servicesList}>
            {biz.services.map((service) => (
              <ServiceBookingCard
                key={service.id}
                service={service}
                onBook={openBooking}
              />
            ))}
          </View>
        );

      case 'portfolio':
        return (
          <PortfolioGrid
            portfolios={biz.portfolios}
            onPortfolioPress={openPortfolio}
          />
        );

      case 'about':
        return <BusinessAbout business={biz} />;

      default:
        return null;
    }
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      {/* ═══ Main Scrollable Content ═══ */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        bounces={false}
      >
        {/* ─── 1. Hero Gallery ─── */}
        <BusinessHero
          gallery={biz.gallery}
          businessId={biz.id}
          businessName={biz.name}
          onBackPress={goBack}
          isFavorite={isFavorite}
          onFavoritePress={toggleFavorite}
        />

        {/* ─── 2. Business Info Card ─── */}
        <BusinessInfoCard business={biz} />

        {/* ─── 3. Map Button ─── */}
        <View style={s.mapButtonWrapper}>
          <BusinessMapButton business={biz} onPress={openMap} />
        </View>

        {/* ─── 4. Tabs ─── */}
        <BusinessTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          colors={colors}
        />

        {/* ─── 5. Tab Content ─── */}
        <View style={s.tabContentWrapper}>{renderTabContent()}</View>

        {/* ─── Bottom Spacer for Sticky Bar ─── */}
        <View style={s.bottomSpacer} />
      </ScrollView>

      {/* ═══ Sticky Booking Bar ═══ */}
      <StickyBookingBar minPrice={minServicePrice} onBookPress={openBooking} />

      {/* ═══ Booking Modal ═══ */}
      <BookingModal
        visible={bookingModalVisible}
        onClose={closeBooking}
        service={selectedService}
      />

      {/* ═══ Portfolio Modal ═══ */}
      <PortfolioModal
        visible={portfolioModalVisible}
        onClose={closePortfolio}
        portfolio={activePortfolio}
        initialIndex={portfolioInitialIndex}
      />
    </ScreenWrapper>
  );
}

// ═══════════════════════════════════════════════════════
//                     STYLES
// ═══════════════════════════════════════════════════════
const s = StyleSheet.create({
  scrollContent: {
    paddingBottom: 0,
  },
  mapButtonWrapper: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  tabContentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  servicesList: {
    gap: 12,
    paddingBottom: 8,
  },
  bottomSpacer: {
    height: 220,
  },
});