// src/components/home/BusinessAbout.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../common/Card';

const toPersianDigit = (str) =>
  String(str || '').replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export default function BusinessAbout({ business }) {
  const { colors } = useTheme();

  // 🎯 هندلر تماس مستقیم
  const handleCall = async () => {
    if (!business.phone) {
      Alert.alert('خطا', 'شماره تماسی ثبت نشده است');
      return;
    }
    try {
      const cleanPhone = business.phone
        .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
        .replace(/[^0-9+]/g, '');

      const phoneUrl = `tel:${cleanPhone}`;
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

  return (
    <View style={s.aboutSection}>
      {/* درباره کسب‌وکار */}
      <Card variant="elevated" padding={20} radius={20}>
        <View style={s.aboutHeader}>
          <Icon name="info-outline" size={22} color={colors.primary} />
          <Text style={[s.aboutTitle, { color: colors.textMain }]}>
            درباره کسب‌وکار
          </Text>
        </View>
        <Text style={[s.aboutText, { color: colors.textSecondary }]}>
          {business.about}
        </Text>
      </Card>

      <View style={s.contactCards}>
        {/* آدرس */}
        <Card variant="elevated" padding={16} radius={16} style={s.contactCard}>
          <View style={s.contactRow}>
            <View style={[s.contactIconBox, { backgroundColor: '#E5393520' }]}>
              <Icon name="place" size={22} color="#E53935" />
            </View>
            <View style={s.contactTextCol}>
              <Text style={[s.contactLabel, { color: colors.textSecondary }]}>
                آدرس
              </Text>
              <Text style={[s.contactValue, { color: colors.textMain }]}>
                {business.address}
              </Text>
            </View>
          </View>
        </Card>

        {/* 🎯 تلفن تماس - ساده و یکسان با بقیه */}
        <Card variant="elevated" padding={16} radius={16} style={s.contactCard}>
          <TouchableOpacity
            style={s.contactRow}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <View style={[s.contactIconBox, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="phone" size={22} color="#4CAF50" />
            </View>
            <View style={s.contactTextCol}>
              <Text style={[s.contactLabel, { color: colors.textSecondary }]}>
                تلفن تماس
              </Text>
              <Text style={[s.contactValue, { color: colors.textMain }]}>
                {toPersianDigit(business.phone)}
              </Text>
            </View>
            <Icon name="call" size={22} color="#4CAF50" />
          </TouchableOpacity>
        </Card>

        {/* ساعات کاری */}
        <Card variant="elevated" padding={16} radius={16} style={s.contactCard}>
          <View style={s.contactRow}>
            <View style={[s.contactIconBox, { backgroundColor: '#2196F320' }]}>
              <Icon name="schedule" size={22} color="#2196F3" />
            </View>
            <View style={s.contactTextCol}>
              <Text style={[s.contactLabel, { color: colors.textSecondary }]}>
                ساعات کاری
              </Text>
              <Text style={[s.contactValue, { color: colors.textMain }]}>
                {business.workingHours}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  aboutSection: {
    gap: 12,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  aboutTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    width:'100%'
  },
  aboutText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 24,
    textAlign: 'justify',
  },
  contactCards: {
    gap: 10,
    marginTop: 8,
  },
  contactCard: {},
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  contactIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextCol: {
    flex: 1,
    gap: 4,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  contactValue: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    lineHeight: 22,
  },
});