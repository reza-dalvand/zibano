// src/components/manageBusiness/CancelReasonModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Avatar from '../common/Avatar';

const REASON_SUGGESTIONS = [
  'سالن در این تاریخ تعطیل است',
  'کارمند مربوطه در دسترس نیست',
  'مشکل فنی در سالن',
  'تغییر برنامه کاری',
  'سایر موارد',
];

export default function CancelReasonModal({ visible, appointment, onClose, onConfirm }) {
  const { colors } = useTheme();
  const [reason, setReason] = useState('');

  // 🎯 reset کردن reason وقتی مدال باز می‌شود
  useEffect(() => {
    if (visible && appointment) {
      setReason('');
    }
  }, [visible, appointment]);

  // 🎯 حذف return null از اینجا!

  const handleConfirm = () => {
    if (!appointment) return;
    onConfirm(appointment.id, reason.trim() || 'دلیلی ذکر نشده است');
    setReason('');
  };

  return (
    <Modal
      visible={visible && !!appointment}  // ✅ شرط داخل visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {appointment && (  // ✅ شرط داخل JSX
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={s.backdrop}>
          <TouchableOpacity activeOpacity={1} style={s.container}>
            <View style={[s.modal, { backgroundColor: colors.cardBackground }]}>
              {/* هدر */}
              <View style={[s.header, { borderBottomColor: colors.border }]}>
                <View style={[s.headerIconBox, { backgroundColor: '#E5393515' }]}>
                  <Icon name="cancel" size={28} color="#E53935" />
                </View>
                <Text style={[s.title, { color: colors.textMain }]}>لغو نوبت مشتری</Text>
                <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                  دلیل لغو نوبت را ذکر کنید
                </Text>
              </View>

              {/* اطلاعات مشتری */}
              <View style={s.customerRow}>
                <Avatar name={appointment.customerName} size="md" />
                <View style={s.customerInfo}>
                  <Text style={[s.customerName, { color: colors.textMain }]}>
                    {appointment.customerName}
                  </Text>
                  <Text style={[s.serviceName, { color: colors.textSecondary }]}>
                    {appointment.serviceName}
                  </Text>
                </View>
              </View>

              {/* هشدار استرداد */}
              <View style={[s.warningBox, { backgroundColor: '#FF980010', borderColor: '#FF980040' }]}>
                <Icon name="warning" size={18} color="#FF9800" />
                <View style={s.warningTextCol}>
                  <Text style={[s.warningTitle, { color: '#FF9800' }]}>
                    بیعانه به مشتری مسترد می‌شود
                  </Text>
                  <Text style={[s.warningSubtitle, { color: colors.textSecondary }]}>
                    با لغو نوبت، کل بیعانه پرداخت شده ظرف ۲۴ ساعت به حساب مشتری واریز می‌شود.
                  </Text>
                </View>
              </View>

              {/* پیشنهادها */}
              <Text style={[s.suggestionLabel, { color: colors.textMain }]}>
                دلایل پیشنهادی:
              </Text>
              <View style={s.suggestionChips}>
                {REASON_SUGGESTIONS.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    onPress={() => setReason(suggestion)}
                    style={[
                      s.suggestionChip,
                      {
                        backgroundColor:
                          reason === suggestion
                            ? colors.primary + '20'
                            : colors.background,
                        borderColor:
                          reason === suggestion ? colors.primary : colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        s.suggestionText,
                        {
                          color: reason === suggestion ? colors.primary : colors.textMain,
                        },
                      ]}
                    >
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* فیلد دلیل */}
              <Input
                label="دلیل لغو (اختیاری)"
                placeholder="دلیل لغو نوبت را بنویسید..."
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={3}
                rightIcon={<Icon name="edit" size={18} color={colors.textSecondary} />}
              />

              {/* دکمه‌ها */}
              <View style={s.buttonRow}>
                <Button
                  title="انصراف"
                  onPress={() => {
                    setReason('');
                    onClose();
                  }}
                  variant="outline"
                  size="lg"
                  style={s.halfButton}
                />
                <Button
                  title="تایید و لغو نوبت"
                  onPress={handleConfirm}
                  variant="primary"
                  size="lg"
                  style={[s.halfButton, { backgroundColor: '#E53935' }]}
                  icon={<Icon name="cancel" size={18} color="#fff" />}
                  iconPosition="right"
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
  },
  modal: {
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    alignItems: 'center',
    gap: 6,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Vazir-Bold',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customerInfo: {
    flex: 1,
    gap: 2,
  },
  customerName: {
    fontSize: 14,
    fontFamily: 'Vazir-Bold',
  },
  serviceName: {
    fontSize: 12,
    fontFamily: 'Vazir',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  warningTextCol: {
    flex: 1,
    gap: 2,
  },
  warningTitle: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  warningSubtitle: {
    fontSize: 11,
    fontFamily: 'Vazir',
    lineHeight: 18,
  },
  suggestionLabel: {
    fontSize: 13,
    fontFamily: 'Vazir-Bold',
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 11,
    fontFamily: 'Vazir-Medium',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  halfButton: {
    flex: 1,
  },
});