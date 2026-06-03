import React from 'react';
import {View, Image, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';

const PortfolioGrid = ({portfolios, onImagePress}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {portfolios.map((item, index) => (
        <TouchableOpacity
          key={item.id || index}
          onPress={() => onImagePress?.(item, index)}
          activeOpacity={0.8}>
          <Image source={{uri: item.image}} style={styles.image} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
});

export default PortfolioGrid;
