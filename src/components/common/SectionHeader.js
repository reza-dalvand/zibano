// src/components/common/SectionHeader.js  // ✅ اصلاح شد
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

export default function SectionHeader({
  icon,
  iconColor,
  title,
  subtitle,
  rightElement,
  style,
}) {
  const { colors } = useTheme();
  const bgColor = iconColor || colors.primary;
  
  return (
    <View style={[s.container, style]}>
      <View style={s.left}>
        {icon && (
          <View style={[s.iconBox, { backgroundColor: bgColor + '15' }]}>
            <Icon name={icon} size={18} color={bgColor} />
          </View>
        )}
        <View style={s.textCol}>
          <Text style={[s.title, { color: colors.textMain }]}>{title}</Text>
          {subtitle && (
            <Text style={[s.subtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontFamily: 'Vazir-Bold', textAlign:'left' },
  subtitle: { fontSize: 11, fontFamily: 'Vazir', textAlign:'center' },
});