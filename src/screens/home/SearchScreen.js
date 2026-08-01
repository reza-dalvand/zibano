// src/screens/home/SearchScreen.js
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import SearchBar from '../../components/common/SearchBar';
import SectionHeader from '../../components/common/SectionHeader';
import CategoryGrid from '../../components/home/CategoryGrid';
import {
  SearchTabs,
  SearchBusinessCard,
  SearchModelCard,
  SearchLineCard,
  SearchEmptyState,
  searchAll,
  getResultCounts,
} from '../../components/home/search';

// 🎯 دسته‌بندی‌های محبوب برای حالت خالی
const POPULAR_CATEGORIES = [
  { id: 1, name: 'میکاپ', icon: 'face', color: '#E91E63' },
  { id: 2, name: 'کاشت ناخن', icon: 'brush', color: '#9C27B0' },
  { id: 3, name: 'لیزر مو', icon: 'flash-on', color: '#2196F3' },
  { id: 4, name: 'پاکسازی', icon: 'spa', color: '#4CAF50' },
  { id: 5, name: 'رنگ مو', icon: 'palette', color: '#FF9800' },
  { id: 6, name: 'کراتین', icon: 'auto-awesome', color: '#00BCD4' },
  { id: 7, name: 'مژه', icon: 'visibility', color: '#795548' },
  { id: 8, name: 'ماساژ', icon: 'self-improvement', color: '#607D8B' },
];


