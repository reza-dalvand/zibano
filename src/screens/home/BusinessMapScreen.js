// src/screens/home/BusinessMapScreen.js
import React, { useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Map, Camera, Marker } from '@maplibre/maplibre-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';

const MAPTILER_KEY = 'L73LG8NW7ZJ9HyUyCEZu';
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}&language=fa`;

const DEFAULT_LOCATION = {
  latitude: 35.6997,
  longitude: 51.3380,
};

// 🎯 اپلیکیشن‌های مسیریاب 
const NAVIGATION_APPS = [
  {
    id: 'google',
    name: 'گوگل مپ',
    icon: 'map',
    color: '#4285F4',
    description: 'مسیریاب پیش‌فرض',
    buildUrl: (lat, lng) =>
      Platform.OS === 'ios'
        ? `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`
        : `google.navigation:q=${lat},${lng}`,
    fallbackUrl: (lat, lng) =>
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
  },
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
  
  const { business } = route.params || {};

  const [showAppSelector, setShowAppSelector] = useState(false);

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
      zoom: 16,
    }),
    [location]
  );

  const availableApps = useMemo(() => {
    return NAVIGATION_APPS.filter((app) => {
      if (app.id === 'apple' && Platform.OS !== 'ios') return false;
      return true;
    });
  }, []);

  const handleNavigation = async (app) => {
    const url = app.buildUrl(
      location.latitude,
      location.longitude,
      business?.name || 'مقصد'
    );
    const fallbackUrl = app.fallbackUrl(
      location.latitude,
      location.longitude,
      business?.name || 'مقصد'
    );

    setShowAppSelector(false);

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
              text: 'باز کردن',
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

  return (
    <View style={s.container}>
      {/* ═══════ نقشه تمام صفحه ═══════ */}
      <Map
        style={s.map}
        mapStyle={MAP_STYLE}
        compassEnabled={false}
        logoEnabled={false}
        attributionEnabled={true}
      >
        <Camera ref={cameraRef} initialViewState={initialCamera} />
        
        {/* 🎯 مارکر قرمز رنگ خالص بدون برش‌خوردگی */}
        <Marker
          id="business-marker"
          lngLat={[location.longitude, location.latitude]}
          anchor="bottom"
        >
          <View style={s.markerContainer}>
            <Icon name="location-on" size={48} color="#E53935" style={s.markerIcon} />
            <View style={s.markerShadow} />
          </View>
        </Marker>
      </Map>

      {/* ═══════ دکمه‌های پایینی ═══════ */}
      <View
        style={[
          s.bottomActionContainer,
          {
            paddingBottom: Math.max(insets.bottom, 20),
            backgroundColor: colors.cardBackground,
          },
        ]}
      >
        <View style={s.businessInfoBox}>
          <Text style={[s.businessName, { color: colors.textMain }]} numberOfLines={1}>
            {business?.name || 'موقعیت کسب‌وکار'}
          </Text>
          <Text style={[s.businessAddress, { color: colors.textSecondary }]} numberOfLines={2}>
            {business?.address || 'آدرس ثبت نشده است'}
          </Text>
        </View>

        <View style={s.actionButtonsRow}>
          <TouchableOpacity
            style={[s.cancelButton, { backgroundColor: colors.background, borderColor: colors.border }]}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Icon name="close" size={20} color={colors.textMain} />
            <Text style={[s.cancelButtonText, { color: colors.textMain }]}>انصراف</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.routeButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
            onPress={() => setShowAppSelector(true)}
          >
            <Icon name="directions" size={20} color="#fff" />
            <Text style={s.routeButtonText}>مسیریابی</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══════ مُدال انتخاب اپلیکیشن ═══════ */}
      <Modal
        visible={showAppSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAppSelector(false)}
      >
        <View style={s.modalOverlay}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFillObject} 
            activeOpacity={1} 
            onPress={() => setShowAppSelector(false)} 
          />
          <View
            style={[
              s.bottomSheet,
              {
                backgroundColor: colors.cardBackground,
                paddingBottom: Math.max(insets.bottom, 20),
              },
            ]}
          >
            <View style={s.sheetHandle} />
            <Text style={[s.sheetTitle, { color: colors.textMain }]}>
              انتخاب مسیر‌یاب
            </Text>
            <Text style={[s.sheetSubtitle, { color: colors.textSecondary }]}>
              کدام اپلیکیشن را برای مسیریابی باز کنیم؟
            </Text>

            <View style={s.appsList}>
              {availableApps.map((app) => (
                <TouchableOpacity
                  key={app.id}
                  onPress={() => handleNavigation(app)}
                  activeOpacity={0.8}
                  style={[s.appItem, { borderBottomColor: colors.border }]}
                >
                  <View style={[s.appIconBox, { backgroundColor: app.color + '18' }]}>
                    <Icon name={app.icon} size={24} color={app.color} />
                  </View>
                  <View style={s.appTextCol}>
                    <Text style={[s.appName, { color: colors.textMain }]}>
                      {app.name}
                    </Text>
                    <Text style={[s.appDesc, { color: colors.textSecondary }]}>
                      {app.description}
                    </Text>
                  </View>
                  <Icon name="chevron-left" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  
  // 🎯 تنظیم ابعاد کانتینر جهت جلوگیری از برش خوردن نوک پین
  markerContainer: { 
    width: 52,
    height: 58,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  markerIcon: {
    includeFontPadding: false,
  },
  markerShadow: {
    width: 14,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 7,
    marginTop: -4,
  },

  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  businessInfoBox: { marginBottom: 16, alignItems: 'flex-start' },
  businessName: { fontSize: 16, fontFamily: 'Vazir-Bold', marginBottom: 4 },
  businessAddress: { fontSize: 13, fontFamily: 'Vazir', lineHeight: 20, textAlign: 'left' },
  actionButtonsRow: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 54, borderRadius: 16, borderWidth: 1 },
  cancelButtonText: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  routeButton: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 54, borderRadius: 16, elevation: 4 },
  routeButtonText: { color: '#fff', fontSize: 16, fontFamily: 'Vazir-Bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  bottomSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 12, maxHeight: '80%' },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#ccc', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontFamily: 'Vazir-Bold', textAlign: 'right' },
  sheetSubtitle: { fontSize: 13, fontFamily: 'Vazir', marginTop: 4, marginBottom: 20, textAlign: 'right' },
  appsList: { paddingBottom: 20 },
  appItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, gap: 14 },
  appIconBox: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  appTextCol: { flex: 1, gap: 2, alignItems: 'flex-start' },
  appName: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  appDesc: { fontSize: 12, fontFamily: 'Vazir' },
});