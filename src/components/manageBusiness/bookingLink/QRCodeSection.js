// src/components/manageBusiness/bookingLink/QRCodeSection.js
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import Card from '../../common/Card';

export default function QRCodeSection({ bookingLink }) {
  const { colors } = useTheme();

  const handleDownloadQR = () => {
    Alert.alert('دانلود QR Code', 'این قابلیت به زودی فعال می‌شود');
  };

  return (
    <Card variant="default" padding={20} radius={16} style={s.container}>
      <View style={s.header}>
        <Icon name="qr-code-2" size={20} color={colors.primary} />
        <Text style={[s.title, { color: colors.textMain }]}>کد QR</Text>
      </View>

      {/* QR Code Placeholder */}
      <View style={[s.qrBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={s.qrPlaceholder}>
          <Icon name="qr-code-2" size={120} color={colors.border} />
          <Text style={[s.qrHint, { color: colors.textSecondary }]}>
            QR Code به زودی اضافه می‌شود
          </Text>
        </View>
      </View>

      {/* دکمه دانلود */}
      <View style={s.actions}>
        <Icon name="info-outline" size={14} color={colors.textSecondary} />
        <Text style={[s.actionText, { color: colors.textSecondary }]}>
          این کد را چاپ کنید و در سالن خود قرار دهید
        </Text>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  container: {
    margin: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  qrPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  qrHint: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 11,
    fontFamily: 'Vazir',
  },
});