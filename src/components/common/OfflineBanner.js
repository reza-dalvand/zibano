// src/components/common/OfflineBanner.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { useNetwork } from '../../context/NetworkContext';

const CONNECTION_LABELS = {
  wifi: 'وای‌فای',
  cellular: 'دیتای موبایل',
  ethernet: 'کابل شبکه',
  bluetooth: 'بلوتوث',
  unknown: 'نامشخص',
};

export default function OfflineBanner() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    isConnected,
    isInternetReachable,
    connectionType,
    showOfflineBanner,
    dismissBanner,
  } = useNetwork();

  // فقط وقتی بنر را نشان بده که واقعاً قطع باشد
  const isOffline = !isConnected || isInternetReachable === false;

  if (!showOfflineBanner || !isOffline) return null;

  const connectionLabel = CONNECTION_LABELS[connectionType] || 'اینترنت';

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: '#E53935',
          paddingTop: insets.top > 0 ? insets.top : 8,
        },
      ]}
    >
      <View style={s.content}>
        {/* آیکون */}
        <View style={s.iconCircle}>
          <Icon name="wifi-off" size={18} color="#fff" />
        </View>

        {/* متن */}
        <View style={s.textCol}>
          <Text style={s.title}>اتصال اینترنت قطع شد</Text>
          <Text style={s.subtitle}>
            لطفاً اتصال {connectionLabel} خود را بررسی کنید
          </Text>
        </View>

        {/* دکمه بستن */}
        <TouchableOpacity
          onPress={dismissBanner}
          style={s.closeBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="close" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontFamily: 'Vazir',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});