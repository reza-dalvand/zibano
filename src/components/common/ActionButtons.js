//src/components/common/ActionButtons.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { toPersianDigit } from '../../utils/numberUtils';

export default function ActionButtons({ phone, shareMessage, shareUrl }) {
  const { colors } = useTheme();

  const handleCall = async () => {
    if (!phone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    try {
      await Linking.openURL(`tel:${phone}`);
    } catch {
      Alert.alert('خطا', `شماره: ${toPersianDigit(phone)}`);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: shareMessage, url: shareUrl });
    } catch {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  return (
    <View style={s.container}>
      {phone && (
        <TouchableOpacity
          onPress={handleCall}
          style={[s.callBtn, { backgroundColor: '#4CAF50' }]}
        >
          <View style={s.iconWrap}>
            <Icon name="call" size={20} color="#fff" />
          </View>
          <View style={s.textCol}>
            <Text style={s.callTitle}>تلفن تماس</Text>
            <Text style={s.callSubtitle}>{toPersianDigit(phone)}</Text>
          </View>
          <Icon name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={handleShare}
        style={[s.shareBtn, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      >
        <Icon name="share" size={20} color={colors.primary} />
        <Text style={[s.shareText, { color: colors.textMain }]}>
          اشتراک‌گذاری
        </Text>
        <Icon name="arrow-back" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { gap: 12 },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, gap: 2 },
  callTitle: { color: '#fff', fontSize: 15, fontFamily: 'Vazir-Bold' },
  callSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontFamily: 'Vazir' },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  shareText: { fontSize: 14, fontFamily: 'Vazir-Bold', flex: 1 },
});