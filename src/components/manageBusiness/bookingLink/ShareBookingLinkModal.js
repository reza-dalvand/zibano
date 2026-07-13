// src/components/manageBusiness/bookingLink/ShareBookingLinkModal.js
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Share, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../theme/ThemeContext';
import Button from '../../common/Button';
import QRCodeSection from './QRCodeSection';

export default function ShareBookingLinkModal({ visible, onClose, bookingLink }) {
  const { colors } = useTheme();

  const handleShareWhatsApp = async () => {
    try {
      await Share.share({
        message: `🌸 نوبت‌دهی آنلاین\n\nبا این لینک می‌توانید مستقیماً از من نوبت بگیرید:\n${bookingLink}\n\n📱 رزرو از اپلیکیشن زیبانو`,
      });
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  const handleShareInstagram = () => {
    Alert.alert('اینستاگرام', 'لینک را کپی کنید و در استوری یا بیو اینستاگرام خود قرار دهید');
  };

  const handleShareTelegram = async () => {
    try {
      await Share.share({
        message: `🌸 نوبت‌دهی آنلاین\n\n${bookingLink}`,
      });
    } catch (error) {
      Alert.alert('خطا', 'امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={s.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1}>
          <View style={[s.modal, { backgroundColor: colors.cardBackground }]}>
            {/* هدر */}
            <View style={s.header}>
              <View style={s.headerInfo}>
                <View style={[s.iconBox, { backgroundColor: colors.primary + '20' }]}>
                  <Icon name="share" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={[s.title, { color: colors.textMain }]}>اشتراک‌گذاری لینک رزرو</Text>
                  <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                    لینک خود را در شبکه‌های اجتماعی به اشتراک بگذارید
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={[s.closeBtn, { backgroundColor: colors.background }]}
              >
                <Icon name="close" size={20} color={colors.textMain} />
              </TouchableOpacity>
            </View>

            {/* QR Code */}
            <QRCodeSection bookingLink={bookingLink} />

            {/* دکمه‌های اشتراک‌گذاری */}
            <View style={s.shareButtons}>
              <TouchableOpacity
                style={[s.shareBtn, { backgroundColor: '#25D366' }]}
                onPress={handleShareWhatsApp}
                activeOpacity={0.8}
              >
                <Icon name="message" size={24} color="#fff" />
                <Text style={[s.shareBtnText, { color: '#fff' }]}>واتساپ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.shareBtn, { backgroundColor: '#E1306C' }]}
                onPress={handleShareInstagram}
                activeOpacity={0.8}
              >
                <Icon name="photo-camera" size={24} color="#fff" />
                <Text style={[s.shareBtnText, { color: '#fff' }]}>اینستاگرام</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.shareBtn, { backgroundColor: '#0088cc' }]}
                onPress={handleShareTelegram}
                activeOpacity={0.8}
              >
                <Icon name="send" size={24} color="#fff" />
                <Text style={[s.shareBtnText, { color: '#fff' }]}>تلگرام</Text>
              </TouchableOpacity>
            </View>

            {/* راهنما */}
            <View style={[s.hintBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
              <Icon name="info-outline" size={16} color={colors.primary} />
              <Text style={[s.hintText, { color: colors.textSecondary }]}>
                با به اشتراک‌گذاری این لینک، مشتریان می‌توانند مستقیماً از شما نوبت بگیرند
              </Text>
            </View>

            {/* دکمه بستن */}
            <Button
              title="بستن"
              onPress={onClose}
              variant="outline"
              size="lg"
              fullWidth
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Vazir-Bold',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    gap: 12,
  },
  shareBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  shareBtnText: {
    fontSize: 12,
    fontFamily: 'Vazir-Bold',
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  hintText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },
});