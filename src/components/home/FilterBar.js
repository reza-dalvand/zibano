import React from 'react';
import {ScrollView, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';

const FilterBar = ({filters = [], selectedId, onSelect}) => {
  const {colors} = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {filters.map(item => {
        const active = item.id === selectedId;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelect?.(item)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.primary : colors.cardBackground,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}>
            <Text
              style={[
                styles.label,
                {
                  color: active ? '#fff' : colors.textMain,
                  fontFamily: active ? 'Vazir-Medium' : 'Vazir',
                },
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 12, paddingVertical: 8, gap: 8},
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {fontSize: 13},
});

export default FilterBar;
