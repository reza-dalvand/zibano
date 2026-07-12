// src/components/profile/ProfileHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 🆕
import { useTheme } from '../../theme/ThemeContext';
import Avatar from '../common/Avatar';

export default function ProfileHeader({ user }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // 🆕

  return (
    <View style={[s.headerContainer, {
      backgroundColor: colors.primary,
      paddingTop: insets.top + 8, // 🎯 insets.top
    }]}>
      <View style={s.headerContent}>
        <Text style={s.headerTitle}>پروفایل من</Text>
        <View style={s.userInfoRow}>
          <Avatar
            uri={user?.avatarUrl}
            name={user?.name}
            size="xl"
            showBorder
            style={s.avatar}
          />
          <View style={s.userInfo}>
            <Text style={s.userName}>{user?.name}</Text>
            <Text style={s.userPhone}>{user?.phone}</Text>
            <View style={s.memberBadge}>
              <Icon name="verified" size={14} color="#FFD700" />
              <Text style={s.memberText}>
                {user?.memberSince || 'عضو جدید'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  headerContainer: {
    // paddingTop حذف شد
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Vazir-Bold',
    color: '#ffffff',
  },
  userPhone: {
    fontSize: 14,
    fontFamily: 'Vazir',
    color: '#ffffff90',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  memberText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
    color: '#ffffff',
  },
});