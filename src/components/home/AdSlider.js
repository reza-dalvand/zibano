import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useTheme} from '../theme/ThemeContext';

const {width} = Dimensions.get('window');

const AdSlider = ({ads = [], onPress}) => {
  const {colors} = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onScroll = e => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
      style={styles.slide}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      {item.title && (
        <View style={[styles.overlay, {backgroundColor: colors.overlayDark}]}>
          <Text style={[styles.title, {fontFamily: 'Vazir-Bold'}]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={[styles.subtitle, {fontFamily: 'Vazir'}]}>
              {item.subtitle}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ads}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}/>
      <View style={styles.dots}>
        {ads.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === activeIndex ? colors.primary : colors.border,
                width: i === activeIndex ? 16 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 8},
  slide: {width, height: 180},
  image: {width: '100%', height: '100%', resizeMode: 'cover'},
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  title: {color: '#fff', fontSize: 16},
  subtitle: {color: '#eee', fontSize: 13, marginTop: 2},
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  dot: {height: 6, borderRadius: 3},
});

export default AdSlider;
