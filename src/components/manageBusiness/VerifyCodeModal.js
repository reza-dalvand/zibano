// src/components/manageBusiness/VerifyCodeModal.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../stores/useThemeStore';
import Button from '../common/Button';
import Avatar from '../common/Avatar';

const CODE_LENGTH = 4; // ✅ تغییر از 6 به 4
const toPersianDigit = (str) =>
  String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
const toEnglishDigits = (str) =>
  String(str)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

export default function VerifyCodeModal({ visible, appointment, onClose, onConfirm }) {
  const { colors } = useTheme();
  const [code, setCode] = useState(['', '', '', '']); // ✅ 4 خانه
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (visible && appointment) {
      setCode(['', '', '', '']); // ✅ ریست 4 تایی
      setError('');
      setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }
  }, [visible, appointment]);

  const handleChange = (text, index) => {
    if (!appointment) return;
    const cleaned = toEnglishDigits(text).replace(/[^0-9]/g, '');
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, CODE_LENGTH).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < CODE_LENGTH) newCode[index + i] = digit;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, CODE_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      setError('');
      return;
    }
    const digit = cleaned[0] || '';
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError('');
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = async () => {
    if (!appointment) return;
    const enteredCode = code.join('');
    if (enteredCode.length < CODE_LENGTH) {
      setError(`کد تایید ${toPersianDigit(CODE_LENGTH)} رقمی را کامل وارد کنید`);
      return;
    }
    if (enteredCode !== appointment.verificationCode) {
      setError('کد وارد شده صحیح نیست. لطفاً از مشتری کد درست را بپرسید.');
      return;
    }
    setLoading(true);
    Keyboard.dismiss();
    await new Promise((r) => setTimeout(r, 1200));
    onConfirm(appointment.id);
    setLoading(false);
  };

  const isComplete = code.join('').length === CODE_LENGTH;

  return (
    <Modal
      visible={visible && !!appointment}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {appointment && (
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={s.backdrop}>
          <TouchableOpacity activeOpacity={1} style={s.container}>
            <View style={[s.modal, { backgroundColor: colors.cardBackground }]}>
              {/* هدر */}
              <View style={[s.header, { borderBottomColor: colors.border }]}>
                <View style={[s.headerIconBox, { backgroundColor: '#43A04715' }]}>
                  <Icon name="verified-user" size={28} color="#43A047" />
                </View>
                <Text style={[s.title, { color: colors.textMain }]}>تایید انجام خدمت</Text>
                <Text style={[s.subtitle, { color: colors.textSecondary }]}>
                  کد تایید مشتری را وارد کنید
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

              {/* ورودی کد */}
              <View style={s.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      s.codeBox,
                      {
                        backgroundColor: colors.background,
                        borderColor:
                          error && digit === ''
                            ? '#E53935'
                            : digit
                            ? colors.primary
                            : colors.border,
                        color: colors.textMain,
                        borderWidth: digit ? 2 : 1.5,
                      },
                    ]}
                    value={toPersianDigit(digit)}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    textAlign="center"
                  />
                ))}
              </View>

              {/* پیام خطا */}
              {error ? (
                <View style={s.errorBox}>
                  <Icon name="error-outline" size={14} color="#E53935" />
                  <Text style={[s.errorText, { color: '#E53935' }]}>{error}</Text>
                </View>
              ) : null}

              {/* نمایش کد صحیح برای تست */}
              <View
                style={[
                  s.testHintBox,
                  { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' },
                ]}
              >
                <Icon name="info-outline" size={14} color={colors.primary} />
                <Text style={[s.testHintText, { color: colors.textSecondary }]}>
                  کد تایید این مشتری:{' '}
                  <Text style={{ color: colors.primary, fontFamily: 'Vazir-Bold' }}>
                    {toPersianDigit(appointment.verificationCode)}
                  </Text>
                </Text>
              </View>

              {/* راهنما */}
              <View style={[s.hintCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Icon name="lightbulb" size={16} color="#FFC107" />
                <Text style={[s.hintText, { color: colors.textSecondary }]}>
                  مشتری می‌تواند کد تایید ۴ رقمی خود را از بخش «نوبت‌های من» مشاهده کند. این کد هر 1 روز یکبار قابل ارسال مجدد می‌باشد..
                </Text>
              </View>

              {/* دکمه‌ها */}
              <View style={s.buttonRow}>
                <Button
                  title="انصراف"
                  onPress={onClose}
                  variant="outline"
                  size="lg"
                  style={s.halfButton}
                />
                <Button
                  title={loading ? 'در حال تایید...' : 'تایید انجام خدمت'}
                  onPress={handleConfirm}
                  loading={loading}
                  disabled={!isComplete || loading}
                  variant="primary"
                  size="lg"
                  style={[s.halfButton, { backgroundColor: '#43A047' }]}
                  icon={<Icon name="check" size={18} color="#fff" />}
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
    paddingVertical: 4,
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
  codeContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 12, // ✅ فاصله بیشتر برای 4 باکس
    paddingVertical: 4,
  },
  codeBox: {
    width: 56, // ✅ بزرگ‌تر برای 4 باکس
    height: 64,
    borderRadius: 14,
    fontSize: 26,
    fontFamily: 'Vazir-Bold',
    textAlign: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
  testHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  testHintText: {
    fontSize: 12,
    fontFamily: 'Vazir',
    flex: 1,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  hintText: {
    fontSize: 11,
    fontFamily: 'Vazir',
    flex: 1,
    lineHeight: 18,
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