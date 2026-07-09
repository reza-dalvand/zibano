// src/components/createbusiness/TermsAndConditionsStep.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../common/Button';
import Card from '../common/Card';

const TERMS_SECTIONS = [
  {
    icon: 'verified-user',
    iconColor: '#4CAF50',
    title: 'احراز هویت الزامی',
    description:
      'برای جلوگیری از سوءاستفاده، کد ملی شما با شماره ثبت‌نام‌شده تطبیق داده می‌شود. این اطلاعات محرمانه باقی می‌ماند.',
  },
  {
    icon: 'account-balance-wallet',
    iconColor: '#2196F3',
    title: 'کارمزد و هزینه‌ها',
    description:
      'زیبانو ۵٪ کارمزد از هر رزرو موفق کسر می‌کند. این کارمزد به صورت خودکار از مبلغ دریافتی از مشتری کسر می‌شود.',
  },
  {
    icon: 'schedule',
    iconColor: '#FF9800',
    title: 'تعهد به کیفیت خدمات',
    description:
      'کسب‌وکار شما متعهد به ارائه خدمات با کیفیت و مطابق با توضیحات ثبت‌شده است. شکایات مشتریان به صورت جدی پیگیری می‌شود.',
  },
  {
    icon: 'gavel',
    iconColor: '#9C27B0',
    title: 'لغو نوبت و جریمه',
    description:
      'در صورت لغو نوبت توسط مشتری، درصدی از بیعانه به عنوان جریمه کسر و مابقی مسترد می‌شود. قوانین جریمه در اختیار شماست.',
  },
  {
    icon: 'shield',
    iconColor: '#E91E63',
    title: 'حفاظت از اطلاعات',
    description:
      'اطلاعات شخصی مشتریان رمزنگاری شده و هرگز در اختیار شخص ثالث قرار نمی‌گیرد. شما نیز موظف به حفظ محرمانگی هستید.',
  },
  {
    icon: 'trending-up',
    iconColor: '#FFC107',
    title: 'تبلیغات و سرویس‌های ویژه',
    description:
      'امکان خرید سرویس‌های ویژه مانند تبلیغات در صفحه اصلی، نمایش برتر و پیامک‌های انبوه برای شما فراهم است.',
  },
];

