// src/components/manager/ManageHeader.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Avatar from '../common/Avatar';

export default function ManageHeader({
  businessInfo,
  pendingCount,
  userName,
  onSettingsPress,
}) {
  const { colors } = useTheme();

  // خوشامدگویی هوشمند بر اساس زمان روز
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'صبح بخیر', emoji: '🌅' };
    if (hour < 17) return { text: 'ظهر بخیر', emoji: '☀️' };
    return { text: 'عصر بخیر', emoji: '🌆' };
  };

  const greeting = getGreeting();

  return (
    <View
      style={[
        s.headerGradient,
        {
          backgroundColor: colors.primary,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        },
      ]}
    >
      <View style={s.headerContent}>
        {/* بخش خوشامدگویی */}
        <View style={s.welcomeSection}>
          <Text style={s.greetingText}>
            {greeting.emoji} {greeting.text}
          </Text>
          <Text style={s.userName}>{userName || 'مدیر سالن'}</Text>
          <Text style={s.welcomeSubtitle}>
            امروز {pendingCount} نوبت در انتظار تایید دارید
          </Text>
        </View>

        {/* لوگو و اطلاعات سالن - استفاده از Avatar کامپوننت */}
        <View style={s.businessInfoRow}>
          <Avatar
            uri={businessInfo.logo}
            name={businessInfo.name}
            size="lg"
            showBorder
            style={s.businessAvatar}
          />
          <View style={s.businessInfo}>
            <Text style={s.businessName} numberOfLines={1}>
              {businessInfo.name}
            </Text>
            <View style={s.ratingRow}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={s.ratingText}>{businessInfo.rating}</Text>
              <Text style={s.reviewsText}>
                ({businessInfo.reviewsCount} نظر)
              </Text>
            </View>
          </View>
          <TouchableOpacity style={s.editButton} onPress={onSettingsPress}>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: { gap: 20 },
  welcomeSection: { gap: 4 },
  greetingText: {
    fontSize: 14,
    fontFamily: 'Vazir',
    color: '#ffffff',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    fontFamily: 'Vazir',
    color: '#ffffff90',
  },
  businessInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  businessAvatar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 0,
  },
  businessInfo: { flex: 1, gap: 4 },
  businessName: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
  },
  reviewsText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    color: '#ffffff90',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});