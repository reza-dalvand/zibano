// src/screens/profile/InviteFriendsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Share, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function InviteFriendsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = 'ZIBANO-' + (user?.phone?.slice(-4) || '0000');
  const referralLink = `https://zibano.app/invite/${referralCode}`;

  const handleCopy = async () => {
    try {
      await Share.share({
        message: `📋 کد معرف زیبانو من:\n\n${referralCode}\n\n${referralLink}`,
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          `🌸 با اپلیکیشن زیبانو، خدمات زیبایی و سلامت رو آنلاین رزرو کن!\n\n` +
          `✨ با کد معرف من ثبت‌نام کن:\n${referralCode}\n\n` +
          `📱 لینک دانلود:\n${referralLink}`,
      });
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom']} scrollable>
      <View style={s.content}>
        <View style={s.heroSection}>
          <View style={[s.heroIconBox, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="card-giftcard" size={56} color={colors.primary} />
          </View>
          <Text style={[s.heroTitle, { color: colors.textMain }]}>
            دوستان خود را دعوت کنید
          </Text>
          <Text style={[s.heroSubtitle, { color: colors.textSecondary }]}>
            زیبانو را به دوستانتان معرفی کنید و همراه با آن‌ها از خدمات زیبایی لذت ببرید
          </Text>
        </View>

        <Card variant="elevated" padding={20} radius={20} style={s.codeCard}>
          <Text style={[s.codeLabel, { color: colors.textSecondary }]}>
            کد معرف شما
          </Text>
          <View
            style={[
              s.codeBox,
              { backgroundColor: colors.background, borderColor: colors.primary + '40' },
            ]}
          >
            <Text style={[s.codeText, { color: colors.primary }]} selectable>
              {referralCode}
            </Text>
            <TouchableOpacity
              style={[s.copyBtn, { backgroundColor: colors.primary }]}
              onPress={handleCopy}
            >
              <Icon name={copied ? 'check' : 'content-copy'} size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[s.codeHint, { color: colors.textSecondary }]}>
            {copied
              ? '✓ برای کپی، یکی از گزینه‌های اشتراک‌گذاری را انتخاب کنید'
              : 'این کد را با دوستانتان به اشتراک بگذارید'}
          </Text>
        </Card>

        <Card variant="elevated" padding={16} radius={16} style={s.linkCard}>
          <View style={s.linkRow}>
            <Icon name="link" size={20} color={colors.primary} />
            <View style={s.linkInfo}>
              <Text style={[s.linkLabel, { color: colors.textSecondary }]}>لینک دعوت</Text>
              <Text style={[s.linkValue, { color: colors.textMain }]} numberOfLines={1}>
                {referralLink}
              </Text>
            </View>
          </View>
        </Card>

        <Text style={[s.stepsTitle, { color: colors.textMain }]}>چگونه دعوت کنم؟</Text>
        <View style={s.stepsContainer}>
          {[
            { icon: 'share', text: 'کد معرف یا لینک دعوت را با دوستانتان به اشتراک بگذارید' },
            { icon: 'person-add', text: 'دوست شما با کد شما در زیبانو ثبت‌نام می‌کند' },
            { icon: 'celebration', text: 'همراه با دوستانتان از خدمات زیبانو لذت ببرید' },
          ].map((step, index) => (
            <View key={index} style={s.stepRow}>
              <View style={[s.stepNumber, { backgroundColor: colors.primary }]}>
                <Icon name={step.icon} size={16} color="#fff" />
              </View>
              <Text style={[s.stepText, { color: colors.textMain }]}>{step.text}</Text>
            </View>
          ))}
        </View>

        <Button
          title="اشتراک‌گذاری با دوستان"
          onPress={handleShare}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Icon name="share" size={20} color="#fff" />}
          iconPosition="right"
          style={s.shareBtn}
        />
      </View>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100 },
  heroSection: { alignItems: 'center', marginBottom: 28, gap: 8 },
  heroIconBox: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  heroTitle: { fontSize: 20, fontFamily: 'Vazir-Bold', textAlign: 'center' },
  heroSubtitle: {
    fontSize: 13, fontFamily: 'Vazir', textAlign: 'center',
    lineHeight: 22, paddingHorizontal: 12,
  },
  codeCard: { marginBottom: 12, alignItems: 'center', gap: 12 },
  codeLabel: { fontSize: 13, fontFamily: 'Vazir' },
  codeBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14,
    borderWidth: 1.5, borderStyle: 'dashed', width: '100%', gap: 10,
  },
  codeText: { fontSize: 20, fontFamily: 'Vazir-Bold', letterSpacing: 2, flex: 1 },
  copyBtn: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  codeHint: { fontSize: 12, fontFamily: 'Vazir', textAlign: 'center' },
  linkCard: { marginBottom: 24 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkInfo: { flex: 1, gap: 2 },
  linkLabel: { fontSize: 11, fontFamily: 'Vazir' },
  linkValue: { fontSize: 13, fontFamily: 'Vazir-Medium' },
  stepsTitle: { fontSize: 16, fontFamily: 'Vazir-Bold', marginBottom: 12 },
  stepsContainer: { gap: 14, marginBottom: 24 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNumber: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  stepText: { flex: 1, fontSize: 13, fontFamily: 'Vazir', lineHeight: 20 },
  shareBtn: { marginTop: 8 },
});