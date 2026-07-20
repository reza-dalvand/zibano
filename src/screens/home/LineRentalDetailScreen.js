// src/screens/home/LineRentalDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Card from '../../components/common/Card';

const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

const toEnglishDigits = (str) =>
  String(str || '')
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

const COLLAB_META = {
  percent: {
    label: 'همکاری درصدی',
    icon: 'pie-chart',
    color: '#9C27B0',
    description: 'تقسیم درآمد با درصد توافقی بین سالن و همکار',
  },
  fixed: {
    label: 'اجاره ثابت',
    icon: 'attach-money',
    color: '#2196F3',
    description: 'مبلغ ثابت ماهانه + رهن (اختیاری)',
  },
  hourly: {
    label: 'همکاری ساعتی',
    icon: 'schedule',
    color: '#FF9800',
    description: 'به ازای هر ساعت استفاده از لاین',
  },
};

export default function LineRentalDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { ad } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  const meta = COLLAB_META[ad.collabType] || COLLAB_META.percent;

  const shareUrl = `https://zibano.app/line-rental/${ad.id}`;

  const handleCall = async () => {
    if (!ad.contactPhone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    const cleanPhone = toEnglishDigits(ad.contactPhone).replace(/[^0-9+]/g, '');
    if (!cleanPhone) {
      Alert.alert('خطا', 'شماره تماس معتبر نیست');
      return;
    }
    try {
      const phoneUrl = `tel:${cleanPhone}`;
      await Linking.openURL(phoneUrl);
    } catch (error) {
      console.log('Call error:', error);
      Alert.alert(
        'خطا در برقراری تماس',
        `لطفاً به صورت دستی با شماره زیر تماس بگیرید:\n${toPersianDigit(cleanPhone)}`,
      );
    }
  };

  const handleBusinessPress = () => {
    navigation.navigate('BusinessDetails', {
      businessId: ad.businessId || '1',
    });
  };

  const handleShare = async () => {
    const shareMessage = `${ad.title}\n${ad.description || ''}\n🏪 ${ad.businessName}\n📍 ${ad.city}\n🔗 ${shareUrl}`;
    try {
      const result = await Share.share(
        {
          message: shareMessage,
          url: shareUrl,
          title: ad.title,
        },
        {
          dialogTitle: 'اشتراک‌گذاری آگهی',
          excludedActivityTypes: [],
        },
      );
      if (result.action === Share.sharedAction) {
        console.log('✅ اشتراک‌گذاری موفق با:', result.activityType);
      } else if (result.action === Share.dismissedAction) {
        console.log('کاربر انصراف داد');
      }
    } catch (error) {
      console.log('Share error:', error);
      Alert.alert(
        'خطا در اشتراک‌گذاری',
        'متاسفانه امکان اشتراک‌گذاری وجود ندارد. لطفاً دوباره تلاش کنید.',
      );
    }
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
  };

  // 🎯 محاسبه ارتفاع hero
  const HERO_BASE_HEIGHT = 320;
  const heroHeight = HERO_BASE_HEIGHT + insets.top;

  return (
    // 🎯 top اضافه شد تا SafeAreaView top padding اعمال کند
    <ScreenWrapper padding={0} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ═══════ Hero Image ═══════ */}
        <View
          style={[
            s.heroImageContainer,
            {
              height: heroHeight,
              marginTop: -insets.top, // 🎯 کلید حل مشکل: container را به بالا بکش
            },
          ]}
        >
          <Image source={{ uri: ad.lineImage }} style={s.heroImage} />
          <View style={s.heroGradient} />

          {/* دکمه‌های بالا - با فاصله از notch */}
          <View style={[s.heroTopActions, { top: insets.top + 12 }]}>
            <TouchableOpacity
              style={s.heroActionButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-forward" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={s.heroActionButton}
              onPress={handleSaveToggle}
            >
              <Icon
                name={isSaved ? 'bookmark' : 'bookmark-border'}
                size={22}
                color={isSaved ? '#FFD700' : '#fff'}
              />
            </TouchableOpacity>
          </View>

          {/* Badge‌ها */}
          <View style={s.heroBadges}>
            <View style={[s.collabBadge, { backgroundColor: meta.color }]}>
              <Icon name={meta.icon} size={12} color="#fff" />
              <Text style={s.collabBadgeText}>{meta.label}</Text>
            </View>
            <View
              style={[
                s.serviceBadge,
                { backgroundColor: ad.serviceTypeColor || '#607D8B' },
              ]}
            >
              <Icon name={ad.serviceTypeIcon || 'spa'} size={10} color="#fff" />
              <Text style={s.serviceBadgeText}>{ad.serviceTypeName}</Text>
            </View>
          </View>
        </View>

        {/* ═══════ محتوا ═══════ */}
        <View style={s.content}>
          <Text style={[s.title, { color: colors.textMain }]}>{ad.title}</Text>

          {/* ═══════ کارت کسب و کار ═══════ */}
          <TouchableOpacity onPress={handleBusinessPress} activeOpacity={0.85}>
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
                      style={[s.businessCity, { color: colors.textSecondary }]}
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

          {/* ═══════ کارت قیمت و شرایط همکاری ═══════ */}
          <Card
            variant="elevated"
            padding={16}
            radius={16}
            style={[s.priceCard, { borderColor: meta.color + '40' }]}
          >
            <View style={s.priceHeader}>
              <View
                style={[s.priceIconBox, { backgroundColor: meta.color + '15' }]}
              >
                <Icon name={meta.icon} size={20} color={meta.color} />
              </View>
              <View style={s.priceInfo}>
                <Text style={[s.priceLabel, { color: colors.textSecondary }]}>
                  شرایط همکاری
                </Text>
                <Text style={[s.priceType, { color: colors.textMain }]}>
                  {meta.label}
                </Text>
              </View>
            </View>
            <Text style={[s.priceValue, { color: meta.color }]}>
              {ad.priceDisplay}
            </Text>
            <Text style={[s.priceDescription, { color: colors.textSecondary }]}>
              {meta.description}
            </Text>
          </Card>

          {/* ═══════ توضیحات ═══════ */}
          <Card variant="elevated" padding={16} radius={16}>
            <View style={s.sectionHeader}>
              <View
                style={[s.sectionIconBox, { backgroundColor: '#2196F315' }]}
              >
                <Icon name="description" size={18} color="#2196F3" />
              </View>
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                توضیحات آگهی
              </Text>
            </View>
            <Text style={[s.descriptionText, { color: colors.textMain }]}>
              {ad.description}
            </Text>
          </Card>

          {/* ═══════ 🎯 دکمه‌های اکشن ═══════ */}
          <View style={s.actionButtonsSection}>
            <View style={s.sectionHeader}>
              <View
                style={[s.sectionIconBox, { backgroundColor: '#4CAF5015' }]}
              >
                <Icon name="handshake" size={18} color="#4CAF50" />
              </View>
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                ارتباط و همکاری
              </Text>
            </View>

            <View
              style={[
                s.phoneDisplayBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[s.phoneIconCircle, { backgroundColor: '#4CAF5020' }]}
              >
                <Icon name="phone" size={20} color="#4CAF50" />
              </View>
              <View style={s.phoneInfo}>
                <Text style={[s.phoneLabel, { color: colors.textSecondary }]}>
                  شماره تماس صاحب آگهی
                </Text>
                <Text
                  style={[s.phoneValue, { color: colors.textMain }]}
                  selectable
                >
                  {ad.contactPhone
                    ? toPersianDigit(ad.contactPhone)
                    : 'ثبت نشده'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleCall}
              activeOpacity={0.85}
              style={[s.callBtn, { backgroundColor: '#4CAF50' }]}
            >
              <View style={s.callBtnIconWrap}>
                <Icon name="call" size={20} color="#fff" />
              </View>
              <View style={s.callBtnTextCol}>
                <Text style={s.callBtnTitle}>تماس و همکاری</Text>
                <Text style={s.callBtnSubtitle}>
                  {ad.contactPhone
                    ? toPersianDigit(ad.contactPhone)
                    : 'شماره ثبت نشده'}
                </Text>
              </View>
              <Icon name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              activeOpacity={0.85}
              style={[
                s.shareBtn,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <Icon name="share" size={20} color={colors.primary} />
              <Text style={[s.shareBtnText, { color: colors.textMain }]}>
                اشتراک‌گذاری این آگهی با دوستان
              </Text>
              <Icon name="arrow-back" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* ═══════ اطلاعات زمانی ═══════ */}
          <Card variant="elevated" padding={16} radius={16}>
            <View style={s.sectionHeader}>
              <View
                style={[s.sectionIconBox, { backgroundColor: '#FF980015' }]}
              >
                <Icon name="schedule" size={18} color="#FF9800" />
              </View>
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                اطلاعات زمانی
              </Text>
            </View>
            <View style={s.dateRow}>
              <Icon name="event-note" size={16} color="#43A047" />
              <Text style={[s.dateLabel, { color: colors.textSecondary }]}>
                تاریخ ایجاد:
              </Text>
              <Text style={[s.dateValue, { color: colors.textMain }]}>
                {ad.createdAt}
              </Text>
            </View>
            <View style={s.dateRow}>
              <Icon name="event-busy" size={16} color="#E53935" />
              <Text style={[s.dateLabel, { color: colors.textSecondary }]}>
                تاریخ انقضا:
              </Text>
              <Text style={[s.dateValue, { color: colors.textMain }]}>
                {ad.expiresAt}
              </Text>
            </View>
          </Card>

          {/* ═══════ نکات مهم ═══════ */}
          <Card variant="default" padding={14} radius={14} style={s.hintCard}>
            <View style={s.hintHeader}>
              <Icon name="lightbulb" size={18} color="#FFC107" />
              <Text style={[s.hintTitle, { color: colors.textMain }]}>
                نکات مهم
              </Text>
            </View>
            <View style={s.hintList}>
              <View style={s.hintItem}>
                <Icon name="check-circle" size={14} color="#4CAF50" />
                <Text style={[s.hintText, { color: colors.textSecondary }]}>
                  قبل از تماس، شرایط آگهی را به دقت مطالعه کنید
                </Text>
              </View>
              <View style={s.hintItem}>
                <Icon name="check-circle" size={14} color="#4CAF50" />
                <Text style={[s.hintText, { color: colors.textSecondary }]}>
                  شرایط همکاری را حضوری و قبل از شروع کار نهایی کنید
                </Text>
              </View>
              <View style={s.hintItem}>
                <Icon name="check-circle" size={14} color="#4CAF50" />
                <Text style={[s.hintText, { color: colors.textSecondary }]}>
                  قرارداد کتبی تنظیم و امضا شود
                </Text>
              </View>
              <View style={s.hintItem}>
                <Icon name="check-circle" size={14} color="#4CAF50" />
                <Text style={[s.hintText, { color: colors.textSecondary }]}>
                  از هویت و مجوزهای کسب‌وکار اطمینان حاصل کنید
                </Text>
              </View>
            </View>
          </Card>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  // ═══════ Hero Image ═══════
  heroImageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#000',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroTopActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroActionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  heroBadges: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  collabBadge: {
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
  collabBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  serviceBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════ Content ═══════
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

  // ═══════ سکشن‌ها ═══════
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
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
    gap: 2,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  priceType: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
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
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  callBtnIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtnTextCol: {
    flex: 1,
    gap: 2,
  },
  callBtnTitle: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  callBtnSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  shareBtnText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },

  // ═══════ توضیحات ═══════
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    lineHeight: 26,
    textAlign: 'justify',
  },

  // ═══════ تاریخ ═══════
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  dateLabel: {
    fontSize: 13,
    fontFamily: 'Vazir',
    minWidth: 90,
  },
  dateValue: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    flex: 1,
  },

  // ═══════ نکات مهم ═══════
  hintCard: {
    borderWidth: 1,
  },
  hintHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  hintTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
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
});