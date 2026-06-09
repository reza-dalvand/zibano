// src/components/booking/EmployeeSelector.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Avatar from '../common/Avatar';

const ROLE_ICONS = {
  'ناخن‌کار': 'brush',
  'آرایشگر': 'face',
  'متخصص پوست': 'spa',
  'لیزر': 'flash-on',
  'میکاپ': 'auto-awesome',
  default: 'person',
};

const ROLE_COLORS = {
  'ناخن‌کار': '#E91E63',
  'آرایشگر': '#9C27B0',
  'متخصص پوست': '#4CAF50',
  'لیزر': '#2196F3',
  'میکاپ': '#FF9800',
  default: '#607D8B',
};

export default function EmployeeSelector({
  employees = [],
  selectedId,
  onSelect,
}) {
  const { colors } = useTheme();

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={[s.sectionIcon, { backgroundColor: colors.primary + '15' }]}>
          <Icon name="people" size={18} color={colors.primary} />
        </View>
        <Text style={[s.sectionTitle, { color: colors.textMain }]}>
          انتخاب کارمند
        </Text>
        <View style={{ flex: 1 }} />
        <Text style={[s.sectionHint, { color: colors.textSecondary }]}>
          {employees.length} نفر
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.employeeRow}
      >
        {employees.map((emp) => {
          const isSelected = selectedId === emp.id;
          const icon = ROLE_ICONS[emp.role] || ROLE_ICONS.default;
          const roleColor = ROLE_COLORS[emp.role] || ROLE_COLORS.default;

          return (
            <TouchableOpacity
              key={emp.id}
              activeOpacity={0.85}
              style={[
                s.employeeCard,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected
                    ? colors.primary + '08'
                    : colors.cardBackground,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => onSelect(emp.id)}
            >
              {/* Badge انتخاب */}
              {isSelected && (
                <View style={[s.checkBadge, { backgroundColor: colors.primary }]}>
                  <Icon name="check" size={14} color="#fff" />
                </View>
              )}

              {/* آواتار با آیکون نقش در گوشه */}
              <View style={s.avatarWrapper}>
                <Avatar name={emp.name} size="lg" showBorder={isSelected} />
                <View
                  style={[
                    s.roleBadge,
                    { backgroundColor: roleColor + '25', borderColor: roleColor },
                  ]}
                >
                  <Icon name={icon} size={12} color={roleColor} />
                </View>
              </View>

              <Text
                style={[s.empName, { color: colors.textMain }]}
                numberOfLines={1}
              >
                {emp.name}
              </Text>
              <Text
                style={[s.empRole, { color: roleColor }]}
                numberOfLines={1}
              >
                {emp.role}
              </Text>

              {/* سابقه کار */}
              <View style={[s.expRow, { borderTopColor: colors.border }]}>
                <Icon name="star" size={11} color="#FFC107" />
                <Text style={[s.empExp, { color: colors.textSecondary }]}>
                  {emp.experience}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  sectionHint: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  employeeRow: {
    gap: 12,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  employeeCard: {
    width: 135,
    padding: 14,
    paddingTop: 16,
    borderRadius: 20,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  roleBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 1,
  },
  empName: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    marginBottom: 3,
    textAlign: 'center',
  },
  empRole: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    textAlign: 'center',
  },
  expRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  empExp: {
    fontSize: 10,
    fontFamily: 'Vazir',
  },
});