export default function TermsAndConditionsStep({ onAccept, onDecline, navbarHeight = 90 }) {
  const { colors } = useTheme();
  const [accepted, setAccepted] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    
    // 🎯 محاسبه دقیق پیشرفت
    const currentProgress = (contentOffset.y + layoutMeasurement.height) / contentSize.height;
    setScrollProgress(Math.min(currentProgress, 1));
    
    // 🎯 فاصله تا انتهای صفحه
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    
    // 🎯 آستانه تشخیص: 150 پیکسل قبل از انتها
    if (distanceFromBottom <= 150 && !scrolledToBottom) {
      console.log('✅ Reached bottom!');
      setScrolledToBottom(true);
    }
  };

  const canProceed = accepted && scrolledToBottom;

  const footerBottomPadding = navbarHeight + 40;

  const getHintMessage = () => {
    if (!scrolledToBottom) {
      return `📖 ${Math.round(scrollProgress * 100)}٪ مطالعه شده - ادامه دهید`;
    }
    if (!accepted) {
      return '☑️ برای ادامه، قوانین را بپذیرید';
    }
    return '';
  };

  return (
    <View style={s.container}>
      {/* هدر لاکچری */}
      <View style={s.heroSection}>
        <View style={[s.heroIconBox, { backgroundColor: colors.primary + '15' }]}>
          <View style={[s.heroIconCircle, { backgroundColor: colors.primary }]}>
            <Icon name="gavel" size={24} color="#fff" />
          </View>
          <View style={[s.heroRing1, { borderColor: colors.primary + '40' }]} />
          <View style={[s.heroRing2, { borderColor: colors.primary + '20' }]} />
        </View>
        <Text style={[s.heroTitle, { color: colors.textMain }]}>قوانین و مقررات</Text>
        <Text style={[s.heroSubtitle, { color: colors.textSecondary }]}>
          لطفاً قبل از شروع، قوانین زیبانو را مطالعه بفرمایید
        </Text>
      </View>

      {/* نوار پیشرفت اسکرول */}
      <View style={[s.progressBarWrapper, { backgroundColor: colors.border }]}>
        <View
          style={[
            s.progressBarFill,
            {
              backgroundColor: scrolledToBottom ? '#4CAF50' : colors.primary,
              width: `${scrollProgress * 100}%`,
            },
          ]}
        />
      </View>

      {/* لیست قوانین در اسکرول */}
      <ScrollView
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={50}
        contentContainerStyle={s.scrollContent}
      >
        {TERMS_SECTIONS.map((section, index) => (
          <Card
            key={index}
            variant="default"
            padding={14}
            radius={14}
            style={[s.termCard, { borderColor: colors.border }]}
          >
            <View style={s.termRow}>
              <View style={[s.termIconBox, { backgroundColor: section.iconColor + '15' }]}>
                <Icon name={section.icon} size={20} color={section.iconColor} />
              </View>
              <View style={s.termTextCol}>
                <Text style={[s.termTitle, { color: colors.textMain }]}>{section.title}</Text>
                <Text style={[s.termDescription, { color: colors.textSecondary }]}>
                  {section.description}
                </Text>
              </View>
            </View>
          </Card>
        ))}

        {/* پیام پایان اسکرول */}
        {scrolledToBottom && (
          <View style={[s.endMessage, { backgroundColor: '#4CAF5015', borderColor: '#4CAF5040' }]}>
            <Icon name="check-circle" size={20} color="#4CAF50" />
            <Text style={[s.endMessageText, { color: '#4CAF50' }]}>
              تمام قوانین را مطالعه کردید
            </Text>
          </View>
        )}

        {!scrolledToBottom && (
          <View style={[s.scrollHint, { backgroundColor: colors.primary + '10' }]}>
            <Icon name="arrow-downward" size={16} color={colors.primary} />
            <Text style={[s.scrollHintText, { color: colors.primary }]}>
              برای مشاهده همه قوانین، صفحه را به پایین بکشید
            </Text>
          </View>
        )}

        {/* فضای خالی برای فوتر شناور */}
        <View style={{ height: footerBottomPadding + 120 }} />
      </ScrollView>

      {/* فوتر با چک‌باکس و دکمه‌ها */}
      <View
        style={[
          s.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: footerBottomPadding,
          },
        ]}
      >
        {/* چک‌باکس قوانین */}
        <TouchableOpacity
          onPress={() => setAccepted(!accepted)}
          activeOpacity={0.8}
          style={[
            s.acceptBox,
            {
              backgroundColor: accepted ? colors.primary + '15' : colors.cardBackground,
              borderColor: accepted ? colors.primary : colors.border,
            },
          ]}
        >
          <View
            style={[
              s.checkbox,
              {
                backgroundColor: accepted ? colors.primary : 'transparent',
                borderColor: accepted ? colors.primary : colors.border,
              },
            ]}
          >
            {accepted && <Icon name="check" size={16} color="#fff" />}
          </View>
          <Text style={[s.acceptText, { color: colors.textMain }]}>
            تمامی قوانین و مقررات فوق را{' '}
            <Text style={{ color: colors.primary, fontFamily: 'Vazir-Bold' }}>
              مطالعه کرده و می‌پذیرم.
            </Text>
          </Text>
        </TouchableOpacity>

        {/* دکمه‌های ناوبری */}
        <View style={s.footerRow}>
          <Button
            title="انصراف"
            onPress={onDecline}
            variant="outline"
            size="md"
            style={s.halfButton}
          />
          <Button
            title="ادامه و شروع ثبت"
            onPress={onAccept}
            variant="primary"
            size="md"
            disabled={!canProceed}
            icon={<Icon name="arrow-back" size={18} color="#fff" />}
            iconPosition="left"
            style={[s.halfButton, { opacity: canProceed ? 1 : 0.5 }]}
          />
        </View>

        {/* پیام راهنما */}
        {!canProceed && getHintMessage() !== '' && (
          <Text style={[s.footerHint, { color: colors.textSecondary }]}>{getHintMessage()}</Text>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    gap: 6,
  },
  heroIconBox: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    position: 'relative',
    marginBottom: 6,
  },
  heroIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  heroRing1: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    zIndex: 2,
  },
  heroRing2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  progressBarWrapper: {
    height: 6,
    borderRadius: 2,
    marginHorizontal: 20,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  termCard: {
    borderWidth: 1,
  },
  termRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  termIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termTextCol: {
    flex: 1,
    gap: 3,
  },
  termTitle: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  termDescription: {
    fontSize: 11.5,
    fontFamily: 'Vazir',
    lineHeight: 19,
    textAlign: 'left',
  },
  scrollHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  scrollHintText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  endMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  endMessageText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  acceptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: 'Vazir',
    lineHeight: 20,
    textAlign: 'left',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfButton: {
    flex: 1,
  },
  footerHint: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'center',
  },
});