// src/screens/home/HomeScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import HomeHeader from '../../components/home/HomeHeader';
import AdSlider from '../../components/home/AdSlider';
import CategoryGrid from '../../components/home/CategoryGrid';
import NotificationModal from '../../components/home/NotificationModal';
import HomeFilterModal from '../../components/home/HomeFilterModal';
import ModelRequestsSection from '../../components/home/ModelRequestsSection';
import LineRentalSection from '../../components/home/LineRentalSection';
import SeeAllButton from '../../components/home/SeeAllButton';
import { useAuth } from '../../context/AuthContext';

// 🎯 اضافه شدن businessId به هر آگهی
const MOCK_ADS = [
  {
    id: 1,
    businessId: '1', // 🆕 شناسه کسب‌وکار برای نویگیشن
    imageUrl: 'https://picsum.photos/800/400?random=1',
    title: 'جشنواره تخفیف‌های بهار کلینیک رُز',
    subtitle: 'تا ۳۰٪ تخفیف خدمات پوست',
    badge: 'پیشنهاد ویژه',
  },
  {
    id: 2,
    businessId: '2', // 🆕 شناسه کسب‌وکار برای نویگیشن
    imageUrl: 'https://picsum.photos/800/400?random=2',
    title: 'افتتاحیه سالن زیبایی لاویا',
    subtitle: 'نوبت‌دهی آنلاین با بیعانه اقتصادی',
    badge: 'جدید',
  },
  {
    id: 3,
    businessId: '3', // 🆕 شناسه کسب‌وکار برای نویگیشن
    imageUrl: 'https://picsum.photos/800/400?random=3',
    title: 'لیزر با جدیدترین دستگاه ۲۰۲۴',
    subtitle: 'مرکز رویال - تخفیف ویژه',
    badge: 'پرفروش',
  },
];

// ... (بقیه MOCK_CATEGORIES بدون تغییر)
const MOCK_CATEGORIES = [
  { id: 1, name: 'میکاپ', icon: 'face', color: '#E91E63' },
  { id: 2, name: 'کاشت ناخن', icon: 'brush', color: '#9C27B0' },
  { id: 3, name: 'لیزر مو', icon: 'flash-on', color: '#2196F3' },
  { id: 4, name: 'پاکسازی', icon: 'spa', color: '#4CAF50' },
  { id: 5, name: 'رنگ مو', icon: 'palette', color: '#FF9800' },
  { id: 6, name: 'کراتین', icon: 'auto-awesome', color: '#00BCD4' },
  { id: 7, name: 'مژه', icon: 'visibility', color: '#795548' },
  { id: 8, name: 'ماساژ', icon: 'self-improvement', color: '#607D8B' },
];

function SectionHeader({ title, onSeeAll, colors, icon, iconColor, count }) {
  return (
    <View style={s.sectionHeader}>
      <View style={s.titleRow}>
        {icon && (
          <View style={[s.iconBox, { backgroundColor: (iconColor || colors.primary) + '15' }]}>
            <Icon name={icon} size={18} color={iconColor || colors.primary} />
          </View>
        )}
        <Text style={[s.sectionTitle, { color: colors.textMain }]}>{title}</Text>
      </View>
      {onSeeAll && <SeeAllButton onPress={onSeeAll} count={count} />}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const hasActiveFilter = Object.values(filters).some(
    (v) => v && v !== 'all' && v !== 'recommended' && (!Array.isArray(v) || v.length > 0)
  );
  const notificationCount = 3;

  // 🎯 هندلر کلیک روی آگهی اسلایدر - هدایت به صفحه دیتیل کسب‌وکار
  const handleAdPress = (ad) => {
    if (ad.businessId) {
      navigation.navigate('BusinessDetails', { businessId: ad.businessId });
    }
  };

  return (
    <ScreenWrapper scrollable padding={0} edges={['bottom', 'left', 'right']}>
      <HomeHeader
        userName={user?.name}
        userAvatar={user?.avatar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={() =>
          navigation?.navigate('SearchFilter', { query: searchQuery })
        }
        onNotificationPress={() => setNotificationModalVisible(true)}
        notificationCount={notificationCount}
        onFilterPress={() => setFilterModalVisible(true)}
        hasActiveFilter={hasActiveFilter}
      />
      <View style={s.bodyContainer}>
        {/* ۱. اسلایدر تبلیغات */}
        <View style={s.section}>
          <AdSlider
            ads={MOCK_ADS}
            onPress={handleAdPress} // 🎯 تغییر: هندلر نویگیشن به جای console.log
          />
        </View>

        {/* ۲. دسته‌بندی خدمات */}
        <View style={s.section}>
          <SectionHeader
            title="دسته‌بندی خدمات"
            colors={colors}
            icon="category"
            iconColor="#FF9800"
            count={MOCK_CATEGORIES.length}
          />
          <CategoryGrid
            categories={MOCK_CATEGORIES}
            selectedId={selectedCategory}
            onSelect={(item) => {
              setSelectedCategory(item.id);
              navigation.navigate('CategoryBusinesses', {
                categoryId: item.id,
                categoryName: item.name,
              });
            }}
          />
        </View>

        {/* ۳. فرصت‌های مدلینگ */}
        <ModelRequestsSection
          onSeeAll={() => console.log('See all model requests')}
          onItemPress={(item) => console.log('Model request:', item.id)}
        />
        {/* ۴. فرصت‌های همکاری / اجاره لاین */}
        <LineRentalSection
          onSeeAll={() => console.log('See all line rentals')}
          onItemPress={(item) => console.log('Line rental:', item.id)}
        />
      </View>
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
      />
      <HomeFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  bodyContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
});