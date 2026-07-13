// src/screens/manageBusiness/BookingLinkScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import { useBusiness } from '../../context/BusinessContext';
import BookingLinkCard from '../../components/manageBusiness/bookingLink/BookingLinkCard';
// import ShareBookingLinkModal from '../../components/manageBusiness/bookingLink/ShareBookingLinkModal';

export default function BookingLinkScreen({ navigation }) {
  const { colors } = useTheme();
  const { businessData } = useBusiness();
  const [shareModalVisible, setShareModalVisible] = useState(false);

  // تولید لینک اختصاصی (در آینده از API)
  const bookingLink = `https://zibano.app/book/${businessData?.id || 'biz_1'}`;

  // آمار موقت
  const linkStats = {
    clicks: 245,
    bookings: 18,
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <Header title="لینک اختصاصی رزرو" onBackPress={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {/* هدر توضیحی */}
        <View style={s.heroSection}>
          <View style={[s.heroIconBox, { backgroundColor: colors.primary + '15' }]}>
            <Icon name="link" size={32} color={colors.primary} />
          </View>
          <Text style={[s.heroTitle, { color: colors.textMain }]}>لینک اختصاصی شما</Text>
          <Text style={[s.heroSubtitle, { color: colors.textSecondary }]}>
            این لینک را میتوانید در شبکه‌های اجتماعی، بیو اینستاگرام و واتساپ خود قرار دهید
          </Text>
        </View>

        {/* کارت اصلی لینک */}
        <BookingLinkCard
          bookingLink={{ ...linkStats, link: bookingLink }}
          onShare={() => setShareModalVisible(true)}
          onCopy={() => {}}
        />

        {/* راهنمای استفاده */}
        <Card variant="elevated" padding={16} radius={16} style={s.guideCard}>
          <View style={s.guideHeader}>
            <Icon name="lightbulb" size={20} color="#FFC107" />
            <Text style={[s.guideTitle, { color: colors.textMain }]}>چگونه استفاده کنم؟</Text>
          </View>

          <View style={s.guideList}>
            {[
              {
                icon: 'content-copy',
                text: 'لینک را کپی کنید',
                color: colors.primary,
              },
              {
                icon: 'share',
                text: 'در شبکه‌های اجتماعی به اشتراک بگذارید',
                color: '#25D366',
              },
              {
                icon: 'photo-camera',
                text: 'در بیو اینستاگرام قرار دهید',
                color: '#E1306C',
              },
            ].map((item, index) => (
              <View key={index} style={s.guideItem}>
                <View style={[s.guideNumber, { backgroundColor: item.color }]}>
                  <Text style={s.guideNumberText}>{index + 1}</Text>
                </View>
                <Icon name={item.icon} size={18} color={item.color} />
                <Text style={[s.guideItemText, { color: colors.textSecondary }]}>
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* مزایا */}
        <Card variant="elevated" padding={16} radius={16} style={s.benefitsCard}>
          <View style={s.benefitsHeader}>
            <Icon name="workspace-premium" size={20} color={colors.primary} />
            <Text style={[s.benefitsTitle, { color: colors.textMain }]}>مزایای لینک اختصاصی</Text>
          </View>

          <View style={s.benefitsList}>
            {[
              'رزرو مستقیم بدون جستجو در اپلیکیشن',
              'افزایش اعتبار حرفه‌ای کسب‌وکار شما',
              'امکان اشتراک‌گذاری آسان در همه پلتفرم‌ها',
            ].map((benefit, index) => (
              <View key={index} style={s.benefitItem}>
                <Icon name="check-circle" size={16} color="#4CAF50" />
                <Text style={[s.benefitText, { color: colors.textSecondary }]}>{benefit}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>

      {/* مدال اشتراک‌گذاری */}
      {/* <ShareBookingLinkModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        bookingLink={bookingLink}
      /> */}
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  heroSection: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    marginBottom: 16,
  },
  heroIconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 19,
    fontFamily: 'Vazir-Bold',
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  guideCard: {
    marginTop: 16,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  guideList: {
    gap: 12,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  guideNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideNumberText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  guideItemText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  benefitsCard: {
    marginTop: 16,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  benefitsTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 20,
  },
});