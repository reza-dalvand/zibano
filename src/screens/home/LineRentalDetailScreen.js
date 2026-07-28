// src/screens/home/LineRentalDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import DetailHero from '../../components/common/DetailHero';
import ActionButtons from '../../components/common/ActionButtons';
import SectionHeader from '../../components/common/SectionHeader';
import InfoRow from '../../components/common/InfoRow';
import CollabBadge from '../../components/common/CollabBadge';
import { toPersianDigit } from '../../utils/numberUtils';
import { cleanPhone } from '../../utils/phoneUtils';
import { COLLAB_TYPE_META } from '../../constants/meta';

export default function LineRentalDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { ad } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  const meta = COLLAB_TYPE_META[ad.collabType] || COLLAB_TYPE_META.percent;
  const shareUrl = `https://zibano.app/line-rental/${ad.id}`;

  // 🎯 هندلرهای ActionButtons
  const handleCall = () => {
    if (!ad.contactPhone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    const cleanedPhone = cleanPhone(ad.contactPhone);
    if (!cleanedPhone) {
      Alert.alert('خطا', 'شماره تماس معتبر نیست');
      return;
    }
  };

  const handleShare = async () => {
    const shareMessage = `${ad.title}
${ad.description || ''}
🏪 ${ad.businessName}
📍 ${ad.city}
🔗 ${shareUrl}`;
    try {
      await Share.share({ message: shareMessage, url: shareUrl, title: ad.title });
    } catch (error) {
      Alert.alert('خطا در اشتراک‌گذاری', 'متاسفانه امکان اشتراک‌گذاری وجود ندارد.');
    }
  };

  const handleSaveToggle = () => setIsSaved(!isSaved);

  const handleBusinessPress = () => {
    navigation.navigate('BusinessDetails', { businessId: ad.businessId || '1' });
  };

  // 🎯 Badges برای DetailHero
  const heroBadges = [
    {
      container: s.collabBadgeHero,  // ✅ styles → s
      icon: meta.icon,
      iconSize: 12,
      iconColor: '#fff',
      text: meta.label,
      textStyle: s.collabBadgeHeroText,  // ✅ styles → s
    },
    {
      container: [s.serviceBadgeHero, { backgroundColor: ad.serviceTypeColor || '#607D8B' }],  // ✅ styles → s
      icon: ad.serviceTypeIcon || 'spa',
      iconSize: 10,
      iconColor: '#fff',
      text: ad.serviceTypeName,
      textStyle: s.serviceBadgeHeroText,  // ✅ styles → s
    },
  ];

  return (
    <ScreenWrapper padding={0} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ═══════ 🎯 DetailHero مشترک ═══════ */}
        <DetailHero
          imageUrl={ad.lineImage}
          onBack={() => navigation.goBack()}
          onSave={handleSaveToggle}
          isSaved={isSaved}
          badges={heroBadges}
        />

        {/* ═══════ محتوا ═══════ */}
        <View style={s.content}>
          <Text style={[s.title, { color: colors.textMain }]}>{ad.title}</Text>

          {/* ═══════ کارت کسب و کار ═══════ */}
          <TouchableOpacity onPress={handleBusinessPress} activeOpacity={0.85}>
            <Card variant="elevated" padding={14} radius={16} style={s.businessCard}>
              <View style={s.businessRow}>
                <View style={[s.businessIconBox, { backgroundColor: colors.primary + '15' }]}>
                  <Icon name="store" size={22} color={colors.primary} />
                </View>
                <View style={s.businessInfo}>
                  <Text style={[s.businessName, { color: colors.textMain }]} numberOfLines={1}>
                    {ad.businessName}
                  </Text>
                  <View style={s.businessMeta}>
                    <Icon name="location-on" size={12} color={colors.textSecondary} />
                    <Text style={[s.businessCity, { color: colors.textSecondary }]}>
                      {ad.city}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-left" size={24} color={colors.textSecondary} />
              </View>
            </Card>
          </TouchableOpacity>

          {/* ═══════ 🎯 کارت قیمت با CollabBadge ═══════ */}
          <Card
            variant="elevated"
            padding={16}
            radius={16}
            style={[s.priceCard, { borderColor: meta.color + '40' }]}
          >
            <View style={s.priceHeader}>
              <View style={[s.priceIconBox, { backgroundColor: meta.color + '15' }]}>
                <Icon name={meta.icon} size={20} color={meta.color} />
              </View>
              <View style={s.priceInfo}>
                <Text style={[s.priceLabel, { color: colors.textSecondary }]}>
                  شرایط همکاری
                </Text>
                {/* 🎯 استفاده از CollabBadge مشترک */}
                <CollabBadge
                  type={ad.collabType}
                  priceDisplay={ad.priceDisplay}
                  variant="compact"
                />
              </View>
            </View>
            <Text style={[s.priceValue, { color: meta.color }]}>
              {ad.priceDisplay}
            </Text>
            <Text style={[s.priceDescription, { color: colors.textSecondary }]}>
              {meta.description}
            </Text>
          </Card>

          {/* ═══════ 🎯 توضیحات با SectionHeader ═══════ */}
          <Card variant="elevated" padding={16} radius={16}>
            <SectionHeader
              icon="description"
              iconColor="#2196F3"
              title="توضیحات آگهی"
            />
            <Text style={[s.descriptionText, { color: colors.textMain }]}>
              {ad.description}
            </Text>
          </Card>

          {/* ═══════ 🎯 دکمه‌های اکشن با ActionButtons مشترک ═══════ */}
          <View style={s.actionButtonsSection}>
            <SectionHeader
              icon="handshake"
              iconColor="#4CAF50"
              title="ارتباط و همکاری"
            />

            {/* نمایش شماره تلفن */}
            <View
              style={[
                s.phoneDisplayBox,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              <View style={[s.phoneIconCircle, { backgroundColor: '#4CAF5020' }]}>
                <Icon name="phone" size={20} color="#4CAF50" />
              </View>
              <View style={s.phoneInfo}>
                <Text style={[s.phoneLabel, { color: colors.textSecondary }]}>
                  شماره تماس صاحب آگهی
                </Text>
                <Text style={[s.phoneValue, { color: colors.textMain }]} selectable>
                  {ad.contactPhone ? toPersianDigit(ad.contactPhone) : 'ثبت نشده'}
                </Text>
              </View>
            </View>

            {/* 🎯 استفاده از ActionButtons مشترک */}
            <ActionButtons
              phone={cleanPhone(ad.contactPhone)}
              shareMessage={`${ad.title}
${ad.description || ''}
🏪 ${ad.businessName}
📍 ${ad.city}`}
              shareUrl={shareUrl}
            />
          </View>

          {/* ═══════ 🎯 اطلاعات زمانی با SectionHeader و InfoRow ═══════ */}
          <Card variant="elevated" padding={16} radius={16}>
            <SectionHeader
              icon="schedule"
              iconColor="#FF9800"
              title="اطلاعات زمانی"
            />
            <InfoRow
              icon="event-note"
              iconColor="#43A047"
              label="تاریخ ایجاد:"
              value={ad.createdAt}
              showDivider
            />
            <InfoRow
              icon="event-busy"
              iconColor="#E53935"
              label="تاریخ انقضا:"
              value={ad.expiresAt}
            />
          </Card>

          {/* ═══════ نکات مهم ═══════ */}
          <Card variant="default" padding={14} radius={14} style={s.hintCard}>
            <SectionHeader
              icon="lightbulb"
              iconColor="#FFC107"
              title="نکات مهم"
            />
            <View style={s.hintList}>
              {[
                'قبل از تماس، شرایط آگهی را به دقت مطالعه کنید',
                'شرایط همکاری را حضوری و قبل از شروع کار نهایی کنید',
                'قرارداد کتبی تنظیم و امضا شود',
                'از هویت و مجوزهای کسب‌وکار اطمینان حاصل کنید',
              ].map((text, i) => (
                <View key={i} style={s.hintItem}>
                  <Icon name="check-circle" size={14} color="#4CAF50" />
                  <Text style={[s.hintText, { color: colors.textSecondary }]}>
                    {text}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    lineHeight: 32,
  },
  businessCard: {
    marginBottom: 0,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  businessIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessInfo: {
    flex: 1,
    gap: 4,
  },
  businessName: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  businessMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessCity: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },

  // ═══════ کارت قیمت ═══════
  priceCard: {
    borderWidth: 1.5,
    gap: 10,
  },
  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceInfo: {
    flex: 1,
    gap: 4,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  priceValue: {
    fontSize: 26,
    fontFamily: 'Vazir-Bold',
  },
  priceDescription: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 20,
  },

  // ═══════ دکمه‌های اکشن ═══════
  actionButtonsSection: {
    gap: 12,
  },
  phoneDisplayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  phoneIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneInfo: {
    flex: 1,
    gap: 3,
  },
  phoneLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  phoneValue: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    letterSpacing: 1,
  },

  // ═══════ توضیحات ═══════
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    lineHeight: 26,
    textAlign: 'justify',
  },

  // ═══════ نکات مهم ═══════
  hintCard: {
    borderWidth: 1,
  },
  hintList: {
    gap: 8,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  hintText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 20,
  },

  // ═══════ Badges برای DetailHero ═══════
  collabBadgeHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(156, 39, 176, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  collabBadgeHeroText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  serviceBadgeHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  serviceBadgeHeroText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },
});