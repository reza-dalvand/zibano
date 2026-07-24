// src/components/common/SearchBar.js

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../stores/useThemeStore';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'جستجوی خدمات و کسب‌وکارها...',
  onSubmit,
  onClear,
  autoFocus = false,
  style,
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: colors.cardBackground,
          borderColor: focused ? colors.primary : colors.border,
        },
        style,
      ]}
    >
      {/* آیکون جستجو — به خاطر RTL خودکار در سمت راست باکس می‌نشیند */}
      <Icon name="search" size={22} color={focused ? colors.primary : colors.textSecondary} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary + '80'}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[s.input, { color: colors.textMain }]}
      />

      {/* دکمه پاک‌کردن متن — به خاطر RTL خودکار در سمت چپ قرار می‌گیرد */}
      {value?.length > 0 && (
        <TouchableOpacity 
          onPress={handleClear} 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={s.clearBtn}
        >
          <Icon name="close" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row', // هماهنگ با سیستم خودکار RTL
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Vazir',
    paddingVertical: 0,
    textAlign: 'right', // برای تضمین راست‌چین بودن متن در حین تایپ
  },
  clearBtn: {
    padding: 4,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
});