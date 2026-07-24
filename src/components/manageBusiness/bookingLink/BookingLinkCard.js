// src/components/manageBusiness/bookingLink/BookingLinkCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { useTheme } from '../../../stores/useThemeStore';
import Card from '../../common/Card';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function BookingLinkCard({ bookingLink, onShare, onCopy }) {
  const { colors } = useTheme();

  // 🎯 استخراج مقدار لینک از آبجکت
  const linkUrl = typeof bookingLink === 'string' ? bookingLink : bookingLink?.link || '';
  const clicks = bookingLink?.clicks || 0;
  const bookings = bookingLink?.bookings || 0;

  const handleCopy = () => {
    Clipboard.setString(linkUrl);
    Alert.alert('کپی شد', 'لینک رزرو با موفقیت کپی شد');
    onCopy?.();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌸 نوبت‌دهی آنلاین\n\nبا این لینک می‌توانید مستقیماً از من نوبت بگیرید:\n${linkUrl}\n\n📱 رزرو از اپلیکیشن زیبانو`,
      });
      onShare?.();
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  return (
    <Card variant="elevated" padding={20} radius={20}>
      {/* هدر */}
      <View style={s.header}>
        <View style={[s.iconBox, { backgroundColor: colors.primary + '20' }]}>
          <Icon name="link" size={28} color={colors.primary} />
        </View>
        <View style={s.headerText}>
          <Text style={[s.title, { color: colors.textMain }]}>لینک اختصاصی رزرو</Text>
          <Text style={[s.subtitle, { color: colors.textSecondary }]}>
            این لینک را در شبکه‌های اجتماعی خود به اشتراک بگذارید
          </Text>
        </View>
      </View>

      {/* ✅ اصلاح اصلی: نمایش linkUrl به جای bookingLink */}
      <View style={[s.linkBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Icon name="language" size={20} color={colors.primary} />
        <Text style={[s.linkText, { color: colors.textMain }]} numberOfLines={1}>
          {linkUrl}
        </Text>
      </View>

      {/* راهنما */}
      <View style={[s.hintBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
        <Icon name="lightbulb" size={16} color={colors.primary} />
        <Text style={[s.hintText, { color: colors.textSecondary }]}>
          مشتریان با کلیک روی این لینک مستقیماً به صفحه رزرو شما در اپلیکیشن هدایت می‌شوند
        </Text>
      </View>

      {/* دکمه‌ها */}
      <View style={s.actions}>
        <TouchableOpacity
          style={[s.btn, { backgroundColor: colors.primary }]}
          onPress={handleCopy}
          activeOpacity={0.8}
        >
          <Icon name="content-copy" size={18} color="#fff" />
          <Text style={[s.btnText, { color: '#fff' }]}>کپی لینک</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.btn, { backgroundColor: '#25D366' }]}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Icon name="share" size={18} color="#fff" />
          <Text style={[s.btnText, { color: '#fff' }]}>اشتراک‌گذاری</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  hintText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
});