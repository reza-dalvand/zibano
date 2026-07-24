// src/components/createbusiness/SocialMediaStep.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Input from '../common/Input';
import Card from '../common/Card';
import Divider from '../common/Divider';

// تنظیمات پیام‌رسان‌ها
const SOCIAL_PLATFORMS = [
  {
    key: 'telegram',
    title: 'تلگرام',
    subtitle: 'آیدی یا لینک کانال تلگرام',
    placeholder: 'مثال: nilaram_official',
    icon: 'send',
    color: '#0088cc',
    prefix: '@',
  },
  {
    key: 'whatsapp',
    title: 'واتساپ',
    subtitle: 'شماره تماس واتساپ (با کد کشور)',
    placeholder: 'مثال: 989123456789',
    icon: 'message',
    color: '#25D366',
    prefix: '+',
  },
  {
    key: 'bale',
    title: 'بله',
    subtitle: 'آیدی یا شماره حساب بله',
    placeholder: 'مثال: nilaram_beauty',
    icon: 'forum',
    color: '#00a2e8',
    prefix: '@',
  },
  {
    key: 'eitaa',
    title: 'ایتا',
    subtitle: 'آیدی یا لینک کانال ایتا',
    placeholder: 'مثال: nilaram_official',
    icon: 'chat',
    color: '#ef6c00',
    prefix: '@',
  },
];

