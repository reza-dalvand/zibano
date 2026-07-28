// src/screens/home/ModelRequestDetailScreen.js
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
import CostTypeBadge from '../../components/common/CostTypeBadge';
import { toPersianDigit } from '../../utils/numberUtils';
import { cleanPhone } from '../../utils/phoneUtils';
import { COST_TYPE_META } from '../../constants/meta';

export default function ModelRequestDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { request } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  const costMeta = COST_TYPE_META[request.costType] || COST_TYPE_META.material_cost;
  const shareUrl = `https://zibano.app/model-request/${request.id}`;

  // 🎯 هندلرهای ActionButtons
  const handleCall = () => {
    if (!request.contactPhone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    const cleanedPhone = cleanPhone(request.contactPhone);
    if (!cleanedPhone) {
      Alert.alert('خطا', 'شماره تماس معتبر نیست');
      return;
    }
  };

  const handleShare = async () => {
    const shareMessage = `${request.title}\n${request.description}\n🏪 ${request.businessName}\n📍 ${request.city}\n🔗 ${shareUrl}`;
    try {
      await Share.share({ message: shareMessage, url: shareUrl, title: request.title });
    } catch (error) {
      Alert.alert('خطا در اشتراک‌گذاری', 'متاسفانه امکان اشتراک‌گذاری وجود ندارد.');
    }
  };

  const handleSaveToggle = () => setIsSaved(!isSaved);

  const handleBusinessPress = () => {
    navigation.navigate('BusinessDetails', { businessId: request.businessId || '1' });
  };

  // 🎯 Badges برای DetailHero
  const heroBadges = [
    {
      container: [styles.costBadgeHero, { backgroundColor: costMeta.color }],
      icon: costMeta.icon,
      iconSize: 12,
      iconColor: '#fff',
      text: costMeta.label,
      textStyle: styles.costBadgeHeroText,
    },
  ];

  return (
    <ScreenWrapper padding={0} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ═══════ 🎯 DetailHero مشترک ═══════ */}
        <DetailHero
          imageUrl={request.serviceImage}
          onBack={() => navigation.goBack()}
          onSave={handleSaveToggle}
          isSaved={isSaved}
          badges={heroBadges}
        />

        {/* ═══════ محتوا ═══════ */}
        <View style={s.content}>
          <Text style={[s.title, { color: colors.textMain }]}>{request.title}</Text>

          {/* ═══════ کارت کسب و کار ═══════ */}
          <TouchableOpacity onPress={handleBusinessPress} activeOpacity={0.85}>
            <Card variant="elevated" padding={14} radius={16} style={s.businessCard}>
              <View style={s.businessRow}>
                <View style={[s.businessIconBox, { backgroundColor: colors.primary + '15' }]}>
                  <Icon name="store" size={22} color={colors.primary} />
                </View>
                <View style={s.businessInfo}>
                  <Text style={[s.businessName, { color: colors.textMain }]} numberOfLines={1}>
                    {request.businessName}
                  </Text>
                  <View style={s.businessMeta}>
                    <Icon name="location-on" size={12} color={colors.textSecondary} />
                    <Text style={[s.businessCity, { color: colors.textSecondary }]}>
                      {request.city}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-left" size={24} color={colors.textSecondary} />
              </View>
            </Card>
          </TouchableOpacity>

          {/* ═══════ 🎯 کارت نوع هزینه با CostTypeBadge ═══════ */}
          <Card
            variant="elevated"
            padding={16}
            radius={16}
            style={[s.costCard, { borderColor: costMeta.color + '40' }]}
          >
            <View style={s.costHeader}>
              <View style={[s.costIconBox, { backgroundColor: costMeta.color + '15' }]}>
                <Icon name={costMeta.icon} size={20} color={costMeta.color} />
              </View>
              <View style={s.costInfo}>
                <Text style={[s.costLabel, { color: colors.textSecondary }]}>
                  وضعیت هزینه
                </Text>
                {/* 🎯 استفاده از CostTypeBadge مشترک */}
                <CostTypeBadge
                  type={request.costType}
                  variant="default"
                />
              </View>
            </View>
            <Text style={[s.costDescription, { color: colors.textSecondary }]}>
              {costMeta.description}
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
              {request.description}
            </Text>
          </Card>

          {/* ═══════ 🎯 دکمه‌های اکشن با ActionButtons مشترک ═══════ */}
          <View style={s.actionButtonsSection}>
            <SectionHeader
              icon="handshake"
              iconColor="#4CAF50"
              title="ارتباط و رزرو"
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
                  {request.contactPhone
                    ? toPersianDigit(request.contactPhone)
                    : 'ثبت نشده'}
                </Text>
              </View>
            </View>

            {/* 🎯 استفاده از ActionButtons مشترک */}
            <ActionButtons
              phone={cleanPhone(request.contactPhone)}
              shareMessage={`${request.title}\n${request.description}\n🏪 ${request.businessName}\n📍 ${request.city}`}
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
              value={request.createdAt}
              showDivider
            />
            <InfoRow
              icon="event-busy"
              iconColor="#E53935"
              label="تاریخ انقضا:"
              value={request.expiresAt}
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
                'برای رزرو نوبت با سالن تماس بگیرید',
                'مدل‌ها اجازه استفاده از تصاویر را به سالن می‌دهند',
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
  // ═══════ کارت نوع هزینه ═══════
  costCard: {
    borderWidth: 1.5,
    gap: 10,
  },
  costHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  costIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  costInfo: {
    flex: 1,
    gap: 4,
  },
  costLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  costDescription: {
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
  costBadgeHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  costBadgeHeroText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});