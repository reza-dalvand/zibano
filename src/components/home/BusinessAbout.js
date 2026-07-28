// src/components/home/BusinessAbout.js
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Card from '../common/Card';
import InfoRow from '../common/InfoRow';
import ActionButtons from '../common/ActionButtons';
import { toPersianDigit } from '../../utils/numberUtils';
import { cleanPhone } from '../../utils/phoneUtils';

export default function BusinessAbout({ business }) {
  const { colors } = useTheme();

  const handleCall = async () => {
    if (!business.phone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    // ActionButtons خودش هندل می‌کنه
  };

  return (
    <View style={s.aboutSection}>
      {/* درباره کسب‌وکار */}
      <Card variant="elevated" padding={20} radius={20}>
        <View style={s.aboutHeader}>
          <Icon name="info-outline" size={22} color={colors.primary} />
          <Text style={[s.aboutTitle, { color: colors.textMain }]}>درباره کسب‌وکار</Text>
        </View>
        <Text style={[s.aboutText, { color: colors.textSecondary }]}>{business.about}</Text>
      </Card>

      {/* 🎯 استفاده از ActionButtons مشترک */}
      <ActionButtons
        phone={cleanPhone(business.phone)}
        shareMessage={`🌸 ${business.name}\n📍 ${business.address}`}
      />

      {/* اطلاعات تکمیلی با InfoRow */}
      <Card variant="elevated" padding={16} radius={16}>
        <InfoRow
          icon="place"
          iconColor="#E53935"
          label="آدرس"
          value={business.address}
          showDivider
        />
        <InfoRow
          icon="phone"
          iconColor="#4CAF50"
          label="تلفن تماس"
          value={toPersianDigit(business.phone)}
          showDivider
          monospace
        />
        <InfoRow
          icon="schedule"
          iconColor="#2196F3"
          label="ساعات کاری"
          value={business.workingHours}
        />
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  aboutSection: { gap: 12 },
  aboutHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  aboutTitle: { fontSize: 15, fontFamily: 'Vazir-Bold', width: '100%' },
  aboutText: { fontSize: 13, fontFamily: 'Vazir', lineHeight: 24, textAlign: 'justify' },
});