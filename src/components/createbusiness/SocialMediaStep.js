// src/components/manager/SocialMediaStep.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Input from '../common/Input';
import Card from '../common/Card';
import Button from '../common/Button';
import Divider from '../common/Divider';

export default function SocialMediaStep({ formData, onUpdate }) {
  const { colors } = useTheme();

  return (
    <View style={s.container}>
      <Text style={[s.stepTitle, { color: colors.textMain }]}>
        شبکه‌های اجتماعی و ارتباطات
      </Text>
      <Text style={[s.stepHint, { color: colors.textSecondary }]}>
        راه‌های ارتباطی خود را با مشتریان به اشتراک بگذارید
      </Text>

      <Input
        label="اینستاگرام"
        placeholder="آیدی اینستاگرام (بدون @)"
        value={formData.instagram}
        onChangeText={(txt) => onUpdate('instagram', txt)}
        rightIcon={<Icon name="photo-camera" size={22} color="#E1306C" />}
      />

      <Input
        label="تلگرام"
        placeholder="آیدی یا لینک تلگرام"
        value={formData.telegram}
        onChangeText={(txt) => onUpdate('telegram', txt)}
        rightIcon={<Icon name="send" size={22} color="#0088cc" />}
      />

      <Divider label="نمونه‌کارها" spacing={20} />

      <Card variant="default" padding={24} radius={16}>
        <View style={s.portfolioHint}>
          <Icon name="photo-library" size={32} color={colors.primary} />
          <Text style={[s.portfolioHintText, { color: colors.textSecondary }]}>
            نمونه‌کارهای خود را آپلود کنید تا مشتریان بتوانند کارهای شما را ببینند
          </Text>
          <Button
            title="آپلود نمونه‌کار"
            onPress={() => console.log('Upload portfolio')}
            variant="ghost"
            size="sm"
            icon={<Icon name="add-photo-alternate" size={18} color={colors.primary} />}
            iconPosition="right"
          />
        </View>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  stepHint: {
    fontSize: 13,
    fontFamily: 'Vazir',
    marginBottom: 24,
    textAlign: 'right',
    lineHeight: 20,
  },
  portfolioHint: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  portfolioHintText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 20,
  },
});