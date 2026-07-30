// src/screens/home/LineRentalDetailScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Image,
  Linking,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';
import ActionButtons from '../../components/common/ActionButtons';
import SectionHeader from '../../components/common/SectionHeader';
import CollabBadge from '../../components/common/CollabBadge';
import FavoriteButton from '../../components/common/FavoriteButton'; // 🆕
import { toPersianDigit } from '../../utils/numberUtils';
import { cleanPhone } from '../../utils/phoneUtils';
import { COLLAB_TYPE_META } from '../../constants/meta';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 320;

export default function LineRentalDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { ad } = route.params;

  const meta = COLLAB_TYPE_META[ad.collabType] || COLLAB_TYPE_META.percent;
  const shareUrl = `https://zibano.app/line-rental/${ad.id}`;

  // ═══════════ هندلرها ═══════════
  const handleBusinessPress = () => {
    navigation.navigate('BusinessDetails', { businessId: ad.businessId || '1' });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏪 ${ad.title}\n${ad.description || ''}\n📍 ${ad.businessName} - ${ad.city}\n🔗 ${shareUrl}`,
        url: shareUrl,
        title: ad.title,
      });
    } catch {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  // 🎯 تماس مستقیم
  const handleDirectCall = async () => {
    const phone = cleanPhone(ad.contactPhone);
    if (!phone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    try {
      const canCall = await Linking.canOpenURL(`tel:${phone}`);
      if (canCall) {
        await Linking.openURL(`tel:${phone}`);
      } else {
        Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
      }
    } catch {
      Alert.alert('خطا', `شماره: ${toPersianDigit(phone)}`);
    }
  };

  return (
    <ScreenWrapper padding={0} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* ═══════════════════════════════════════════ */}
        {/*              HERO SECTION                  */}
        {/* ═══════════════════════════════════════════ */}
        <View style={[s.heroContainer, { height: HERO_HEIGHT + insets.top, marginTop: -insets.top }]}>
          <Image
            source={{ uri: ad.lineImage }}
            style={s.heroImage}
            resizeMode="cover"
          />
          <View style={s.heroGradient} />
          <View style={s.heroTopGradient} />

          {/* دکمه‌های بالا */}
          <View style={[s.heroTopActions, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={s.heroActionBtn}
              activeOpacity={0.7}
            >
              <Icon name="arrow-forward" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={handleShare}
              style={s.heroActionBtn}
              activeOpacity={0.7}
            >
              <Icon name="share" size={20} color="#fff" />
            </TouchableOpacity>
            {/* 🎯 استفاده از FavoriteButton - فقط وقتی کاربر لاگین است نمایش داده می‌شود */}
            <FavoriteButton
              isFavorite={false}
              onPress={() => {}}
              size={22}
              color="#fff"
              activeColor="#FFD700"
              style={s.heroActionBtn}
            />
          </View>

          {/* بج‌های پایین هیرو */}
          <View style={s.heroBottomBadges}>
            {/* 🎯 تگ تاریخ ثبت */}
            <View style={s.heroDateBadge}>
              <Icon name="event-note" size={12} color="#fff" />
              <Text style={s.heroDateText}>
                ثبت: {ad.createdAt}
              </Text>
            </View>
            {/* بج نوع خدمت */}
            <View
              style={[
                s.heroServiceBadge,
                { backgroundColor: ad.serviceTypeColor || '#607D8B' },
              ]}
            >
              <Icon
                name={ad.serviceTypeIcon || 'spa'}
                size={11}
                color="#fff"
              />
              <Text style={s.heroServiceText}>
                {ad.serviceTypeName}
              </Text>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════════ */}
        {/*              CONTENT                       */}
        {/* ═══════════════════════════════════════════ */}
        <View style={s.content}>
          {/* عنوان */}
          <Text style={[s.title, { color: colors.textMain }]}>
            {ad.title}
          </Text>

          {/* شهر و نام کسب‌وکار */}
          <View style={s.subtitleRow}>
            <Icon name="store" size={14} color={colors.primary} />
            <Text style={[s.subtitleBiz, { color: colors.primary }]}>
              {ad.businessName}
            </Text>
            <View style={[s.dot, { backgroundColor: colors.border }]} />
            <Icon name="location-on" size={14} color={colors.textSecondary} />
            <Text style={[s.subtitleCity, { color: colors.textSecondary }]}>
              {ad.city}
            </Text>
          </View>

          {/* ═══════════ کارت کسب و کار ═══════════ */}
          <TouchableOpacity
            onPress={handleBusinessPress}
            activeOpacity={0.85}
          >
            <Card
              variant="elevated"
              padding={14}
              radius={16}
              style={s.businessCard}
            >
              <View style={s.businessRow}>
                <View
                  style={[
                    s.businessIconBox,
                    { backgroundColor: colors.primary + '15' },
                  ]}
                >
                  <Icon name="store" size={22} color={colors.primary} />
                </View>
                <View style={s.businessInfo}>
                  <Text
                    style={[s.businessName, { color: colors.textMain }]}
                    numberOfLines={1}
                  >
                    {ad.businessName}
                  </Text>
                  <View style={s.businessMeta}>
                    <Icon
                      name="location-on"
                      size={12}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        s.businessCity,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {ad.city}
                    </Text>
                  </View>
                </View>
                <Icon
                  name="chevron-left"
                  size={24}
                  color={colors.textSecondary}
                />
              </View>
            </Card>
          </TouchableOpacity>

          {/* ═══════════ کارت شرایط همکاری ═══════════ */}
          <Card
            variant="elevated"
            padding={16}
            radius={18}
            style={[s.collabCard, { borderColor: meta.color + '30' }]}
          >
            <SectionHeader
              icon={meta.icon}
              iconColor={meta.color}
              title="شرایط همکاری"
            />
            <View style={s.collabBadgeWrapper}>
              <CollabBadge
                type={ad.collabType}
                priceDisplay={ad.priceDisplay}
                variant="solid"
              />
            </View>
            <View
              style={[
                s.collabDescBox,
                {
                  backgroundColor: meta.color + '08',
                  borderColor: meta.color + '25',
                },
              ]}
            >
              <Icon name="info-outline" size={14} color={meta.color} />
              <Text
                style={[
                  s.collabDescText,
                  { color: colors.textSecondary },
                ]}
              >
                {meta.description}
              </Text>
            </View>
          </Card>

          {/* ═══════════ کارت توضیحات ═══════════ */}
          <Card variant="elevated" padding={16} radius={18}>
            <SectionHeader
              icon="description"
              iconColor="#2196F3"
              title="توضیحات آگهی"
            />
            <Text
              style={[s.descriptionText, { color: colors.textMain }]}
            >
              {ad.description}
            </Text>
          </Card>

          {/* ═══════════ 🎯 کارت ارتباط و همکاری ═══════════ */}
          <View style={s.contactSection}>
            <SectionHeader
              icon="handshake"
              iconColor="#4CAF50"
              title="ارتباط و همکاری"
            />

            {/* 🎯 دکمه تماس مستقیم - بزرگ و برجسته */}
            <TouchableOpacity
              onPress={handleDirectCall}
              activeOpacity={0.85}
              style={s.directCallBtn}
            >
              <View style={s.directCallIconWrap}>
                <Icon name="call" size={24} color="#fff" />
              </View>
              <View style={s.directCallTextCol}>
                <Text style={s.directCallTitle}>تلفن تماس</Text>
                <Text style={s.directCallSubtitle}>
                  {ad.contactPhone ? toPersianDigit(ad.contactPhone) : 'شماره‌ای ثبت نشده'}
                </Text>
              </View>
              <Icon name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            {/* دکمه‌های اشتراک‌گذاری */}
            <ActionButtons
              phone={cleanPhone(ad.contactPhone)}
              shareMessage={`${ad.title}\n${ad.description || ''}\n🏪 ${ad.businessName}\n📍 ${ad.city}`}
              shareUrl={shareUrl}
            />
          </View>

          {/* ═══════════ کارت نکات مهم ═══════════ */}
          <Card
            variant="default"
            padding={16}
            radius={18}
            style={[s.tipsCard, { borderColor: colors.border }]}
          >
            <SectionHeader
              icon="lightbulb"
              iconColor="#FFC107"
              title="نکات مهم"
            />
            <View style={s.tipsList}>
              {[
                'قبل از تماس، شرایط آگهی را به دقت مطالعه کنید',
                'شرایط همکاری را حضوری و قبل از شروع کار نهایی کنید',
                'از هویت و مجوزهای کسب‌وکار اطمینان حاصل کنید',
              ].map((text, i) => (
                <View key={i} style={s.tipItem}>
                  <View
                    style={[
                      s.tipIconBox,
                      { backgroundColor: '#4CAF5018' },
                    ]}
                  >
                    <Icon name="check-circle" size={14} color="#4CAF50" />
                  </View>
                  <Text
                    style={[s.tipText, { color: colors.textSecondary }]}
                  >
                    {text}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  // ═══════════ HERO ═══════════
  heroContainer: {
    width: SCREEN_WIDTH,
    position: 'relative',
    backgroundColor: '#000',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '17%',
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  heroTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.20)',
  },
  heroTopActions: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroBottomBadges: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  heroDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(33,150,243,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  heroDateText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  heroServiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  heroServiceText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════════ CONTENT ═══════════
  content: {
    padding: 20,
    gap: 16,
    marginTop: -5,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    lineHeight: 34,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: -4,
  },
  subtitleBiz: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  subtitleCity: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },

  // ═══════════ BUSINESS CARD ═══════════
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

  // ═══════════ COLLAB CARD ═══════════
  collabCard: {
    borderWidth: 1.5,
    gap: 12,
  },
  collabBadgeWrapper: {
    alignSelf: 'flex-start',
  },
  collabDescBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  collabDescText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 20,
  },

  // ═══════════ DESCRIPTION ═══════════
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    lineHeight: 26,
    textAlign: 'justify',
  },

  // ═══════════ 🎯 CONTACT SECTION ═══════════
  contactSection: {
    gap: 12,
  },

  // 🎯 دکمه تماس مستقیم - سبز و بزرگ
  directCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  directCallIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  directCallTextCol: {
    flex: 1,
    gap: 2,
  },
  directCallTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  directCallSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontFamily: 'Vazir',
  },

  // ═══════════ TIPS ═══════════
  tipsCard: {
    borderWidth: 1,
    gap: 10,
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 20,
  },
});