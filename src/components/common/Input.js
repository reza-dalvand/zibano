// src/components/common/Input.js

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

/**
 * variant: 'default' | 'filled'
 */
export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  variant = 'default',
  error,
  hint,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  rightIcon = null,
  leftIcon = null,
  onRightIconPress,
  style,
  inputStyle,
  autoCapitalize = 'none',
}) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(secureTextEntry);

  const borderColor = error
    ? '#E57373'
    : focused
    ? colors.primary
    : colors.border;

  const bgColor =
    variant === 'filled' ? colors.cardBackground : 'transparent';

  return (
    <View style={[s.wrapper, style]}>
      {label && (
        <Text style={[s.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          s.container,
          {
            borderColor,
            backgroundColor: bgColor,
          },
          focused && s.focused,
          !editable && s.disabled,
          multiline && { height: numberOfLines * 44 },
        ]}
      >
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={s.iconRight}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary + '80'}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          editable={editable}
          autoCapitalize={autoCapitalize}
          textAlign="right"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            s.input,
            {
              color: colors.textMain,
              fontFamily: 'Vazir',
            },
            multiline && s.multilineInput,
            inputStyle,
          ]}
        />

        {leftIcon && !secureTextEntry && (
          <View style={s.iconLeft}>{leftIcon}</View>
        )}

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setSecure(prev => !prev)}
            style={s.iconLeft}
          >
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {secure ? 'نمایش' : 'پنهان'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={s.error}>{error}</Text>
      )}
      {!error && hint && (
        <Text style={[s.hint, { color: colors.textSecondary }]}>{hint}</Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Vazir-Medium',
    fontSize: 13,
    marginBottom: 6,
    textAlign: 'right',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  focused: {
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  multilineInput: {
    paddingTop: 12,
  },
  iconRight: {
    marginLeft: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  error: {
    color: '#E57373',
    fontFamily: 'Vazir',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  hint: {
    fontFamily: 'Vazir',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});
