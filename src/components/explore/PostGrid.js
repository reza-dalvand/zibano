// src/components/explore/PostGrid.js
import React from 'react';
import { FlatList, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Button from '../common/Button';
import PostThumbnail from './PostThumbnail';
import EmptyStateVariants from '../common/EmptyStateVariants';
import { toPersianDigit } from '../../utils/numberUtils';

export default function PostGrid({
  posts,
  onPostPress,
  onClearFilters,
  ListHeaderComponent,
  // 🎯 props لیزی لودینگ
  onLoadMore,
  isLoadingMore = false,
  hasMore = true,
  totalLoaded = 0,
}) {
  const { colors } = useTheme();

  const renderEmpty = () => (
    <EmptyStateVariants
      variant="portfolio"
      title="نتیجه‌ای یافت نشد"
      description="فیلترهای خود را تغییر دهید"
      actionLabel={onClearFilters ? "حذف فیلترها" : null}
      onAction={onClearFilters}
    />
  );

  // ═══════════════════════════════════════════
  //    🔄 لودر و پیام انتهای لیست
  // ═══════════════════════════════════════════
  const renderFooter = () => {
    // حالت ۱: در حال لودینگ - نمایش اسپینر
    if (isLoadingMore) {
      return (
        <View style={s.footerLoader}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[s.footerLoaderText, { color: colors.textSecondary }]}>
            در حال بارگذاری پست‌های بیشتر...
          </Text>
        </View>
      );
    }

    // حالت ۲: همه پست‌ها لود شده - نمایش پیام پایان
    if (!hasMore && posts.length > 0) {
      return (
        <View style={s.footerEnd}>
          <View style={[s.footerEndLine, { backgroundColor: colors.border }]} />
          <View
            style={[
              s.footerEndBadge,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Icon name="check-circle" size={14} color={colors.primary} />
            <Text style={[s.footerEndText, { color: colors.textSecondary }]}>
              همه {toPersianDigit(totalLoaded)} پست نمایش داده شد
            </Text>
          </View>
          <View style={[s.footerEndLine, { backgroundColor: colors.border }]} />
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      data={posts}
      numColumns={3}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 100,
        flexGrow: posts.length === 0 ? 1 : 0,
      }}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      renderItem={({ item }) => (
        <PostThumbnail post={item} onPress={onPostPress} />
      )}
      // 🎯 تنظیمات لیزی لودینگ
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
    />
  );
}

const s = StyleSheet.create({
  // ═══════════════════════════════════════════
  //    🔄 لودر انتهای لیست
  // ═══════════════════════════════════════════
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 28,
  },
  footerLoaderText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },

  // ═══════════════════════════════════════════
  //    ✅ پیام پایان لیست
  // ═══════════════════════════════════════════
  footerEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  footerEndLine: {
    flex: 1,
    height: 1,
  },
  footerEndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  footerEndText: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
});