// src/components/explore/PostGrid.js
import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../common/Button';
import PostThumbnail from './PostThumbnail';

export default function PostGrid({
  posts,
  onPostPress,
  onClearFilters,
  ListHeaderComponent, // 🆕 هدر سفارشی (شامل هدر صفحه + چیپ‌ها)
}) {
  const { colors } = useTheme();

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Icon name="search-off" size={64} color={colors.textSecondary + '60'} />
      <Text style={[styles.emptyTitle, { color: colors.textMain }]}>
        نتیجه‌ای یافت نشد
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        فیلترهای خود را تغییر دهید
      </Text>
      {onClearFilters && (
        <Button
          title="حذف فیلترها"
          onPress={onClearFilters}
          variant="outline"
          size="md"
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );

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
      // 🆕 هدر شامل هدر صفحه + چیپ‌های فیلتر
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={renderEmpty}
      renderItem={({ item }) => (
        <PostThumbnail post={item} onPress={onPostPress} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
});