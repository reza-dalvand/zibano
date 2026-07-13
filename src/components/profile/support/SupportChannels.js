// src/screens/profile/support/SupportChannels.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import { SUPPORT_CHANNELS } from './constants';

export default function SupportChannels() {
  const { colors } = useTheme();

  const handlePress = async channel => {
    try {
      if (channel.type === 'phone') {
        await Linking.openURL(channel.link);
      } else {
        const canOpen = await Linking.canOpenURL(channel.link);
        if (canOpen) {
          await Linking.openURL(channel.link);
        } else {
          Alert.alert(
            'اپلیکیشن مورد نیاز',
            `برای استفاده از ${channel.title}، ابتدا اپلیکیشن آن را نصب کنید.`,
            [{ text: 'انصراف', style: 'cancel' }, { text: 'باشه' }],
          );
        }
      }
    } catch (error) {
      Alert.alert('خطا', 'امکان باز کردن لینک وجود ندارد');
    }
  };

  return (
    <View style={s.section}>
      {/* هدر بخش */}
      <View style={s.sectionHeader}>
        <View
          style={[s.sectionIconBox, { backgroundColor: colors.primary + '15' }]}
        >
          <Icon name="support-agent" size={20} color={colors.primary} />
        </View>
        <View style={s.sectionHeaderText}>
          <Text style={[s.sectionTitle, { color: colors.textMain }]}>
            راه‌های ارتباطی
          </Text>
          <Text style={[s.sectionSubtitle, { color: colors.textSecondary }]}>
            از هر طریقی که راحت‌ترید با ما در تماس باشید
          </Text>
        </View>
      </View>

      {/* شبکه کانال‌ها - ۲ در ۲ */}
      <View style={s.channelsGrid}>
        {SUPPORT_CHANNELS.map(channel => (
          <TouchableOpacity
            key={channel.id}
            activeOpacity={0.85}
            onPress={() => handlePress(channel)}
            style={[
              s.channelCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Badge برای ایرانی بودن */}
            {channel.badge && (
              <View
                style={[s.badge, { backgroundColor: channel.color + '20' }]}
              >
                <Text style={[s.badgeText, { color: channel.color }]}>
                  {channel.badge}
                </Text>
              </View>
            )}

            {/* آیکون با گرادیان */}
            <View
              style={[
                s.iconWrapper,
                {
                  backgroundColor: channel.color + '15',
                  borderColor: channel.color + '40',
                },
              ]}
            >
              <View style={[s.iconInner, { backgroundColor: channel.color }]}>
                <Icon name={channel.icon} size={24} color="#fff" />
              </View>
            </View>

            {/* اطلاعات */}
            <Text style={[s.channelTitle, { color: colors.textMain }]}>
              {channel.title}
            </Text>
            <Text style={[s.channelSubtitle, { color: colors.textSecondary }]}>
              {channel.description}
            </Text>

            {/* دکمه اکشن */}
            <View style={[s.actionRow, { borderTopColor: colors.border }]}>
              <Text style={[s.actionText, { color: channel.color }]}>
                {channel.actionLabel}
              </Text>
              <Icon name="arrow-back" size={16} color={channel.color} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },

  // ═══════════ کانال‌ها ═══════════
  channelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  channelCard: {
    width: '48%',
    padding: 14,
    paddingBottom: 0,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 2,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Vazir-Bold',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 4,
  },
  iconInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  channelTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  channelSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    textAlign: 'center',
    lineHeight: 16,
    minHeight: 32,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
    paddingVertical: 10,
    marginTop: 6,
    borderTopWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
});
