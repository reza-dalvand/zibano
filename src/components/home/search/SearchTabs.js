// src/components/home/search/SearchTabs.js
import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../stores/useThemeStore';
import { toPersianDigit } from '../../../utils/numberUtils';

const TABS = [
  { id: 'all',           label: 'همه',          icon: 'apps' },
  { id: 'businesses',    label: 'کسب‌وکارها',   icon: 'store' },
  // ❌ services حذف شد
  // ❌ posts حذف شد
  { id: 'modelRequests', label: 'مدلینگ',       icon: 'face-retouching-natural' },
  { id: 'lineRentals',   label: 'اجاره لاین',   icon: 'storefront' },
];

export default function SearchTabs({ activeTab, counts, onChange }) {
  const { colors } = useTheme();

  return (
    <View style={[s.container, { borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] || 0;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => onChange(tab.id)}
              style={[
                s.tab,
                {
                  backgroundColor: isActive
                    ? colors.primary
                    : colors.cardBackground,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
            >
              <Icon
                name={tab.icon}
                size={15}
                color={isActive ? '#fff' : colors.textSecondary}
              />
              <Text
                style={[
                  s.tabLabel,
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
                        ? 'rgba(255,255,255,0.3)'
                        : colors.primary + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.badgeText,
                      { color: isActive ? '#fff' : colors.primary },
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
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  badge: {
    minWidth: 22,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 2,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Vazir-Bold',
  },
});