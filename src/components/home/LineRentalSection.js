// src/components/home/LineRentalSection.js
import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import { useNavigation } from '@react-navigation/native';
import SectionHeader from '../common/SectionHeader';
import LineRentalCard from './LineRentalCard';
import SeeAllButton from './SeeAllButton';
import Card from '../common/Card';

const MOCK_LINE_RENTALS = [/* ... */];

export default function LineRentalSection() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleSeeAll = () => navigation.navigate('AllLineRentals');
  const handleItemPress = (ad) => navigation.navigate('LineRentalDetail', { ad });

  return (
    <View style={s.section}>
      <SectionHeader
        icon="storefront"
        iconColor="#667eea"
        title="فرصت‌های همکاری"
        subtitle="با اجاره لاین، کسب‌وکار خود را گسترش دهید"
        rightElement={<SeeAllButton onPress={handleSeeAll} count={MOCK_LINE_RENTALS.length} />}
      />

      <Card variant="default" padding={10} radius={12} style={[s.promoBanner, { backgroundColor: '#667eea08', borderColor: '#667eea40' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="workspace-premium" size={16} color="#667eea" />
          <Text style={{ fontSize: 11, fontFamily: 'Vazir', flex: 1, lineHeight: 17, color: colors.textMain }}>
            برای متخصصان: با حداقل سرمایه، کسب‌وکار خود را راه‌اندازی کنید
          </Text>
        </View>
      </Card>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.cardsContainer}>
        {MOCK_LINE_RENTALS.map((ad) => (
          <LineRentalCard key={ad.id} ad={ad} onPress={handleItemPress} />
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  section: { marginBottom: 24 },
  promoBanner: { borderWidth: 1, marginBottom: 12 },
  cardsContainer: { gap: 12, paddingRight: 4 },
});