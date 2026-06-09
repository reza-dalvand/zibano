// src/components/explore/GallerySlider.js
import React, { useRef, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 32;

export default function GallerySlider({ gallery = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);

  const onScroll = (e) => {
    const slideSize = e.nativeEvent.layoutMeasurement.width;
    if (slideSize === 0) return;
    const index = Math.round(e.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={gallery}
        keyExtractor={(item, index) => `img-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />

      {gallery.length > 1 && (
        <View style={styles.dotsContainer}>
          {gallery.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                  width: i === currentIndex ? 16 : 6,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SLIDER_WIDTH,
    width: '100%',
    position: 'relative',
    marginVertical: 8,
  },
  image: {
    width: SLIDER_WIDTH,
    height: SLIDER_WIDTH,
    resizeMode: 'cover',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});