export default function SocialMediaStep({ formData, onUpdate }) {
  const { colors } = useTheme();

  // شمارش تعداد فیلدهای پر شده
  const filledCount = SOCIAL_PLATFORMS.filter(
    (p) => formData[p.key] && formData[p.key].trim()
  ).length;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
      {/* هدر بخش */}
      <View style={s.sectionHeader}>
        <View style={[s.headerIconBox, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="share" size={24} color={colors.primary} />
        </View>
        <View style={s.headerTextCol}>
          <Text style={[s.stepTitle, { color: colors.textMain }]}>
            شبکه‌های اجتماعی و پیام‌رسان‌ها
          </Text>
          <Text style={[s.stepHint, { color: colors.textSecondary }]}>
            راه‌های ارتباطی خود را با مشتریان به اشتراک بگذارید
          </Text>
        </View>
      </View>

      {/* نشانگر پیشرفت */}
      <Card
        variant="default"
        padding={14}
        radius={14}
        style={[s.progressCard, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '30' }]}
      >
        <View style={s.progressRow}>
          <Icon name="info-outline" size={18} color={colors.primary} />
          <Text style={[s.progressText, { color: colors.primary }]}>
            {filledCount} از {SOCIAL_PLATFORMS.length} پیام‌رسان تکمیل شده است
          </Text>
        </View>
        <View style={[s.progressBarBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              s.progressBarFill,
              {
                backgroundColor: colors.primary,
                width: `${(filledCount / SOCIAL_PLATFORMS.length) * 100}%`,
              },
            ]}
          />
        </View>
      </Card>

      {/* کارت‌های پیام‌رسان‌ها */}
      {SOCIAL_PLATFORMS.map((platform) => {
        const value = formData[platform.key] || '';
        const hasValue = value.trim().length > 0;

        return (
          <Card
            key={platform.key}
            variant="default"
            padding={16}
            radius={16}
            style={[
              s.socialCard,
              hasValue && { borderColor: platform.color + '60' },
            ]}
          >
            {/* هدر پیام‌رسان */}
            <View style={s.socialHeader}>
              <View
                style={[
                  s.socialIconBox,
                  { backgroundColor: platform.color + '20' },
                ]}
              >
                <Icon name={platform.icon} size={24} color={platform.color} />
              </View>
              <View style={s.socialTitleCol}>
                <Text style={[s.socialTitle, { color: colors.textMain }]}>
                  {platform.title}
                </Text>
                <Text style={[s.socialSubtitle, { color: colors.textSecondary }]}>
                  {platform.subtitle}
                </Text>
              </View>
              {hasValue && (
                <View
                  style={[
                    s.verifiedBadge,
                    { backgroundColor: platform.color + '20' },
                  ]}
                >
                  <Icon name="check-circle" size={14} color={platform.color} />
                </View>
              )}
            </View>

            {/* فیلد ورودی */}
            <Input
              placeholder={platform.placeholder}
              value={value}
              onChangeText={(txt) => onUpdate(platform.key, txt)}
              rightIcon={
                <View
                  style={[
                    s.inputIconBox,
                    { backgroundColor: platform.color + '15' },
                  ]}
                >
                  <Icon
                    name={platform.icon}
                    size={18}
                    color={platform.color}
                  />
                </View>
              }
            />

            {/* پیش‌نمایش */}
            {hasValue && (
              <View
                style={[
                  s.previewBox,
                  {
                    backgroundColor: platform.color + '10',
                    borderColor: platform.color + '30',
                  },
                ]}
              >
                <Icon name="visibility" size={14} color={platform.color} />
                <Text style={[s.previewText, { color: platform.color }]}>
                  {platform.prefix} {value}
                </Text>
              </View>
            )}
          </Card>
        );
      })}

      <Divider spacing={16} />

      {/* کارت راهنما */}
      <Card
        variant="default"
        padding={16}
        radius={16}
        style={[s.hintCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      >
        <View style={s.hintHeader}>
          <Icon name="lightbulb" size={20} color="#FFC107" />
          <Text style={[s.hintTitle, { color: colors.textMain }]}>
            چرا پیام‌رسان‌ها مهم هستند؟
          </Text>
        </View>
        <View style={s.hintList}>
          <View style={s.hintItem}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text style={[s.hintItemText, { color: colors.textSecondary }]}>
              مشتریان می‌توانند مستقیماً با شما در ارتباط باشند
            </Text>
          </View>
          <View style={s.hintItem}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text style={[s.hintItemText, { color: colors.textSecondary }]}>
              پاسخگویی سریع‌تر از طریق پیام‌رسان‌های محبوب ایرانی
            </Text>
          </View>
          <View style={s.hintItem}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text style={[s.hintItemText, { color: colors.textSecondary }]}>
              افزایش اعتبار و اعتماد مشتریان به کسب‌وکار شما
            </Text>
          </View>
          <View style={s.hintItem}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
            <Text style={[s.hintItemText, { color: colors.textSecondary }]}>
              امکان ارسال اطلاعیه‌ها و تخفیف‌های ویژه به مشتریان
            </Text>
          </View>
        </View>
      </Card>

      {/* کارت اختیاری بودن */}
      <Card
        variant="default"
        padding={14}
        radius={14}
        style={[s.optionalCard, { backgroundColor: colors.primary + '08', borderColor: colors.primary + '30' }]}
      >
        <View style={s.optionalRow}>
          <Icon name="info-outline" size={20} color={colors.primary} />
          <Text style={[s.optionalText, { color: colors.primary }]}>
            این مرحله اختیاری است و می‌توانید بعداً در تنظیمات سالن، پیام‌رسان‌ها را اضافه یا ویرایش کنید.
          </Text>
        </View>
      </Card>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },

  // هدر
  sectionHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  headerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 18, fontFamily: 'Vazir-Bold' },
  stepHint: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 18 },

  // کارت پیشرفت
  progressCard: { borderWidth: 1 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  progressText: { fontSize: 12, fontFamily: 'Vazir-Medium', flex: 1 },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // کارت پیام‌رسان
  socialCard: { borderWidth: 1 },
  socialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  socialIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialTitleCol: { flex: 1, gap: 2 },
  socialTitle: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  socialSubtitle: { fontSize: 12, fontFamily: 'Vazir' },
  verifiedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  previewText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
    flex: 1,
  },

  // کارت راهنما
  hintCard: { borderWidth: 1 },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  hintTitle: { fontSize: 14, fontFamily: 'Vazir-Bold' },
  hintList: { gap: 10 },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hintItemText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 18,
    flex: 1,
  },

  // کارت اختیاری
  optionalCard: { borderWidth: 1 },
  optionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionalText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 20,
    flex: 1,
  },
});