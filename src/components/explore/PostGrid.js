// src/components/explore/PostGrid.js
import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../common/Button';
import PostThumbnail from './PostThumbnail';

export default function PostGrid({ posts, onPostPress, onClearFilters }) {
  const { colors } = useTheme();

  if (posts.length === 0) {
    return (
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
  }

  return (
    <FlatList
      data={posts}
      numColumns={3}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      renderItem={({ item }) => (
        <PostThumbnail post={item} onPress={onPostPress} />
      )}
    />
  );
}

// این import رو بالای فایل بذارید:
import { Text } from 'react-native';

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