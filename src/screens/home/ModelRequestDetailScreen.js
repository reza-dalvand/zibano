// src/screens/home/ModelRequestDetailScreen.js
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

const COST_TYPE_META = {
  paid: {
    label: 'با هزینه',
    icon: 'attach-money',
    color: '#2196F3',
    description: 'مدل بخشی از هزینه خدمت را پرداخت می‌کند',
  },
  material_cost: {
    label: 'با هزینه مواد',
    icon: 'science',
    color: '#FF9800',
    description: 'فقط هزینه مواد مصرفی دریافت می‌شود',
  },
  free: {
    label: 'کاملاً رایگان',
    icon: 'redeem',
    color: '#4CAF50',
    description: 'هیچ هزینه‌ای از مدل دریافت نمی‌شود',
  },
};

export default function ModelRequestDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { request } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  const costMeta = COST_TYPE_META[request.costType] || COST_TYPE_META.material_cost;

  // 🎯 هندلر تماس با صاحب آگهی
  const handleCall = async () => {
    if (!request.contactPhone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    try {
      const phoneUrl = `tel:${request.contactPhone}`;
      const canCall = await Linking.canOpenURL(phoneUrl);
      if (canCall) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
      }
    } catch (error) {
      Alert.alert('خطا', 'امکان برقراری تماس وجود ندارد');
    }
  };

  // 🎯 هندلر کلیک روی نام کسب و کار → رفتن به صفحه کسب و کار
  const handleBusinessPress = () => {
    navigation.navigate('BusinessDetails', {
      businessId: request.businessId || '1',
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🌸 فرصت مدلینگ در زیبانو\n\n${request.title}\n🏪 ${request.businessName}\n📍 ${request.city}\n💰 ${costMeta.label}\n\n📱 مشاهده در اپلیکیشن زیبانو`,
      });
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? 'حذف از علاقه‌مندی' : 'افزوده به علاقه‌مندی',
      isSaved ? 'این فرصت از علاقه‌مندی‌های شما حذف شد' : 'این فرصت به علاقه‌مندی‌های شما اضافه شد',
    );
  };

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* تصویر هدر */}
        <View style={[s.heroImageContainer, { paddingTop: insets.top }]}>
          <Image source={{ uri: request.serviceImage }} style={s.heroImage} />
          <View style={s.heroGradient} />

          {/* دکمه‌های بالا */}
          <View style={[s.heroTopActions, { top: insets.top + 12 }]}>
            <TouchableOpacity
              style={s.heroActionButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-forward" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={s.heroActionButton} onPress={handleShare}>
              <Icon name="share" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={s.heroActionButton} onPress={handleSaveToggle}>
              <Icon
                name={isSaved ? 'bookmark' : 'bookmark-border'}
                size={22}
                color={isSaved ? '#FFD700' : '#fff'}
              />
            </TouchableOpacity>
          </View>

          {/* Badge‌ها */}
          <View style={s.heroBadges}>
            <View style={[s.costBadge, { backgroundColor: costMeta.color }]}>
              <Icon name={costMeta.icon} size={12} color="#fff" />
              <Text style={s.costBadgeText}>{costMeta.label}</Text>
            </View>

            {request.isUrgent && (
              <View style={s.urgentBadge}>
                <Icon name="flash-on" size={12} color="#fff" />
                <Text style={s.urgentText}>فوری</Text>
              </View>
            )}
          </View>
        </View>

        {/* محتوا */}
        <View style={s.content}>
          {/* عنوان */}
          <Text style={[s.title, { color: colors.textMain }]}>{request.title}</Text>

          {/* ═══════ کارت کسب و کار - قابل کلیک ═══════ */}
          <TouchableOpacity
            onPress={handleBusinessPress}
            activeOpacity={0.85}
          >
            <Card variant="elevated" padding={14} radius={16} style={s.businessCard}>
              <View style={s.businessRow}>
                <View style={[s.businessIconBox, { backgroundColor: colors.primary + '15' }]}>
                  <Icon name="store" size={22} color={colors.primary} />
                </View>
                <View style={s.businessInfo}>
                  <Text style={[s.businessName, { color: colors.textMain }]}>
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
                    {/* ═══════ 🆕 کارت تماس با صاحب آگهی ═══════ */}
          <Card variant="elevated" padding={16} radius={16}>
            <View style={s.sectionHeader}>
              <View style={[s.sectionIconBox, { backgroundColor: '#4CAF5015' }]}>
                <Icon name="phone" size={18} color="#4CAF50" />
              </View>
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                تماس با صاحب آگهی
              </Text>
            </View>

            {/* باکس شماره تماس */}
            <View
              style={[
                s.phoneBox,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={s.phoneInfo}>
                <Text style={[s.phoneValue, { color: colors.textMain }]} selectable>
                  {request.contactPhone
                    ? toPersianDigit(request.contactPhone)
                    : 'ثبت نشده'}
                </Text>
              </View>
              <View style={[s.phoneIconCircle, { backgroundColor: '#4CAF5020' }]}>
                <Icon name="phone" size={20} color="#4CAF50" />
              </View>
            </View>

            {/* دکمه تماس */}
            <TouchableOpacity
              onPress={handleCall}
              activeOpacity={0.85}
              style={[s.callBtn, { backgroundColor: '#4CAF50' }]}
            >
              <Icon name="call" size={18} color="#fff" />
              <Text style={s.callBtnText}>تماس با صاحب آگهی </Text>
              <Icon name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>
          </Card>

          {/* ═══════ توضیحات ═══════ */}
          <Card variant="elevated" padding={16} radius={16}>
            <View style={s.sectionHeader}>
              <View style={[s.sectionIconBox, { backgroundColor: '#2196F315' }]}>
                <Icon name="description" size={18} color="#2196F3" />
              </View>
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                توضیحات آگهی
              </Text>
            </View>
            <Text style={[s.descriptionText, { color: colors.textMain }]}>
              {request.description}
            </Text>
          </Card>

          {/* ═══════ اطلاعات زمانی ═══════ */}
          <Card variant="elevated" padding={16} radius={16}>
            <View style={s.sectionHeader}>
              <View style={[s.sectionIconBox, { backgroundColor: '#FF980015' }]}>
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
                {request.createdAt}
              </Text>
            </View>

            <View style={s.dateRow}>
              <Icon name="event-busy" size={16} color="#E53935" />
              <Text style={[s.dateLabel, { color: colors.textSecondary }]}>
                تاریخ انقضا:
              </Text>
              <Text style={[s.dateValue, { color: colors.textMain }]}>
                {request.expiresAt}
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
                  برای رزرو نوبت با سالن تماس بگیرید
                </Text>
              </View>
              <View style={s.hintItem}>
                <Icon name="check-circle" size={14} color="#4CAF50" />
                <Text style={[s.hintText, { color: colors.textSecondary }]}>
                  مدل‌ها اجازه استفاده از تصاویر را به سالن می‌دهند
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
    height: 300,
    position: 'relative',
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: '100%',
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
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
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
  costBadge: {
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
  costBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,152,0,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgentText: {
    color: '#fff',
    fontSize: 11,
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
  costTypeBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  costTypeLabel: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  costTypeDescription: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 20,
  },

  // ═══════ 🆕 کارت تماس ═══════
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  phoneInfo: {
    flex: 1,
    gap: 2,
  },
  phoneLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  phoneValue: {
    fontSize: 17,
    fontFamily: 'Vazir-Bold',
    letterSpacing: 1,
    textAlign: 'center',

  },
  phoneIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  callBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',
  },
  callHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
  },
  callHintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 18,
  },

  // ═══════ توضیحات و تاریخ ═══════
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    lineHeight: 26,
    textAlign: 'justify',
  },
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