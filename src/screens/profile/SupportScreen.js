// src/screens/profile/SupportScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import SupportChannels from '../../components/profile/support/SupportChannels';
import FaqSection from '../../components/profile/support/FaqSection';
import { SUPPORT_HOURS_SIMPLE } from '../../components/profile/support/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 🆕

export default function SupportScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // 🆕

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      {/* ═══════════ هدر ساده ═══════════ */}
      <View
        style={[
          s.heroSection,
          {
            backgroundColor: colors.primary,
            paddingTop: insets.top + 8, // 🎯 insets.top
          },
        ]}
      >
        <View style={s.heroContent}>
          <View style={s.heroIconWrapper}>
            <View style={s.heroIconCircle}>
              <Icon name="headset-mic" size={40} color="#fff" />
            </View>
            <View style={s.heroRing1} />
            <View style={s.heroRing2} />
          </View>
          <Text style={s.heroTitle}>پشتیبانی زیبانو</Text>
          <Text style={s.heroSubtitle}>
            تیم ما آماده پاسخگویی به سوالات و حل مشکلات شماست
          </Text>
        </View>
      </View>

      {/* ═══════════ محتوای اصلی ═══════════ */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* 🎯 راهنمای سریع */}
        <View
          style={[
            s.quickTip,
            {
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '25',
            },
          ]}
        >
          <Icon name="lightbulb" size={18} color={colors.primary} />
          <Text style={[s.quickTipText, { color: colors.textSecondary }]}>
            برای دریافت سریع‌تر پاسخ، ابتدا سوالات متداول را بررسی کنید
          </Text>
        </View>

        {/* 🎯 ساعت پاسخگویی ساده */}
        <View
          style={[
            s.hoursCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={[s.hoursIconBox, { backgroundColor: '#FF980020' }]}>
            <Icon name="schedule" size={18} color="#FF9800" />
          </View>
          <View style={s.hoursInfo}>
            <Text style={[s.hoursLabel, { color: colors.textSecondary }]}>
              ساعات پاسخگویی
            </Text>
            <Text style={[s.hoursValue, { color: colors.textMain }]}>
              {SUPPORT_HOURS_SIMPLE}
            </Text>
          </View>
        </View>

        {/* ═══════════ بخش کانال‌های ارتباطی ═══════════ */}
        <SupportChannels />

        {/* ═══════════ بخش سوالات متداول ═══════════ */}
        <FaqSection />

        {/* ═══════════ فوتر ═══════════ */}
        <View style={s.footer}>
          <Text style={[s.footerText, { color: colors.textSecondary }]}>
            زیبانو - همراه شما در مسیر زیبایی و سلامت
          </Text>
          <Text style={[s.footerVersion, { color: colors.textSecondary }]}>
            نسخه ۱.۰.۰
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  // ═══════════ هدر ═══════════
  heroSection: {
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  heroContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
  },
  heroIconWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  heroRing1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    zIndex: 1,
  },
  heroRing2: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 0,
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 10,
  },

  // ═══════════ محتوا ═══════════
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  quickTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  quickTipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 19,
  },

  // ═══════════ کارت ساعت پاسخگویی ═══════════
  hoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  hoursIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hoursInfo: {
    flex: 1,
    gap: 2,
  },
  hoursLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  hoursValue: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════════ فوتر ═══════════
  footer: {
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
    paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Vazir-Medium',
  },
  footerVersion: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
});
