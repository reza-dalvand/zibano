import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../theme/ThemeContext';

const CategoryGrid = ({categories = [], onSelect, selectedId}) => {
  const {colors} = useTheme();

  const renderItem = ({item}) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        onPress={() => onSelect?.(item)}
        style={[
          styles.item,
          {
            backgroundColor: isSelected ? colors.primary : colors.cardBackground,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}>
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
          numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      numColumns={4}
      scrollEnabled={false}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.grid}
    />
  );
};

const styles = StyleSheet.create({
  grid: {paddingHorizontal: 12},
  row: {justifyContent: 'space-between', marginBottom: 12},
  item: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {fontSize: 11, textAlign: 'center'},
});

export default CategoryGrid;
