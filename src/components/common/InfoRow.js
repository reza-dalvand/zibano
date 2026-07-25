// src/components/common/InfoRow.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';

/**
 * کامپوننت مشترک ردیف اطلاعات (آیکون + لیبل + مقدار)
 *
 * استفاده شده در:
 * - BusinessAbout (contactRow)
 * - AppointmentDetailSheet (infoRow)
 * - TransactionDetailModal (row)
 * - InvoiceModal (infoRow)
 *
 * Props:
 * - icon: نام آیکون MaterialIcons
 * - iconColor: رنگ آیکون
 * - label: برچسب (مثلاً "نام مشتری")
 * - value: مقدار
 * - valueColor: رنگ مقدار (اختیاری)
 * - monospace: فونت monospace برای کدها
 * - onPress: کلیک‌پذیر بودن
 * - showDivider: خط پایین
 * - rightIcon: آیکون سمت راست (مثلاً کپی)
 */
export default function InfoRow({
  icon,
  iconColor,
  label,
  value,
  valueColor,
  valueBold = false,
  monospace = false,
  onPress,
  showDivider = false,
  rightIcon = null,
  warn = false,
  highlight = false,
}) {
  const { colors } = useTheme();

  const finalIconColor = warn ? '#E53935' : highlight ? '#2196F3' : iconColor || colors.textSecondary;
  const finalValueColor = warn ? '#E53935' : highlight ? '#2196F3' : valueColor || colors.textMain;

  const content = (
    <View
      style={[
        s.container,
        showDivider && { borderBottomWidth: 1, borderBottomColor: colors.border + '50' },
      ]}
    >
      {icon && <Icon name={icon} size={18} color={finalIconColor} />}
      <View style={s.content}>
        <Text style={[s.label, { color: colors.textSecondary }]}>{label}</Text>
        <Text
          style={[
            s.value,
            { color: finalValueColor },
            (valueBold || monospace || highlight || warn) && s.valueBold,
            monospace && s.monospace,
          ]}
          selectable
        >
          {value}
        </Text>
      </View>
      {rightIcon}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  value: {
    fontSize: 13.5,
    fontFamily: 'Vazir-Medium',
  },
  valueBold: {
    fontFamily: 'Vazir-Bold',
  },
  monospace: {
    letterSpacing: 1,
  },
});