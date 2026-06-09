// src/components/explore/PostActionBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function PostActionBar({ post, onSave, onShare }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, { borderColor: colors.border }]}
        onPress={() => onSave(post.id)}
      >
        <Icon
          name={post.saved ? 'bookmark' : 'bookmark-border'}
          size={20}
          color={post.saved ? colors.primary : colors.textMain}
        />
        <Text style={[styles.btnText, { color: colors.textMain }]}>
          {post.saved ? 'ذخیره‌شده' : 'علاقه‌مندی'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { borderColor: colors.border }]}
        onPress={() => onShare(post)}
      >
        <Icon name="share" size={20} color={colors.textMain} />
        <Text style={[styles.btnText, { color: colors.textMain }]}>
          اشتراک‌گذاری
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  btn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
});