// src/components/manageBusiness/modelRequest/ModelRequestEmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import Button from '../../common/Button';

export default function ModelRequestEmptyState({ onCreate }) {
  const { colors } = useTheme();

  return (
    <View style={s.container}>
      <View style={[s.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
        <View style={[s.iconCircle, { backgroundColor: colors.primary }]}>
          <Icon name="face-retouching-natural" size={48} color="#fff" />
        </View>
        <View style={[s.iconRing, { borderColor: colors.primary + '40' }]} />
      </View>

      <Text style={[s.title, { color: colors.textMain }]}>
        هنوز درخواست مدلی ثبت نکرده‌اید
      </Text>

      <Text style={[s.description, { color: colors.textSecondary }]}>
        با ایجاد درخواست مدل، می‌توانید برای خدمات خود مدل جذب کنید و نمونه‌کار بسازید
      </Text>

      <Button
        title="ایجاد اولین درخواست مدل"
        onPress={onCreate}
        variant="primary"
        size="lg"
        icon={<Icon name="add" size={20} color="#fff" />}
        iconPosition="right"
        style={s.button}
      />

      <View style={s.tipsContainer}>
        <View style={s.tipItem}>
          <Icon name="lightbulb" size={14} color="#FFC107" />
          <Text style={[s.tipText, { color: colors.textSecondary }]}>
            تخفیف ویژه برای مدل‌ها ارائه دهید (معمولاً ۵۰-۷۰٪)
          </Text>
        </View>

        <View style={s.tipItem}>
          <Icon name="info-outline" size={14} color={colors.primary} />
          <Text style={[s.tipText, { color: colors.textSecondary }]}>
            مدل‌ها در ازای تخفیف، اجازه استفاده از تصاویر را می‌دهند
          </Text>
        </View>

        <View style={s.tipItem}>
          <Icon name="trending-up" size={14} color="#4CAF50" />
          <Text style={[s.tipText, { color: colors.textSecondary }]}>
            با نمونه‌کارهای بیشتر، اعتماد مشتریان افزایش می‌یابد
          </Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 14,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
  },
  tipsContainer: {
    marginTop: 16,
    gap: 10,
    width: '100%',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
  },
});