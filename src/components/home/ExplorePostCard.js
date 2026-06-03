import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../theme/ThemeContext';

const ExplorePostCard = ({post, onPress, onSave}) => {
  const {colors} = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(post)}
      style={[styles.card, {backgroundColor: colors.cardBackground}]}>
      <Image source={{uri: post.imageUrl}} style={styles.image} />
      <TouchableOpacity style={styles.saveBtn} onPress={() => onSave?.(post)}>
        <Icon
          name={post.saved ? 'bookmark' : 'bookmark-border'}
          size={22}
          color={post.saved ? colors.primary : '#fff'}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={[styles.title, {color: colors.textMain, fontFamily: 'Vazir-Medium'}]}numberOfLines={1}>
          {post.businessName}
        </Text>
        <View style={styles.row}>
          <Icon name="star" size={14} color="#FFC107" />
          <Text style={[styles.meta, {color: colors.textSecondary, fontFamily: 'Vazir'}]}>
            {post.rating}  ·  {post.serviceName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {borderRadius: 12, overflow: 'hidden', marginBottom: 12},
  image: {width: '100%', height: 180, resizeMode: 'cover'},
  saveBtn: {position: 'absolute', top: 8, left: 8},
  info: {padding: 10},
  title: {fontSize: 14, marginBottom: 4},
  row: {flexDirection: 'row', alignItems: 'center', gap: 4},
  meta: {fontSize: 12},
});

export default ExplorePostCard;
