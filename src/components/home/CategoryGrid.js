// src/components/home/CategoryGrid.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { toPersianDigit } from '../../constants/exploreFilters';

const CategoryGrid = ({ categories = [], onSelect, selectedId }) => {
  const { colors } = useTheme();

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    const hasCount = item.count && item.count > 0;

    return (
      <View style={styles.itemWrapper}>
        <TouchableOpacity
          onPress={() => onSelect?.(item)}
          style={[
            styles.item,
            {
              backgroundColor: isSelected ? colors.primary : colors.cardBackground,
              borderColor: isSelected ? colors.primary : colors.border,
            },
          ]}
        >
          <Icon
            name={item.icon || 'spa'}
            size={28}
            color={isSelected ? '#fff' : colors.primary}
          />
          <Text
            style={[
              styles.label,
              {
                color: isSelected ? '#fff' : colors.textMain,
                fontFamily: 'Vazir-Medium',
              },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </TouchableOpacity>

        {/* 🎯 Badge - top تغییر کرد از -8 به -4 */}
        {hasCount && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {toPersianDigit(item.count > 99 ? '99+' : item.count)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={4}
      scrollEnabled={false}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.grid}
    />
  );
};

const styles = StyleSheet.create({
  // 🎯 paddingTop اضافه شد برای فاصله از عنوان بخش
  grid: {
    paddingHorizontal: 12,
    paddingTop: 8, // ✅ فاصله از عنوان "دسته‌بندی خدمات"
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemWrapper: {
    width: '22%',
    alignItems: 'center',
    overflow: 'visible',
  },
  item: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
  // 🎯 Badge - top تغییر کرد
  badge: {
    position: 'absolute',
    top: -4,        // ✅ از -8 به -4 (کمتر بالا می‌رود)
    left: -4,       // ✅ از -8 به -4
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
});

export default CategoryGrid;