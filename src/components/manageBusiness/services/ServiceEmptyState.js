// src/components/manageBusiness/services/ServiceEmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import Button from '../../common/Button';

export default function ServiceEmptyState({ onAdd }) {
  const { colors } = useTheme();

  return (
    <View style={s.container}>
      <View style={[s.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
        <View style={[s.iconCircle, { backgroundColor: colors.primary }]}>
          <Icon name="spa" size={40} color="#fff" />
        </View>
        <View style={[s.iconRing, { borderColor: colors.primary + '40' }]} />
      </View>

      <Text style={[s.title, { color: colors.textMain }]}>
        هنوز خدمتی ثبت نکرده‌اید
      </Text>
      <Text style={[s.description, { color: colors.textSecondary }]}>
        اولین خدمت سالن خود را اضافه کنید{'\n'}
        تا مشتریان بتوانند از شما نوبت بگیرند
      </Text>

      <Button
        title="افزودن اولین خدمت"
        onPress={onAdd}
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
            حداقل ۳ خدمت برای شروع پیشنهاد می‌شود
          </Text>
        </View>
        <View style={s.tipItem}>
          <Icon name="info-outline" size={14} color={colors.primary} />
          <Text style={[s.tipText, { color: colors.textSecondary }]}>
            خدمات باید به اعضای تیم اختصاص داده شوند
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
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
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