// src/components/common/SuccessModal.js
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';

export default function SuccessModal({
  visible,
  onClose,
  title = 'ثبت‌نام موفق',
  message = 'اطلاعات کسب‌وکار شما با موفقیت ثبت شد.',
  confirmText = 'متوجه شدم',
  emoji = '🎉',
}) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={s.backdrop}
      >
        <TouchableOpacity activeOpacity={1} style={s.container}>
          <View style={[s.modalContent, { backgroundColor: colors.cardBackground }]}>
            {/* ═══════ بخش بالایی: آیکون موفقیت ═══════ */}
            <View style={s.iconSection}>
              {/* حلقه‌های تزئینی پشت آیکون */}
              <View style={[s.decorRing1, { borderColor: '#4CAF5020' }]} />
              <View style={[s.decorRing2, { borderColor: '#4CAF5010' }]} />
              
              {/* دایره اصلی سبز با چک‌مارک */}
              <View style={s.successCircle}>
                <View style={s.innerGlow} />
                <Icon name="check" size={56} color="#fff" />
              </View>
              
              {/* ایموجی */}
              <View style={s.emojiBadge}>
                <Text style={s.emojiText}>{emoji}</Text>
              </View>
            </View>

            {/* ═══════ عنوان ═══════ */}
            <Text style={[s.title, { color: colors.textMain }]}>
              {title}
            </Text>

            {/* ═══════ کارت پیام ═══════ */}
            <View
              style={[
                s.messageCard,
                {
                  backgroundColor: colors.primary + '08',
                  borderColor: colors.primary + '25',
                },
              ]}
            >
              <View style={[s.messageIconBox, { backgroundColor: colors.primary + '20' }]}>
                <Icon name="sms" size={18} color={colors.primary} />
              </View>
              <Text style={[s.messageText, { color: colors.textSecondary }]}>
                {message}
              </Text>
            </View>

            {/* ═══════ نکات مهم ═══════ */}
            <View style={s.tipsSection}>
              <View style={s.tipsHeader}>
                <Icon name="info-outline" size={16} color={colors.primary} />
                <Text style={[s.tipsTitle, { color: colors.textMain }]}>
                  مراحل بعدی
                </Text>
              </View>

              <View style={s.tipsList}>
                <View style={s.tipItem}>
                  <View style={[s.tipIconBox, { backgroundColor: '#FF980020' }]}>
                    <Icon name="schedule" size={14} color="#FF9800" />
                  </View>
                  <View style={s.tipTextCol}>
                    <Text style={[s.tipTitle, { color: colors.textMain }]}>
                      بررسی توسط کارشناسان
                    </Text>
                    <Text style={[s.tipDescription, { color: colors.textSecondary }]}>
                      فرآیند بررسی ۲۴ تا ۴۸ ساعت زمان می‌برد
                    </Text>
                  </View>
                </View>

                <View style={s.tipDivider}>
                  <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
                </View>

                <View style={s.tipItem}>
                  <View style={[s.tipIconBox, { backgroundColor: '#2196F320' }]}>
                    <Icon name="notifications-active" size={14} color="#2196F3" />
                  </View>
                  <View style={s.tipTextCol}>
                    <Text style={[s.tipTitle, { color: colors.textMain }]}>
                      اطلاع‌رسانی نتیجه
                    </Text>
                    <Text style={[s.tipDescription, { color: colors.textSecondary }]}>
                      نتیجه از طریق پیامک و نوتیفیکیشن ارسال می‌شود
                    </Text>
                  </View>
                </View>

                <View style={s.tipDivider}>
                  <View style={[s.dividerLine, { backgroundColor: colors.border }]} />
                </View>

                <View style={s.tipItem}>
                  <View style={[s.tipIconBox, { backgroundColor: '#4CAF5020' }]}>
                    <Icon name="rocket-launch" size={14} color="#4CAF50" />
                  </View>
                  <View style={s.tipTextCol}>
                    <Text style={[s.tipTitle, { color: colors.textMain }]}>
                      شروع فعالیت
                    </Text>
                    <Text style={[s.tipDescription, { color: colors.textSecondary }]}>
                      پس از تایید، کسب‌وکار شما فعال می‌شود
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ═══════ کارت اطمینان ═══════ */}
            <View
              style={[
                s.trustCard,
                {
                  backgroundColor: '#4CAF5008',
                  borderColor: '#4CAF5025',
                },
              ]}
            >
              <Icon name="shield" size={16} color="#4CAF50" />
              <Text style={[s.trustText, { color: '#4CAF50' }]}>
                اطلاعات شما محرمانه و امن نگهداری می‌شود
              </Text>
            </View>

            {/* ═══════ دکمه تایید ═══════ */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onClose}
              style={[s.confirmBtn, { backgroundColor: colors.primary }]}
            >
              <Icon name="check-circle" size={20} color="#fff" />
              <Text style={s.confirmBtnText}>{confirmText}</Text>
              <Icon name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  // ═══════ Backdrop ═══════
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    width: '100%',
  },

  // ═══════ Modal Content ═══════
  modalContent: {
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },

  // ═══════ بخش آیکون ═══════
  iconSection: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
    height: 130,
    marginBottom: 20,
  },
  decorRing1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    zIndex: 1,
  },
  decorRing2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    zIndex: 0,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    position: 'relative',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  innerGlow: {
    position: 'absolute',
    top: 10,
    left: 18,
    width: 32,
    height: 22,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  emojiBadge: {
    position: 'absolute',
    top: 0,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#4CAF50',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  emojiText: {
    fontSize: 18,
  },

  // ═══════ عنوان ═══════
  title: {
    fontSize: 22,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },

  // ═══════ کارت پیام ═══════
  messageCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
  },
  messageIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Vazir',
    lineHeight: 22,
    textAlign: 'left',
  },

  // ═══════ بخش نکات ═══════
  tipsSection: {
    width: '100%',
    marginBottom: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  tipsList: {
    width: '100%',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  tipIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTextCol: {
    flex: 1,
    gap: 2,
  },
  tipTitle: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  tipDescription: {
    fontSize: 11.5,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },
  tipDivider: {
    paddingLeft: 15,
    paddingVertical: 2,
  },
  dividerLine: {
    width: 2,
    height: 14,
    borderRadius: 1,
    marginLeft: 0,
  },

  // ═══════ کارت اطمینان ═══════
  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
  },
  trustText: {
    flex: 1,
    fontSize: 11.5,
    fontFamily: 'Vazir-Medium',
    textAlign: 'center',
  },

  // ═══════ دکمه تایید ═══════
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 17,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Vazir-Bold',
    flex: 1,
    textAlign: 'center',

  },
});