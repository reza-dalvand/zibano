// src/components/common/MapPicker.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Map, Camera, UserLocation } from '@maplibre/maplibre-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MAPTILER_KEY = 'L73LG8NW7ZJ9HyUyCEZu';
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}&language=fa`;
const DEFAULT_LOCATION = {
  latitude: 35.6997,
  longitude: 51.3380,
  zoom: 13,
};

export default function MapPicker({
  initialLocation,
  onLocationSelect,
  readOnly = false,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const latestLocationRef = useRef(initialLocation || DEFAULT_LOCATION);

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmedLocation, setConfirmedLocation] = useState(initialLocation || null);
  const [confirmedAddress, setConfirmedAddress] = useState('');
  const [tempAddress, setTempAddress] = useState('در حال دریافت آدرس...');
  const [loading, setLoading] = useState(false);
  const [hasValidLocation, setHasValidLocation] = useState(false);

  const initialCamera = useMemo(() => {
    const loc = confirmedLocation || DEFAULT_LOCATION;
    return {
      center: [loc.longitude, loc.latitude],
      zoom: loc.zoom || DEFAULT_LOCATION.zoom,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=fa`,
        { headers: { 'User-Agent': 'ZibanoApp/1.0 (contact@yourdomain.com)' } },
      );
      const data = await response.json();
      return data.display_name || 'آدرس یافت نشد';
    } catch (error) {
      console.log('Error getting address:', error);
      return 'خطا در دریافت آدرس';
    }
  };

  useEffect(() => {
    const init = async () => {
      if (confirmedLocation?.latitude && confirmedLocation?.longitude) {
        const addr = await getAddressFromCoordinates(
          confirmedLocation.latitude,
          confirmedLocation.longitude,
        );
        setConfirmedAddress(addr);
      }
    };
    init();
  }, [confirmedLocation]);

  const openModal = () => {
    if (readOnly) return;
    const startLoc = confirmedLocation || DEFAULT_LOCATION;
    latestLocationRef.current = startLoc;
    setHasValidLocation(true);
    setModalVisible(true);
    setLoading(true);
    getAddressFromCoordinates(startLoc.latitude, startLoc.longitude).then((addr) => {
      setTempAddress(addr);
      setLoading(false);
    });
  };

  const handleRegionDidChange = useCallback((event) => {
    const center = event?.nativeEvent?.properties?.center || event?.nativeEvent?.center;
    if (!center) return;
    const [lng, lat] = center;
    latestLocationRef.current = { latitude: lat, longitude: lng };
    setTempAddress('در حال جستجوی موقعیت...');
    setLoading(true);
    setHasValidLocation(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      const addr = await getAddressFromCoordinates(lat, lng);
      setTempAddress(addr);
      setHasValidLocation(true);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleConfirm = () => {
    const finalLoc = latestLocationRef.current;
    if (!finalLoc || !hasValidLocation) return;
    setConfirmedLocation(finalLoc);
    setConfirmedAddress(tempAddress);
    onLocationSelect?.(finalLoc, tempAddress);
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const renderedMap = useMemo(() => {
    if (!modalVisible) return null;
    return (
      <Map
        style={s.map}
        mapStyle={MAP_STYLE}
        onRegionDidChange={handleRegionDidChange}
        compassEnabled={false}
        logoEnabled={false}
        attributionEnabled={true}
      >
        <Camera ref={cameraRef} initialViewState={initialCamera} />
        <UserLocation visible={true} />
      </Map>
    );
  }, [modalVisible, initialCamera, handleRegionDidChange]);

  return (
    <View style={s.wrapper}>
      {/* ═══════ Trigger Button ═══════ */}
      <TouchableOpacity
        onPress={openModal}
        activeOpacity={0.8}
        disabled={readOnly}
        style={[
          s.triggerBox,
          {
            backgroundColor: colors.cardBackground,
            borderColor: confirmedLocation ? colors.primary : colors.border,
          },
        ]}
      >
        {confirmedLocation ? (
          <>
            <View style={[s.triggerIconBox, { backgroundColor: colors.primary + '18' }]}>
              <Icon name="location-on" size={20} color={colors.primary} />
            </View>
            <View style={s.triggerTextCol}>
              <Text style={[s.triggerLabel, { color: colors.textSecondary }]}>
                موقعیت انتخاب شده
              </Text>
              <Text style={[s.triggerAddress, { color: colors.textMain }]} numberOfLines={1}>
                {confirmedAddress ||
                  `${confirmedLocation.latitude.toFixed(4)}, ${confirmedLocation.longitude.toFixed(4)}`}
              </Text>
            </View>
            <View style={[s.triggerEditBadge, { backgroundColor: colors.primary }]}>
              <Icon name="edit" size={12} color="#fff" />
              <Text style={s.triggerEditText}>تغییر</Text>
            </View>
          </>
        ) : (
          <>
            <View style={[s.triggerIconBox, { backgroundColor: colors.border + '60' }]}>
              <Icon name="place" size={20} color={colors.textSecondary} />
            </View>
            <View style={s.triggerTextCol}>
              <Text style={[s.triggerLabel, { color: colors.textSecondary }]}>
                موقعیت مکانی
              </Text>
              <Text style={[s.triggerPlaceholder, { color: colors.textSecondary }]}>
                برای انتخاب روی نقشه، ضربه بزنید
              </Text>
            </View>
            <Icon name="chevron-left" size={22} color={colors.textSecondary} />
          </>
        )}
      </TouchableOpacity>

      {/* ═══════ Modal ═══════ */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <View style={[s.modalContainer, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View
            style={[
              s.modalHeader,
              {
                paddingTop: insets.top + 8,
                backgroundColor: colors.cardBackground,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleClose}
              style={[s.closeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
              activeOpacity={0.7}
            >
              <Icon name="close" size={20} color={colors.textMain} />
            </TouchableOpacity>
            <View style={s.headerCenter}>
              <Text style={[s.headerTitle, { color: colors.textMain }]}>
                انتخاب موقعیت مکانی
              </Text>
              <Text style={[s.headerSubtitle, { color: colors.textSecondary }]}>
                نقشه را جابه‌جا کنید تا نشانگر روی محل دقیق قرار گیرد
              </Text>
            </View>
            <View style={{ width: 38 }} />
          </View>

          {/* Map Wrapper */}
          <View style={s.mapWrapper}>
            {renderedMap}
            
            {/* 🎯 مارکر ثابت قرمز در مرکز نقشه */}
            {modalVisible && (
              <View style={s.pinWrapper} pointerEvents="none">
                <View style={s.markerContainer}>
                  <Icon name="location-on" size={48} color="#E53935" style={s.markerIcon} />
                  <View style={s.markerShadow} />
                </View>
              </View>
            )}
          </View>

          {/* Address Box */}
          <View
            style={[
              s.addressBox,
              { backgroundColor: colors.cardBackground, borderTopColor: colors.border },
            ]}
          >
            <Icon name="place" size={18} color={colors.primary} />
            <View style={s.addressInfo}>
              {loading ? (
                <View style={s.loadingRow}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[s.addressText, { color: colors.textSecondary }]}>
                    در حال جستجوی موقعیت...
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={[s.addressLabel, { color: colors.textMain }]}>
                    آدرس انتخابی
                  </Text>
                  <Text style={[s.addressText, { color: colors.textSecondary }]} numberOfLines={2}>
                    {tempAddress}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* ═══════ Footer Buttons ═══════ */}
          <View
            style={[
              s.modalFooter,
              {
                paddingBottom: Math.max(insets.bottom, 12) + 10,
                backgroundColor: colors.cardBackground,
                borderTopColor: colors.border,
              },
            ]}
          >
            <View style={s.footerButtonsRow}>
              {/* دکمه انصراف */}
              <TouchableOpacity
                onPress={handleClose}
                style={[
                  s.cancelBtn,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Icon name="arrow-forward" size={17} color={colors.textSecondary} />
                <Text style={[s.cancelBtnText, { color: colors.textSecondary }]}>
                  انصراف
                </Text>
              </TouchableOpacity>

              {/* دکمه تایید */}
              <TouchableOpacity
                onPress={handleConfirm}
                disabled={!hasValidLocation || loading}
                activeOpacity={0.85}
                style={[
                  s.confirmBtn,
                  {
                    backgroundColor:
                      hasValidLocation && !loading
                        ? colors.primary
                        : colors.border,
                  },
                ]}
              >
                <View style={s.confirmIconCircle}>
                  <Icon name="done" size={16} color="#fff" />
                </View>
                <Text style={s.confirmBtnText}>تایید موقعیت</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { width: '100%' },

  // ═══════ Trigger Button ═══════
  triggerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  triggerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerTextCol: { flex: 1, gap: 2 },
  triggerLabel: { fontSize: 11, fontFamily: 'Vazir' },
  triggerAddress: { fontSize: 13, fontFamily: 'Vazir-Bold', textAlign: 'left' },
  triggerPlaceholder: { fontSize: 13, fontFamily: 'Vazir', textAlign: 'left' },
  triggerEditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  triggerEditText: { color: '#fff', fontSize: 11, fontFamily: 'Vazir-Bold' },

  // ═══════ Modal ═══════
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerCenter: { flex: 1, alignItems: 'center', gap: 2 },
  headerTitle: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  headerSubtitle: { fontSize: 11, fontFamily: 'Vazir' },

  // ═══════ Map ═══════
  mapWrapper: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  pinWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 🎯 مارکر قرمز مشابه فایل قبلی + شیفت به بالا (translateY) برای مرکز شدن دقیق
  markerContainer: { 
    width: 52,
    height: 58,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
    // به اندازه نصف ارتفاع کانتینر (29 پیکسل) شیفت می‌دهیم تا نوک پین در مرکز قرار گیرد
    transform: [{ translateY: -29 }], 
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

  // ═══════ Address Box ═══════
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  addressInfo: { flex: 1, gap: 2 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressLabel: { fontSize: 12, fontFamily: 'Vazir-Bold', textAlign: 'left' },
  addressText: { fontSize: 12, fontFamily: 'Vazir', lineHeight: 18, textAlign: 'left' },

  // ═══════ Footer ═══════
  modalFooter: {
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  footerButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  // ═══════ Cancel Button ═══════
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════ Confirm Button ═══════
  confirmBtn: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  confirmIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
});