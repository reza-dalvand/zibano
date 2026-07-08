// src/components/common/EmptyState.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from './Button';

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}) {
  const { colors } = useTheme();

  return (
    <View style={[s.container, style]}>
      {icon && (
        <View style={[s.iconWrapper, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {typeof icon === 'string' ? (
            <Text style={s.iconEmoji}>{icon}</Text>
          ) : (
            icon
          )}
        </View>
      )}

      {title && (
        <Text style={[s.title, { color: colors.textMain }]}>{title}</Text>
      )}

      {description && (
        <Text style={[s.description, { color: colors.textSecondary }]}>
          {description}
        </Text>
      )}

      {/* {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          size="md"
          style={s.action}
        />
      )} */}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontFamily: 'Vazir-Bold',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Vazir',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  action: {
    minWidth: 140,
  },
});