export default function SearchScreen({ navigation }) {
  const { colors } = useTheme();

  // ─── State Management ───
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState(''); // فقط وقتی Enter زده شد
  const [activeTab, setActiveTab] = useState('all');

  // ─── انجام جستجو فقط وقتی activeQuery تغییر کنه ───
  const searchResults = useMemo(() => {
    if (!activeQuery.trim()) {
      return {
        businesses: [],
        services: [],
        posts: [],
        modelRequests: [],
        lineRentals: [],
      };
    }
    return searchAll(activeQuery);
  }, [activeQuery]);

  const resultCounts = useMemo(
    () => getResultCounts(searchResults),
    [searchResults]
  );

  // ─── فیلتر نتایج بر اساس تب فعال ───
  const filteredResults = useMemo(() => {
    switch (activeTab) {
      case 'businesses':
        return searchResults.businesses;
      case 'services':
        return searchResults.services;
      case 'posts':
        return searchResults.posts;
      case 'modelRequests':
        return searchResults.modelRequests;
      case 'lineRentals':
        return searchResults.lineRentals;
      default:
        return null; // 'all' - نمایش همه
    }
  }, [searchResults, activeTab]);

  // ─── Handlers ───
  const handleSearch = useCallback(
    (query) => {
      const q = typeof query === 'string' ? query : searchQuery;
      setActiveQuery(q);
      setActiveTab('all');
    },
    [searchQuery]
  );

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setActiveQuery('');
    setActiveTab('all');
  }, []);

  const handleBusinessPress = useCallback(
    (business) => {
      navigation.navigate('BusinessDetails', { businessId: business.id });
    },
    [navigation]
  );


  const handleModelPress = useCallback(
    (request) => {
      navigation.navigate('ModelRequestDetail', { request });
    },
    [navigation]
  );

  const handleLinePress = useCallback(
    (ad) => {
      navigation.navigate('LineRentalDetail', { ad });
    },
    [navigation]
  );

  const handleCategoryPress = useCallback(
    (category) => {
      navigation.navigate('CategoryBusinesses', {
        categoryId: category.id,
        categoryName: category.name,
      });
    },
    [navigation]
  );

  // ─── رندر سکشن «مشاهده همه» ───
  const renderSeeMore = (count, label, tabId, color = colors.primary) => (
    <TouchableOpacity
      style={[s.seeMoreBtn, { borderColor: colors.border }]}
      onPress={() => setActiveTab(tabId)}
    >
      <Text style={[s.seeMoreText, { color }]}>
        مشاهده همه {count} {label}
      </Text>
      <Icon name="chevron-left" size={18} color={color} />
    </TouchableOpacity>
  );

  // ─── رندر نتایج بر اساس تب ───
  const renderResults = () => {
    const hasResults = resultCounts.all > 0;

    // حالت بدون نتیجه
    if (!hasResults && activeQuery.trim()) {
      return <SearchEmptyState query={activeQuery} activeTab={activeTab} />;
    }

    // ═══════ تب «همه» - نمایش خلاصه از هر دسته ═══════
    if (activeTab === 'all') {
    return (
        <View style={s.allResultsContainer}>
        {/* ─── کسب‌وکارها ─── */}
        {searchResults.businesses.length > 0 && (
            <View style={s.resultSection}>
            <View style={s.sectionHeader}>
                <View style={[s.sectionIconBox, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="store" size={18} color={colors.primary} />
                </View>
                <View style={s.sectionTitleCol}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                    کسب‌وکارها
                </Text>
                <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
                    سالن‌ها و کلینیک‌های مرتبط
                </Text>
                </View>
                <View style={[s.sectionCount, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[s.countText, { color: colors.primary }]}>
                    {searchResults.businesses.length}
                </Text>
                </View>
            </View>
            
            <View style={s.businessList}>
                {searchResults.businesses.slice(0, 3).map((business) => (
                <SearchBusinessCard
                    key={business.id}
                    business={business}
                    onPress={handleBusinessPress}
                />
                ))}
            </View>
            
            {searchResults.businesses.length > 3 &&
                renderSeeMore(searchResults.businesses.length, 'کسب‌وکار', 'businesses')
            }
            </View>
        )}
        
        {/* ─── فرصت‌های مدلینگ ─── */}
        {searchResults.modelRequests.length > 0 && (
            <View style={s.resultSection}>
            <View style={s.sectionHeader}>
                <View style={[s.sectionIconBox, { backgroundColor: '#E91E6318' }]}>
                <Icon name="face-retouching-natural" size={18} color="#E91E63" />
                </View>
                <View style={s.sectionTitleCol}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                    فرصت‌های مدلینگ
                </Text>
                <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
                    با تخفیف ویژه مدل شوید
                </Text>
                </View>
                <View style={[s.sectionCount, { backgroundColor: '#E91E6318' }]}>
                <Text style={[s.countText, { color: '#E91E63' }]}>
                    {searchResults.modelRequests.length}
                </Text>
                </View>
            </View>
            
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.horizontalScroll}
            >
                {searchResults.modelRequests.slice(0, 6).map((request) => (
                <SearchModelCard
                    key={request.id}
                    request={request}
                    onPress={handleModelPress}
                />
                ))}
            </ScrollView>
            
            {searchResults.modelRequests.length > 6 &&
                renderSeeMore(searchResults.modelRequests.length, 'فرصت', 'modelRequests', '#E91E63')
            }
            </View>
        )}
        
        {/* ─── اجاره لاین ─── */}
        {searchResults.lineRentals.length > 0 && (
            <View style={s.resultSection}>
            <View style={s.sectionHeader}>
                <View style={[s.sectionIconBox, { backgroundColor: '#667eea18' }]}>
                <Icon name="storefront" size={18} color="#667eea" />
                </View>
                <View style={s.sectionTitleCol}>
                <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                    اجاره لاین
                </Text>
                <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
                    فرصت‌های همکاری و اجاره
                </Text>
                </View>
                <View style={[s.sectionCount, { backgroundColor: '#667eea18' }]}>
                <Text style={[s.countText, { color: '#667eea' }]}>
                    {searchResults.lineRentals.length}
                </Text>
                </View>
            </View>
            
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.horizontalScroll}
            >
                {searchResults.lineRentals.slice(0, 6).map((ad) => (
                <SearchLineCard
                    key={ad.id}
                    ad={ad}
                    onPress={handleLinePress}
                />
                ))}
            </ScrollView>
            
            {searchResults.lineRentals.length > 6 &&
                renderSeeMore(searchResults.lineRentals.length, 'آگهی', 'lineRentals', '#667eea')
            }
            </View>
        )}
        </View>
    );
    }

    // ═══════ تب‌های خاص - نمایش لیست کامل ═══════
    switch (activeTab) {
      case 'businesses':
        return (
          <View style={s.listContainer}>
            {filteredResults.map((business) => (
              <SearchBusinessCard
                key={business.id}
                business={business}
                onPress={handleBusinessPress}
              />
            ))}
          </View>
        );

      case 'modelRequests':
        return (
          <View style={s.modelGrid}>
            {filteredResults.map((request) => (
              <SearchModelCard
                key={request.id}
                request={request}
                onPress={handleModelPress}
              />
            ))}
          </View>
        );

      case 'lineRentals':
        return (
          <View style={s.lineGrid}>
            {filteredResults.map((ad) => (
              <SearchLineCard
                key={ad.id}
                ad={ad}
                onPress={handleLinePress}
              />
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  // ═══════ حالت خالی - نمایش محتوای خانه ═══════
  const renderEmptyState = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.emptyContainer}
    >
      {/* ─── دسته‌بندی‌های محبوب ─── */}
      <View style={s.section}>
        <SectionHeader
          icon="category"
          iconColor="#FF9800"
          title="دسته‌بندی‌های محبوب"
          subtitle="یک دسته‌بندی انتخاب کنید"
        />
        <CategoryGrid
          categories={POPULAR_CATEGORIES}
          onSelect={handleCategoryPress}
        />
      </View>

      {/* ─── راهنمای جستجو ─── */}
      <View style={s.searchHintCard}>
        <View
          style={[s.hintIconBox, { backgroundColor: colors.primary + '15' }]}
        >
          <Icon name="search" size={24} color={colors.primary} />
        </View>
        <Text style={[s.hintTitle, { color: colors.textMain }]}>
          چه چیزهایی می‌توانید جستجو کنید؟
        </Text>
        <View style={s.hintList}>
          {[
            { icon: 'store', text: 'نام کسب‌وکارها', color: colors.primary },
            {
              icon: 'face-retouching-natural',
              text: 'فرصت‌های مدلینگ',
              color: '#E91E63',
            },
            { icon: 'storefront', text: 'آگهی‌های اجاره لاین', color: '#667eea' },
          ].map((item, i) => (
            <View key={i} style={s.hintItem}>
              <View
                style={[s.hintItemIcon, { backgroundColor: item.color + '18' }]}
              >
                <Icon name={item.icon} size={14} color={item.color} />
              </View>
              <Text style={[s.hintItemText, { color: colors.textSecondary }]}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  // ═══════════ RENDER ═══════════
  return (
    <ScreenWrapper padding={0} edges={['top', 'bottom', 'left', 'right']}>
      {/* ─── هدر جستجو ─── */}
      <View
        style={[
          s.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={s.headerRow}>
          {/* دکمه بازگشت */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[s.backBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Icon name="arrow-forward" size={22} color={colors.textMain} />
          </TouchableOpacity>

          {/* نوار جستجو */}
          <View style={s.searchBarWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmit={() => handleSearch(searchQuery)}
              onClear={handleClear}
              placeholder="جستجوی خدمات، کسب‌وکارها..."
              autoFocus
            />
          </View>
        </View>
      </View>

      {/* ─── تب‌ها - فقط وقتی جستجو انجام شده ─── */}
      {activeQuery.trim() && resultCounts.all > 0 && (
        <SearchTabs
          activeTab={activeTab}
          counts={resultCounts}
          onChange={setActiveTab}
        />
      )}

      {/* ─── محتوا ─── */}
      {activeQuery.trim() ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.resultsContainer}
        >
          {renderResults()}
        </ScrollView>
      ) : (
        renderEmptyState()
      )}
    </ScreenWrapper>
  );
}

// ═══════════ STYLES ═══════════
const s = StyleSheet.create({
  // ─── هدر ───
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchBarWrapper: {
    flex: 1,
  },
  
  // ─── نتایج ───
  resultsContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  allResultsContainer: {
    gap: 28,
  },
  resultSection: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  sectionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitleCol: {
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
  sectionCount: {
    minWidth: 32,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  seeMoreText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  
  // ─── اسکرول افقی ───
  horizontalScroll: {
    paddingRight: 4,
    paddingBottom: 4,
  },
  
  // ─── لیست عمودی کسب‌وکارها ───
  businessList: {
    gap: 0,
  },
  listContainer: {
    gap: 0,
  },
  
  // ─── گریدهای قدیمی (حذف شده) ───
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  
  // ─── حالت خالی ───
  emptyContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  
  // ─── کارت راهنمای جستجو ───
  searchHintCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#00000010',
    gap: 12,
    marginTop: 8,
  },
  hintIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  hintTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  hintList: {
    width: '100%',
    gap: 8,
    marginTop: 4,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  hintItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintItemText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    flex: 1,
  },
});