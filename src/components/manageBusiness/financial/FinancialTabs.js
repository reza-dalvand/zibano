// تب‌های فیلتر تراکنش‌ها
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import { toPersianDigit, TX_TABS, TX_STATUS_META } from './constants';

const TAB_ICONS = {
  all: 'list-alt',
  blocked: 'hourglass-top',
  settling: 'sync',
  settled: 'account-balance',
  refunded: 'undo',
};

export default function FinancialTabs({ active, counts, onChange }) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
    >
      {TX_TABS.map(tab => {
        const isActive = active === tab.id;
        const meta = TX_STATUS_META[tab.id];
        const icon = meta ? TAB_ICONS[tab.id] : 'apps';
        const color = meta ? meta.color : '#607D8B';
        const count = counts[tab.id] || 0;

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.78}
            onPress={() => onChange(tab.id)}
            style={[
              s.chip,
              {
                backgroundColor: isActive ? color : colors.cardBackground,
                borderColor: isActive ? color : colors.border,
                shadowOpacity: isActive ? 0.25 : 0,
              },
            ]}
          >
            <Icon name={icon} size={15} color={isActive ? '#fff' : color} />
            <Text
              style={[
                s.label,
                { color: isActive ? '#fff' : colors.textMain },
              ]}
            >
              {tab.label}
            </Text>
            {count > 0 && (
              <View
                style={[
                  s.badge,
                  {
                    backgroundColor: isActive
                      ? 'rgba(255,255,255,0.28)'
                      : colors.border + '60',
                  },
                ]}
              >
                <Text
                  style={[
                    s.badgeText,
                    { color: isActive ? '#fff' : colors.textSecondary },
                  ]}
                >
                  {toPersianDigit(count)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  row: {
    gap: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 12.5,
    fontFamily: 'Vazir-Bold',
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginRight: 2,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
});