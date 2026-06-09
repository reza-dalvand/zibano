// src/components/business/BusinessAbout.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Card from '../common/Card';

export default function BusinessAbout({ business }) {
  const { colors } = useTheme();

  return (
    <View style={s.aboutSection}>
      <Card variant="elevated" padding={20} radius={20}>
        <View style={s.aboutHeader}>
          <Icon name="info-outline" size={22} color={colors.primary} />
          <Text style={[s.aboutTitle, { color: colors.textMain }]}>
            درباره کسب‌وکار
          </Text>
        </View>
        <Text style={[s.aboutText, { color: colors.textSecondary }]}>
          {business.about}
        </Text>
      </Card>

      <View style={s.contactCards}>
        <Card variant="elevated" padding={16} radius={16} style={s.contactCard}>
          <View style={s.contactRow}>
            <View style={[s.contactIconBox, { backgroundColor: '#E5393520' }]}>
              <Icon name="place" size={22} color="#E53935" />
            </View>
            <View style={s.contactTextCol}>
              <Text style={[s.contactLabel, { color: colors.textSecondary }]}>
                آدرس
              </Text>
              <Text style={[s.contactValue, { color: colors.textMain }]}>
                {business.address}
              </Text>
            </View>
          </View>
        </Card>

        <Card variant="elevated" padding={16} radius={16} style={s.contactCard}>
          <TouchableOpacity style={s.contactRow}>
            <View style={[s.contactIconBox, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="phone" size={22} color="#4CAF50" />
            </View>
            <View style={s.contactTextCol}>
              <Text style={[s.contactLabel, { color: colors.textSecondary }]}>
                تلفن تماس
              </Text>
              <Text style={[s.contactValue, { color: colors.textMain }]}>
                {business.phone}
              </Text>
            </View>
            <Icon name="chevron-left" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        <Card variant="elevated" padding={16} radius={16} style={s.contactCard}>
          <View style={s.contactRow}>
            <View style={[s.contactIconBox, { backgroundColor: '#2196F320' }]}>
              <Icon name="schedule" size={22} color="#2196F3" />
            </View>
            <View style={s.contactTextCol}>
              <Text style={[s.contactLabel, { color: colors.textSecondary }]}>
                ساعات کاری
              </Text>
              <Text style={[s.contactValue, { color: colors.textMain }]}>
                {business.workingHours}
              </Text>
            </View>
          </View>
        </Card>

        {/* شبکه‌های اجتماعی */}
        {business.socialMedia && (
          <Card variant="elevated" padding={16} radius={16} style={s.contactCard}>
            <View style={s.socialRow}>
              {business.socialMedia.instagram && (
                <TouchableOpacity style={s.socialBtn}>
                  <Icon name="photo-camera" size={22} color="#E1306C" />
                  <Text style={[s.socialText, { color: colors.textMain }]}>
                    اینستاگرام
                  </Text>
                </TouchableOpacity>
              )}
              {business.socialMedia.instagram && business.socialMedia.telegram && (
                <View style={[s.socialDivider, { backgroundColor: colors.border }]} />
              )}
              {business.socialMedia.telegram && (
                <TouchableOpacity style={s.socialBtn}>
                  <Icon name="send" size={22} color="#0088cc" />
                  <Text style={[s.socialText, { color: colors.textMain }]}>
                    تلگرام
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Card>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  aboutSection: {
    gap: 12,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  aboutTitle: {
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
  },
  aboutText: {
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 24,
    textAlign: 'justify',
  },
  contactCards: {
    gap: 10,
    marginTop: 8,
  },
  contactCard: {},
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  contactIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextCol: {
    flex: 1,
    gap: 4,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  contactValue: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
    lineHeight: 22,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  socialText: {
    fontSize: 13,
    fontFamily: 'Vazir-Medium',
  },
  socialDivider: {
    width: 1,
    height: 28,
  },
});