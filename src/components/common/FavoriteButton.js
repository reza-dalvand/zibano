// src/components/common/FavoriteButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '../../stores/useAuthStore';

/**
 * دکمه علاقه‌مندی که فقط وقتی کاربر لاگین است نمایش داده می‌شود
 * 
 * @param {boolean} isFavorite - آیا مورد علاقه است؟
 * @param {Function} onPress - عملکرد هنگام کلیک
 * @param {number} size - اندازه آیکون (پیش‌فرض: 24)
 * @param {string} color - رنگ آیکون وقتی علاقه‌مندی نیست (پیش‌فرض: #fff)
 * @param {string} activeColor - رنگ آیکون وقتی علاقه‌مندی است (پیش‌فرض: #E91E63)
 * @param {object} style - استایل اضافی
 */
export default function FavoriteButton({
  isFavorite = false,
  onPress,
  size = 24,
  color = '#fff',
  activeColor = '#E91E63',
  style,
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // اگر کاربر لاگین نیست، چیزی نمایش نده
  if (!isAuthenticated) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, style]}
    >
      <Icon
        name={isFavorite ? 'bookmark' : 'bookmark-border'}
        size={size}
        color={isFavorite ? activeColor : color}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});