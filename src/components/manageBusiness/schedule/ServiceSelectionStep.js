// src/components/manageBusiness/schedule/ServiceSelectionStep.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import ServiceTypeIcon from '../services/ServiceTypeIcon';
import { toPersianDigit } from '../../../utils/numberUtils';

export default function ServiceSelectionStep({ services, selectedId, onSelect }) {
  const { colors } = useTheme();

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Icon name="spa" size={20} color={colors.primary} />
        <Text style={[s.title, { color: colors.textMain }]}>
          خدمت موردنظر را انتخاب کنید
        </Text>
      </View>
      <Text style={[s.subtitle, { color: colors.textSecondary }]}>
        برای تنظیم ساعات کاری، ابتدا خدمت را مشخص نمایید
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
      >
        {services.map((service) => {
          const isSelected = selectedId === service.id;
          return (
            <TouchableOpacity
              key={service.id}
              activeOpacity={0.8}
              onPress={() => onSelect(service.id)}
              style={[
                s.card,
                {
                  backgroundColor: isSelected ? colors.primary + '08' : colors.cardBackground,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <ServiceTypeIcon typeId={service.typeId} size={52} />
              <View style={s.info}>
                <Text style={[s.name, { color: colors.textMain }]}>
                  {service.name}
                </Text>
                <Text style={[s.type, { color: colors.textSecondary }]}>
                  {service.typeName}
                </Text>
                <View style={s.metaRow}>
                  <Icon name="schedule" size={12} color={colors.textSecondary} />
                  <Text style={[s.meta, { color: colors.textSecondary }]}>
                    {toPersianDigit(service.duration || 60)} دقیقه
                  </Text>
                </View>
              </View>
              {isSelected && (
                <View style={[s.checkBadge, { backgroundColor: colors.primary }]}>
                  <Icon name="check" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontFamily: 'Vazir-Bold' },
  subtitle: { fontSize: 12, fontFamily: 'Vazir', marginBottom: 8 },
  list: { gap: 10, paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    position: 'relative',
  },
  info: { flex: 1, gap: 3 },
  name: { fontSize: 15, fontFamily: 'Vazir-Bold' },
  type: { fontSize: 12, fontFamily: 'Vazir-Medium' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  meta: { fontSize: 11, fontFamily: 'Vazir' },
  checkBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
});