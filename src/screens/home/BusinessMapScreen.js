// src/screens/home/BusinessMapScreen.js
import React, { useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
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

export default function BusinessMapScreen({ navigation, route }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);
  
  const { business } = route.params || {};

  // 🎯 محاسبه فاصله از پایین برای قرار گرفتن دقیقاً بالای تب‌بار شناور
  const TAB_BAR_HEIGHT = 90; 
  const safeBottom = Math.max(insets.bottom, 12) + TAB_BAR_HEIGHT;

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

  // 🎯 تابع جدید برای سپردن انتخاب به سیستم‌عامل
  const handleNavigation = async () => {
    const lat = location.latitude;
    const lng = location.longitude;
    const label = encodeURIComponent(business?.name || 'مقصد');

    // تولید لینک بر اساس سیستم‌عامل
    const url = Platform.select({
      // باز کردن دیالوگ پیش‌فرض اندروید برای انتخاب از بین تمام مسیریاب‌های نصب شده
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
      // باز کردن نقشه در iOS (هدایت به سمت مقصد)
      ios: `maps://?daddr=${lat},${lng}&dirflg=d` 
    });

    // لینک جایگزین در صورتی که هیچ اپلیکیشن نقشه‌ای نصب نباشد
    const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // باز کردن نسخه وب گوگل مپ
        await Linking.openURL(fallbackUrl);
      }
    } catch (error) {
      console.log('Navigation error:', error);
      Linking.openURL(fallbackUrl).catch(() => {
        Alert.alert('خطا', 'امکان باز کردن مسیریاب وجود ندارد.');
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
            bottom: safeBottom,
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
            onPress={handleNavigation} // 🎯 فراخوانی مستقیم بدون نیاز به مدال
          >
            <Icon name="directions" size={20} color="#fff" />
            <Text style={s.routeButtonText}>مسیریابی</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  
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
    left: '2%',
    right: '2%',
    padding: 16,
    borderRadius: 24,
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
});