// src/screens/explore/ExploreScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 🆕
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
  minRating: '0',
};

export default function ExploreScreen({ navigation }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // 🆕

  // state ها
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activePost, setActivePost] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // ---------- منطق فیلتر ----------
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (filters.province && post.provinceId !== filters.province)
        return false;
      if (filters.city && post.cityId !== filters.city) return false;
      if (filters.businessType && post.businessTypeId !== filters.businessType)
        return false;
      if (
        filters.minRating !== '0' &&
        post.rating < parseFloat(filters.minRating)
      )
        return false;
      return true;
    });
  }, [posts, filters]);

  const hasActiveFilter =
    filters.province ||
    filters.city ||
    filters.businessType ||
    filters.minRating !== '0';

  // ---------- هندلرها ----------
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

  // ---------- رندر ----------
  return (
    <ScreenWrapper
      scrollable={true}
      padding={0}
      edges={['bottom', 'left', 'right']}
    >
      {/* هدر صفحه */}
      <View
        style={[
          styles.header,
          {
            borderColor: colors.border,
            backgroundColor: colors.background,
            paddingTop: insets.top + 8, // 🎯 insets.top
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>ویترین</Text>
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

      {/* گرید پست‌ها */}
      <PostGrid
        posts={filteredPosts}
        onPostPress={setActivePost}
        onClearFilters={hasActiveFilter ? handleClearFilters : null}
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
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
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
