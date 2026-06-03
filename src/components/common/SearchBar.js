// src/components/common/SearchBar.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'جستجو...',
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
      {/* آیکون جستجو */}
      <Text style={[s.searchIcon, { color: colors.textSecondary }]}>🔍</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary + '80'}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        textAlign="right"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          s.input,
          { color: colors.textMain, fontFamily: 'Vazir' },
        ]}
      />

      {/* دکمه پاک‌کردن */}
      {value?.length > 0 && (
        <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[s.clearIcon, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 13,
    fontWeight: '600',
  },
});
