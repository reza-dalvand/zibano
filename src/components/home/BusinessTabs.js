// src/components/business/BusinessTabs.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TABS = [
  { id: 'services', label: 'خدمات' },
  { id: 'portfolio', label: 'نمونه‌کار' },
  { id: 'about', label: 'درباره' },
];

export default function BusinessTabs({ activeTab, onTabChange, colors }) {
  return (
    <View style={s.tabsWrapper}>
      <View style={[s.tabsContainer, { backgroundColor: colors.cardBackground }]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={[s.tabButton, isActive && s.tabButtonActive]}
            >
              <Text
                style={[
                  s.tabLabel,
                  {
                    color: isActive ? '#fff' : colors.textSecondary,
                    fontFamily: isActive ? 'Vazir-Bold' : 'Vazir',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  tabsWrapper: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 16,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#A88B7D',
  },
  tabLabel: {
    fontSize: 13,
  },
});