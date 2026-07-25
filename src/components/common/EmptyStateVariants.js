// src/components/common/EmptyStateVariants.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Button from './Button';

/**
 * کامپوننت مشترک Empty State با variant‌های از پیش تعریف شده
 *
 * استفاده شده در:
 * - AllAdsEmptyState
 * - AllLineRentalsEmptyState
 * - AllModelRequestsEmptyState
 * - ServiceEmptyState
 * - ModelRequestEmptyState
 * - LineRentalEmptyState
 *
 * Props:
 * - variant: نوع از پیش تعریف شده
 * - title: عنوان (override)
 * - description: توضیحات (override)
 * - actionLabel: متن دکمه
 * - onAction: هندلر دکمه
 * - tips: آرایه نکات [{ icon, text, color }]
 * - onCreate: هندلر ایجاد (برای myAds)
 */

// پیکربندی variant‌های از پیش تعریف شده
const VARIANT_CONFIG = {
  ads: {
    icon: 'local-fire-department',
    defaultTitle: 'فعلاً پیشنهاد ویژه‌ای وجود ندارد',
    defaultDescription: 'به زودی تخفیف‌ها و جشنواره‌های جدید اضافه می‌شود',
    color: '#E53935',
    defaultTips: [
      { icon: 'notifications-active', text: 'اعلان‌های زیبانو را فعال کنید', color: '#FF9800' },
      { icon: 'schedule', text: 'هر روز پیشنهادات جدید اضافه می‌شود', color: '#E53935' },
    ],
  },
  lineRental: {
    icon: 'storefront',
    defaultTitle: 'فعلاً آگهی لاینی وجود ندارد',
    defaultDescription: 'به زودی فرصت‌های جدید اجاره لاین اضافه می‌شود',
    color: '#667eea',
    defaultTips: [
      { icon: 'notifications-active', text: 'اعلان‌ها را فعال کنید', color: '#FF9800' },
      { icon: 'schedule', text: 'هر روز آگهی‌های جدید اضافه می‌شود', color: '#667eea' },
    ],
  },
  modelRequest: {
    icon: 'face-retouching-natural',
    defaultTitle: 'فعلاً فرصت مدلینگی وجود ندارد',
    defaultDescription: 'به زودی فرصت‌های جدید اضافه می‌شود',
    color: '#E91E63',
    defaultTips: [
      { icon: 'notifications-active', text: 'اعلان‌ها را فعال کنید', color: '#FF9800' },
      { icon: 'schedule', text: 'هر روز فرصت‌های جدید', color: '#E91E63' },
    ],
  },
  service: {
    icon: 'spa',
    defaultTitle: 'هنوز خدمتی ثبت نکرده‌اید',
    defaultDescription: 'اولین خدمت سالن خود را اضافه کنید',
    color: '#A88B7D',
    actionLabel: 'افزودن اولین خدمت',
    defaultTips: [
      { icon: 'lightbulb', text: 'حداقل ۳ خدمت برای شروع', color: '#FFC107' },
      { icon: 'info-outline', text: 'خدمات باید به اعضای تیم اختصاص داده شوند', color: '#A88B7D' },
    ],
  },
  portfolio: {
    icon: 'photo-library',
    defaultTitle: 'هنوز نمونه‌کاری ثبت نکرده‌اید',
    defaultDescription: 'نمونه‌کارهای خود را آپلود کنید',
    color: '#A88B7D',
    actionLabel: 'افزودن اولین نمونه‌کار',
  },
  appointment: {
    icon: 'event-available',
    defaultTitle: 'نوبتی ثبت نشده است',
    defaultDescription: 'پس از رزرو اولین نوبت، اینجا نمایش داده می‌شود',
    color: '#2196F3',
  },
  payment: {
    icon: 'receipt-long',
    defaultTitle: 'پرداختی ثبت نشده',
    defaultDescription: 'پس از اولین پرداخت، سوابق مالی نمایش داده می‌شود',
    color: '#4CAF50',
  },
  transaction: {
    icon: 'receipt-long',
    defaultTitle: 'تراکنشی یافت نشد',
    defaultDescription: 'در این دسته‌بندی تراکنشی ثبت نشده',
    color: '#A88B7D',
  },
};

export default function EmptyStateVariants({
  variant = 'service',
  title,
  description,
  actionLabel,
  onAction,
  tips,
  customIcon,
}) {
  const { colors } = useTheme();
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.service;

  const finalTitle = title || config.defaultTitle;
  const finalDescription = description || config.defaultDescription;
  const finalActionLabel = actionLabel || config.actionLabel;
  const finalTips = tips || config.defaultTips || [];
  const iconName = customIcon || config.icon;
  const iconColor = config.color;

  return (
    <View style={s.container}>
      {/* آیکون */}
      <View style={[s.iconWrapper, { backgroundColor: iconColor + '15' }]}>
        <View style={[s.iconCircle, { backgroundColor: iconColor }]}>
          <Icon name={iconName} size={44} color="#fff" />
        </View>
        <View style={[s.iconRing, { borderColor: iconColor + '40' }]} />
      </View>

      {/* عنوان و توضیحات */}
      <Text style={[s.title, { color: colors.textMain }]}>{finalTitle}</Text>
      <Text style={[s.description, { color: colors.textSecondary }]}>
        {finalDescription}
      </Text>

      {/* دکمه اکشن */}
      {finalActionLabel && onAction && (
        <Button
          title={finalActionLabel}
          onPress={onAction}
          variant="primary"
          size="lg"
          icon={<Icon name="add" size={20} color="#fff" />}
          iconPosition="right"
          style={s.button}
        />
      )}

      {/* نکات */}
      {finalTips.length > 0 && (
        <View style={s.tipsContainer}>
          {finalTips.map((tip, i) => (
            <View key={i} style={s.tipItem}>
              <Icon name={tip.icon} size={14} color={tip.color} />
              <Text style={[s.tipText, { color: colors.textSecondary }]}>
                {tip.text}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
    minHeight: 400,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    zIndex: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
  },
  tipsContainer: {
    marginTop: 16,
    gap: 10,
    width: '100%',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
});