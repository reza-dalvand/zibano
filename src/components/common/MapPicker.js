// src/components/common/MapPicker.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MapPicker({
  initialLocation,
  onLocationSelect,
  readOnly = false,
  height = 280, // 🎯 دیگه استفاده نمیشه (برای backward compatibility نگه داشتم)
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);

  // 🎯 state برای مدال
  const [modalVisible, setModalVisible] = useState(false);

  // 🎯 موقعیت نهایی تایید شده (بیرون مدال)
  const [confirmedLocation, setConfirmedLocation] = useState(initialLocation || null);
  const [confirmedAddress, setConfirmedAddress] = useState('');

  // 🎯 موقعیت موقت داخل مدال (قبل از ثبت)
  const [tempLocation, setTempLocation] = useState(null);
  const [tempAddress, setTempAddress] = useState('در حال دریافت آدرس...');
  const [loading, setLoading] = useState(false);

  const DEFAULT_LOCATION = {
    latitude: 35.6892,
    longitude: 51.389,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // 🎯 تبدیل مختصات به آدرس
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`,
        {
          headers: {
            'User-Agent': 'ZibanoApp/1.0',
          },
        },
      );
      const data = await response.json();
      return data.display_name || 'آدرس یافت نشد';
    } catch (error) {
      console.log('Error getting address:', error);
      return 'خطا در دریافت آدرس';
    }
  };

  // 🎯 مقداردهی اولیه آدرس اگر موقعیت تایید شده وجود دارد
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
  }, []);

  // 🎯 باز کردن مدال
  const openModal = () => {
    if (readOnly) return;
    // اگر موقعیت تایید شده داریم، با آن شروع کن، وگرنه پیش‌فرض
    const startLoc = confirmedLocation || DEFAULT_LOCATION;
    setTempLocation(startLoc);
    setModalVisible(true);

    // دریافت آدرس اولیه
    setLoading(true);
    getAddressFromCoordinates(startLoc.latitude, startLoc.longitude).then(
      (addr) => {
        setTempAddress(addr);
        setLoading(false);
      },
    );
  };

  // 🎯 کلیک روی نقشه (انتخاب موقعیت جدید)
  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newLocation = {
      latitude,
      longitude,
      latitudeDelta: tempLocation?.latitudeDelta || 0.01,
      longitudeDelta: tempLocation?.longitudeDelta || 0.01,
    };
    setTempLocation(newLocation);
    setLoading(true);
    const addr = await getAddressFromCoordinates(latitude, longitude);
    setTempAddress(addr);
    setLoading(false);
  };

  // 🎯 کشیدن مارکر
  const handleMarkerDragEnd = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newLocation = {
      latitude,
      longitude,
      latitudeDelta: tempLocation?.latitudeDelta || 0.01,
      longitudeDelta: tempLocation?.longitudeDelta || 0.01,
    };
    setTempLocation(newLocation);
    setLoading(true);
    const addr = await getAddressFromCoordinates(latitude, longitude);
    setTempAddress(addr);
    setLoading(false);
  };

  // 🎯 ثبت موقعیت و بستن مدال
  const handleConfirm = () => {
    if (!tempLocation) return;
    setConfirmedLocation(tempLocation);
    setConfirmedAddress(tempAddress);
    onLocationSelect?.(tempLocation, tempAddress);
    setModalVisible(false);
  };

  // 🎯 بستن بدون ثبت
  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={s.wrapper}>
      {/* ═══════ فیلد نمایشی (شبیه Input) ═══════ */}
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
            <View
              style={[
                s.triggerIconBox,
                { backgroundColor: colors.primary + '18' },
              ]}
            >
              <Icon name="location-on" size={20} color={colors.primary} />
            </View>
            <View style={s.triggerTextCol}>
              <Text
                style={[s.triggerLabel, { color: colors.textSecondary }]}
              >
                موقعیت انتخاب شده
              </Text>
              <Text
                style={[s.triggerAddress, { color: colors.textMain }]}
                numberOfLines={1}
              >
                {confirmedAddress ||
                  `${confirmedLocation.latitude.toFixed(4)}, ${confirmedLocation.longitude.toFixed(4)}`}
              </Text>
            </View>
            <View
              style={[s.triggerEditBadge, { backgroundColor: colors.primary }]}
            >
              <Icon name="edit" size={12} color="#fff" />
              <Text style={s.triggerEditText}>تغییر</Text>
            </View>
          </>
        ) : (
          <>
            <View
              style={[
                s.triggerIconBox,
                { backgroundColor: colors.border + '60' },
              ]}
            >
              <Icon name="place" size={20} color={colors.textSecondary} />
            </View>
            <View style={s.triggerTextCol}>
              <Text
                style={[s.triggerLabel, { color: colors.textSecondary }]}
              >
                موقعیت مکانی
              </Text>
              <Text
                style={[s.triggerPlaceholder, { color: colors.textSecondary }]}
              >
                برای انتخاب روی نقشه، ضربه بزنید
              </Text>
            </View>
            <Icon
              name="chevron-left"
              size={22}
              color={colors.textSecondary}
            />
          </>
        )}
      </TouchableOpacity>

      {/* ═══════ مدال تمام‌صفحه ═══════ */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <View
          style={[
            s.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          {/* ═══════ هدر مدال ═══════ */}
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
              style={[
                s.closeBtn,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
              activeOpacity={0.7}
            >
              <Icon name="close" size={20} color={colors.textMain} />
            </TouchableOpacity>
            <View style={s.headerCenter}>
              <Text style={[s.headerTitle, { color: colors.textMain }]}>
                انتخاب موقعیت مکانی
              </Text>
              <Text
                style={[s.headerSubtitle, { color: colors.textSecondary }]}
              >
                روی نقشه ضربه بزنید یا مارکر را جابه‌جا کنید
              </Text>
            </View>
            <View style={{ width: 38 }} />
          </View>

          {/* ═══════ نقشه ═══════ */}
          <View style={s.mapWrapper}>
            <MapView
              ref={mapRef}
              style={s.map}
              mapType="none"
              region={
                tempLocation || DEFAULT_LOCATION
              }
              onPress={handleMapPress}
              scrollEnabled
              zoomEnabled
              rotateEnabled={false}
            >
              <UrlTile
                urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />
              {tempLocation && (
                <Marker
                  coordinate={{
                    latitude: tempLocation.latitude,
                    longitude: tempLocation.longitude,
                  }}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                >
                  <View
                    style={[
                      s.markerContainer,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Icon name="location-on" size={24} color="#fff" />
                  </View>
                </Marker>
              )}
            </MapView>

            {/* ═══════ نشانگر مرکز (راهنما) ═══════ */}
            <View style={s.centerHint}>
              <Icon name="touch-app" size={14} color="#fff" />
              <Text style={s.centerHintText}>ضربه روی نقشه</Text>
            </View>

            {/* ═══════ باکس آدرس ═══════ */}
            <View
              style={[
                s.addressBox,
                {
                  backgroundColor: colors.cardBackground,
                  borderTopColor: colors.border,
                },
              ]}
            >
              <Icon name="place" size={18} color={colors.primary} />
              <View style={s.addressInfo}>
                {loading ? (
                  <View style={s.loadingRow}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text
                      style={[
                        s.addressText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      در حال دریافت آدرس...
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text
                      style={[s.addressLabel, { color: colors.textMain }]}
                    >
                      آدرس انتخابی
                    </Text>
                    <Text
                      style={[
                        s.addressText,
                        { color: colors.textSecondary },
                      ]}
                      numberOfLines={2}
                    >
                      {tempAddress}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* ═══════ فوتر: دکمه ثبت ═══════ */}
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
            {/* نمایش مختصات */}
            {tempLocation && (
              <View
                style={[
                  s.coordsRow,
                  {
                    backgroundColor: colors.primary + '10',
                    borderColor: colors.primary + '30',
                  },
                ]}
              >
                <Icon name="my-location" size={14} color={colors.primary} />
                <Text
                  style={[s.coordsText, { color: colors.primary }]}
                  numberOfLines={1}
                >
                  {tempLocation.latitude.toFixed(5)},{' '}
                  {tempLocation.longitude.toFixed(5)}
                </Text>
              </View>
            )}

            <View style={s.footerButtonsRow}>
              <TouchableOpacity
                onPress={handleClose}
                style={[
                  s.cancelBtn,
                  { borderColor: colors.border, backgroundColor: colors.background },
                ]}
                activeOpacity={0.8}
              >
                <Icon name="close" size={18} color={colors.textMain} />
                <Text
                  style={[s.cancelBtnText, { color: colors.textMain }]}
                >
                  انصراف
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                disabled={!tempLocation || loading}
                activeOpacity={0.85}
                style={[
                  s.confirmBtn,
                  {
                    backgroundColor:
                      tempLocation && !loading ? colors.primary : colors.border,
                  },
                ]}
              >
                <Icon name="check" size={18} color="#fff" />
                <Text style={s.confirmBtnText}>ثبت موقعیت مکانی</Text>
                <Icon name="arrow-back" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    width: '100%',
  },

  // ═══════ فیلد نمایشی ═══════
  triggerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
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
  triggerTextCol: {
    flex: 1,
    gap: 2,
  },
  triggerLabel: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  triggerAddress: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  triggerPlaceholder: {
    fontSize: 13,
    fontFamily: 'Vazir',
  },
  triggerEditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  triggerEditText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },

  // ═══════ مدال ═══════
  modalContainer: {
    flex: 1,
  },
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },

  // ═══════ نقشه ═══════
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  centerHint: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    zIndex: 5,
  },
  centerHintText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
  markerContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  // ═══════ باکس آدرس ═══════
  addressBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  addressInfo: {
    flex: 1,
    gap: 2,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressLabel: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },

  // ═══════ فوتر ═══════
  modalFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  coordsRow: {
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
  footerButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  confirmBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal:16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',
  },
});