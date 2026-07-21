// src/screens/home/BusinessMapScreen.js
import React, { useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Map, Camera, Marker } from '@maplibre/maplibre-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

const MAPTILER_KEY = 'L73LG8NW7ZJ9HyUyCEZu';
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}&language=fa`;

const DEFAULT_LOCATION = {
  latitude: 35.6997,
  longitude: 51.3380,
};

// 🎯 اپلیکیشن‌های مسیریاب (بدون گوگل مپ)
const NAVIGATION_APPS = [
  {
    id: 'neshan',
    name: 'نشان',
    icon: 'navigation',
    color: '#00BCD4',
    description: 'مسیریاب فارسی با ترافیک زنده',
    buildUrl: (lat, lng, name) =>
      `neshan://direction?to=${lat},${lng}&to_name=${encodeURIComponent(name)}`,
    fallbackUrl: (lat, lng) =>
      `https://neshan.org/maps/@${lat},${lng},17z`,
  },
  {
    id: 'balad',
    name: 'بلد',
    icon: 'place',
    color: '#4CAF50',
    description: 'مسیریاب ایرانی با نقشه دقیق',
    buildUrl: (lat, lng, name) =>
      `balad://direction?to=${lat},${lng}&to_name=${encodeURIComponent(name)}`,
    fallbackUrl: (lat, lng) =>
      `https://balad.ir/maps/@${lat},${lng},17z`,
  },
  {
    id: 'apple',
    name: 'اپل مپ',
    icon: 'explore',
    color: '#000000',
    description: 'فقط برای iOS',
    buildUrl: (lat, lng) =>
      `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
    fallbackUrl: (lat, lng) =>
      `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`,
  },
];

export default function BusinessMapScreen({ navigation, route }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);
  const { business } = route.params;

  // 🎯 ارتفاع تب بار شناور برای فاصله دادن از پایین
  const NAVBAR_HEIGHT = 80;
  const bottomSpacing = NAVBAR_HEIGHT + insets.bottom + 20;

  const location = useMemo(() => {
    if (business?.location?.latitude && business?.location?.longitude) {
      return {
        latitude: business.location.latitude,
        longitude: business.location.longitude,
      };
    }
    return DEFAULT_LOCATION;
  }, [business]);

  const initialCamera = useMemo(
    () => ({
      center: [location.longitude, location.latitude],
      zoom: 15,
    }),
    [location]
  );

  // 🎯 باز کردن اپلیکیشن مسیریاب
  const handleNavigation = async (app) => {
    const url = app.buildUrl(
      location.latitude,
      location.longitude,
      business?.name || ''
    );
    const fallbackUrl = app.fallbackUrl(
      location.latitude,
      location.longitude,
      business?.name || ''
    );

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          `اپلیکیشن ${app.name}`,
          `اپلیکیشن ${app.name} روی دستگاه شما نصب نیست.\nآیا می‌خواهید در مرورگر باز شود؟`,
          [
            { text: 'انصراف', style: 'cancel' },
            {
              text: 'باز کردن در مرورگر',
              onPress: () => Linking.openURL(fallbackUrl),
            },
          ]
        );
      }
    } catch (error) {
      console.log('Navigation error:', error);
      Linking.openURL(fallbackUrl).catch(() => {
        Alert.alert('خطا', 'امکان باز کردن لینک وجود ندارد');
      });
    }
  };

  // 🎯 فیلتر اپل مپ فقط برای iOS
  const availableApps = useMemo(() => {
    return NAVIGATION_APPS.filter((app) => {
      if (app.id === 'apple' && Platform.OS !== 'ios') return false;
      return true;
    });
  }, []);

  return (
    <ScreenWrapper padding={0} edges={['bottom', 'left', 'right']}>
      <Header
        title="موقعیت روی نقشه"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* ═══════ نقشه با مارکر قرمز ═══════ */}
        <Card variant="elevated" padding={0} radius={20} style={s.mapCard}>
          <View style={s.mapWrapper}>
            <Map
              style={s.map}
              mapStyle={MAP_STYLE}
              compassEnabled={false}
              logoEnabled={false}
              attributionEnabled={true}
              scrollEnabled={true}
              zoomEnabled={true}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Camera ref={cameraRef} initialViewState={initialCamera} />
              {/* 🎯 مارکر قرمز ساده */}
              <Marker
                coordinate={[location.longitude, location.latitude]}
                anchor={{ x: 0.5, y: 1 }}
              >
                <View style={s.markerContainer}>
                  <View style={s.markerPin}>
                    <Icon name="location-on" size={28} color="#fff" />
                  </View>
                  <View style={s.markerShadow} />
                </View>
              </Marker>
            </Map>
          </View>
        </Card>

        {/* ═══════ کارت آدرس ═══════ */}
        <Card variant="elevated" padding={16} radius={18} style={s.addressCard}>
          <View style={s.addressHeader}>
            <View style={[s.addressIconBox, { backgroundColor: '#E5393518' }]}>
              <Icon name="place" size={22} color="#E53935" />
            </View>
            <View style={s.addressTextCol}>
              <Text style={[s.addressLabel, { color: colors.textSecondary }]}>
                آدرس کسب‌وکار
              </Text>
              <Text style={[s.addressValue, { color: colors.textMain }]}>
                {business?.address || 'آدرس ثبت نشده است'}
              </Text>
            </View>
          </View>

          {/* مختصات */}
          <View
            style={[
              s.coordsBox,
              { backgroundColor: colors.background, borderColor: colors.border },
            ]}
          >
            <Icon name="my-location" size={14} color={colors.primary} />
            <Text style={[s.coordsText, { color: colors.textSecondary }]}>
              {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </Text>
          </View>
        </Card>

        {/* ═══════ بخش مسیریابی ═══════ */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={[s.sectionIconBox, { backgroundColor: '#4CAF5018' }]}>
              <Icon name="directions" size={18} color="#4CAF50" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.sectionTitle, { color: colors.textMain }]}>
                مسیریابی به مقصد
              </Text>
              <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
                اپلیکیشن مورد نظر خود را انتخاب کنید
              </Text>
            </View>
          </View>

          <View style={s.appsList}>
            {availableApps.map((app) => (
              <TouchableOpacity
                key={app.id}
                onPress={() => handleNavigation(app)}
                activeOpacity={0.85}
                style={[
                  s.appCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[s.appIconBox, { backgroundColor: app.color + '18' }]}>
                  <Icon name={app.icon} size={26} color={app.color} />
                </View>
                <View style={s.appTextCol}>
                  <Text style={[s.appName, { color: colors.textMain }]}>
                    {app.name}
                  </Text>
                  <Text style={[s.appDesc, { color: colors.textSecondary }]}>
                    {app.description}
                  </Text>
                </View>
                <View style={[s.appActionBox, { backgroundColor: app.color + '18' }]}>
                  <Icon name="arrow-back" size={16} color={app.color} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ═══════ راهنما ═══════ */}
        <Card variant="default" padding={14} radius={14} style={s.hintCard}>
          <Icon name="lightbulb" size={18} color="#FFC107" />
          <Text style={[s.hintText, { color: colors.textSecondary }]}>
            برای استفاده از نشان یا بلد، ابتدا اپلیکیشن آن‌ها را از کافه‌بازار یا اپ‌استور نصب کنید
          </Text>
        </Card>

        {/* 🎯 فضای خالی برای جلوگیری از رفتن زیر تب بار */}
        <View style={{ height: bottomSpacing }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingTop: 12,
  },

  // ═══════ نقشه ═══════
  mapCard: {
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapWrapper: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  map: {
    flex: 1,
  },

  // 🎯 مارکر قرمز
  markerContainer: {
    alignItems: 'center',
  },
  markerPin: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E53935',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 6,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  markerShadow: {
    width: 14,
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 7,
    marginTop: -2,
  },

  // ═══════ آدرس ═══════
  addressCard: {
    marginBottom: 16,
    gap: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  addressIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTextCol: {
    flex: 1,
    gap: 4,
  },
  addressLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  addressValue: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    lineHeight: 22,
  },
  coordsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  coordsText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    flex: 1,
  },

  // ═══════ بخش‌ها ═══════
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
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
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    marginTop: 2,
  },

  // ═══════ اپ‌ها ═══════
  appsList: {
    gap: 10,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  appIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTextCol: {
    flex: 1,
    gap: 3,
  },
  appName: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  appDesc: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  appActionBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ═══════ راهنما ═══════
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  hintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 18,
  },
});