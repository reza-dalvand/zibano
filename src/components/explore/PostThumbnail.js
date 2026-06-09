// src/components/explore/PostThumbnail.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const THUMBNAIL_SIZE = width / 3;

export default function PostThumbnail({ post, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(post)}
      style={styles.container}
    >
      <Image source={{ uri: post.gallery[0] }} style={styles.image} />
      {post.gallery.length > 1 && (
        <View style={styles.carouselIcon}>
          <Icon name="collections" size={16} color="#FFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    padding: 1,
  },
  image: {
    flex: 1,
    backgroundColor: '#eee',
  },
  carouselIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
});