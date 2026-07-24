// src/components/manageBusiness/services/ServiceCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import ServiceTypeIcon from './ServiceTypeIcon';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const formatPrice = (num) =>
  `${toPersianDigit((num || 0).toLocaleString('en-US'))}`;

export default function ServiceCard({ service, onEdit, onToggle, onDelete }) {
  const { colors } = useTheme();
  const isActive = service.isActive !== false;
  const hasDiscount = service.discountPercent > 0;
  // 🆕 بررسی وضعیت یادآوری
  const hasReminder = service.reminderDays > 0;

  const handleDelete = () => {
    Alert.alert(
      'حذف خدمت',
      `آیا از حذف "${service.name}" مطمئن هستید؟`,
      [
        { text: 'انصراف', style: 'cancel' },
        { text: 'حذف', style: 'destructive', onPress: () => onDelete?.(service.id) },
      ]
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onEdit?.(service)}
      style={[
        s.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: isActive ? colors.border : colors.border + '60',
          opacity: isActive ? 1 : 0.7,
        },
      ]}
    >
      {/* ردیف بالا: آیکون + اطلاعات + Switch */}
      <View style={s.topRow}>
        <ServiceTypeIcon typeId={service.typeId} size={56} />

        <View style={s.infoCol}>
          <Text style={[s.name, { color: colors.textMain }]} numberOfLines={1}>
            {service.name}
          </Text>
          <Text style={[s.typeName, { color: colors.textSecondary }]} numberOfLines={1}>
            {service.typeName}
          </Text>
          {/* 🆕 نمایش وضعیت یادآوری */}
          <View style={s.reminderRow}>
            <Icon
              name={hasReminder ? 'notifications-active' : 'notifications-off'}
              size={12}
              color={hasReminder ? '#9C27B0' : colors.textSecondary + '80'}
            />
            <Text
              style={[
                s.reminderText,
                { color: hasReminder ? '#9C27B0' : colors.textSecondary + '80' },
              ]}
            >
              {hasReminder
                ? `یادآوری ${toPersianDigit(service.reminderDays)} روز قبل`
                : 'یادآوری غیرفعال'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onToggle?.(service.id);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={s.switchWrapper}
        >
          <View
            style={[
              s.switchTrack,
              { backgroundColor: isActive ? colors.primary + '55' : colors.border },
            ]}
          >
            <View
              style={[
                s.switchKnob,
                {
                  backgroundColor: isActive ? colors.primary : '#ccc',
                  alignSelf: isActive ? 'flex-start' : 'flex-end',
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* خط جداکننده */}
      <View style={[s.divider, { backgroundColor: colors.border }]} />

      {/* ردیف قیمت‌ها */}
      <View style={s.priceSection}>
        {/* قیمت اصلی و نهایی */}
        <View style={s.priceCol}>
          {hasDiscount && (
            <Text style={[s.originalPrice, { color: colors.textSecondary }]}>
              {formatPrice(service.originalPrice)}
            </Text>
          )}
          <View style={s.finalPriceRow}>
            <Text style={[s.finalPrice, { color: colors.primary }]}>
              {formatPrice(hasDiscount ? service.finalPrice : service.originalPrice)}
            </Text>
            <Text style={[s.currencyText, { color: colors.textSecondary }]}>
              تومان
            </Text>
            {hasDiscount && (
              <View style={[s.discountBadge, { backgroundColor: '#43A04720' }]}>
                <Icon name="local-offer" size={10} color="#43A047" />
                <Text style={[s.discountText, { color: '#43A047' }]}>
                  {toPersianDigit(service.discountPercent)}٪
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* دکمه‌های اکشن */}
        <View style={s.actionCol}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation?.();
              onEdit?.(service);
            }}
            style={[s.actionBtn, { backgroundColor: colors.primary + '15' }]}
          >
            <Icon name="edit" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation?.();
              handleDelete();
            }}
            style={[s.actionBtn, { backgroundColor: '#E5393515' }]}
          >
            <Icon name="delete-outline" size={18} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ردیف بیعانه */}
      {service.hasDeposit && service.depositAmount > 0 && (
        <View style={[s.depositRow, { borderTopColor: colors.border }]}>
          <Icon name="account-balance-wallet" size={14} color="#FF9800" />
          <Text style={[s.depositLabel, { color: colors.textSecondary }]}>
            بیعانه رزرو:
          </Text>
          <Text style={[s.depositValue, { color: '#FF9800' }]}>
            {formatPrice(service.depositAmount)} تومان
          </Text>
        </View>
      )}

      {/* راهنما: برای ویرایش کلیک کنید */}
      <View style={[s.hintRow, { borderTopColor: colors.border }]}>
        <Icon name="touch-app" size={12} color={colors.textSecondary} />
        <Text style={[s.hintText, { color: colors.textSecondary }]}>
          برای ویرایش کامل، روی کارت کلیک کنید
        </Text>
        <Icon name="chevron-left" size={14} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoCol: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  typeName: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  durationText: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  // 🆕 استایل ردیف یادآوری
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  reminderText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  switchWrapper: {
    paddingVertical: 4,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  priceCol: {
    flex: 1,
    gap: 4,
  },
  originalPrice: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textDecorationLine: 'line-through',
  },
  finalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  finalPrice: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
  },
  currencyText: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
  actionCol: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  depositLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  depositValue: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
    marginLeft: 'auto',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  hintText: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Vazir',
  },
});