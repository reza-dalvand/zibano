// src/screens/explore/ExploreScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FilterModal,
  PostModal,
  PostGrid,
  ActiveFilterChips,
} from '../../components/explore';
import { MOCK_POSTS } from '../../constants/exploreFilters';

const INITIAL_FILTERS = {
  province: null,
  city: null,
  businessType: null,
};

export default function ExploreScreen({ navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activePost, setActivePost] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (filters.province && post.provinceId !== filters.province)
        return false;
      if (filters.city && post.cityId !== filters.city) return false;
      if (filters.businessType && post.businessTypeId !== filters.businessType)
        return false;
      return true;
    });
  }, [posts, filters]);

  const hasActiveFilter =
    filters.province ||
    filters.city ||
    filters.businessType;

  const handleSave = postId => {
    setPosts(prev =>
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

  // 🆕 هدر سفارشی که به عنوان ListHeaderComponent به FlatList پاس داده می‌شود
  const renderHeader = () => (
    <View>
      {/* هدر صفحه */}
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
        {/* آیکون ویترین سمت راست */}
        <View style={[styles.headerIconBox, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="collections" size={22} color={colors.primary} />
        </View>

        {/* تایتل وسط */}
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>ویترین</Text>

        {/* دکمه فیلتر سمت چپ */}
        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          style={[
            styles.filterBtn,
            {
              backgroundColor: hasActiveFilter ? colors.primary + '15' : colors.cardBackground,
              borderColor: hasActiveFilter ? colors.primary : colors.border,
            },
          ]}
        >
          <Icon name="tune" size={20} color={hasActiveFilter ? colors.primary : colors.textMain} />
          {hasActiveFilter && (
            <View style={[styles.filterBadge, { backgroundColor: colors.primary }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* چیپ‌های فیلتر فعال */}
      <ActiveFilterChips filters={filters} onChange={setFilters} />
    </View>
  );

  return (
    // ✅ scrollable={false} - چون PostGrid خودش FlatList هست
    <ScreenWrapper
      scrollable={false}
      padding={0}
      edges={['bottom', 'left', 'right']}
    >
      {/* ✅ هدر و چیپ‌ها به عنوان ListHeaderComponent به PostGrid پاس داده می‌شوند */}
      <PostGrid
        posts={filteredPosts}
        onPostPress={setActivePost}
        onClearFilters={hasActiveFilter ? handleClearFilters : null}
        ListHeaderComponent={renderHeader()}
      />

      {/* مدال فیلتر */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        currentFilters={filters}
      />

      {/* مدال پست */}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',
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