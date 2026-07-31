// src/screens/explore/ExploreScreen.js
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import SectionHeader from '../../components/common/SectionHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FilterModal,
  PostModal,
  PostGrid,
  ActiveFilterChips,
} from '../../components/explore';
import { MOCK_POSTS } from '../../constants/exploreFilters';
import { toPersianDigit } from '../../utils/numberUtils';

const INITIAL_FILTERS = {
  province: null,
  city: null,
  businessType: null,
};

// ═══════════════════════════════════════════
//    🎯 تنظیمات لیزی لودینگ
// ═══════════════════════════════════════════
const PAGE_SIZE = 12;          // ✅ هر بار ۱۲ پست لود می‌شود
const MAX_PAGES = 10;          // حداکثر ۱۰ صفحه (۱۲۰ پست)

// ═══════════════════════════════════════════
//    🔄 شبیه‌سازی API سرور - تولید پست‌های جدید
// ═══════════════════════════════════════════
const generateMorePosts = (page, size) => {
  if (page > MAX_PAGES) return [];

  const samplePosts = MOCK_POSTS.filter(p => p.source === 'business');
  const newPosts = [];

  for (let i = 0; i < size; i++) {
    const sample = samplePosts[Math.floor(Math.random() * samplePosts.length)];
    const randomId = Math.random().toString(36).substring(7);
    const randomImageId = Math.floor(Math.random() * 1000) + page * 100;

    newPosts.push({
      ...sample,
      id: `p_${page}_${i}_${randomId}`,
      businessLogo: `https://picsum.photos/100/100?random=${randomImageId}`,
      gallery: sample.gallery?.map((_, idx) =>
        `https://picsum.photos/800/800?random=${randomImageId + idx}`
      ) || [`https://picsum.photos/800/800?random=${randomImageId}`],
      saved: false,
    });
  }

  return newPosts;
};

export default function ExploreScreen({ navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // ═══════════════════════════════════════════
  //    🎯 state های لیزی لودینگ
  // ═══════════════════════════════════════════
  const [allPosts, setAllPosts] = useState(MOCK_POSTS.slice(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [activePost, setActivePost] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // ═══════════════════════════════════════════
  //    🔄 تابع لود پست‌های بیشتر (فقط با اسکرول کاربر)
  // ═══════════════════════════════════════════
  const loadMorePosts = useCallback(async () => {
    // جلوگیری از درخواست تکراری
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // شبیه‌سازی تاخیر شبکه (۸۰۰ تا ۱۵۰۰ میلی‌ثانیه)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

    const nextPage = page + 1;
    const newPosts = generateMorePosts(nextPage, PAGE_SIZE);

    // اگر پستی برنگشت یا به سقف رسیدیم، دیگه لود نکن
    if (newPosts.length === 0 || nextPage >= MAX_PAGES) {
      setHasMore(false);
    }

    if (newPosts.length > 0) {
      setAllPosts(prev => [...prev, ...newPosts]);
      setPage(nextPage);
    }

    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, page]);

  // ═══════════════════════════════════════════
  //    🔍 فیلتر روی پست‌های لود شده
  // ═══════════════════════════════════════════
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      if (filters.province && post.provinceId !== filters.province) return false;
      if (filters.city && post.cityId !== filters.city) return false;
      if (filters.businessType && post.businessTypeId !== filters.businessType)
        return false;
      return true;
    });
  }, [allPosts, filters]);

  const hasActiveFilter =
    filters.province || filters.city || filters.businessType;

  const handleSave = postId => {
    setAllPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, saved: !p.saved } : p)),
    );
    if (activePost?.id === postId) {
      setActivePost(prev => ({ ...prev, saved: !prev.saved }));
    }
  };

  const handleNavigateToProfile = businessId => {
    navigation.navigate('Home', {
      screen: 'BusinessDetails',
      params: { businessId },
    });
  };

  const handleClearFilters = () => setFilters(INITIAL_FILTERS);

  // 🆕 هدر سفارشی
  const renderHeader = () => (
    <View>
      <View
        style={[
          styles.header,
          {
            borderColor: colors.border,
            backgroundColor: colors.background,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <SectionHeader
          icon="collections"
          title="ویترین"
          subtitle='نمونه کار‌های خدمات در بانویار'
          iconColor={colors.primary}
          rightElement={
            <TouchableOpacity
              onPress={() => setFilterVisible(true)}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: hasActiveFilter
                    ? colors.primary + '15'
                    : colors.cardBackground,
                  borderColor: hasActiveFilter
                    ? colors.primary
                    : colors.border,
                },
              ]}
            >
              <Icon
                name="tune"
                size={20}
                color={hasActiveFilter ? colors.primary : colors.textMain}
              />
              {hasActiveFilter && (
                <View
                  style={[styles.filterBadge, { backgroundColor: colors.primary }]}
                />
              )}
            </TouchableOpacity>
          }
        />
      </View>
      <ActiveFilterChips filters={filters} onChange={setFilters} />
    </View>
  );

  return (
    <ScreenWrapper
      scrollable={false}
      padding={0}
      edges={['bottom', 'left', 'right']}
    >
      <PostGrid
        posts={filteredPosts}
        onPostPress={setActivePost}
        onClearFilters={hasActiveFilter ? handleClearFilters : null}
        ListHeaderComponent={renderHeader()}
        // 🎯 props لیزی لودینگ
        onLoadMore={loadMorePosts}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        totalLoaded={allPosts.length}
      />

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />

      <PostModal
        post={activePost}
        visible={!!activePost}
        onClose={() => setActivePost(null)}
        onSave={handleSave}
        onNavigateToProfile={handleNavigateToProfile}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
});