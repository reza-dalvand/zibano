// src/components/manageBusiness/lineRental/LineRentalEmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Button from '../../common/Button';

export default function LineRentalEmptyState({ onCreate, tabType }) {
  const { colors } = useTheme();
  const isMyAds = tabType === 'myAds';

  return (
    <View style={s.container}>
      <View style={[s.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
        <View style={[s.iconCircle, { backgroundColor: colors.primary }]}>
          <Icon
            name={isMyAds ? 'storefront' : 'search'}
            size={48}
            color="#fff"
          />
        </View>
        <View style={[s.iconRing, { borderColor: colors.primary + '40' }]} />
      </View>

      <Text style={[s.title, { color: colors.textMain }]}>
        {isMyAds ? 'هنوز آگهی لاینی ثبت نکرده‌اید' : 'آگهی فعالی وجود ندارد'}
      </Text>

      <Text style={[s.description, { color: colors.textSecondary }]}>
        {isMyAds
          ? 'با ثبت آگهی لاین، می‌توانید همکار متخصص جذب کنید و درآمد سالن خود را افزایش دهید'
          : 'در حال حاضر آگهی فعالی برای نمایش وجود ندارد. بعداً مراجعه کنید.'}
      </Text>

      {isMyAds && (
        <Button
          title="ثبت اولین آگهی لاین"
          onPress={onCreate}
          variant="primary"
          size="lg"
          icon={<Icon name="add" size={20} color="#fff" />}
          iconPosition="right"
          style={s.button}
        />
      )}

      <View style={s.tipsContainer}>
        {[
          { icon: 'trending-up', text: 'افزایش درآمد سالن با همکار متخصص', color: '#4CAF50' },
          { icon: 'verified', text: 'ثبت آگهی کاملاً رایگان است', color: colors.primary },
          { icon: 'people', text: 'جذب بهترین متخصصان شهر شما', color: '#2196F3' },
        ].map((tip, i) => (
          <View key={i} style={s.tipItem}>
            <Icon name={tip.icon} size={14} color={tip.color} />
            <Text style={[s.tipText, { color: colors.textSecondary }]}>{tip.text}</Text>
          </View>
        ))}
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
    gap: 12,
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
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
});